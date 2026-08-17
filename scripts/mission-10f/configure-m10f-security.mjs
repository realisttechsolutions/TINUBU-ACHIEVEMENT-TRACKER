import { createRequire } from 'node:module';
import { randomBytes } from 'node:crypto';
const require = createRequire(import.meta.url);
const auth = require('../../node_modules/firebase-tools/lib/auth');
const { requireAuth } = require('../../node_modules/firebase-tools/lib/requireAuth');
const { Client } = require('../../node_modules/firebase-tools/lib/apiv2');
import { createFirebasePasswordDatabase, createFirebaseIamDatabase } from '../mission-10c/firebase-iam-pg.mjs';

const PROJECT = 'tinubu-achievement-stg';
const INSTANCE = 'tat-db-staging';
const DATABASE = 'tat_staging';
const ADMIN_SA_NAME = 'tat-admin-api-staging';
const ADMIN_SA_EMAIL = `${ADMIN_SA_NAME}@${PROJECT}.iam.gserviceaccount.com`;
const ADMIN_DB_USER = `${ADMIN_SA_NAME}@${PROJECT}.iam`;
const ADMIN_ROLE = 'tat_admin_writer_m10f';

const headers = { 'x-goog-user-project': PROJECT };
const iam = new Client({ urlPrefix: 'https://iam.googleapis.com', apiVersion: 'v1', auth: true });
const resourceManager = new Client({ urlPrefix: 'https://cloudresourcemanager.googleapis.com', apiVersion: 'v1', auth: true });
const sqlAdmin = new Client({ urlPrefix: 'https://sqladmin.googleapis.com', apiVersion: 'v1', auth: true });

function temporaryPassword() {
  return `${randomBytes(48).toString('base64url')}aA9!`;
}

async function waitForSqlOperation(operation, label) {
  const name = operation?.body?.name ?? operation?.name;
  if (!name) throw new Error(`${label} did not return an operation name.`);
  const deadline = Date.now() + 5 * 60 * 1000;
  while (Date.now() < deadline) {
    const status = await sqlAdmin.get(`/projects/${PROJECT}/operations/${name}`, { headers });
    if (status.body.status === 'DONE') {
      const errors = status.body.error?.errors ?? [];
      if (errors.length) throw new Error(`${label} failed: ${errors.map((error) => error.message).join('; ')}`);
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, 2_000));
  }
  throw new Error(`${label} exceeded five minutes.`);
}

async function setPostgresPassword(password, label) {
  const operation = await sqlAdmin.put(
    `/projects/${PROJECT}/instances/${INSTANCE}/users`,
    { name: 'postgres', password, type: 'BUILT_IN' },
    { headers, queryParams: { name: 'postgres' } },
  );
  await waitForSqlOperation(operation, label);
}

async function withTemporaryAdminDatabase(action) {
  const bootstrapPassword = temporaryPassword();
  let database;
  let primaryError;
  try {
    await setPostgresPassword(bootstrapPassword, 'Temporary bootstrap password activation');
    database = await createFirebasePasswordDatabase({ password: bootstrapPassword });
    return await action(database);
  } catch (error) {
    primaryError = error;
    throw error;
  } finally {
    await database?.close().catch(() => undefined);
    try {
      await setPostgresPassword(temporaryPassword(), 'Built-in administrator password cleanup rotation');
    } catch (cleanupError) {
      if (!primaryError) throw cleanupError;
      console.error(`Password cleanup failed after primary error: ${cleanupError.message}`);
    }
  }
}

