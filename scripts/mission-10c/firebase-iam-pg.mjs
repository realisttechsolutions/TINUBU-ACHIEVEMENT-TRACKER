import { createRequire } from 'node:module';
import pg from 'pg';
import { AuthTypes, Connector, IpAddressTypes } from '@google-cloud/cloud-sql-connector';

const require = createRequire(import.meta.url);
const auth = require('../../node_modules/firebase-tools/lib/auth');
const { requireAuth } = require('../../node_modules/firebase-tools/lib/requireAuth');
const cloudSqlAdmin = require('../../node_modules/firebase-tools/lib/gcp/cloudsql/cloudsqladmin');
const { FBToolsAuthClient } = require('../../node_modules/firebase-tools/lib/gcp/cloudsql/fbToolsAuthClient');
const { getIAMUser } = require('../../node_modules/firebase-tools/lib/gcp/cloudsql/connect');

pg.types.setTypeParser(20, (value) => value);
pg.types.setTypeParser(1700, (value) => value);

export async function createFirebaseIamDatabase({
  project = 'tinubu-achievement-stg',
  instance = 'tat-db-staging',
  database = 'tat_staging',
  max = 2,
} = {}) {
  const account = auth.getGlobalDefaultAccount();
  if (!account) throw new Error('Firebase CLI authentication is required for the staging proof harness.');
  const options = { ...account, project };
  await requireAuth(options);
  const username = await getIAMUser(options);
  const instanceState = await cloudSqlAdmin.getInstance(project, instance);
  if (instanceState.project !== project || instanceState.name !== instance) throw new Error('Cloud SQL staging boundary mismatch.');

  const connector = new Connector({ auth: new FBToolsAuthClient() });
  let pool;
  try {
    const connectorOptions = await connector.getOptions({
      instanceConnectionName: instanceState.connectionName,
      authType: AuthTypes.IAM,
      ipType: IpAddressTypes.PUBLIC,
    });
    pool = new pg.Pool({
      ...connectorOptions,
      user: username.user,
      database,
      max,
      min: 0,
      idleTimeoutMillis: 10_000,
      connectionTimeoutMillis: 15_000,
      statement_timeout: 120_000,
      application_name: 'tat-m10c-staging-proof',
      allowExitOnIdle: true,
    });
    const client = await pool.connect();
    return {
      username: username.user,
      async query(text, values = []) {
        return client.query(text, values);
      },
      async close() {
        client.release();
        await pool.end();
        connector.close();
      },
    };
  } catch (error) {
    await pool?.end().catch(() => undefined);
    connector.close();
    throw error;
  }
}
