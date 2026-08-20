import { unstable_cache } from 'next/cache';
import type { PublicDataSnapshot } from '@/adapters/runtimeData';
import { isCloudSqlDataEnabled } from '@/server/db/config';

export async function getPublicDataSnapshot(): Promise<PublicDataSnapshot | null> {
  if (!isCloudSqlDataEnabled()) return null;

  const { getDatabaseConnection } = await import('@/server/db/pool');
  const { PublicDataRepository } = await import('@/server/repositories/public-data.repository');
  const { mapPublicDataSnapshot } = await import('@/server/repositories/public-data.mapper');

  const loadCloudSnapshot = unstable_cache(async (): Promise<PublicDataSnapshot> => {
    const repository = new PublicDataRepository(await getDatabaseConnection());
    return mapPublicDataSnapshot(await repository.getPublicSnapshotRows());
  }, ['tat-public-cloud-sql-snapshot-v1'], { revalidate: 300, tags: ['tat-public-data'] });

  return loadCloudSnapshot();
}
