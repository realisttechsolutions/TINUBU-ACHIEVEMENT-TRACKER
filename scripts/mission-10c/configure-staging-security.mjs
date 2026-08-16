import { createRequire } from 'node:module';
import { randomBytes } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { createFirebaseIamDatabase, createFirebasePasswordDatabase } from './firebase-iam-pg.mjs';

const require = createRequire(import.meta.url);
const auth = require('../../node_modules/firebase-tools/lib/auth');
const { requireAuth } = require('../../node_modules/firebase-tools/lib/requireAuth');
const { Client } = require('../../node_modules/firebase-tools/lib/apiv2');
const cloudSqlAdmin = require('../../node_modules/firebase-tools/lib/gcp/cloudsql/cloudsqladmin');

const PROJECT = 'tinubu-achievement-stg';
const PROJECT_NUMBER = '248050067355';
const INSTANCE = 'tat-db-staging';
const DATABASE = 'tat_staging';
const PUBLIC_SERVICE_ACCOUNT_ID = 'firebase-app-hosting-compute';
const INGESTION_SERVICE_ACCOUNT_ID = 'tat-ingestion-writer';
const PUBLIC_SERVICE_ACCOUNT = `${PUBLIC_SERVICE_ACCOUNT_ID}@${PROJECT}.iam.gserviceaccount.com`;
const INGESTION_SERVICE_ACCOUNT = `${INGESTION_SERVICE_ACCOUNT_ID}@${PROJECT}.iam.gserviceaccount.com`;
const PUBLIC_DB_USER = PUBLIC_SERVICE_ACCOUNT.replace('.gserviceaccount.com', '');
const INGESTION_DB_USER = INGESTION_SERVICE_ACCOUNT.replace('.gserviceaccount.com', '');
const apply = process.argv.includes('--apply');
const cleanupOperator = process.argv.includes('--cleanup-operator');

const headers = { 'x-goog-user-project': PROJECT };
const iam = new Client({ urlPrefix: 'https://iam.googleapis.com', apiVersion: 'v1', auth: true });
const resourceManager = new Client({ urlPrefix: 'https://cloudresourcemanager.googleapis.com', apiVersion: 'v1', auth: true });
const serviceUsage = new Client({ urlPrefix: 'https://serviceusage.googleapis.com', apiVersion: 'v1', auth: true });
const sqlAdmin = new Client({ urlPrefix: 'https://sqladmin.googleapis.com', apiVersion: 'v1', auth: true });

function quoteIdentifier(value) {
  return `"${String(value).replaceAll('"', '""')}"`;
}

async function authenticate() {
  const account = auth.getGlobalDefaultAccount();
  if (!account) throw new Error('Firebase CLI authentication is required.');
  await requireAuth({ ...account, project: PROJECT });
}

