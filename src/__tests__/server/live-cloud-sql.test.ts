// @vitest-environment node
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { dataAdapter, hydrateDataAdapter } from '@/adapters/dataAdapter';
import { mapPublicDataSnapshot } from '@/server/repositories/public-data.mapper';
import { PublicDataRepository } from '@/server/repositories/public-data.repository';
import { createFirebaseIamDatabase } from '../../../scripts/mission-10c/firebase-iam-pg.mjs';

const live = process.env.TAT_RUN_LIVE_CLOUD_SQL === '1';
const suite = live ? describe : describe.skip;

suite('live Cloud SQL public application data layer', { timeout: 120_000 }, () => {
  let database: Awaited<ReturnType<typeof createFirebaseIamDatabase>>;
  let repository: PublicDataRepository;
  let queryCount = 0;
  const latencies: Record<string, number> = {};

  const timed = async <T>(name: string, action: () => Promise<T>) => {
    const start = performance.now();
    const value = await action();
    latencies[name] = Math.round((performance.now() - start) * 100) / 100;
    return value;
  };

  beforeAll(async () => {
    database = await createFirebaseIamDatabase({ max: 2 });
    const membership = await database.query(
      "SELECT pg_has_role(current_user, 'tat_public_reader', 'MEMBER') AS permitted",
    );
    if (!(membership.rows[0] as unknown as { permitted: boolean }).permitted) {
      throw new Error('Authenticated operator is not authorized for the staging public-reader proof role.');
    }
    await database.query('SET ROLE tat_public_reader');
    repository = new PublicDataRepository({
      async query(text: string, values: readonly unknown[] = []) {
        queryCount += 1;
        return database.query(text, [...values]);
      },
    } as never);
  });

  afterAll(async () => {
    if (!database) return;
    hydrateDataAdapter(null);
    await database.query('RESET ROLE').catch(() => undefined);
    await database.close();
    console.log(JSON.stringify({ latenciesMs: latencies, queryCount }, null, 2));
  });

  it('proves homepage, explorer, filters, search, and detail', async () => {
    const homepage = await timed('homepage', () => repository.getHomepageSummary());
    expect(homepage?.published_records).toBe(56);
    expect((await timed('explorer', () => repository.listRecords())).length).toBe(56);
    expect((await timed('search', () => repository.listRecords({ search: 'Electricity Act' }))).length).toBeGreaterThan(0);
    expect((await timed('sectorFilter', () => repository.listRecords({ sector: 'power_energy_natural_resources' }))).length).toBeGreaterThan(0);
    expect((await timed('geographyFilter', () => repository.listRecords({ geography: 'NG-LA' }))).length).toBeGreaterThan(0);
    expect((await timed('statusFilter', () => repository.listRecords({ status: 'operational' }))).length).toBeGreaterThan(0);

    const match = await repository.listRecords({ search: 'Electricity Act', limit: 1 });
    const detail = await timed('recordDetail', () => repository.getRecordDetail(String(match[0].slug)));
    expect(detail.record).not.toBeNull();
    expect(detail.evidence.length).toBeGreaterThan(0);
  });

  it('proves summaries, timeline, indicators, exact finance, beneficiaries, and downloads', async () => {
    expect((await timed('sectorSummaries', () => repository.getSectorSummaries())).length).toBeGreaterThan(0);
    expect((await timed('geographySummaries', () => repository.getGeographySummaries())).length).toBeGreaterThan(0);
    expect((await timed('timeline', () => repository.getTimeline())).length).toBe(15);
    expect((await timed('indicators', () => repository.getIndicators())).length).toBe(4);
    const aggregates = await timed('financialAggregates', () => repository.getSafeFinancialAggregates());
    expect(aggregates).toHaveLength(7);
    expect(aggregates.every((row) => typeof row.amount_exact === 'string')).toBe(true);
    expect((await timed('downloads', () => repository.getPublicDownload(null, null))).length).toBe(56);

    const before = queryCount;
    const rows = await timed('publicSnapshot', () => repository.getPublicSnapshotRows());
    expect(queryCount - before).toBe(4);
    expect(rows.financials).toHaveLength(8);
    expect(rows.beneficiaries).toHaveLength(8);
    const snapshot = mapPublicDataSnapshot(rows);
    hydrateDataAdapter(snapshot);
    expect(snapshot.achievements).toHaveLength(30);
    expect(snapshot.projects).toHaveLength(8);
    expect(snapshot.policies).toHaveLength(10);
    expect(snapshot.programmes).toHaveLength(8);
    expect(snapshot.timelineEvents).toHaveLength(15);
    expect(snapshot.publicDownload).toHaveLength(56);
    expect(dataAdapter.getAchievements()).toHaveLength(30);
    expect(dataAdapter.getProjects()).toHaveLength(8);
    expect(dataAdapter.getPolicies()).toHaveLength(10);
  });
});
