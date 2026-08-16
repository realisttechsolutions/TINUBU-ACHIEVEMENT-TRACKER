// @vitest-environment node
import { readFile } from 'node:fs/promises';
import { describe, expect, it, vi } from 'vitest';
import { PublicDataRepository } from '@/server/repositories/public-data.repository';

describe('public PostgreSQL repository', () => {
  it('parameterizes searches and filters without embedding user input', async () => {
    const query = vi.fn().mockResolvedValue({ rows: [], rowCount: 0 });
    const repository = new PublicDataRepository({ query } as never);
    const hostile = `coastal'; DROP TABLE records; --`;
    const rows = await repository.listRecords({ search: hostile, sector: 'infrastructure_transportation', status: 'operational', geography: 'NG-LA' });
    expect(rows).toEqual([]);
    const [sql, values] = query.mock.calls[0];
    expect(sql).not.toContain(hostile);
    expect(values).toContain(hostile);
    expect(sql).toContain('$1');
  });

  it('maps an empty record detail to a stable empty bundle', async () => {
    const query = vi.fn().mockResolvedValue({ rows: [], rowCount: 0 });
    const repository = new PublicDataRepository({ query } as never);
    await expect(repository.getRecordDetail('missing-slug')).resolves.toEqual({
      record: null,
      evidence: [],
      financials: [],
      beneficiaries: [],
    });
  });

  it('queries only the four approved public views', async () => {
    const source = await readFile(new URL('../../server/repositories/public-data.repository.ts', import.meta.url), 'utf8');
    for (const table of ['records', 'sources', 'evidence_claims', 'financial_records', 'beneficiary_records', 'timeline_events', 'indicator_observations', 'review_decisions', 'research_batches']) {
      expect(source).not.toMatch(new RegExp(`(?:FROM|JOIN)\\s+${table}\\b`, 'i'));
    }
    for (const view of ['public_record_catalog', 'public_claim_evidence', 'public_financial_records', 'public_beneficiary_records']) {
      expect(source).toContain(view);
    }
  });
});
