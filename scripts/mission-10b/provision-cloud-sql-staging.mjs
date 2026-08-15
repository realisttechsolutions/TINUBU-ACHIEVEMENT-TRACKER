import { randomBytes } from 'node:crypto';
import { createRequire } from 'node:module';
import { readFile } from 'node:fs/promises';
import { PGlite } from '@electric-sql/pglite';
import pg from 'pg';
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
const { Client } = require('../../node_modules/firebase-tools/lib/apiv2');

const PROJECT = 'tinubu-achievement-stg';
const INSTANCE = 'tat-db-staging';
const DATABASE = 'tat_staging';
const REGION = 'us-central1';
const REQUIRED_APPROVAL_FLAG = '--approved-cost';
const operationTimeoutMs = 30 * 60 * 1000;

if (!process.argv.includes(REQUIRED_APPROVAL_FLAG)) {
  throw new Error(`Refusing to create billable infrastructure without ${REQUIRED_APPROVAL_FLAG}.`);
}

const headers = { 'x-goog-user-project': PROJECT };
const sqlAdmin = new Client({
  urlPrefix: 'https://sqladmin.googleapis.com',
  apiVersion: 'v1',
  auth: true,
});
const billing = new Client({
  urlPrefix: 'https://cloudbilling.googleapis.com',
  apiVersion: 'v1',
  auth: true,
});

const get = (path) => sqlAdmin.get(path, { headers });
const post = (path, body) => sqlAdmin.post(path, body, { headers });
const patch = (path, body) => sqlAdmin.patch(path, body, { headers });
const put = (path, body, queryParams) => sqlAdmin.put(path, body, { headers, queryParams });
const delay = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
const password = () => `${randomBytes(36).toString('base64url')}aA9!`;

async function authenticate() {
  const account = auth.getGlobalDefaultAccount();
  if (!account) throw new Error('Firebase CLI authentication is required.');
  await requireAuth({ ...account, project: PROJECT });
}

async function waitForOperation(operation, label) {
  const operationName = operation?.body?.name ?? operation?.name;
  if (!operationName) throw new Error(`${label} did not return a Cloud SQL operation name.`);
  const deadline = Date.now() + operationTimeoutMs;
  let lastStatus = '';

  while (Date.now() < deadline) {
    const response = await get(`/projects/${PROJECT}/operations/${operationName}`);
    const current = response.body;
    if (current.status !== lastStatus) {
      console.log(`${label}: ${current.status}`);
      lastStatus = current.status;
    }
    if (current.status === 'DONE') {
      const errors = current.error?.errors ?? [];
      if (errors.length) {
        throw new Error(`${label} failed: ${errors.map((error) => `${error.code}: ${error.message}`).join('; ')}`);
      }
      return current;
    }
    await delay(10_000);
  }
  throw new Error(`${label} exceeded the 30-minute safety timeout.`);
}

async function getExternalIpv4() {
  const response = await fetch('https://api.ipify.org?format=json');
  if (!response.ok) throw new Error(`Unable to determine administrator IPv4 address (${response.status}).`);
  const { ip } = await response.json();
  const octets = String(ip).split('.').map(Number);
  if (octets.length !== 4 || octets.some((part) => !Number.isInteger(part) || part < 0 || part > 255)) {
    throw new Error('Administrator endpoint did not return a valid IPv4 address.');
  }
  return ip;
}

function publicIp(instance) {
  const address = instance.ipAddresses?.find((entry) => entry.type === 'PRIMARY')?.ipAddress;
  if (!address) throw new Error('Cloud SQL did not expose the expected primary public IPv4 address.');
  return address;
}

async function getInstance() {
  return (await get(`/projects/${PROJECT}/instances/${INSTANCE}`)).body;
}

