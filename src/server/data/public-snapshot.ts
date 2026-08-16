import { unstable_cache } from 'next/cache';
import type { PublicDataSnapshot } from '@/adapters/runtimeData';
import { isCloudSqlDataEnabled } from '@/server/db/config';
import { getDatabaseConnection } from '@/server/db/pool';
import { mapPublicDataSnapshot } from '@/server/repositories/public-data.mapper';
import { PublicDataRepository } from '@/server/repositories/public-data.repository';

const loadCloudSnapshot = unstable_cache(async (): Promise<PublicDataSnapshot> => {
  const repository = new PublicDataRepository(await getDatabaseConnection());
  return mapPublicDataSnapshot(await repository.getPublicSnapshotRows());
}, ['tat-public-cloud-sql-snapshot-v1'], { revalidate: 300, tags: ['tat-public-data'] });

export async function getPublicDataSnapshot(): Promise<PublicDataSnapshot | null> {
  if (!isCloudSqlDataEnabled()) return null;
  return loadCloudSnapshot();
}
