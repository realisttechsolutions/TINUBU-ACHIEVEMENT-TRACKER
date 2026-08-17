import { z } from 'zod';

export const RECORD_TYPES = ['achievement', 'policy', 'project', 'programme'] as const;
export type RecordType = (typeof RECORD_TYPES)[number];

export const IMPLEMENTATION_STATUSES = [
  'not_started',
  'in_progress',
  'completed',
  'suspended',
  'ongoing_periodic',
  'under_review',
] as const;

export const GEOGRAPHIC_SCOPES = [
  'national',
  'geopolitical_zone',
  'state',
  'lga',
  'multi_state',
  'diaspora',
  'unspecified',
] as const;

export const DATE_PRECISIONS = [
  'exact_day',
  'month',
  'quarter',
  'year',
  'fiscal_year',
  'range',
  'unknown',
] as const;

export const DATA_VALUE_NATURES = [
  'actual',
  'target',
  'estimate',
  'projection',
  'baseline',
  'cumulative_actual',
] as const;

export const SOURCE_ORIGINS = [
  'government_gazette',
  'ministry_release',
  'official_speech',
  'statutory_report',
  'budget_document',
  'external_audit',
  'news_report',
  'academic_paper',
  'independent_verification',
] as const;

export const VERIFICATION_STATUSES = [
  'verified',
  'unverified',
  'disputed',
  'provisional',
  'withdrawn',
] as const;

export const FINANCIAL_TYPES = [
  'fec_approved_contract',
  'capital_allocation',
  'actual_disbursement',
  'donor_counterpart_funding',
  'revenue_generated',
  'cost_savings',
  'appropriated_amount',
] as const;

export const BENEFICIARY_STAGES = [
  'targeted',
  'registered',
  'verified',
  'disbursed',
  'completed',
  'active',
] as const;

export const TIMELINE_EVENT_TYPES = [
  'announced',
  'approved',
  'funded',
  'groundbreaking',
  'flag_off',
  'commenced',
  'milestone_reached',
  'commissioned',
  'policy_effective',
  'disbursement_started',
  'reviewed',
  'audit_completed',
  'amended',
  'suspended',
  'terminated',
] as const;

export const createRecordSchema = z.object({
  record_type: z.enum(RECORD_TYPES),
  title: z.string().min(3).max(500),
  slug: z.string().min(3).max(200).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  short_summary: z.string().max(1000).optional().nullable(),
  full_description: z.string().max(10000).optional().nullable(),
  lead_sector_id: z.string().uuid().optional().nullable(),
  lead_institution_id: z.string().uuid().optional().nullable(),
  implementation_status: z.enum(IMPLEMENTATION_STATUSES).default('in_progress'),
  geographic_scope: z.enum(GEOGRAPHIC_SCOPES).default('national'),
  announced_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().nullable(),
  announced_date_precision: z.enum(DATE_PRECISIONS).default('exact_day'),
  start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().nullable(),
  start_date_precision: z.enum(DATE_PRECISIONS).default('exact_day'),
  completion_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().nullable(),
  completion_date_precision: z.enum(DATE_PRECISIONS).default('exact_day'),
  
  achievement_profile: z.object({
    milestone_type: z.string().max(100).optional().nullable(),
    verified_impact_summary: z.string().max(2000).optional().nullable(),
    flagship_tier: z.coerce.number().int().min(1).max(3).optional().nullable(),
  }).optional().nullable(),
  
  policy_details: z.object({
    policy_type: z.string().max(100).optional().nullable(),
    legal_instrument_type: z.string().max(100).optional().nullable(),
    gazette_or_order_number: z.string().max(100).optional().nullable(),
    policy_scope: z.string().max(200).optional().nullable(),
  }).optional().nullable(),
  
  project_details: z.object({
    project_type: z.string().max(100).optional().nullable(),
    target_completion_year: z.coerce.number().int().min(2020).max(2050).optional().nullable(),
    physical_asset_type: z.string().max(100).optional().nullable(),
    infrastructure_subsector: z.string().max(100).optional().nullable(),
  }).optional().nullable(),
  
  programme_details: z.object({
    programme_type: z.string().max(100).optional().nullable(),
    target_beneficiary_group: z.string().max(200).optional().nullable(),
    recurring_or_fixed: z.string().max(50).optional().nullable(),
  }).optional().nullable(),

  sector_ids: z.array(z.string().uuid()).default([]),
  institution_ids: z.array(z.string().uuid()).default([]),
  geographic_unit_ids: z.array(z.string().uuid()).default([]),
});