async function createApprovedInstance(rootPassword, administratorIpv4) {
  const existing = (await get(`/projects/${PROJECT}/instances`)).body.items ?? [];
  if (existing.some((item) => item.name === INSTANCE)) {
    throw new Error(`${INSTANCE} already exists; refusing an ambiguous provisioning replay.`);
  }

  const expirationTime = new Date(Date.now() + 90 * 60 * 1000).toISOString();
  const operation = await post(`/projects/${PROJECT}/instances`, {
    name: INSTANCE,
    project: PROJECT,
    region: REGION,
    databaseVersion: 'POSTGRES_17',
    rootPassword,
    settings: {
      tier: 'db-f1-micro',
      edition: 'ENTERPRISE',
      availabilityType: 'ZONAL',
      pricingPlan: 'PER_USE',
      activationPolicy: 'ALWAYS',
      dataDiskType: 'PD_SSD',
      dataDiskSizeGb: '10',
      storageAutoResize: false,
      deletionProtectionEnabled: true,
      retainBackupsOnDelete: false,
      finalBackupConfig: { enabled: false },
      userLabels: {
        environment: 'staging',
        mission: 'm10b',
        application: 'tat',
      },
      databaseFlags: [
        { name: 'cloudsql.iam_authentication', value: 'on' },
      ],
      ipConfiguration: {
        ipv4Enabled: true,
        requireSsl: false,
        sslMode: 'ENCRYPTED_ONLY',
        authorizedNetworks: [{
          name: 'm10b-temporary-admin',
          value: `${administratorIpv4}/32`,
          expirationTime,
        }],
      },
      backupConfiguration: {
        enabled: true,
        startTime: '02:00',
        pointInTimeRecoveryEnabled: false,
        backupRetentionSettings: {
          retentionUnit: 'COUNT',
          retainedBackups: 7,
        },
      },
      insightsConfig: {
        queryInsightsEnabled: false,
      },
    },
  });
  await waitForOperation(operation, 'Cloud SQL instance creation');
}

function assertApprovedConfiguration(instance) {
  const settings = instance.settings ?? {};
  const required = [
    ['project', instance.project, PROJECT],
    ['name', instance.name, INSTANCE],
    ['region', instance.region, REGION],
    ['state', instance.state, 'RUNNABLE'],
    ['databaseVersion', instance.databaseVersion, 'POSTGRES_17'],
    ['tier', settings.tier, 'db-f1-micro'],
    ['edition', settings.edition, 'ENTERPRISE'],
    ['availabilityType', settings.availabilityType, 'ZONAL'],
    ['dataDiskType', settings.dataDiskType, 'PD_SSD'],
    ['dataDiskSizeGb', String(settings.dataDiskSizeGb), '10'],
    ['storageAutoResize', settings.storageAutoResize, false],
    ['deletionProtectionEnabled', settings.deletionProtectionEnabled, true],
    ['sslMode', settings.ipConfiguration?.sslMode, 'ENCRYPTED_ONLY'],
    ['backups enabled', settings.backupConfiguration?.enabled, true],
    ['PITR disabled', settings.backupConfiguration?.pointInTimeRecoveryEnabled, false],
    ['retained backups', settings.backupConfiguration?.backupRetentionSettings?.retainedBackups, 7],
  ];
  const failures = required
    .filter(([, actual, expected]) => actual !== expected)
    .map(([name, actual, expected]) => `${name}: expected ${expected}, found ${actual}`);
  const iamFlag = settings.databaseFlags?.find((flag) => flag.name === 'cloudsql.iam_authentication')?.value;
  if (iamFlag !== 'on') failures.push('cloudsql.iam_authentication is not on');
  if (failures.length) throw new Error(`Approved Cloud SQL configuration mismatch:\n- ${failures.join('\n- ')}`);
}

async function createDatabase() {
  const databases = (await get(`/projects/${PROJECT}/instances/${INSTANCE}/databases`)).body.items ?? [];
  if (databases.some((database) => database.name === DATABASE)) return;
  const operation = await post(`/projects/${PROJECT}/instances/${INSTANCE}/databases`, {
    project: PROJECT,
    instance: INSTANCE,
    name: DATABASE,
  });
  await waitForOperation(operation, 'tat_staging database creation');
}

async function connectToDatabase(instance, rootPassword) {
  const config = {
    host: publicIp(instance),
    port: 5432,
    database: DATABASE,
    user: 'postgres',
    password: rootPassword,
    ssl: {
      ca: instance.serverCaCert?.cert,
      rejectUnauthorized: true,
      checkServerIdentity: () => undefined,
    },
    connectionTimeoutMillis: 10_000,
    statement_timeout: 120_000,
  };

  for (let attempt = 1; attempt <= 60; attempt += 1) {
    const client = new pg.Client(config);
    try {
      await client.connect();
      console.log(`Secure administrative connection: PASS (attempt ${attempt})`);
      return client;
    } catch (error) {
      await client.end().catch(() => undefined);
      if (attempt === 60) throw error;
      if (attempt === 1 || attempt % 6 === 0) console.log(`Waiting for PostgreSQL readiness (attempt ${attempt})`);
      await delay(10_000);
    }
  }
  throw new Error('PostgreSQL connection retry loop ended unexpectedly.');
}

