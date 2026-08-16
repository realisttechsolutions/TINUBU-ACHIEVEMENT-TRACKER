import { NextResponse } from 'next/server';
import { isCloudSqlDataEnabled, readCloudSqlConfig } from '@/server/db/config';
import { getDatabaseConnection } from '@/server/db/pool';
import { assertPublicDatabaseBoundary } from '@/server/security/public-database-boundary';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const cloudSql = isCloudSqlDataEnabled();
  let database = cloudSql ? 'unavailable' : 'synthetic';
  let securityBoundary = cloudSql ? 'unverified' : 'not-applicable';
  if (cloudSql) {
    try {
      const connection = await getDatabaseConnection();
      const config = readCloudSqlConfig();
      await assertPublicDatabaseBoundary(connection, config.IAM_DB_USER);
      database = 'reachable';
      securityBoundary = 'enforced';
    } catch {
      return NextResponse.json(
        { status: 'unhealthy', database: 'unavailable', securityBoundary: 'unverified' },
        { status: 503 },
      );
    }
  }
  return NextResponse.json(
    {
      status: 'healthy',
      application: 'Tinubu Achievement Tracker V2',
      framework: 'Next.js App Router',
      version: '2.0.0-m09',
      environment: process.env.NODE_ENV || 'development',
      dataSource: cloudSql ? 'cloud-sql' : 'synthetic',
      database,
      securityBoundary,
      timestamp: new Date().toISOString(),
      capabilities: {
        serverRendering: true,
        dynamicMetadata: true,
        appHostingReady: true,
      },
    },
    { status: 200 }
  );
}
