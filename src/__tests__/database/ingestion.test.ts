// @vitest-environment node
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createLocalDatabase } from '../../../backend/local/database.mjs';
import { executeM02Ingestion } from '../../../backend/ingestion/importer.mjs';
import { reconcileDatabaseWithM02 } from '../../../backend/ingestion/reconciler.mjs';

describe('M02 Research Ingestion Pipeline & Reconciliation Tests', { timeout: 30000 }, () => {
  let db: any;

  beforeAll(async () => {
    db = await createLocalDatabase({ seed: false });
  }, 30000);

  afterAll(async () => {
    if (db) await db.close();
  });

  it('successfully executes dry-run validation without writing rows', async () => {
    const dryRunReport = await executeM02Ingestion(db, { dryRun: true });
    expect(dryRunReport.success).toBe(true);
    expect(dryRunReport.manifestVerified).toBe(true);
    expect(dryRunReport.dataValidated).toBe(true);
    expect(dryRunReport.counts.records).toBe(56);

    const checkRes = await db.query('SELECT count(*)::int as count FROM records');
    expect(checkRes.rows[0].count).toBe(0);
  });

  it('successfully commits live M02 ingestion with 100% reconciliation', async () => {
    const liveReport = await executeM02Ingestion(db, { dryRun: false });
    expect(liveReport.success).toBe(true);
    expect(liveReport.manifestVerified).toBe(true);
    expect(liveReport.dataValidated).toBe(true);

    const recon = await reconcileDatabaseWithM02(db);
    expect(recon.reconciled).toBe(true);
    expect(recon.discrepancies).toHaveLength(0);
    expect(recon.showcaseVerified).toBe(10);
    expect(recon.actual.records).toBe(56);
    expect(recon.actual.sources).toBe(35);
    expect(recon.actual.evidenceClaims).toBe(33);
    expect(recon.actual.claimSourceRelationships).toBe(36);
    expect(recon.actual.financialRecords).toBe(8);
    expect(recon.actual.beneficiaryRecords).toBe(8);
    expect(recon.actual.timelineEvents).toBe(15);
  });
});
