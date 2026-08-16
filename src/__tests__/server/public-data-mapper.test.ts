// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { assertExactDecimal, formatExactDecimal, mapPublicDataSnapshot } from '@/server/repositories/public-data.mapper';

const record = {
  id: 'a0000000-0000-4000-8000-000000000001',
  slug: 'precision-proof',
  record_type: 'achievement',
  title: 'Precision proof achievement',
  summary: 'A public summary for the precision mapping proof.',
  implementation_status: 'operational',
  publication_status: 'published',
  verification_status: 'independently_corroborated',
  evidence_profile: 'verified_administrative_disbursement',
  qualification: null,
  published_at: '2024-08-01T00:00:00Z',
  public_description: 'Public description',
  display_priority: 1,
  type_details: {},
  sectors: [{ code: 'economy_fiscal_reforms', label: 'Economy and Fiscal Reforms', role: 'primary', publicGroupCode: 'economy', publicGroupLabel: 'Economy' }],
  institutions: [{ name: 'Public Test Institution', role: 'lead' }],
  geographies: [{ code: 'NGA', name: 'Nigeria', type: 'national', role: 'covered' }],
  timeline: [],
  indicators: [],
};

describe('public data mapping', () => {
  it('preserves numeric(24,4) values as exact strings', () => {
    const exact = '900719925474099312345678.1234';
    const snapshot = mapPublicDataSnapshot({
      records: [record],
      evidence: [],
      financials: [{ id: 'f1', record_id: record.id, financial_type: 'funding_released', amount_exact: exact, currency_code: 'NGN', reporting_period_label: '2024', period_start: '2024-01-01', period_end: '2024-12-31', aggregation_basis: 'period', nominal_or_real: 'nominal' }],
      beneficiaries: [],
    }, '2026-08-16T00:00:00.000Z');
    expect(snapshot.achievements[0].financialMetrics?.[0].amount).toBe(exact);
    expect(snapshot.achievements[0].financialMetrics?.[0].formattedAmount).toBe('NGN 900,719,925,474,099,312,345,678.1234');
  });

  it('rejects invalid decimal text rather than coercing it', () => {
    expect(() => assertExactDecimal('1e9')).toThrow('invalid exact decimal');
  });

  it('formats exact decimal text without floating-point conversion', () => {
    expect(formatExactDecimal('1234567890.0000')).toBe('1,234,567,890.0000');
  });
});
