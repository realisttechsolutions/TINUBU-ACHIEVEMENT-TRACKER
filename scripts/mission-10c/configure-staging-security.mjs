import { createRequire } from 'node:module';
import { readFile } from 'node:fs/promises';
import { createFirebaseIamDatabase } from './firebase-iam-pg.mjs';

const require = createRequire(import.meta.url);
const auth = require('../../node_modules/firebase-tools/lib/auth');
const { requireAuth } = require('../../node_modules/firebase-tools/lib/requireAuth');
const { Client } = require('../../node_modules/firebase-tools/lib/apiv2');
const cloudSqlAdmin = require('../../node_modules/firebase-tools/lib/gcp/cloudsql/cloudsqladmin');

const PROJECT = 'tinubu-achievement-stg';
const INSTANCE = 'tat-db-staging';
const DATABASE = 'tat_staging';
const PUBLIC_SERVICE_ACCOUNT_ID = 'firebase-app-hosting-compute';
const INGESTION_SERVICE_ACCOUNT_ID = 'tat-ingestion-writer';
const PUBLIC_SERVICE_ACCOUNT = `${PUBLIC_SERVICE_ACCOUNT_ID}@${PROJECT}.iam.gserviceaccount.com`;
const INGESTION_SERVICE_ACCOUNT = `${INGESTION_SERVICE_ACCOUNT_ID}@${PROJECT}.iam.gserviceaccount.com`;
const PUBLIC_DB_USER = PUBLIC_SERVICE_ACCOUNT.replace('.gserviceaccount.com', '');
const INGESTION_DB_USER = INGESTION_SERVICE_ACCOUNT.replace('.gserviceaccount.com', '');
const apply = process.argv.includes('--apply');

const headers = { 'x-goog-user-project': PROJECT };
const iam = new Client({ urlPrefix: 'https://iam.googleapis.com', apiVersion: 'v1', auth: true });
const resourceManager = new Client({ urlPrefix: 'https://cloudresourcemanager.googleapis.com', apiVersion: 'v1', auth: true });

function quoteIdentifier(value) {
  return `"${String(value).replaceAll('"', '""')}"`;
}

async function authenticate() {
  const account = auth.getGlobalDefaultAccount();
  if (!account) throw new Error('Firebase CLI authentication is required.');
  await requireAuth({ ...account, project: PROJECT });
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
  for (const role of ['roles/cloudsql.client', 'roles/cloudsql.instanceUser']) {
    let binding = policy.bindings.find((candidate) => candidate.role === role && !candidate.condition);
    if (!binding) {
      binding = { role, members: [] };
      policy.bindings.push(binding);
      changed = true;
    }
    for (const email of [PUBLIC_SERVICE_ACCOUNT, INGESTION_SERVICE_ACCOUNT]) {
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

function privilegeSql(schemaSql) {
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
    ALTER ROLE tat_public_reader NOLOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOREPLICATION NOBYPASSRLS;
    ALTER ROLE tat_ingestion_writer NOLOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOREPLICATION NOBYPASSRLS;
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
      pg_has_role(${`'${INGESTION_DB_USER}'`}, 'tat_ingestion_writer', 'MEMBER') AS writer_role_member`);
  const row = result.rows[0];
  const pass = row.public_connect && row.public_schema_usage
    && row.public_catalog_select && row.public_evidence_select
    && row.public_financial_select && row.public_beneficiary_select
    && !row.public_records_select && !row.public_sources_select && !row.public_batches_select
    && row.writer_records_insert && row.writer_records_update && !row.writer_records_delete
    && row.public_role_member && row.writer_role_member;
  if (!pass) throw new Error(`Staging privilege audit failed: ${JSON.stringify(row)}`);
  return row;
}

await authenticate();
if (!apply) {
  console.log(JSON.stringify({
    mode: 'dry-run', project: PROJECT, instance: INSTANCE, database: DATABASE,
    serviceAccounts: [PUBLIC_SERVICE_ACCOUNT, INGESTION_SERVICE_ACCOUNT],
    iamRoles: ['roles/cloudsql.client', 'roles/cloudsql.instanceUser'],
    databaseRoles: ['tat_public_reader', 'tat_ingestion_writer'],
    credentialsOrKeysCreated: false,
  }, null, 2));
  process.exit(0);
}

const changes = {
  publicServiceAccountCreated: await ensureServiceAccount(PUBLIC_SERVICE_ACCOUNT_ID, 'Firebase App Hosting compute'),
  ingestionServiceAccountCreated: await ensureServiceAccount(INGESTION_SERVICE_ACCOUNT_ID, 'TAT staging ingestion writer'),
};
changes.projectIamChanged = await ensureProjectRoles();
changes.publicIamDatabaseUserCreated = await ensureIamDatabaseUser(PUBLIC_DB_USER);
changes.ingestionIamDatabaseUserCreated = await ensureIamDatabaseUser(INGESTION_DB_USER);

const database = await createFirebaseIamDatabase();
try {
  const schemaSql = await readFile(new URL('../../database/schema.sql', import.meta.url), 'utf8');
  await database.query('BEGIN');
  try {
    await database.query(privilegeSql(schemaSql));
    await database.query('COMMIT');
  } catch (error) {
    await database.query('ROLLBACK');
    throw error;
  }
  const privileges = await audit(database);
  console.log(JSON.stringify({ changes, privileges, credentialsOrKeysCreated: false }, null, 2));
  console.log('M10C STAGING SECURITY MODEL: PASS');
} finally {
  await database.close();
}