export type CreateRecordInput = z.infer<typeof createRecordSchema>;

export const updateRecordOverviewSchema = createRecordSchema.extend({
  expected_updated_at: z.string().min(10),
});

export type UpdateRecordOverviewInput = z.infer<typeof updateRecordOverviewSchema>;

export const claimSchema = z.object({
  id: z.string().uuid().optional(),
  claim_type: z.string().min(2).max(100),
  claim_text: z.string().min(5).max(2000),
  value_numeric: z.string().regex(/^-?\d+(\.\d+)?$/, 'Must be a valid decimal number').optional().nullable(),
  value_text: z.string().max(500).optional().nullable(),
  unit_code: z.string().max(50).optional().nullable(),
  currency_code: z.string().length(3).default('NGN'),
  reporting_period_label: z.string().max(100).optional().nullable(),
  data_value_nature: z.enum(DATA_VALUE_NATURES).default('actual'),
  source_origin: z.enum(SOURCE_ORIGINS).default('government_gazette'),
  verification_status: z.enum(VERIFICATION_STATUSES).default('verified'),
  limitations: z.string().max(2000).optional().nullable(),
  linked_source_ids: z.array(z.string().uuid()).default([]),
});

export type ClaimInput = z.infer<typeof claimSchema>;

export const sourceSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(3).max(500),
  publisher_name: z.string().min(2).max(255),
  source_type: z.enum(SOURCE_ORIGINS).default('government_gazette'),
  source_level: z.coerce.number().int().min(1).max(4).default(1),
  original_url: z.string().url().max(1000),
  archival_url: z.string().url().max(1000).optional().nullable(),
  publication_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().nullable(),
  publication_date_precision: z.enum(DATE_PRECISIONS).default('exact_day'),
  visibility_class: z.enum(['public', 'internal', 'restricted']).default('public'),
});

export type SourceInput = z.infer<typeof sourceSchema>;

export const financialRecordSchema = z.object({
  id: z.string().uuid().optional(),
  claim_id: z.string().uuid().optional().nullable(),
  financial_type: z.enum(FINANCIAL_TYPES),
  amount: z.string().regex(/^\d+(\.\d{1,4})?$/, 'Amount must be a valid positive numeric string'),
  currency_code: z.string().length(3).default('NGN'),
  reporting_period_label: z.string().max(100).optional().nullable(),
  period_start: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().nullable(),
  period_end: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().nullable(),
  aggregation_basis: z.string().max(100).optional().nullable(),
  nominal_or_real: z.enum(['nominal', 'real_2023_base']).default('nominal'),
  methodology: z.string().max(1000).optional().nullable(),
  limitations: z.string().max(1000).optional().nullable(),
});

export type FinancialRecordInput = z.infer<typeof financialRecordSchema>;

export const beneficiaryRecordSchema = z.object({
  id: z.string().uuid().optional(),
  claim_id: z.string().uuid().optional().nullable(),
  beneficiary_type: z.string().min(2).max(100),
  beneficiary_stage: z.enum(BENEFICIARY_STAGES),
  count_value: z.coerce.number().int().nonnegative(),
  unit: z.string().max(50).default('individual'),
  count_basis: z.string().max(100).optional().nullable(),
  cumulative: z.boolean().default(false),
  reporting_period_label: z.string().max(100).optional().nullable(),
  period_start: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().nullable(),
  period_end: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().nullable(),
  cohort_key: z.string().max(100).optional().nullable(),
  double_counting_notes: z.string().max(1000).optional().nullable(),
  limitations: z.string().max(1000).optional().nullable(),
});

export type BeneficiaryRecordInput = z.infer<typeof beneficiaryRecordSchema>;

export const timelineEventSchema = z.object({
  id: z.string().uuid().optional(),
  event_type: z.enum(TIMELINE_EVENT_TYPES),
  title: z.string().min(3).max(300),
  description: z.string().max(2000).optional().nullable(),
  date_value: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().nullable(),
  date_precision: z.enum(DATE_PRECISIONS).default('exact_day'),
  period_start: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().nullable(),
  period_end: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().nullable(),
  reporting_period_label: z.string().max(100).optional().nullable(),
  provisional: z.boolean().default(false),
  is_public: z.boolean().default(false),
});

export type TimelineEventInput = z.infer<typeof timelineEventSchema>;