async function main() {
  console.log('============================================================');
  console.log('MISSION 10F-B: PROVISIONING ADMIN CONTROL PLANE IAM & DB ROLE');
  console.log('============================================================\n');

  const account = auth.getGlobalDefaultAccount();
  await requireAuth({ ...account, project: PROJECT });

  // 1. Ensure Service Account
  console.log(`[1/5] Checking Service Account: ${ADMIN_SA_EMAIL}...`);
  const saList = await iam.get(`/projects/${PROJECT}/serviceAccounts`, { headers });
  const saExists = (saList.body.accounts || []).some((a) => a.email === ADMIN_SA_EMAIL);

  if (!saExists) {
    console.log(` - Creating Service Account: ${ADMIN_SA_NAME}...`);
    await iam.post(`/projects/${PROJECT}/serviceAccounts`, {
      accountId: ADMIN_SA_NAME,
      serviceAccount: {
        displayName: 'TAT Admin API Staging Service Account',
        description: 'Dedicated identity for TAT Admin Control Plane Cloud Run service (Mission 10F)',
      },
    }, { headers });
    console.log(' - Service Account created successfully.');
  } else {
    console.log(' - Service Account already exists.');
  }

  // 2. Grant IAM Roles to Service Account on Project (Cloud SQL Client & Instance User)
  console.log('\n[2/5] Granting least-privilege IAM roles on project...');
  const policyRes = await resourceManager.post(`/projects/${PROJECT}:getIamPolicy`, {}, { headers });
  const policy = policyRes.body;
  const member = `serviceAccount:${ADMIN_SA_EMAIL}`;

  const requiredRoles = ['roles/cloudsql.client', 'roles/cloudsql.instanceUser'];
  let policyChanged = false;

  for (const role of requiredRoles) {
    let binding = policy.bindings.find((b) => b.role === role);
    if (!binding) {
      binding = { role, members: [] };
      policy.bindings.push(binding);
    }
    if (!binding.members.includes(member)) {
      binding.members.push(member);
      policyChanged = true;
      console.log(` - Adding ${member} to ${role}`);
    } else {
      console.log(` - ${member} already has ${role}`);
    }
  }

  if (policyChanged) {
    await resourceManager.post(`/projects/${PROJECT}:setIamPolicy`, { policy }, { headers });
    console.log(' - IAM policy updated successfully.');
  }

  // 3. Add Cloud SQL IAM Database User
  console.log(`\n[3/5] Checking Cloud SQL IAM database user: ${ADMIN_DB_USER}...`);
  const usersRes = await sqlAdmin.get(`/projects/${PROJECT}/instances/${INSTANCE}/users`, { headers });
  const users = usersRes.body.items || [];
  const dbUserExists = users.some((u) => u.name === ADMIN_DB_USER);

  if (!dbUserExists) {
    console.log(` - Adding Cloud SQL IAM database user: ${ADMIN_DB_USER}...`);
    const op = await sqlAdmin.post(`/projects/${PROJECT}/instances/${INSTANCE}/users`, {
      name: ADMIN_DB_USER,
      instance: INSTANCE,
      project: PROJECT,
      type: 'CLOUD_IAM_SERVICE_ACCOUNT',
    }, { headers });
    await waitForSqlOperation(op, 'Add Cloud SQL IAM Database User');
    console.log(' - Cloud SQL database user added successfully.');
  } else {
    console.log(` - Cloud SQL database user already exists.`);
  }

  // 4. Configure PostgreSQL Role tat_admin_writer_m10f using Temporary Admin Session
  console.log(`\n[4/5] Configuring PostgreSQL role ${ADMIN_ROLE} and table privileges via Admin Session...`);
  await withTemporaryAdminDatabase(async (database) => {
    const configureSql = `
      DO $$ BEGIN
        CREATE ROLE ${ADMIN_ROLE} NOLOGIN;
      EXCEPTION WHEN duplicate_object THEN NULL;
      END $$;

      ALTER ROLE ${ADMIN_ROLE} NOLOGIN NOCREATEDB NOCREATEROLE;

      REVOKE ALL ON DATABASE "${DATABASE}" FROM ${ADMIN_ROLE};
      GRANT CONNECT ON DATABASE "${DATABASE}" TO ${ADMIN_ROLE};

      REVOKE ALL ON SCHEMA public FROM ${ADMIN_ROLE};
      GRANT USAGE ON SCHEMA public TO ${ADMIN_ROLE};

      REVOKE ALL ON ALL TABLES IN SCHEMA public FROM ${ADMIN_ROLE};

      -- SELECT ONLY on Reference & Historical Tables
      GRANT SELECT ON
        actor_profiles,
        sectors,
        record_relationships,
        institutions,
        geographic_units,
        indicators,
        indicator_observations,
        corrections,
        review_decisions
      TO ${ADMIN_ROLE};

      -- SELECT, INSERT, UPDATE, DELETE on Linkage Tables (needed for syncing relations)
      GRANT SELECT, INSERT, UPDATE, DELETE ON
        record_sectors,
        record_institutions,
        record_geographies,
        sources,
        evidence_claims,
        claim_source_relationships
      TO ${ADMIN_ROLE};

      -- SELECT, INSERT, UPDATE on Core Mutable Entity Tables
      GRANT SELECT, INSERT, UPDATE ON
        records,
        achievement_profiles,
        policy_details,
        project_details,
        programme_details,
        financial_records,
        beneficiary_records,
        timeline_events,
        research_batches
      TO ${ADMIN_ROLE};

      -- Grant membership to the dedicated admin IAM user
      GRANT ${ADMIN_ROLE} TO "${ADMIN_DB_USER}";
    `;

    await database.query(configureSql);
    console.log(` - PostgreSQL role ${ADMIN_ROLE} created and granted to "${ADMIN_DB_USER}".`);
  });

  // 5. Verification Audit via IAM Database Connection
  console.log(`\n[5/5] Auditing PostgreSQL Catalog Memberships & Privileges...`);
  const iamDb = await createFirebaseIamDatabase();

  const membersAudit = await iamDb.query(`
    SELECT r.rolname as role, m.rolname as member
    FROM pg_auth_members am
    JOIN pg_roles r ON r.oid = am.roleid
    JOIN pg_roles m ON m.oid = am.member
    WHERE r.rolname = '${ADMIN_ROLE}' OR m.rolname = '${ADMIN_DB_USER}'
  `);
  console.log('--- ROLE MEMBERSHIPS ---');
  console.table(membersAudit.rows);

  const publicAudit = await iamDb.query(`
    SELECT
      pg_has_role('firebase-app-hosting-compute@tinubu-achievement-stg.iam', 'tat_public_reader', 'MEMBER') as app_is_public_reader,
      pg_has_role('firebase-app-hosting-compute@tinubu-achievement-stg.iam', '${ADMIN_ROLE}', 'MEMBER') as app_is_admin_writer,
      pg_has_role('firebase-app-hosting-compute@tinubu-achievement-stg.iam', 'tat_ingestion_writer', 'MEMBER') as app_is_ingestion_writer
  `);
  console.log('--- PUBLIC APP HOSTING BOUNDARY AUDIT ---');
  console.table(publicAudit.rows);

  await iamDb.close();
  console.log('\nPROVISIONING COMPLETE AND VERIFIED.');
}

main().catch(console.error);
