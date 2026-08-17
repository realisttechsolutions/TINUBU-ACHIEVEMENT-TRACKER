import { describe, it, expect } from 'vitest';
import {
  createRecordSchema,
  updateRecordOverviewSchema,
  claimSchema,
  sourceSchema,
  financialRecordSchema,
  beneficiaryRecordSchema,
  timelineEventSchema,
} from '@/server/admin/validation';

describe('Admin Validation Schemas (Mission 10F)', () => {
  describe('createRecordSchema', () => {
    it('accepts valid achievement draft payload', () => {
      const validPayload = {
        record_type: 'achievement',
        title: 'Lagos-Calabar Coastal Highway Section 1 Construction',
        slug: 'lagos-calabar-coastal-highway-section-1',
        short_summary: 'Construction of 47km dual carriage highway segment.',
        full_description: 'Detailed description of the flagship infrastructure project.',
        implementation_status: 'in_progress',
        geographic_scope: 'multi_state',
        announced_date: '2024-03-15',
        announced_date_precision: 'exact_day',
        achievement_profile: {
          milestone_type: 'flag_off',
          flagship_tier: 1,
        },
        sector_ids: ['a0000000-0000-0000-0000-000000000001'],
        institution_ids: ['b0000000-0000-0000-0000-000000000001'],
        geographic_unit_ids: [],
      };

      const result = createRecordSchema.safeParse(validPayload);
      expect(result.success).toBe(true);
    });

    it('rejects invalid record_type or invalid slug', () => {
      const invalidType = {
        record_type: 'unknown_type',
        title: 'Test',
        slug: 'test',
      };
      expect(createRecordSchema.safeParse(invalidType).success).toBe(false);

      const invalidSlug = {
        record_type: 'achievement',
        title: 'Valid Title',
        slug: 'INVALID SLUG WITH SPACES',
      };
      expect(createRecordSchema.safeParse(invalidSlug).success).toBe(false);
    });
  });

  describe('updateRecordOverviewSchema', () => {
    it('requires expected_updated_at concurrency token', () => {
      const payload = {
        record_type: 'policy',
        title: 'National Single Window Initiative',
        slug: 'national-single-window',
        expected_updated_at: '2026-08-17T05:00:00.000Z',
      };
      expect(updateRecordOverviewSchema.safeParse(payload).success).toBe(true);

      const missingToken = {
        record_type: 'policy',
        title: 'National Single Window Initiative',
        slug: 'national-single-window',
      };
      expect(updateRecordOverviewSchema.safeParse(missingToken).success).toBe(false);
    });
  });

  describe('claimSchema', () => {
    it('validates claim payload with numeric and linked sources', () => {
      const validClaim = {
        claim_type: 'disbursement_amount',
        claim_text: 'Total disbursed student loans reached 50 billion naira in Q2 2024.',
        value_numeric: '50000000000',
        unit_code: 'NGN',
        currency_code: 'NGN',
        data_value_nature: 'actual',
        source_origin: 'statutory_report',
        verification_status: 'verified',
        linked_source_ids: ['c0000000-0000-0000-0000-000000000001'],
      };
      expect(claimSchema.safeParse(validClaim).success).toBe(true);
    });

    it('rejects non-numeric value_numeric string', () => {
      const invalidClaim = {
        claim_type: 'disbursement_amount',
        claim_text: 'Sample claim text with invalid numeric value.',
        value_numeric: 'fifty billion',
      };
      expect(claimSchema.safeParse(invalidClaim).success).toBe(false);
    });
  });

  describe('sourceSchema', () => {
    it('validates source citation payload', () => {
      const validSource = {
        title: 'Federal Republic of Nigeria Official Gazette No. 45',
        publisher_name: 'Federal Government of Nigeria',
        source_type: 'government_gazette',
        source_level: 1,
        original_url: 'https://gazettes.gov.ng/2024-45.pdf',
        visibility_class: 'public',
      };
      expect(sourceSchema.safeParse(validSource).success).toBe(true);
    });

    it('rejects invalid URL', () => {
      const invalidSource = {
        title: 'Invalid Source',
        publisher_name: 'Publisher',
        original_url: 'not-a-valid-url',
      };
      expect(sourceSchema.safeParse(invalidSource).success).toBe(false);
    });
  });

  describe('financialRecordSchema', () => {
    it('validates monetary entries with exact decimal strings', () => {
      const validFinancial = {
        financial_type: 'capital_allocation',
        amount: '125000000000.50',
        currency_code: 'NGN',
        nominal_or_real: 'nominal',
      };
      expect(financialRecordSchema.safeParse(validFinancial).success).toBe(true);
    });

    it('rejects negative or malformed amounts', () => {
      const invalidFinancial = {
        financial_type: 'capital_allocation',
        amount: '-1000',
      };
      expect(financialRecordSchema.safeParse(invalidFinancial).success).toBe(false);
    });
  });

  describe('beneficiaryRecordSchema', () => {
    it('validates beneficiary counts and stages', () => {
      const validBeneficiary = {
        beneficiary_type: 'undergraduate_students',
        beneficiary_stage: 'disbursed',
        count_value: 120000,
        unit: 'individual',
        cumulative: true,
      };
      expect(beneficiaryRecordSchema.safeParse(validBeneficiary).success).toBe(true);
    });

    it('rejects negative count value', () => {
      const invalidBeneficiary = {
        beneficiary_type: 'undergraduate_students',
        beneficiary_stage: 'disbursed',
        count_value: -50,
      };
      expect(beneficiaryRecordSchema.safeParse(invalidBeneficiary).success).toBe(false);
    });
  });

  describe('timelineEventSchema', () => {
    it('validates milestone timeline event', () => {
      const validTimeline = {
        event_type: 'commissioned',
        title: 'Phase 1 Commissioning Ceremony',
        date_value: '2024-05-29',
        date_precision: 'exact_day',
        provisional: false,
        is_public: false,
      };
      expect(timelineEventSchema.safeParse(validTimeline).success).toBe(true);
    });
  });
});