async function ensureIamApi() {
  const servicePath = `/projects/${PROJECT_NUMBER}/services/iam.googleapis.com`;
  const current = await serviceUsage.get(servicePath, { headers });
  if (current.body.state === 'ENABLED') return false;
  const operation = await serviceUsage.post(`${servicePath}:enable`, {}, { headers });
  const operationPath = `/${operation.body.name}`;
  const deadline = Date.now() + 5 * 60 * 1000;
  while (Date.now() < deadline) {
    const status = await serviceUsage.get(operationPath, { headers });
    if (status.body.done) {
      if (status.body.error) throw new Error(`IAM API enable failed: ${JSON.stringify(status.body.error)}`);
      return true;
    }
    await new Promise((resolve) => setTimeout(resolve, 5_000));
  }
  throw new Error('IAM API enable operation exceeded five minutes.');
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

function temporaryPassword() {
  return `${randomBytes(48).toString('base64url')}aA9!`;
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

async function serviceAccounts() {
  const response = await iam.get(`/projects/${PROJECT}/serviceAccounts`, { headers, queryParams: { pageSize: 100 } });
  return response.body.accounts ?? [];
}

async function ensureServiceAccount(accountId, displayName) {
  const email = `${accountId}@${PROJECT}.iam.gserviceaccount.com`;
  if ((await serviceAccounts()).some((account) => account.email === email)) return false;
  await iam.post(`/projects/${PROJECT}/serviceAccounts`, {
    accountId,
    serviceAccount: { displayName, description: 'Staging-only TAT M10C runtime identity; no keys.' },
  }, { headers });
  return true;
}

async function ensureProjectRoles() {
  const policyResponse = await resourceManager.post(`/projects/${PROJECT}:getIamPolicy`, {}, { headers });
  const policy = policyResponse.body;
  policy.bindings ??= [];
  let changed = false;
  const requiredBindings = new Map([
    ['roles/cloudsql.client', [PUBLIC_SERVICE_ACCOUNT, INGESTION_SERVICE_ACCOUNT]],
    ['roles/cloudsql.instanceUser', [PUBLIC_SERVICE_ACCOUNT, INGESTION_SERVICE_ACCOUNT]],
    ['roles/firebaseapphosting.computeRunner', [PUBLIC_SERVICE_ACCOUNT]],
  ]);
  for (const [role, emails] of requiredBindings) {
    let binding = policy.bindings.find((candidate) => candidate.role === role && !candidate.condition);
    if (!binding) {
      binding = { role, members: [] };
      policy.bindings.push(binding);
      changed = true;
    }
    for (const email of emails) {
      const member = `serviceAccount:${email}`;
      if (!binding.members.includes(member)) {
        binding.members.push(member);
        changed = true;
      }
    }
    binding.members.sort();
  }
  if (changed) {
    await resourceManager.post(`/projects/${PROJECT}:setIamPolicy`, { policy }, { headers });
  }
  return changed;
}

async function auditCloudIdentities() {
  const policy = (await resourceManager.post(`/projects/${PROJECT}:getIamPolicy`, {}, { headers })).body;
  const hasBinding = (role, email) => (policy.bindings ?? []).some(
    (binding) => binding.role === role && !binding.condition
      && (binding.members ?? []).includes(`serviceAccount:${email}`),
  );
  const [publicKeys, ingestionKeys] = await Promise.all([
    iam.get(`/projects/${PROJECT}/serviceAccounts/${encodeURIComponent(PUBLIC_SERVICE_ACCOUNT)}/keys`, {
      headers, queryParams: { keyTypes: 'USER_MANAGED' },
    }),
    iam.get(`/projects/${PROJECT}/serviceAccounts/${encodeURIComponent(INGESTION_SERVICE_ACCOUNT)}/keys`, {
      headers, queryParams: { keyTypes: 'USER_MANAGED' },
    }),
  ]);
  const result = {
    publicCloudSqlClient: hasBinding('roles/cloudsql.client', PUBLIC_SERVICE_ACCOUNT),
    publicCloudSqlInstanceUser: hasBinding('roles/cloudsql.instanceUser', PUBLIC_SERVICE_ACCOUNT),
    publicAppHostingComputeRunner: hasBinding('roles/firebaseapphosting.computeRunner', PUBLIC_SERVICE_ACCOUNT),
    ingestionCloudSqlClient: hasBinding('roles/cloudsql.client', INGESTION_SERVICE_ACCOUNT),
    ingestionCloudSqlInstanceUser: hasBinding('roles/cloudsql.instanceUser', INGESTION_SERVICE_ACCOUNT),
    publicUserManagedKeys: (publicKeys.body.keys ?? []).length,
    ingestionUserManagedKeys: (ingestionKeys.body.keys ?? []).length,
  };
  if (!result.publicCloudSqlClient || !result.publicCloudSqlInstanceUser
    || !result.publicAppHostingComputeRunner || !result.ingestionCloudSqlClient
    || !result.ingestionCloudSqlInstanceUser || result.publicUserManagedKeys !== 0
    || result.ingestionUserManagedKeys !== 0) {
    throw new Error(`Cloud identity audit failed: ${JSON.stringify(result)}`);
  }
  return result;
}

async function ensureIamDatabaseUser(username) {
  const users = await cloudSqlAdmin.listUsers(PROJECT, INSTANCE);
  if (users.some((user) => user.name === username && user.type === 'CLOUD_IAM_SERVICE_ACCOUNT')) return false;
  await cloudSqlAdmin.createUser(PROJECT, INSTANCE, 'CLOUD_IAM_SERVICE_ACCOUNT', username);
  return true;
}

function publicCatalogReplacement(schemaSql) {
  const start = schemaSql.indexOf('CREATE VIEW public_record_catalog AS');
  const end = schemaSql.indexOf('CREATE VIEW public_claim_evidence AS');
  if (start < 0 || end < 0 || end <= start) throw new Error('Canonical public view boundary could not be extracted.');
  return schemaSql.slice(start, end).trim().replace('CREATE VIEW', 'CREATE OR REPLACE VIEW');
}

function seedWithoutTransactionWrapper(seedSql) {
  const lines = seedSql.split(/\r?\n/);
  if (!lines.some((line) => line.trim() === 'BEGIN;') || !lines.some((line) => line.trim() === 'COMMIT;')) {
    throw new Error('Canonical reference seed transaction wrapper was not found.');
  }
  return lines.filter((line) => !['BEGIN;', 'COMMIT;'].includes(line.trim())).join('\n');
}

function privilegeSql(schemaSql, operator) {
  const publicViews = ['public_record_catalog', 'public_claim_evidence', 'public_financial_records', 'public_beneficiary_records'];
  const writerMutableTables = [
    'institutions', 'geographic_units', 'research_batches', 'records', 'achievement_profiles',
    'policy_details', 'project_details', 'programme_details', 'record_institutions',
    'record_sectors', 'record_geographies', 'sources', 'evidence_claims',
    'claim_source_relationships', 'financial_records', 'beneficiary_records', 'indicators',
    'indicator_observations', 'timeline_events', 'corrections', 'review_decisions',
  ];
  const reader = quoteIdentifier(PUBLIC_DB_USER);
  const writer = quoteIdentifier(INGESTION_DB_USER);
  return `
    ${publicCatalogReplacement(schemaSql)};
    DO $$ BEGIN CREATE ROLE tat_public_reader NOLOGIN; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    DO $$ BEGIN CREATE ROLE tat_ingestion_writer NOLOGIN; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    ALTER ROLE tat_public_reader NOLOGIN NOCREATEDB NOCREATEROLE;
    ALTER ROLE tat_ingestion_writer NOLOGIN NOCREATEDB NOCREATEROLE;
    REVOKE ALL ON DATABASE ${quoteIdentifier(DATABASE)} FROM tat_public_reader, tat_ingestion_writer;
    GRANT CONNECT ON DATABASE ${quoteIdentifier(DATABASE)} TO tat_public_reader, tat_ingestion_writer;
    REVOKE ALL ON SCHEMA public FROM tat_public_reader, tat_ingestion_writer;
    GRANT USAGE ON SCHEMA public TO tat_public_reader, tat_ingestion_writer;
    REVOKE ALL ON ALL TABLES IN SCHEMA public FROM tat_public_reader, tat_ingestion_writer;
    GRANT SELECT ON ${publicViews.map(quoteIdentifier).join(', ')} TO tat_public_reader;
    GRANT SELECT ON actor_profiles, sectors, record_relationships TO tat_ingestion_writer;
    GRANT SELECT, INSERT, UPDATE ON ${writerMutableTables.map(quoteIdentifier).join(', ')} TO tat_ingestion_writer;
    GRANT tat_public_reader TO ${reader};
    GRANT tat_ingestion_writer TO ${writer};
    GRANT tat_public_reader, tat_ingestion_writer TO ${quoteIdentifier(operator)};
  `;
}

async function audit(database) {
  const result = await database.query(`
    SELECT
      has_database_privilege(${`'${PUBLIC_DB_USER}'`}, current_database(), 'CONNECT') AS public_connect,
      has_schema_privilege(${`'${PUBLIC_DB_USER}'`}, 'public', 'USAGE') AS public_schema_usage,
      has_table_privilege(${`'${PUBLIC_DB_USER}'`}, 'public.public_record_catalog', 'SELECT') AS public_catalog_select,
      has_table_privilege(${`'${PUBLIC_DB_USER}'`}, 'public.public_claim_evidence', 'SELECT') AS public_evidence_select,
      has_table_privilege(${`'${PUBLIC_DB_USER}'`}, 'public.public_financial_records', 'SELECT') AS public_financial_select,
      has_table_privilege(${`'${PUBLIC_DB_USER}'`}, 'public.public_beneficiary_records', 'SELECT') AS public_beneficiary_select,
      has_table_privilege(${`'${PUBLIC_DB_USER}'`}, 'public.records', 'SELECT') AS public_records_select,
      has_table_privilege(${`'${PUBLIC_DB_USER}'`}, 'public.sources', 'SELECT') AS public_sources_select,
      has_table_privilege(${`'${PUBLIC_DB_USER}'`}, 'public.research_batches', 'SELECT') AS public_batches_select,
      has_table_privilege(${`'${INGESTION_DB_USER}'`}, 'public.records', 'INSERT') AS writer_records_insert,
      has_table_privilege(${`'${INGESTION_DB_USER}'`}, 'public.records', 'UPDATE') AS writer_records_update,
      has_table_privilege(${`'${INGESTION_DB_USER}'`}, 'public.records', 'DELETE') AS writer_records_delete,
      pg_has_role(${`'${PUBLIC_DB_USER}'`}, 'tat_public_reader', 'MEMBER') AS public_role_member,
      pg_has_role(${`'${INGESTION_DB_USER}'`}, 'tat_ingestion_writer', 'MEMBER') AS writer_role_member,
      (SELECT NOT rolsuper AND NOT rolcreaterole AND NOT rolcreatedb AND NOT rolcanlogin
         AND NOT rolreplication AND NOT rolbypassrls FROM pg_roles WHERE rolname = 'tat_public_reader') AS public_role_restricted,
      (SELECT NOT rolsuper AND NOT rolcreaterole AND NOT rolcreatedb AND NOT rolcanlogin
         AND NOT rolreplication AND NOT rolbypassrls FROM pg_roles WHERE rolname = 'tat_ingestion_writer') AS writer_role_restricted`);
  const row = result.rows[0];
  const pass = row.public_connect && row.public_schema_usage
    && row.public_catalog_select && row.public_evidence_select
    && row.public_financial_select && row.public_beneficiary_select
    && !row.public_records_select && !row.public_sources_select && !row.public_batches_select
    && row.writer_records_insert && row.writer_records_update && !row.writer_records_delete
    && row.public_role_member && row.writer_role_member
    && row.public_role_restricted && row.writer_role_restricted;
  if (!pass) throw new Error(`Staging privilege audit failed: ${JSON.stringify(row)}`);
  return row;
}

await authenticate();
if (!apply && !cleanupOperator) {
  console.log(JSON.stringify({
    mode: 'dry-run', project: PROJECT, instance: INSTANCE, database: DATABASE,
    serviceAccounts: [PUBLIC_SERVICE_ACCOUNT, INGESTION_SERVICE_ACCOUNT],
    iamRoles: ['roles/cloudsql.client', 'roles/cloudsql.instanceUser', 'roles/firebaseapphosting.computeRunner'],
    databaseRoles: ['tat_public_reader', 'tat_ingestion_writer'],
    persistentCredentialsOrKeysCreated: false,
  }, null, 2));
  process.exit(0);
}

if (cleanupOperator) {
  const operatorDatabase = await createFirebaseIamDatabase();
  const operator = operatorDatabase.username;
  await operatorDatabase.close();
  const cleanupResult = await withTemporaryAdminDatabase(async (database) => {
    await database.query(`REVOKE tat_public_reader, tat_ingestion_writer FROM ${quoteIdentifier(operator)}`);
    const membership = await database.query(`
      SELECT
        pg_has_role($1, 'tat_public_reader', 'MEMBER') AS public_member,
        pg_has_role($1, 'tat_ingestion_writer', 'MEMBER') AS writer_member`, [operator]);
    if (membership.rows[0].public_member || membership.rows[0].writer_member) {
      throw new Error('Operator staging-role cleanup did not remove both temporary memberships.');
    }
    return { operatorMembershipsRemoved: true, privileges: await audit(database) };
  });
  console.log(JSON.stringify({
    ...cleanupResult,
    cloudIdentities: await auditCloudIdentities(),
    temporaryAdminCredential: 'rotated and discarded in process memory',
    persistentCredentialsOrKeysCreated: false,
  }, null, 2));
  console.log('M10C OPERATOR ROLE CLEANUP: PASS');
  process.exit(0);
}

const changes = {
  iamApiEnabled: await ensureIamApi(),
  publicServiceAccountCreated: await ensureServiceAccount(PUBLIC_SERVICE_ACCOUNT_ID, 'Firebase App Hosting compute'),
  ingestionServiceAccountCreated: await ensureServiceAccount(INGESTION_SERVICE_ACCOUNT_ID, 'TAT staging ingestion writer'),
};
changes.projectIamChanged = await ensureProjectRoles();
changes.publicIamDatabaseUserCreated = await ensureIamDatabaseUser(PUBLIC_DB_USER);
changes.ingestionIamDatabaseUserCreated = await ensureIamDatabaseUser(INGESTION_DB_USER);

const operatorDatabase = await createFirebaseIamDatabase();
const operator = operatorDatabase.username;
await operatorDatabase.close();
const result = await withTemporaryAdminDatabase(async (database) => {
  const schemaSql = await readFile(new URL('../../database/schema.sql', import.meta.url), 'utf8');
  const seedSql = await readFile(new URL('../../database/seeds/canonical-reference.sql', import.meta.url), 'utf8');
  await database.query('BEGIN');
  try {
    await database.query(seedWithoutTransactionWrapper(seedSql));
    await database.query(privilegeSql(schemaSql, operator));
    await database.query('COMMIT');
  } catch (error) {
    await database.query('ROLLBACK');
    throw error;
  }
  const privileges = await audit(database);
  return { changes, canonicalReferenceSeedApplied: true, privileges };
});
console.log(JSON.stringify({
  ...result,
  cloudIdentities: await auditCloudIdentities(),
  runtimeAndIngestionAuthentication: 'IAM',
  temporaryAdminCredential: 'rotated and discarded in process memory',
  persistentCredentialsOrKeysCreated: false,
}, null, 2));
console.log('M10C STAGING SECURITY MODEL: PASS');
