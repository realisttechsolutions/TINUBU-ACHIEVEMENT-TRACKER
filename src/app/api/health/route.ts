import { NextResponse } from 'next/server';
import { isCloudSqlDataEnabled } from '@/server/db/config';
import { getDatabaseConnection } from '@/server/db/pool';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const cloudSql = isCloudSqlDataEnabled();
  let database = cloudSql ? 'unavailable' : 'synthetic';
  if (cloudSql) {
    try {
      const result = await (await getDatabaseConnection()).query(
        'SELECT current_database() AS database, current_user AS database_user, 1 AS reachable',
      );
      database = result.rows[0]?.reachable === 1 ? 'reachable' : 'unavailable';
    } catch {
      return NextResponse.json({ status: 'unhealthy', database: 'unavailable' }, { status: 503 });
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