async function applyAndCertifyCanonicalDdl(cloud) {
  const existing = await cloud.query(`
    SELECT count(*)::int AS count
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public' AND c.relkind IN ('r', 'v')`);
  if (existing.rows[0].count !== 0) {
    throw new Error(`tat_staging is not empty (${existing.rows[0].count} public tables/views); canonical DDL was not applied.`);
  }

  const schemaSql = await readFile(new URL('../../database/schema.sql', import.meta.url), 'utf8');
  const ddlResult = await cloud.query(schemaSql);
  console.log(`Canonical DDL application: PASS (${Array.isArray(ddlResult) ? ddlResult.length : 1} PostgreSQL result blocks)`);

  const local = new PGlite();
  try {
    await local.exec(schemaSql);
    const canonical = await introspectCanonicalCatalog(local);
    const live = await introspectCanonicalCatalog(cloud);
    const canonicalMetrics = catalogMetrics(canonical);
    const liveMetrics = catalogMetrics(live);
    const comparison = compareCanonicalCatalogs(canonical, live);
    const issueCount = catalogIssueCount(comparison);
    assertMission10BMetrics(canonicalMetrics);
    assertMission10BMetrics(liveMetrics);
    if (issueCount !== 0) {
      console.error(JSON.stringify(comparison, null, 2));
      throw new Error(`Cloud physical parity failed with ${issueCount} catalog differences.`);
    }
    console.log(`Cloud physical metrics: ${JSON.stringify(liveMetrics)}`);
    console.log('Canonical Cloud SQL physical parity: PASS (100%, 0 catalog differences)');
  } finally {
    await local.close();
  }
}

async function rotateBuiltinPassword() {
  const operation = await put(
    `/projects/${PROJECT}/instances/${INSTANCE}/users`,
    { name: 'postgres', password: password(), type: 'BUILT_IN' },
    { name: 'postgres' },
  );
  await waitForOperation(operation, 'Built-in administrator password rotation');
}

async function removeAdministratorNetwork() {
  const instance = await getInstance();
  const operation = await patch(`/projects/${PROJECT}/instances/${INSTANCE}`, {
    settings: {
      settingsVersion: instance.settings.settingsVersion,
      ipConfiguration: { authorizedNetworks: [] },
    },
  });
  await waitForOperation(operation, 'Temporary administrator network removal');
  const verified = await getInstance();
  if ((verified.settings.ipConfiguration?.authorizedNetworks ?? []).length !== 0) {
    throw new Error('Temporary administrator network is still present after cleanup.');
  }
  if (verified.settings.ipConfiguration?.sslMode !== 'ENCRYPTED_ONLY') {
    throw new Error('Encrypted-only connection policy changed during cleanup.');
  }
  console.log('Temporary administrator network: REMOVED');
}

await authenticate();
const billingInfo = await billing.get(`/projects/${PROJECT}/billingInfo`, { headers });
if (!billingInfo.body.billingEnabled || !billingInfo.body.billingAccountName) {
  throw new Error(`${PROJECT} is not linked to an enabled billing account.`);
}
console.log('Billing/Blaze preflight: PASS');

const administratorIpv4 = await getExternalIpv4();
const rootPassword = password();
let instanceCreated = false;
let cloud;
let primaryError;

try {
  await createApprovedInstance(rootPassword, administratorIpv4);
  instanceCreated = true;
  let instance = await getInstance();
  assertApprovedConfiguration(instance);
  console.log('Approved Cloud SQL configuration: PASS');
  await createDatabase();
  instance = await getInstance();
  cloud = await connectToDatabase(instance, rootPassword);
  const version = await cloud.query('SELECT current_setting(\'server_version\') AS version, current_database() AS database');
  if (!String(version.rows[0].version).startsWith('17.')) {
    throw new Error(`Expected PostgreSQL 17, found ${version.rows[0].version}.`);
  }
  if (version.rows[0].database !== DATABASE) {
    throw new Error(`Expected ${DATABASE}, connected to ${version.rows[0].database}.`);
  }
  console.log(`PostgreSQL/database verification: PASS (${version.rows[0].version}, ${version.rows[0].database})`);
  await applyAndCertifyCanonicalDdl(cloud);
} catch (error) {
  primaryError = error;
} finally {
  await cloud?.end().catch(() => undefined);
  if (instanceCreated) {
    try {
      await rotateBuiltinPassword();
    } catch (error) {
      primaryError ??= error;
      console.error(`Password cleanup failed: ${error.message}`);
    }
    try {
      await removeAdministratorNetwork();
    } catch (error) {
      primaryError ??= error;
      console.error(`Network cleanup failed: ${error.message}`);
    }
  }
}

if (primaryError) throw primaryError;
console.log('MISSION 10B CLOUD SQL FOUNDATION: PASS');
