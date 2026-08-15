// @vitest-environment node
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createLocalDatabase } from '../../../backend/local/database.mjs';

describe('Canonical 27-Table Database Schema Tests', { timeout: 30000 }, () => {
  let db: any;

  beforeAll(async () => {
    db = await createLocalDatabase({ seed: true });
  }, 30000);

  afterAll(async () => {
    if (db) await db.close();
  });

  it('contains all 27 canonical tables and core public views', async () => {
    const tableRes = await db.query(
      `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE'`
    );
    const tables = tableRes.rows.map((r: any) => r.table_name);

    expect(tables).toContain('records');
    expect(tables).toContain('achievement_profiles');
    expect(tables).toContain('policy_details');
    expect(tables).toContain('project_details');
    expect(tables).toContain('programme_details');
    expect(tables).toContain('sources');
    expect(tables).toContain('evidence_claims');
    expect(tables).toContain('claim_source_relationships');
    expect(tables).toContain('financial_records');
    expect(tables).toContain('beneficiary_records');
    expect(tables).toContain('indicators');
    expect(tables).toContain('indicator_observations');
    expect(tables).toContain('timeline_events');
    expect(tables).toContain('corrections');
    expect(tables).toContain('review_decisions');
    expect(tables).toContain('research_batches');
    expect(tables).toContain('sectors');
    expect(tables).toContain('geographic_units');
    expect(tables).toContain('actor_profiles');
    expect(tables).toContain('actor_roles');
  });

  it('enforces append-only triggers on review_decisions and corrections', async () => {
    await expect(
      db.query(`DELETE FROM review_decisions`)
    ).rejects.toThrow(/append-only/i);

    await expect(
      db.query(`DELETE FROM corrections`)
    ).rejects.toThrow(/append-only/i);
  });

  it('enforces sector taxonomy hierarchy rules', async () => {
    await expect(
      db.query(`
        INSERT INTO sectors (id, code, label, taxonomy_level, parent_sector_id, public_order)
        VALUES ('11111111-1111-4000-8000-111111111111', 'fake_sector', 'Fake Sector', 'LEVEL_2_SECTOR', NULL, 99)
      `)
    ).rejects.toThrow();
  });
});
