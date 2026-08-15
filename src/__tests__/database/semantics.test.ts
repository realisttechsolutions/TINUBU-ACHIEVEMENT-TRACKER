// @vitest-environment node
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createLocalDatabase } from '../../../backend/local/database.mjs';
import { executeM02Ingestion } from '../../../backend/ingestion/importer.mjs';

describe('Research Truth Discipline & Semantic Integrity Tests', { timeout: 30000 }, () => {
  let db: any;

  beforeAll(async () => {
    db = await createLocalDatabase({ seed: false });
    await executeM02Ingestion(db);
  }, 30000);

  afterAll(async () => {
    if (db) await db.close();
  });

  it('preserves distinct financial aggregation types without collapsing', async () => {
    const finRes = await db.query(
      `SELECT financial_type, count(*)::int as count FROM financial_records GROUP BY financial_type`
    );
    expect(finRes.rows.length).toBeGreaterThan(1);
  });

  it('preserves distinct beneficiary stages without false aggregation', async () => {
    const benRes = await db.query(
      `SELECT beneficiary_stage, count(*)::int as count FROM beneficiary_records GROUP BY beneficiary_stage`
    );
    expect(benRes.rows.length).toBeGreaterThan(1);
  });

  it('links every financial and beneficiary record to an evidence claim on the same record', async () => {
    const orphanFin = await db.query(`
      SELECT f.id FROM financial_records f
      JOIN evidence_claims c ON c.id = f.claim_id
      WHERE f.record_id <> c.record_id
    `);
    expect(orphanFin.rows).toHaveLength(0);

    const orphanBen = await db.query(`
      SELECT b.id FROM beneficiary_records b
      JOIN evidence_claims c ON c.id = b.claim_id
      WHERE b.record_id <> c.record_id
    `);
    expect(orphanBen.rows).toHaveLength(0);
  });
});
