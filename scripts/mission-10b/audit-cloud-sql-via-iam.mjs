import { createRequire } from 'node:module';
import { readFile } from 'node:fs/promises';
import { PGlite } from '@electric-sql/pglite';
import {
  assertMission10BMetrics,
  catalogIssueCount,
  catalogMetrics,
  compareCanonicalCatalogs,
  introspectCanonicalCatalog,
} from './schema-catalog.mjs';

const require = createRequire(import.meta.url);
const auth = require('../../node_modules/firebase-tools/lib/auth');
const { requireAuth } = require('../../node_modules/firebase-tools/lib/requireAuth');
const { executeSqlCmdsAsIamUser } = require('../../node_modules/firebase-tools/lib/gcp/cloudsql/connect');

const PROJECT = 'tinubu-achievement-stg';
const INSTANCE = 'tat-db-staging';
const DATABASE = 'tat_staging';
const SERVICE_AGENT_USER = 'service-248050067355@gcp-sa-firebasedataconnect.iam';
const WRITER_ROLE = 'firebasewriter_tat_staging_public';
const READER_ROLE = 'firebasereader_tat_staging_public';
const OWNER_ROLE = 'firebaseowner_tat_staging_public';

const account = auth.getGlobalDefaultAccount();
if (!account) throw new Error('Firebase CLI authentication is required.');
const options = { ...account, project: PROJECT };
await requireAuth(options);

const cloud = {
  async query(sql) {
    const [result] = await executeSqlCmdsAsIamUser(options, INSTANCE, DATABASE, [sql], true);
    return result;
  },
};

const schemaSql = await readFile(new URL('../../database/schema.sql', import.meta.url), 'utf8');
const local = new PGlite();

try {
  await local.exec(schemaSql);
  const canonical = await introspectCanonicalCatalog(local);
  const live = await introspectCanonicalCatalog(cloud);
  const metrics = catalogMetrics(live);
  const comparison = compareCanonicalCatalogs(canonical, live);
  const issues = catalogIssueCount(comparison);
  assertMission10BMetrics(metrics);
  if (issues !== 0) {
    console.error(JSON.stringify(comparison, null, 2));
    throw new Error(`Cloud catalog parity failed with ${issues} issues.`);
  }

  const ownership = await cloud.query(`
    SELECT
      (SELECT pg_get_userbyid(nspowner) FROM pg_namespace WHERE nspname = 'public') AS schema_owner,
      (SELECT pg_get_userbyid(datdba) FROM pg_database WHERE datname = current_database()) AS database_owner,
      count(*)::int AS table_count,
      count(*) FILTER (WHERE tableowner = 'postgres')::int AS postgres_owned_tables,
      count(DISTINCT tableowner)::int AS distinct_table_owners
    FROM pg_tables
    WHERE schemaname = 'public'`);
  const roles = await cloud.query(`
    SELECT
      to_regrole('${OWNER_ROLE}') IS NOT NULL AS owner_role_exists,
      to_regrole('${WRITER_ROLE}') IS NOT NULL AS writer_role_exists,
      to_regrole('${READER_ROLE}') IS NOT NULL AS reader_role_exists,
      pg_has_role('${SERVICE_AGENT_USER}', '${WRITER_ROLE}', 'MEMBER') AS service_agent_is_writer,
      has_schema_privilege('${SERVICE_AGENT_USER}', 'public', 'USAGE') AS service_agent_schema_usage,
      has_table_privilege('${SERVICE_AGENT_USER}', 'public.records', 'SELECT') AS service_agent_can_select,
      has_table_privilege('${SERVICE_AGENT_USER}', 'public.records', 'INSERT') AS service_agent_can_insert,
      has_table_privilege('${SERVICE_AGENT_USER}', 'public.records', 'UPDATE') AS service_agent_can_update,
      has_table_privilege('${SERVICE_AGENT_USER}', 'public.records', 'DELETE') AS service_agent_can_delete`);
  const dataCounts = await cloud.query(canonical.tables
    .map((table) => `SELECT '${table}' AS table_name, count(*)::int AS row_count FROM public."${table}"`)
    .join('\nUNION ALL\n'));

  const owner = ownership.rows[0];
  const role = roles.rows[0];
  const ownershipPass = owner.schema_owner === 'pg_database_owner'
    && owner.database_owner === 'cloudsqlsuperuser'
    && owner.table_count === 27
    && owner.postgres_owned_tables === 27
    && owner.distinct_table_owners === 1;
  const rolePass = role.owner_role_exists === false
    && role.writer_role_exists === true
    && role.reader_role_exists === true
    && role.service_agent_is_writer === true
    && role.service_agent_schema_usage === true
    && role.service_agent_can_select === true
    && role.service_agent_can_insert === true
    && role.service_agent_can_update === true
    && role.service_agent_can_delete === true;
  if (!ownershipPass || !rolePass) {
    throw new Error(`Brownfield ownership/role audit failed: ${JSON.stringify({ owner, role })}`);
  }
  const nonEmptyTables = dataCounts.rows.filter((row) => row.row_count !== 0);
  if (process.argv.includes('--expect-empty') && nonEmptyTables.length) {
    throw new Error(`Expected an empty pre-ingestion database: ${JSON.stringify(nonEmptyTables)}`);
  }

  console.log(JSON.stringify({
    catalogMetrics: metrics,
    catalogDifferences: issues,
    ownership: owner,
    brownfieldRoles: role,
    dataState: {
      tableCount: dataCounts.rows.length,
      totalRows: dataCounts.rows.reduce((total, row) => total + row.row_count, 0),
      nonEmptyTables,
    },
  }, null, 2));
  console.log('POST-BROWNFIELD CLOUD PHYSICAL PARITY: PASS');
  console.log('BROWNFIELD SCHEMA OWNERSHIP: PASS (non-Firebase ownership retained)');
} finally {
  await local.close();
}
