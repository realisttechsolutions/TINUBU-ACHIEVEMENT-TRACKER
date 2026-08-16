import {
  AuthTypes,
  Connector,
  IpAddressTypes,
  type DriverOptions,
} from '@google-cloud/cloud-sql-connector';
import pg, { type Pool, type QueryResult, type QueryResultRow } from 'pg';
import { readCloudSqlConfig } from './config';

const { types } = pg;

// node-postgres must preserve exact numeric and bigint text at the application boundary.
types.setTypeParser(20, (value) => value);
types.setTypeParser(1700, (value) => value);

export interface QueryExecutor {
  query<Row extends QueryResultRow = QueryResultRow>(
    text: string,
    values?: readonly unknown[],
  ): Promise<Pick<QueryResult<Row>, 'rows' | 'rowCount'>>;
}

interface RuntimeDatabaseState {
  connector: Connector;
  pool: Pool;
  closing?: Promise<void>;
}

interface PoolQueryLike {
  query<Row extends QueryResultRow = QueryResultRow>(text: string, values?: unknown[]): Promise<QueryResult<Row>>;
}

declare global {
  // eslint-disable-next-line no-var
  var __tatCloudSqlState: RuntimeDatabaseState | undefined;
}

function ipType(value: 'PUBLIC' | 'PRIVATE' | 'PSC'): IpAddressTypes {
  return IpAddressTypes[value];
}

async function createRuntimeDatabaseState(): Promise<RuntimeDatabaseState> {
  const config = readCloudSqlConfig();
  const connector = new Connector();
  let driverOptions: DriverOptions;

  try {
    driverOptions = await connector.getOptions({
      instanceConnectionName: config.INSTANCE_CONNECTION_NAME,
      authType: AuthTypes.IAM,
      ipType: ipType(config.DB_IP_TYPE),
    });
  } catch (error) {
    connector.close();
    throw new Error('Cloud SQL Connector initialization failed.', { cause: error });
  }

  const pool = new pg.Pool({
    ...driverOptions,
    user: config.IAM_DB_USER,
    database: config.DB_NAME,
    max: config.DB_POOL_MAX,
    min: 0,
    idleTimeoutMillis: config.DB_IDLE_TIMEOUT_MS,
    connectionTimeoutMillis: config.DB_CONNECTION_TIMEOUT_MS,
    statement_timeout: config.DB_STATEMENT_TIMEOUT_MS,
    application_name: 'tinubu-achievement-tracker-public',
    allowExitOnIdle: true,
  });

  pool.on('error', (error) => {
    console.error('Unexpected idle Cloud SQL client error.', { name: error.name, code: (error as NodeJS.ErrnoException).code });
  });

  return { connector, pool };
}

async function runtimeDatabaseState(): Promise<RuntimeDatabaseState> {
  if (!globalThis.__tatCloudSqlState) {
    globalThis.__tatCloudSqlState = await createRuntimeDatabaseState();
  }
  return globalThis.__tatCloudSqlState;
}

export async function getDatabaseConnection(): Promise<QueryExecutor> {
  const { pool } = await runtimeDatabaseState();
  return {
    async query<Row extends QueryResultRow>(text: string, values: readonly unknown[] = []) {
      if (typeof text !== 'string' || !text.trim()) throw new Error('Database query text is required.');
      return executeParameterizedQuery<Row>(pool, text, values);
    },
  };
}

export async function executeParameterizedQuery<Row extends QueryResultRow = QueryResultRow>(
  client: PoolQueryLike,
  text: string,
  values: readonly unknown[] = [],
): Promise<Pick<QueryResult<Row>, 'rows' | 'rowCount'>> {
  try {
    const result = await client.query<Row>(text, [...values]);
    return { rows: result.rows, rowCount: result.rowCount };
  } catch (error) {
    throw new Error('Cloud SQL query failed.', { cause: error });
  }
}

export async function closeDatabaseConnection(): Promise<void> {
  const state = globalThis.__tatCloudSqlState;
  if (!state) return;
  if (!state.closing) {
    state.closing = state.pool.end().finally(() => {
      state.connector.close();
      globalThis.__tatCloudSqlState = undefined;
    });
  }
  await state.closing;
}
