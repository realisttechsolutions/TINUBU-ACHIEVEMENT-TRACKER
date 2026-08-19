// @vitest-environment node
import { describe, expect, it } from 'vitest';
import {
  assertExactDecimal,
  formatExactDecimal,
  formatPublicFinancialAmount,
  formatPublicContractValue,
  sanitizePublicPresentationText,
  mapPublicDataSnapshot,
} from '@/server/repositories/public-data.mapper';

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
  it('preserves numeric(24,4) values as exact strings and formats NGN with Naira symbol', () => {
    const exact = '900719925474099312345678.1234';
    const snapshot = mapPublicDataSnapshot({
      records: [record],
      evidence: [],
      financials: [{ id: 'f1', record_id: record.id, financial_type: 'funding_released', amount_exact: exact, currency_code: 'NGN', reporting_period_label: '2024', period_start: '2024-01-01', period_end: '2024-12-31', aggregation_basis: 'period', nominal_or_real: 'nominal' }],
      beneficiaries: [],
    }, '2026-08-16T00:00:00.000Z');
    expect(snapshot.achievements[0].financialMetrics?.[0].amount).toBe(exact);
    expect(snapshot.achievements[0].financialMetrics?.[0].currency).toBe('NGN');
    expect(snapshot.achievements[0].financialMetrics?.[0].formattedAmount).toBe('₦900,719,925,474,099,312,345,678.1234');
  });

  it('preserves canonical evidence exactly while deriving safe public presentation', () => {
    const exact = '1100000000.0000';
    const canonicalClaimText = 'Bilateral sovereign credit financing of USD 1.1 billion approved for Green Imperative Agro-mechanization programme';
    const canonicalSourceTitle = 'FEC approval of USD 1.1 Billion Green Imperative facility';
    const canonicalEvidenceSummary = 'FEC approval of USD 1.1 Billion facility';

    const foreignRecord = {
      ...record,
      id: 'a0000000-0000-4000-8000-000000000008',
      slug: 'green-imperative-test',
      title: 'Bilateral Activation of Green Imperative',
      summary: 'Bilateral financing activation with foreign partners for the USD 1.1 billion Green Imperative Project.',
      public_description: 'Over USD 1.1 billion in bilateral facilities approved.',
    };

    const snapshot = mapPublicDataSnapshot({
      records: [foreignRecord],
      evidence: [
        {
          record_id: foreignRecord.id,
          claim_id: 'c1',
          claim_text: canonicalClaimText,
          claim_type: 'financial_value',
          data_value_nature: 'actual',
          source_origin: 'government_reported',
          verification_status: 'source_confirmed',
          source_id: 's1',
          source_title: canonicalSourceTitle,
          publisher_name: 'Cabinet Secretariat',
          source_level: 'LEVEL_1',
          source_role: 'primary',
          source_type: 'executive_order',
          original_url: 'https://cabinetoffice.gov.ng',
          evidence_summary: canonicalEvidenceSummary,
        }
      ],
      financials: [
        {
          id: 'f2',
          record_id: foreignRecord.id,
          financial_type: 'approved_funding',
          amount_exact: exact,
          currency_code: 'USD',
          reporting_period_label: '2024-Q1',
          period_start: '2024-01-01',
          period_end: '2024-03-31',
          aggregation_basis: 'period',
          nominal_or_real: 'nominal',
        }
      ],
      beneficiaries: [],
    }, '2026-08-16T00:00:00.000Z');

    const mapped = snapshot.achievements[0];

    // Canonical provenance truth preserved verbatim:
    expect(mapped.financialMetrics?.[0].amount).toBe(exact);
    expect(mapped.financialMetrics?.[0].currency).toBe('USD');
    expect(mapped.evidenceClaims[0].claimText).toBe(canonicalClaimText);
    expect(mapped.evidenceClaims[0].sources[0].title).toBe(canonicalSourceTitle);
    expect(mapped.evidenceClaims[0].sources[0].summary).toBe(canonicalEvidenceSummary);

    // Derived public formatted display is safe (no USD or $):
    expect(mapped.financialMetrics?.[0].formattedAmount).toBe('Bilateral Facility (See Evidence)');
    expect(mapped.financialMetrics?.[0].formattedAmount).not.toMatch(/\$|USD|dollar/i);

    // No numerical relabeling ($1.1B is NOT converted to ₦1.1B):
    expect(mapped.financialMetrics?.[0].formattedAmount).not.toContain('₦1.1');

    // Derived public presentation summaries:
    expect(mapped.summary).toBe('Bilateral financing activation with foreign partners for the Green Imperative Project.');
    expect(mapped.summary).not.toMatch(/\$|USD|dollar/i);

    expect(mapped.description).toBe('Bilateral facilities approved.');
    expect(mapped.description).not.toMatch(/\$|USD|dollar/i);

    expect(mapped.evidenceClaims[0].publicClaimSummary).toBe('Bilateral sovereign credit financing approved for Green Imperative Agro-mechanization programme');
    expect(mapped.evidenceClaims[0].publicClaimSummary).not.toMatch(/\$|USD|dollar/i);

    expect(mapped.evidenceClaims[0].sources[0].displayTitle).toBe('FEC approval of Green Imperative facility');
    expect(mapped.evidenceClaims[0].sources[0].displayTitle).not.toMatch(/\$|USD|dollar/i);
  });

  it('rejects invalid decimal text rather than coercing it', () => {
    expect(() => assertExactDecimal('1e9')).toThrow('invalid exact decimal');
  });

  it('formats exact decimal text without floating-point conversion', () => {
    expect(formatExactDecimal('1234567890.0000')).toBe('1,234,567,890.0000');
  });

  it('sanitizes public narrative text removing foreign currency tokens truthfully without introducing unsupported assertions', () => {
    // Green Imperative:
    const rawGreen = 'Bilateral financing activation with foreign partners for the USD 1.1 billion Green Imperative Project to assemble 10,000 tractors.';
    expect(sanitizePublicPresentationText(rawGreen)).toBe('Bilateral financing activation with foreign partners for the Green Imperative Project to assemble 10,000 tractors.');

    // External Reserves - conservative without unverified "36-month high" claim:
    const rawReserves = 'Gross external reserves recovered to USD 38.5 Billion following foreign exchange market harmonization and portfolio inflows';
    const sanitizedReserves = sanitizePublicPresentationText(rawReserves);
    expect(sanitizedReserves).toBe('Gross external reserves strengthened following foreign exchange market harmonization and portfolio inflows');
    expect(sanitizedReserves).not.toContain('36-month');
    expect(sanitizedReserves).not.toMatch(/\$|USD|dollar/i);

    // External Reserves Balance:
    const rawBalance = 'Gross external reserves balance reported at USD 38.5 Billion';
    expect(sanitizePublicPresentationText(rawBalance)).toBe('Gross external reserves balance reported');

    // Oil & Gas Commitments - no unverified magnitude adjective added:
    const rawOilGas = 'Over USD 5 billion in accelerated final investment decision commitments unlocked across deepwater and shallow assets';
    expect(sanitizePublicPresentationText(rawOilGas)).toBe('Accelerated final investment decision commitments unlocked across deepwater and shallow assets');

    // FX Arbitrage - no unverified "massive" adjective added:
    const rawFx = 'Elimination of official FX arbitrage gap and multi-billion dollar recovery in net foreign portfolio investments';
    expect(sanitizePublicPresentationText(rawFx)).toBe('Elimination of official FX arbitrage gap and recovery in net foreign portfolio investments');

    // Greenfield goal - no unverified "major" adjective added:
    const rawGoal = 'Aimed at unlocking over USD 5B in greenfield investments';
    expect(sanitizePublicPresentationText(rawGoal)).toBe('Aimed at unlocking greenfield investments');
  });

  it('formats public contract values safely for NGN and foreign records', () => {
    expect(formatPublicContractValue('50000000000.0000', 'NGN')).toBe('₦50 billion');
    expect(formatPublicContractValue('1100000000.0000', 'USD')).toBe('Bilateral Contract (See Evidence)');
  });
});
