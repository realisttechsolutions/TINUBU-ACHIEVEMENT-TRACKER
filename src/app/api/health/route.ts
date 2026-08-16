import { NextResponse } from 'next/server';
import { isCloudSqlDataEnabled, readCloudSqlConfig } from '@/server/db/config';
import { getDatabaseConnection } from '@/server/db/pool';
import { assertPublicDatabaseBoundary } from '@/server/security/public-database-boundary';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const cloudSql = isCloudSqlDataEnabled();
  if (cloudSql) {
    try {
      const connection = await getDatabaseConnection();
      const config = readCloudSqlConfig();
      await assertPublicDatabaseBoundary(connection, config.IAM_DB_USER);
    } catch {
      return NextResponse.json({ status: 'unhealthy' }, { status: 503 });
    }
  }
  return NextResponse.json(
    { status: 'healthy' },
    { status: 200 }
  );
}
