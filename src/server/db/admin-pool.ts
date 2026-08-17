import 'server-only';
import pg, { type Pool, type PoolClient, type QueryResult, type QueryResultRow } from 'pg';
import {
  AuthTypes,
  Connector,
  IpAddressTypes,
  type DriverOptions,
} from '@google-cloud/cloud-sql-connector';
import { readCloudSqlConfig, isCloudSqlDataEnabled } from './config';
import { getDatabaseConnection, executeParameterizedQuery, type QueryExecutor } from './pool';

export interface TransactionClient {
  query<Row extends QueryResultRow = QueryResultRow>(
    text: string,
    values?: readonly unknown[],
  ): Promise<Pick<QueryResult<Row>, 'rows' | 'rowCount'>>;
}

export interface AdminDatabaseConnection extends QueryExecutor {
  withTransaction<T>(
    callback: (client: TransactionClient) => Promise<T>,
  ): Promise<T>;
}

interface AdminRuntimeState {
  connector?: Connector;
  pool: Pool;
  closing?: Promise<void>;
}

declare global {
  // eslint-disable-next-line no-var
  var __tatAdminCloudSqlState: AdminRuntimeState | undefined;
}

function ipType(value: 'PUBLIC' | 'PRIVATE' | 'PSC'): IpAddressTypes {
  return IpAddressTypes[value];
}

async function createAdminRuntimeState(): Promise<AdminRuntimeState> {
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
    throw new Error('Admin Cloud SQL Connector initialization failed.', { cause: error });
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
    application_name: 'tinubu-achievement-tracker-admin',
    allowExitOnIdle: true,
  });

  pool.on('error', (error) => {
    console.error('Unexpected idle Admin Cloud SQL client error.', {
      name: error.name,
      code: (error as NodeJS.ErrnoException).code,
    });
  });

  return { connector, pool };
}

async function getAdminPool(): Promise<Pool> {
  if (!isCloudSqlDataEnabled()) {
    // In local development / mock mode, return an in-memory mock or public connection pool
    const { pool } = (globalThis as any).__tatCloudSqlState || {};
    if (pool) return pool;
  }

  if (!globalThis.__tatAdminCloudSqlState) {
    globalThis.__tatAdminCloudSqlState = await createAdminRuntimeState();
  }
  return globalThis.__tatAdminCloudSqlState.pool;
}

export async function getAdminDatabaseConnection(): Promise<AdminDatabaseConnection> {
  if (!isCloudSqlDataEnabled()) {
    // Local / fallback mode
    const publicConn = await getDatabaseConnection();
    return {
      query: publicConn.query,
      async withTransaction<T>(callback: (client: TransactionClient) => Promise<T>): Promise<T> {
        // Execute inside single sequential queries or rollback mock
        await publicConn.query('BEGIN');
        try {
          const result = await callback({ query: publicConn.query });
          await publicConn.query('COMMIT');
          return result;
        } catch (err) {
          await publicConn.query('ROLLBACK');
          throw err;
        }
      },
    };
  }

  const pool = await getAdminPool();

  return {
    async query<Row extends QueryResultRow>(text: string, values: readonly unknown[] = []) {
      if (typeof text !== 'string' || !text.trim()) throw new Error('Database query text is required.');
      return executeParameterizedQuery<Row>(pool, text, values);
    },

    async withTransaction<T>(callback: (client: TransactionClient) => Promise<T>): Promise<T> {
      const client = await pool.connect();
      try {
        await client.query('BEGIN');
        // Set role to tat_admin_writer or tat_ingestion_writer for least-privilege enforcement
        try {
          await client.query('SET ROLE tat_ingestion_writer');
        } catch {
          // If role is not directly configured, proceed with the authenticated IAM identity
        }

        const transactionClient: TransactionClient = {
          async query<Row extends QueryResultRow>(text: string, values: readonly unknown[] = []) {
            const result = await client.query<Row>(text, [...values]);
            return { rows: result.rows, rowCount: result.rowCount };
          },
        };

        const result = await callback(transactionClient);
        await client.query('COMMIT');
        return result;
      } catch (error) {
        try {
          await client.query('ROLLBACK');
        } catch (rollbackError) {
          console.error('Transaction rollback failed:', rollbackError);
        }
        throw error;
      } finally {
        try {
          await client.query('RESET ROLE');
        } catch {
          // ignore reset role failure on client release
        }
        client.release();
      }
    },
  };
}
