// @vitest-environment node
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createLocalDatabase } from '../../../backend/local/database.mjs';
import { executeM02Ingestion } from '../../../backend/ingestion/importer.mjs';
import { reconcileDatabaseWithM02 } from '../../../backend/ingestion/reconciler.mjs';

describe('Ingestion Pipeline Idempotency Tests', { timeout: 30000 }, () => {
  let db: any;

  beforeAll(async () => {
    db = await createLocalDatabase({ seed: false });
  }, 30000);

  afterAll(async () => {
    if (db) await db.close();
  });

  it('handles multiple consecutive runs without row duplication or corruption', async () => {
    const run1 = await executeM02Ingestion(db);
    expect(run1.success).toBe(true);

    const run2 = await executeM02Ingestion(db);
    expect(run2.success).toBe(true);

    const run3 = await executeM02Ingestion(db);
    expect(run3.success).toBe(true);

    const recon = await reconcileDatabaseWithM02(db);
    expect(recon.reconciled).toBe(true);
    expect(recon.actual.records).toBe(56);
    expect(recon.actual.sources).toBe(35);
    expect(recon.actual.evidenceClaims).toBe(33);
  });
});
