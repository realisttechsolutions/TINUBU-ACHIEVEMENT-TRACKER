import { PGlite } from '@electric-sql/pglite';
import { Pool } from 'pg';
import path from 'node:path';
import { readFileSync } from 'node:fs';

export interface SqlConnectConfig {
  connectionString?: string;
  isProduction?: boolean;
  ssl?: boolean;
}

let pgPool: Pool | null = null;
let localDbInstance: PGlite | null = null;

export async function getDatabaseConnection() {
  const isProduction = process.env.NODE_ENV === 'production' && !!process.env.DATABASE_URL;

  if (isProduction && process.env.DATABASE_URL) {
    if (!pgPool) {
      pgPool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.DATABASE_SSL === 'false' ? false : { rejectUnauthorized: false },
        max: 10,
        idleTimeoutMillis: 30000,
      });
    }
    return {
      query: async (text: string, params?: any[]) => {
        const res = await pgPool!.query(text, params);
        return { rows: res.rows, rowCount: res.rowCount };
      },
      close: async () => {},
    };
  }

  // Local Development / Test: PGlite in-memory or persisted
  if (!localDbInstance) {
    localDbInstance = new PGlite();
    // Load canonical schema and reference seed
    try {
      const schemaPath = path.resolve(process.cwd(), 'database/schema.sql');
      const seedPath = path.resolve(process.cwd(), 'database/seeds/canonical-reference.sql');
      const schemaSql = readFileSync(schemaPath, 'utf8');
      const seedSql = readFileSync(seedPath, 'utf8');
      await localDbInstance.exec(schemaSql);
      await localDbInstance.exec(seedSql);
    } catch {
      // In bundled runtime if files are packaged or mocked
    }
  }

  return {
    query: async (text: string, params?: any[]) => {
      const res = await localDbInstance!.query(text, params);
      return { rows: res.rows as any[], rowCount: (res.rows as any[]).length };
    },
    close: async () => {},
  };
}
