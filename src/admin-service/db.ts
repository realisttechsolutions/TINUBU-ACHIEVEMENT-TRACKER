import pg, { type Pool, type QueryResult, type QueryResultRow } from 'pg';
import {
  AuthTypes,
  Connector,
  IpAddressTypes,
  type DriverOptions,
} from '@google-cloud/cloud-sql-connector';

export interface AdminTransactionClient {
  query<Row extends QueryResultRow = QueryResultRow>(
    text: string,
    values?: readonly unknown[],
  ): Promise<Pick<QueryResult<Row>, 'rows' | 'rowCount'>>;
}

export interface AdminControlPlaneDb {
  query<Row extends QueryResultRow = QueryResultRow>(
    text: string,
    values?: readonly unknown[],
  ): Promise<Pick<QueryResult<Row>, 'rows' | 'rowCount'>>;
  withTransaction<T>(
    callback: (client: AdminTransactionClient) => Promise<T>,
  ): Promise<T>;
  close(): Promise<void>;
}

let globalPool: Pool | null = null;
let globalConnector: Connector | null = null;

export async function createAdminControlPlaneDb(): Promise<AdminControlPlaneDb> {
  const instanceConnectionName =
    process.env.INSTANCE_CONNECTION_NAME || 'tinubu-achievement-stg:us-central1:tat-db-staging';
  const dbName = process.env.DB_NAME || 'tat_staging';
  const iamDbUser =
    process.env.ADMIN_IAM_DB_USER || 'tat-admin-api-staging@tinubu-achievement-stg.iam';

  if (!globalPool) {
    globalConnector = new Connector();
    let driverOptions: DriverOptions;
    try {
      driverOptions = await globalConnector.getOptions({
        instanceConnectionName,
        authType: AuthTypes.IAM,
        ipType: IpAddressTypes.PUBLIC,
      });
    } catch (error) {
      globalConnector.close();
      throw new Error('Admin Control Plane Cloud SQL Connector initialization failed.', { cause: error });
    }

    globalPool = new pg.Pool({
      ...driverOptions,
      user: iamDbUser,
      database: dbName,
      max: parseInt(process.env.DB_POOL_MAX || '4', 10),
      min: 0,
      idleTimeoutMillis: 10_000,
      connectionTimeoutMillis: 10_000,
      statement_timeout: 15_000,
      application_name: 'tat-admin-control-plane',
      allowExitOnIdle: true,
    });

    globalPool.on('error', (error) => {
      console.error('Unexpected idle client error in Admin Control Plane:', error);
    });
  }

  const pool = globalPool;

  return {
    async query<Row extends QueryResultRow = QueryResultRow>(
      text: string,
      values: readonly unknown[] = [],
    ) {
      const result = await pool.query<Row>(text, [...values]);
      return { rows: result.rows, rowCount: result.rowCount };
    },

    async withTransaction<T>(callback: (client: AdminTransactionClient) => Promise<T>): Promise<T> {
      const client = await pool.connect();
      try {
        await client.query('BEGIN');
        try {
          await client.query('SET ROLE tat_admin_writer_m10f');
        } catch {
          // If role not yet set, proceed under IAM login
        }

        const txClient: AdminTransactionClient = {
          async query<Row extends QueryResultRow = QueryResultRow>(text: string, values: readonly unknown[] = []) {
            const res = await client.query<Row>(text, [...values]);
            return { rows: res.rows, rowCount: res.rowCount };
          },
        };

        const result = await callback(txClient);
        await client.query('COMMIT');
        return result;
      } catch (error) {
        try {
          await client.query('ROLLBACK');
        } catch (rollbackErr) {
          console.error('Transaction rollback failed:', rollbackErr);
        }
        throw error;
      } finally {
        try {
          await client.query('RESET ROLE');
        } catch {
          // ignore reset role on client release
        }
        client.release();
      }
    },

    async close() {
      if (globalPool) {
        await globalPool.end();
        globalPool = null;
      }
      if (globalConnector) {
        globalConnector.close();
        globalConnector = null;
      }
    },
  };
}
