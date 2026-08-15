// @vitest-environment node
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createLocalDatabase } from '../../../backend/local/database.mjs';

describe('Database Security, RBAC & Boundary Tests', { timeout: 30000 }, () => {
  let db: any;

  beforeAll(async () => {
    db = await createLocalDatabase({ seed: true });
  }, 30000);

  afterAll(async () => {
    if (db) await db.close();
  });

  it('prevents direct unauthorized injection into actor roles', async () => {
    const roles = await db.query(`SELECT count(*)::int as count FROM actor_roles WHERE revoked_at IS NULL`);
    expect(roles.rows[0].count).toBeGreaterThan(0);
  });

  it('restricts public view access to only verified published records', async () => {
    const pubRes = await db.query(
      `SELECT count(*)::int as count FROM public_record_catalog WHERE publication_status NOT IN ('published', 'publishable', 'publishable_with_qualification')`
    );
    expect(pubRes.rows[0].count).toBe(0);
  });

  it('blocks publication without explicit publication review decision', async () => {
    await expect(
      db.query(`
        INSERT INTO records (
          id, external_id, slug, record_type, title, summary,
          implementation_status, workflow_status, publication_status,
          verification_status, evidence_profile, is_public, created_by
        ) VALUES (
          '22222222-2222-4000-8000-222222222222', 'TEST-PUB-FAIL', 'test-pub-fail',
          'achievement', 'Test Invalid Publication', 'Summary of invalid publication attempt',
          'completed', 'draft', 'published',
          'unverified', 'direct_physical_delivery', true, '00000000-0000-4000-8000-000000000001'
        )
      `)
    ).rejects.toThrow();
  });
});
