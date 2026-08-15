export interface CanonicalRecord {
  id: string;
  slug: string;
  record_type: 'achievement' | 'policy' | 'physical_project' | 'programme';
  title: string;
  short_title: string | null;
  summary: string;
  implementation_status: string;
  publication_status: string;
  verification_status: string;
  evidence_profile: string;
  risk_level: string;
  qualification: string | null;
  published_at: string | null;
}

export interface PublicEvidenceClaim {
  claim_id: string;
  record_id: string;
  claim_type: string;
  claim_text: string;
  value_numeric: number | null;
  value_text: string | null;
  unit_code: string | null;
  currency_code: string | null;
  reporting_period_label: string | null;
  data_value_nature: string;
  source_origin: string;
  verification_status: string;
  limitations: string | null;
  relationship_type: string;
  source_role: string;
  evidence_location: string;
  evidence_summary: string;
  source_id: string;
  source_title: string;
  publisher_name: string;
  source_type: string;
  source_level: string;
  original_url: string | null;
  archival_url: string | null;
  publication_date: string | null;
}

export interface PublicFinancialRecord {
  id: string;
  record_id: string;
  financial_type: string;
  amount: number;
  currency_code: string;
  reporting_period_label: string;
  period_start: string;
  period_end: string;
  aggregation_basis: string;
  nominal_or_real: string;
  methodology: string | null;
  limitations: string | null;
}

export interface PublicBeneficiaryRecord {
  id: string;
  record_id: string;
  beneficiary_type: string;
  beneficiary_stage: string;
  count_value: number;
  unit: string;
  count_basis: string;
  cumulative: boolean;
  reporting_period_label: string;
  period_start: string;
  period_end: string;
  cohort_key: string;
  double_counting_notes: string | null;
  limitations: string | null;
}
