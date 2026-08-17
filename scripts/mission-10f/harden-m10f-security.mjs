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
const ADMIN_ROLE = 'tat_admin_writer_m10f';
const ADMIN_SA_EMAIL = `tat-admin-api-staging@${PROJECT}.iam.gserviceaccount.com`;
const APP_HOSTING_SA_EMAIL = `firebase-app-hosting-compute@${PROJECT}.iam.gserviceaccount.com`;
const RUN_SERVICE = 'tat-admin-api-staging';
const REGION = 'us-central1';

const headers = { 'x-goog-user-project': PROJECT };
const sqlAdmin = new Client({ urlPrefix: 'https://sqladmin.googleapis.com', apiVersion: 'v1', auth: true });
const iamClient = new Client({ urlPrefix: 'https://iam.googleapis.com', apiVersion: 'v1', auth: true });
const runClient = new Client({ urlPrefix: 'https://run.googleapis.com', apiVersion: 'v1', auth: true });

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
  console.log('MISSION 10F-B2: FINAL CONTROL-PLANE HARDENING & AUDIT');
  console.log('============================================================\n');

  const account = auth.getGlobalDefaultAccount();
  await requireAuth({ ...account, project: PROJECT });

  // 1. Harden PostgreSQL Privileges
  console.log('[1/5] Hardening PostgreSQL privileges on tat_admin_writer_m10f...');
  await withTemporaryAdminDatabase(async (db) => {
    const hardenSql = `
      -- Revoke all table privileges first to ensure clean state
      REVOKE ALL ON ALL TABLES IN SCHEMA public FROM ${ADMIN_ROLE};

      -- Reference / Master / Historical Tables: SELECT ONLY
      GRANT SELECT ON
        actor_profiles,
        sectors,
        institutions,
        geographic_units,
        indicators,
        indicator_observations,
        corrections,
        review_decisions,
        record_relationships
      TO ${ADMIN_ROLE};

      -- Substantive Entity & Evidence Tables: SELECT, INSERT, UPDATE ONLY (DELETE = DENIED)
      GRANT SELECT, INSERT, UPDATE ON
        records,
        achievement_profiles,
        policy_details,
        project_details,
        programme_details,
        sources,
        evidence_claims,
        financial_records,
        beneficiary_records,
        timeline_events,
        research_batches,
        record_sectors,
        record_institutions,
        record_geographies
      TO ${ADMIN_ROLE};

      -- Only relationship table requiring DELETE for unlinking/updating draft citations
      GRANT SELECT, INSERT, UPDATE, DELETE ON
        claim_source_relationships
      TO ${ADMIN_ROLE};
    `;
    await db.query(hardenSql);
    console.log(' - Hardened SQL grants executed successfully.');
  });

  // 2. Query Live Catalog Privilege Matrix
  console.log('\n[2/5] Auditing live PostgreSQL table privileges after hardening...');
  const iamDb = await createFirebaseIamDatabase();

  const allTables = [
    'records', 'achievement_profiles', 'policy_details', 'project_details', 'programme_details',
    'sources', 'evidence_claims', 'financial_records', 'beneficiary_records', 'timeline_events',
    'research_batches', 'record_sectors', 'record_institutions', 'record_geographies',
    'claim_source_relationships', 'sectors', 'institutions', 'geographic_units',
    'actor_profiles', 'review_decisions', 'corrections', 'indicators', 'indicator_observations'
  ];

  const privQuery = `
    SELECT
      t.table_name,
      has_table_privilege('${ADMIN_ROLE}', 'public.' || t.table_name, 'SELECT') as can_select,
      has_table_privilege('${ADMIN_ROLE}', 'public.' || t.table_name, 'INSERT') as can_insert,
      has_table_privilege('${ADMIN_ROLE}', 'public.' || t.table_name, 'UPDATE') as can_update,
      has_table_privilege('${ADMIN_ROLE}', 'public.' || t.table_name, 'DELETE') as can_delete,
      has_table_privilege('${ADMIN_ROLE}', 'public.' || t.table_name, 'TRUNCATE') as can_truncate,
      has_table_privilege('${ADMIN_ROLE}', 'public.' || t.table_name, 'REFERENCES') as can_references,
      has_table_privilege('${ADMIN_ROLE}', 'public.' || t.table_name, 'TRIGGER') as can_trigger
    FROM unnest($1::text[]) as t(table_name)
    ORDER BY t.table_name
  `;
  const privRes = await iamDb.query(privQuery, [allTables]);
  console.log('--- TAT_ADMIN_WRITER_M10F HARDENED PRIVILEGE MATRIX ---');
  console.table(privRes.rows);

  // 3. User-Defined Functions Audit
  console.log('\n[3/5] Auditing executable user-defined functions in catalog...');
  const funcQuery = `
    SELECT
      n.nspname as schema_name,
      p.proname as function_name,
      pg_get_function_identity_arguments(p.oid) as arguments,
      has_function_privilege('${ADMIN_ROLE}', p.oid, 'EXECUTE') as can_execute
    FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname NOT IN ('pg_catalog', 'information_schema', 'pg_toast')
    ORDER BY n.nspname, p.proname
  `;
  const funcRes = await iamDb.query(funcQuery);
  console.log('--- USER-DEFINED / NON-SYSTEM FUNCTIONS ---');
  if (funcRes.rows.length === 0) {
    console.log(' - No non-system user-defined functions found in public/custom schemas.');
  } else {
    console.table(funcRes.rows);
  }

  // 4. Cloud Run IAM Policy Exact Proof
  console.log('\n[4/5] Inspecting Cloud Run IAM policy for tat-admin-api-staging...');
  const runPolicyRes = await runClient.get(
    `/projects/${PROJECT}/locations/${REGION}/services/${RUN_SERVICE}:getIamPolicy`,
    { headers }
  );
  const runPolicy = runPolicyRes.body;
  console.log('--- CLOUD RUN IAM POLICY (tat-admin-api-staging) ---');
  console.log(JSON.stringify(runPolicy, null, 2));

  const invokerBinding = (runPolicy.bindings || []).find((b) => b.role === 'roles/run.invoker');
  const invokerMembers = invokerBinding?.members || [];
  console.log(' - roles/run.invoker members:', invokerMembers);
  console.log(' - allUsers present:', invokerMembers.includes('allUsers'));
  console.log(' - allAuthenticatedUsers present:', invokerMembers.includes('allAuthenticatedUsers'));

  // 5. Service Account Impersonation Audit
  console.log('\n[5/5] Auditing Service Account IAM Policy on tat-admin-api-staging SA...');
  const saPolicyRes = await iamClient.post(
    `/v1/projects/${PROJECT}/serviceAccounts/${ADMIN_SA_EMAIL}:getIamPolicy`,
    {},
    { headers }
  );
  const saPolicy = saPolicyRes.body;
  console.log('--- ADMIN SERVICE ACCOUNT IAM POLICY ---');
  console.log(JSON.stringify(saPolicy, null, 2));

  let appHostingCanImpersonate = false;
  for (const binding of saPolicy.bindings || []) {
    if (
      binding.role === 'roles/iam.serviceAccountTokenCreator' ||
      binding.role === 'roles/iam.serviceAccountUser' ||
      binding.role === 'roles/iam.workloadIdentityUser'
    ) {
      if (binding.members?.some((m) => m.includes(APP_HOSTING_SA_EMAIL))) {
        appHostingCanImpersonate = true;
      }
    }
  }
  console.log(' - App Hosting compute SA can impersonate Admin SA:', appHostingCanImpersonate);

  await iamDb.close();
  console.log('\nHARDENING AND AUDIT HARNESS COMPLETE.');
}

main().catch(console.error);
