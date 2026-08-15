-- Tinubu Achievement Tracker E01 local PostgreSQL schema.
-- Contract authority: TAT_RESEARCH_CONTRACT_V1_1_2.md.
-- This is a local development schema, not a cloud or production migration.

BEGIN;

CREATE FUNCTION tat_date_precision_valid(
  precision_code text,
  exact_value date,
  range_start date,
  range_end date,
  source_label text
) RETURNS boolean
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT CASE precision_code
    WHEN 'exact_day' THEN exact_value IS NOT NULL AND range_start IS NULL AND range_end IS NULL
    WHEN 'month' THEN exact_value IS NOT NULL AND range_start IS NULL AND range_end IS NULL
    WHEN 'quarter' THEN exact_value IS NOT NULL AND range_start IS NULL AND range_end IS NULL
    WHEN 'year' THEN exact_value IS NOT NULL AND range_start IS NULL AND range_end IS NULL
    WHEN 'fiscal_year' THEN source_label IS NOT NULL AND btrim(source_label) <> ''
    WHEN 'range' THEN range_start IS NOT NULL AND range_end IS NOT NULL AND range_start <= range_end
    WHEN 'unknown' THEN exact_value IS NULL AND range_start IS NULL AND range_end IS NULL
    ELSE false
  END;
$$;

CREATE FUNCTION tat_expected_public_group(sector_code text) RETURNS text
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT CASE sector_code
    WHEN 'economy_fiscal_reforms' THEN 'economy'
    WHEN 'security_national_stability' THEN 'security'
    WHEN 'infrastructure_transportation' THEN 'infrastructure'
    WHEN 'agriculture_food_security' THEN 'economy'
    WHEN 'education_human_capital' THEN 'social_services'
    WHEN 'healthcare_public_health' THEN 'social_services'
    WHEN 'social_protection_human_development' THEN 'social_services'
    WHEN 'youth_employment_skills' THEN 'social_services'
    WHEN 'power_energy_natural_resources' THEN 'infrastructure'
    WHEN 'digital_economy_science_innovation' THEN 'economy'
    WHEN 'housing_urban_development' THEN 'infrastructure'
    WHEN 'environment_climate' THEN 'infrastructure'
    WHEN 'governance_public_service' THEN 'governance'
    WHEN 'foreign_affairs_international_cooperation' THEN 'governance'
    WHEN 'culture_tourism_creative_economy' THEN 'social_services'
    ELSE NULL
  END;
$$;

CREATE TABLE actor_profiles (
  id uuid PRIMARY KEY,
  external_id text UNIQUE,
  firebase_uid text UNIQUE,
  actor_kind text NOT NULL CHECK (actor_kind IN ('human', 'service', 'ai_agent')),
  display_name text NOT NULL,
  email text,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'archived')),
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CHECK (firebase_uid IS NULL OR actor_kind = 'human')
);

CREATE TABLE actor_roles (
  id uuid PRIMARY KEY,
  actor_id uuid NOT NULL REFERENCES actor_profiles(id) ON DELETE RESTRICT,
  role_code text NOT NULL CHECK (role_code IN (
    'researcher', 'senior_researcher', 'evidence_reviewer', 'data_reviewer',
    'editor', 'publisher', 'administrator'
  )),
  scope_type text NOT NULL DEFAULT 'global' CHECK (scope_type IN ('global', 'sector', 'institution', 'geography')),
  scope_key text NOT NULL DEFAULT '*',
  granted_by uuid REFERENCES actor_profiles(id) ON DELETE RESTRICT,
  granted_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  valid_from timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  valid_until timestamptz,
  revoked_at timestamptz,
  revocation_reason text,
  CHECK (valid_until IS NULL OR valid_until > valid_from),
  CHECK ((revoked_at IS NULL AND revocation_reason IS NULL) OR (revoked_at IS NOT NULL AND revocation_reason IS NOT NULL))
);

CREATE UNIQUE INDEX actor_roles_active_assignment_uidx
  ON actor_roles (actor_id, role_code, scope_type, scope_key)
  WHERE revoked_at IS NULL;

CREATE TABLE sectors (
  id uuid PRIMARY KEY,
  code text NOT NULL UNIQUE CHECK (code ~ '^[a-z][a-z0-9_]*$'),
  label text NOT NULL,
  taxonomy_level text NOT NULL CHECK (taxonomy_level IN ('LEVEL_1_GROUP', 'LEVEL_2_SECTOR', 'LEVEL_3_SUBSECTOR')),
  parent_sector_id uuid REFERENCES sectors(id) ON DELETE RESTRICT,
  description text,
  public_order integer,
  active boolean NOT NULL DEFAULT true,
  vocabulary_version text NOT NULL DEFAULT '1.1.2' CHECK (vocabulary_version = '1.1.2'),
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CHECK (
    (taxonomy_level = 'LEVEL_1_GROUP' AND parent_sector_id IS NULL) OR
    (taxonomy_level <> 'LEVEL_1_GROUP' AND parent_sector_id IS NOT NULL)
  )
);

CREATE FUNCTION tat_enforce_sector_hierarchy() RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  parent_level text;
  parent_code text;
  expected_group text;
BEGIN
  IF NEW.taxonomy_level = 'LEVEL_1_GROUP' THEN
    IF NEW.code NOT IN ('economy', 'security', 'infrastructure', 'social_services', 'governance') THEN
      RAISE EXCEPTION 'invalid public navigation group: %', NEW.code;
    END IF;
    RETURN NEW;
  END IF;

  SELECT taxonomy_level, code INTO parent_level, parent_code FROM sectors WHERE id = NEW.parent_sector_id;
  IF NEW.taxonomy_level = 'LEVEL_2_SECTOR' THEN
    expected_group := tat_expected_public_group(NEW.code);
    IF expected_group IS NULL THEN
      RAISE EXCEPTION 'unknown canonical sector for vocabulary v1.1.2: %', NEW.code;
    END IF;
    IF parent_level <> 'LEVEL_1_GROUP' OR parent_code <> expected_group THEN
      RAISE EXCEPTION 'canonical sector % must belong to public group %', NEW.code, expected_group;
    END IF;
  ELSIF NEW.taxonomy_level = 'LEVEL_3_SUBSECTOR' AND parent_level <> 'LEVEL_2_SECTOR' THEN
    RAISE EXCEPTION 'subsector % must have a canonical sector parent', NEW.code;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER sectors_hierarchy_guard
  BEFORE INSERT OR UPDATE OF code, taxonomy_level, parent_sector_id ON sectors
  FOR EACH ROW EXECUTE FUNCTION tat_enforce_sector_hierarchy();

CREATE INDEX sectors_parent_level_idx ON sectors (parent_sector_id, taxonomy_level, active);

CREATE TABLE institutions (
  id uuid PRIMARY KEY,
  external_id text UNIQUE,
  slug text NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  canonical_name text NOT NULL,
  short_name text,
  aliases jsonb NOT NULL DEFAULT '[]'::jsonb CHECK (jsonb_typeof(aliases) = 'array'),
  institution_type text NOT NULL CHECK (institution_type IN (
    'presidency', 'ministry', 'department', 'agency', 'commission', 'legislature',
    'public_institution', 'government_corporation', 'implementation_partner'
  )),
  parent_institution_id uuid REFERENCES institutions(id) ON DELETE RESTRICT,
  official_url text CHECK (official_url IS NULL OR official_url ~ '^https?://'),
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX institutions_name_type_idx ON institutions (lower(canonical_name), institution_type, active);

CREATE TABLE records (
  id uuid PRIMARY KEY,
  external_id text NOT NULL UNIQUE,
  slug text NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  record_type text NOT NULL CHECK (record_type IN (
    'achievement', 'policy', 'reform', 'executive_action', 'legislation', 'regulation',
    'programme', 'intervention', 'physical_project', 'institutional_reform',
    'reported_outcome', 'timeline_event', 'milestone', 'indicator',
    'indicator_observation', 'source', 'correction_revision', 'report', 'dataset', 'methodology'
  )),
  title text NOT NULL CHECK (length(title) >= 5),
  short_title text,
  summary text NOT NULL CHECK (length(summary) >= 10),
  body text,
  implementation_status text NOT NULL CHECK (implementation_status IN (
    'proposed', 'announced', 'approved', 'enacted', 'effective', 'funded',
    'funding_released', 'procurement', 'implementation_planning', 'implementation_ongoing',
    'partially_delivered', 'completed', 'operational', 'outcome_reported',
    'independently_assessed', 'suspended', 'superseded', 'repealed', 'under_review',
    'archived', 'withdrawn'
  )),
  workflow_status text NOT NULL DEFAULT 'draft' CHECK (workflow_status IN (
    'draft', 'research_review', 'evidence_review', 'editorial_review', 'human_approval',
    'ready_for_publication', 'rejected', 'archived'
  )),
  publication_status text NOT NULL DEFAULT 'unpublished' CHECK (publication_status IN (
    'unpublished', 'under_review', 'publishable', 'publishable_with_qualification',
    'published', 'corrected', 'withdrawn', 'archived'
  )),
  verification_status text NOT NULL DEFAULT 'under_review' CHECK (verification_status IN (
    'source_confirmed', 'cross_referenced', 'independently_corroborated', 'under_review',
    'unverified', 'disputed', 'corrected', 'withdrawn'
  )),
  evidence_profile text NOT NULL CHECK (evidence_profile IN (
    'direct_physical_delivery', 'statutory_legal_enactment', 'verified_administrative_disbursement',
    'statistical_indicator_movement', 'official_policy_declaration',
    'third_party_independent_assessment', 'multilateral_partner_evaluation',
    'institutional_reform_milestone'
  )),
  risk_level text NOT NULL DEFAULT 'low' CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
  is_public boolean NOT NULL DEFAULT false,
  qualification text,
  internal_notes text,
  created_by uuid NOT NULL REFERENCES actor_profiles(id) ON DELETE RESTRICT,
  current_revision integer NOT NULL DEFAULT 1 CHECK (current_revision > 0),
  published_at timestamptz,
  withdrawn_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CHECK (
    publication_status NOT IN ('published', 'corrected') OR
    (is_public AND workflow_status = 'ready_for_publication' AND published_at IS NOT NULL)
  ),
  CHECK (publication_status <> 'withdrawn' OR withdrawn_at IS NOT NULL)
);

CREATE INDEX records_public_catalog_idx ON records (publication_status, implementation_status, record_type, published_at DESC);
CREATE INDEX records_workflow_queue_idx ON records (workflow_status, risk_level, updated_at);
CREATE INDEX records_search_idx ON records USING gin (to_tsvector('simple', title || ' ' || summary || ' ' || COALESCE(body, '')));

CREATE TABLE policy_details (
  record_id uuid PRIMARY KEY REFERENCES records(id) ON DELETE CASCADE,
  policy_type text NOT NULL CHECK (policy_type IN (
    'national_policy', 'executive_order', 'statutory_act', 'regulatory_framework',
    'presidential_directive', 'strategic_roadmap'
  )),
  legal_authority text,
  reference_number text,
  effect_scope text,
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE project_details (
  record_id uuid PRIMARY KEY REFERENCES records(id) ON DELETE CASCADE,
  project_type text NOT NULL CHECK (project_type IN (
    'highway_road', 'bridge_tunnel', 'rail_system', 'port_maritime', 'airport_aviation',
    'power_plant_grid', 'housing_estate', 'hospital_health_center',
    'school_educational_facility', 'water_dam_irrigation', 'digital_broadband', 'public_building'
  )),
  progress_percentage numeric(5,2) CHECK (progress_percentage BETWEEN 0 AND 100),
  contract_reference text,
  project_reference text,
  location_narrative text,
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE programme_details (
  record_id uuid PRIMARY KEY REFERENCES records(id) ON DELETE CASCADE,
  programme_type text NOT NULL CHECK (programme_type IN (
    'social_investment', 'financial_credit', 'youth_employment', 'agricultural_intervention',
    'industrial_acceleration', 'health_intervention', 'energy_access', 'digital_transformation'
  )),
  target_group_narrative text,
  enrolment_model text,
  disbursement_model text,
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE achievement_profiles (
  record_id uuid PRIMARY KEY REFERENCES records(id) ON DELETE CASCADE,
  public_impact_narrative text NOT NULL,
  public_qualification text,
  featured_asset_url text CHECK (featured_asset_url IS NULL OR featured_asset_url ~ '^https?://'),
  display_priority integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE record_institutions (
  record_id uuid NOT NULL REFERENCES records(id) ON DELETE CASCADE,
  institution_id uuid NOT NULL REFERENCES institutions(id) ON DELETE RESTRICT,
  role_code text NOT NULL CHECK (role_code IN ('lead', 'implementing', 'funding', 'regulatory', 'partner', 'oversight')),
  valid_from date,
  valid_until date,
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (record_id, institution_id, role_code),
  CHECK (valid_until IS NULL OR valid_from IS NULL OR valid_until >= valid_from)
);

CREATE INDEX record_institutions_reverse_idx ON record_institutions (institution_id, role_code, record_id);

CREATE TABLE record_sectors (
  record_id uuid NOT NULL REFERENCES records(id) ON DELETE CASCADE,
  sector_id uuid NOT NULL REFERENCES sectors(id) ON DELETE RESTRICT,
  role_code text NOT NULL CHECK (role_code IN ('primary', 'secondary', 'cross_cutting')),
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (record_id, sector_id, role_code)
);

CREATE UNIQUE INDEX record_sectors_one_primary_uidx ON record_sectors (record_id) WHERE role_code = 'primary';
CREATE INDEX record_sectors_reverse_idx ON record_sectors (sector_id, role_code, record_id);

CREATE FUNCTION tat_require_level_two_sector() RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE selected_level text;
BEGIN
  SELECT taxonomy_level INTO selected_level FROM sectors WHERE id = NEW.sector_id;
  IF selected_level <> 'LEVEL_2_SECTOR' THEN
    RAISE EXCEPTION 'records may link only to LEVEL_2_SECTOR rows';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER record_sectors_level_guard
  BEFORE INSERT OR UPDATE OF sector_id ON record_sectors
  FOR EACH ROW EXECUTE FUNCTION tat_require_level_two_sector();

CREATE TABLE geographic_units (
  id uuid PRIMARY KEY,
  external_id text UNIQUE,
  code text NOT NULL UNIQUE,
  name text NOT NULL,
  geography_type text NOT NULL CHECK (geography_type IN (
    'national', 'geopolitical_zone', 'state', 'fct', 'lga', 'city_town', 'project_site',
    'corridor', 'multi_state', 'coordinate', 'geographic_boundary'
  )),
  parent_geographic_unit_id uuid REFERENCES geographic_units(id) ON DELETE RESTRICT,
  latitude numeric(9,6),
  longitude numeric(9,6),
  boundary_geojson jsonb,
  sensitivity_class text NOT NULL DEFAULT 'public' CHECK (sensitivity_class IN ('public', 'internal', 'restricted')),
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CHECK ((latitude IS NULL) = (longitude IS NULL)),
  CHECK (latitude IS NULL OR latitude BETWEEN -90 AND 90),
  CHECK (longitude IS NULL OR longitude BETWEEN -180 AND 180),
  CHECK (geography_type <> 'national' OR parent_geographic_unit_id IS NULL),
  CHECK (geography_type = 'national' OR parent_geographic_unit_id IS NOT NULL)
);

CREATE INDEX geographic_units_parent_type_idx ON geographic_units (parent_geographic_unit_id, geography_type, active);

CREATE TABLE record_geographies (
  record_id uuid NOT NULL REFERENCES records(id) ON DELETE CASCADE,
  geographic_unit_id uuid NOT NULL REFERENCES geographic_units(id) ON DELETE RESTRICT,
  coverage_role text NOT NULL CHECK (coverage_role IN ('primary', 'covered', 'beneficiary_scope', 'implementation_site')),
  confidence numeric(4,3) CHECK (confidence BETWEEN 0 AND 1),
  qualification text,
  sensitivity_class text NOT NULL DEFAULT 'public' CHECK (sensitivity_class IN ('public', 'internal', 'restricted')),
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (record_id, geographic_unit_id, coverage_role)
);

CREATE INDEX record_geographies_reverse_idx ON record_geographies (geographic_unit_id, coverage_role, record_id);

CREATE TABLE sources (
  id uuid PRIMARY KEY,
  external_id text NOT NULL UNIQUE,
  title text NOT NULL,
  publisher_institution_id uuid REFERENCES institutions(id) ON DELETE RESTRICT,
  publisher_name text,
  source_type text NOT NULL CHECK (source_type IN (
    'gazette', 'act_statute', 'executive_order', 'court_ruling', 'statistical_bulletin',
    'economic_report', 'debt_report', 'multilateral_report', 'audit_report', 'academic_study',
    'investigative_report', 'mainstream_media', 'specialist_press', 'state_house_release',
    'ministerial_statement', 'agency_portal', 'social_lead'
  )),
  source_level text NOT NULL CHECK (source_level IN ('LEVEL_1', 'LEVEL_2', 'LEVEL_3', 'LEVEL_4', 'LEVEL_5', 'LEVEL_6')),
  original_url text CHECK (original_url IS NULL OR original_url ~ '^https?://'),
  archival_url text CHECK (archival_url IS NULL OR archival_url ~ '^https?://'),
  document_number text,
  publication_date date,
  publication_date_precision text NOT NULL DEFAULT 'unknown' CHECK (publication_date_precision IN (
    'exact_day', 'month', 'quarter', 'year', 'fiscal_year', 'range', 'unknown'
  )),
  publication_period_start date,
  publication_period_end date,
  publication_date_label text,
  access_date date NOT NULL,
  source_status text NOT NULL CHECK (source_status IN ('active', 'archived', 'under_review', 'retracted', 'dead_link')),
  sha256 text CHECK (sha256 IS NULL OR sha256 ~ '^[a-f0-9]{64}$'),
  language_code text NOT NULL DEFAULT 'en' CHECK (language_code ~ '^[a-z]{2,3}(-[A-Z]{2})?$'),
  visibility_class text NOT NULL DEFAULT 'internal' CHECK (visibility_class IN ('public', 'internal', 'restricted')),
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb CHECK (jsonb_typeof(metadata) = 'object'),
  created_by uuid NOT NULL REFERENCES actor_profiles(id) ON DELETE RESTRICT,
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CHECK (publisher_institution_id IS NOT NULL OR publisher_name IS NOT NULL),
  CHECK (tat_date_precision_valid(publication_date_precision, publication_date, publication_period_start, publication_period_end, publication_date_label))
);

CREATE UNIQUE INDEX sources_original_url_uidx ON sources (original_url) WHERE original_url IS NOT NULL;
CREATE UNIQUE INDEX sources_document_number_uidx ON sources (document_number) WHERE document_number IS NOT NULL;
CREATE INDEX sources_search_idx ON sources USING gin (to_tsvector('simple', title || ' ' || COALESCE(publisher_name, '')));

CREATE TABLE evidence_claims (
  id uuid PRIMARY KEY,
  external_id text NOT NULL UNIQUE,
  record_id uuid NOT NULL REFERENCES records(id) ON DELETE CASCADE,
  claim_type text NOT NULL CHECK (claim_type IN (
    'legal_status', 'policy_action', 'implementation_status', 'project_status', 'financial_value',
    'beneficiary_value', 'statistical_indicator', 'geographic_scope', 'timeline_event',
    'reported_outcome', 'institutional_responsibility', 'context'
  )),
  claim_text text NOT NULL CHECK (length(claim_text) >= 10),
  value_numeric numeric(30,8),
  value_text text,
  unit_code text,
  currency_code char(3) CHECK (currency_code IS NULL OR currency_code ~ '^[A-Z]{3}$'),
  date_value date,
  date_precision text NOT NULL DEFAULT 'unknown' CHECK (date_precision IN (
    'exact_day', 'month', 'quarter', 'year', 'fiscal_year', 'range', 'unknown'
  )),
  period_start date,
  period_end date,
  reporting_period_label text,
  period_is_provisional boolean NOT NULL DEFAULT false,
  geographic_unit_id uuid REFERENCES geographic_units(id) ON DELETE RESTRICT,
  data_value_nature text NOT NULL CHECK (data_value_nature IN (
    'actual', 'provisional', 'estimated', 'projected', 'target', 'calculated', 'modelled'
  )),
  source_origin text NOT NULL CHECK (source_origin IN (
    'government_reported', 'independently_reported', 'mixed', 'unknown'
  )),
  verification_status text NOT NULL CHECK (verification_status IN (
    'source_confirmed', 'cross_referenced', 'independently_corroborated', 'under_review',
    'unverified', 'disputed', 'corrected', 'withdrawn'
  )),
  evidence_profile text NOT NULL CHECK (evidence_profile IN (
    'direct_physical_delivery', 'statutory_legal_enactment', 'verified_administrative_disbursement',
    'statistical_indicator_movement', 'official_policy_declaration',
    'third_party_independent_assessment', 'multilateral_partner_evaluation',
    'institutional_reform_milestone'
  )),
  risk_level text NOT NULL CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
  workflow_status text NOT NULL DEFAULT 'draft' CHECK (workflow_status IN (
    'draft', 'research_review', 'evidence_review', 'editorial_review', 'human_approval',
    'ready_for_publication', 'rejected', 'archived'
  )),
  limitations text,
  internal_notes text,
  created_by uuid NOT NULL REFERENCES actor_profiles(id) ON DELETE RESTRICT,
  current_revision integer NOT NULL DEFAULT 1 CHECK (current_revision > 0),
  withdrawn_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CHECK (tat_date_precision_valid(date_precision, date_value, period_start, period_end, reporting_period_label))
);

CREATE INDEX evidence_claims_record_status_idx ON evidence_claims (record_id, verification_status, claim_type);
CREATE INDEX evidence_claims_period_geo_idx ON evidence_claims (period_start, period_end, geographic_unit_id);

CREATE TABLE claim_source_relationships (
  id uuid PRIMARY KEY,
  external_id text NOT NULL UNIQUE,
  claim_id uuid NOT NULL REFERENCES evidence_claims(id) ON DELETE CASCADE,
  source_id uuid NOT NULL REFERENCES sources(id) ON DELETE RESTRICT,
  source_role text NOT NULL CHECK (source_role IN (
    'primary', 'official_statistical', 'direct_implementation', 'independent_assessment',
    'corroborating', 'supporting', 'contextual', 'contradictory', 'replacement',
    'archived', 'discovery_lead'
  )),
  relationship_type text NOT NULL CHECK (relationship_type IN (
    'supports', 'contradicts', 'replaces', 'contextualises', 'discovery_only'
  )),
  evidence_location text NOT NULL,
  evidence_summary text NOT NULL CHECK (length(evidence_summary) >= 10),
  limitation text,
  review_status text NOT NULL DEFAULT 'draft' CHECK (review_status IN (
    'draft', 'research_review', 'evidence_review', 'editorial_review', 'human_approval',
    'ready_for_publication', 'rejected', 'archived'
  )),
  reviewed_by uuid REFERENCES actor_profiles(id) ON DELETE RESTRICT,
  reviewed_at timestamptz,
  supersedes_relationship_id uuid REFERENCES claim_source_relationships(id) ON DELETE RESTRICT,
  created_by uuid NOT NULL REFERENCES actor_profiles(id) ON DELETE RESTRICT,
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (claim_id, source_id, source_role, relationship_type, evidence_location),
  CHECK ((reviewed_by IS NULL) = (reviewed_at IS NULL)),
  CHECK (supersedes_relationship_id IS NULL OR relationship_type = 'replaces')
);

CREATE INDEX claim_source_claim_idx ON claim_source_relationships (claim_id, relationship_type, review_status);
CREATE INDEX claim_source_source_idx ON claim_source_relationships (source_id, relationship_type);

CREATE TABLE financial_records (
  id uuid PRIMARY KEY,
  external_id text NOT NULL UNIQUE,
  record_id uuid NOT NULL REFERENCES records(id) ON DELETE CASCADE,
  claim_id uuid NOT NULL REFERENCES evidence_claims(id) ON DELETE RESTRICT,
  geographic_unit_id uuid REFERENCES geographic_units(id) ON DELETE RESTRICT,
  financial_type text NOT NULL CHECK (financial_type IN (
    'budget_allocation', 'approved_funding', 'funding_released', 'reported_expenditure',
    'contract_value', 'programme_envelope', 'public_investment', 'private_investment',
    'revenue_generated', 'revenue_estimate', 'savings_estimate'
  )),
  amount numeric(24,4) NOT NULL CHECK (amount > 0),
  currency_code char(3) NOT NULL CHECK (currency_code ~ '^[A-Z]{3}$'),
  reporting_period_label text NOT NULL,
  period_start date NOT NULL,
  period_end date NOT NULL,
  date_precision text NOT NULL CHECK (date_precision IN ('exact_day', 'month', 'quarter', 'year', 'fiscal_year', 'range')),
  aggregation_basis text NOT NULL CHECK (aggregation_basis IN ('period', 'cumulative')),
  nominal_or_real text NOT NULL CHECK (nominal_or_real IN ('nominal', 'real')),
  methodology text,
  limitations text,
  created_by uuid NOT NULL REFERENCES actor_profiles(id) ON DELETE RESTRICT,
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CHECK (period_start <= period_end),
  UNIQUE (record_id, claim_id, financial_type, currency_code, period_start, period_end, aggregation_basis)
);

CREATE INDEX financial_records_safe_group_idx ON financial_records (financial_type, currency_code, aggregation_basis, period_start, period_end);
CREATE INDEX financial_records_record_geo_idx ON financial_records (record_id, geographic_unit_id, financial_type);

CREATE TABLE beneficiary_records (
  id uuid PRIMARY KEY,
  external_id text NOT NULL UNIQUE,
  record_id uuid NOT NULL REFERENCES records(id) ON DELETE CASCADE,
  claim_id uuid NOT NULL REFERENCES evidence_claims(id) ON DELETE RESTRICT,
  geographic_unit_id uuid REFERENCES geographic_units(id) ON DELETE RESTRICT,
  beneficiary_type text NOT NULL CHECK (beneficiary_type IN (
    'individuals', 'households', 'farmers', 'students', 'msmes', 'enterprises', 'communities'
  )),
  beneficiary_stage text NOT NULL CHECK (beneficiary_stage IN (
    'applicant', 'registered_participant', 'eligible_applicant', 'approved_beneficiary',
    'disbursement_recipient', 'active_beneficiary'
  )),
  count_value bigint NOT NULL CHECK (count_value >= 0),
  unit text NOT NULL,
  count_basis text NOT NULL CHECK (count_basis IN (
    'cumulative_to_date', 'period_specific', 'target_capacity', 'annual_average'
  )),
  cumulative boolean NOT NULL,
  reporting_period_label text NOT NULL,
  period_start date NOT NULL,
  period_end date NOT NULL,
  cohort_key text NOT NULL,
  methodology text,
  double_counting_notes text,
  limitations text,
  created_by uuid NOT NULL REFERENCES actor_profiles(id) ON DELETE RESTRICT,
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CHECK (period_start <= period_end),
  CHECK (cumulative = (count_basis = 'cumulative_to_date')),
  UNIQUE (record_id, beneficiary_stage, beneficiary_type, period_start, period_end, geographic_unit_id, cohort_key)
);

CREATE INDEX beneficiary_records_safe_group_idx ON beneficiary_records (beneficiary_stage, beneficiary_type, count_basis, period_start, period_end);
CREATE INDEX beneficiary_records_record_geo_idx ON beneficiary_records (record_id, geographic_unit_id, beneficiary_stage);

CREATE FUNCTION tat_enforce_structured_claim_link() RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  claim_record uuid;
  actual_claim_type text;
  expected_claim_type text;
BEGIN
  SELECT record_id, claim_type INTO claim_record, actual_claim_type
  FROM evidence_claims WHERE id = NEW.claim_id;

  expected_claim_type := CASE TG_TABLE_NAME
    WHEN 'financial_records' THEN 'financial_value'
    WHEN 'beneficiary_records' THEN 'beneficiary_value'
    ELSE NULL
  END;

  IF claim_record <> NEW.record_id THEN
    RAISE EXCEPTION '% claim must belong to the same record', TG_TABLE_NAME;
  END IF;
  IF expected_claim_type IS NOT NULL AND actual_claim_type <> expected_claim_type THEN
    RAISE EXCEPTION '% requires claim_type %', TG_TABLE_NAME, expected_claim_type;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER financial_claim_guard
  BEFORE INSERT OR UPDATE OF record_id, claim_id ON financial_records
  FOR EACH ROW EXECUTE FUNCTION tat_enforce_structured_claim_link();
CREATE TRIGGER beneficiary_claim_guard
  BEFORE INSERT OR UPDATE OF record_id, claim_id ON beneficiary_records
  FOR EACH ROW EXECUTE FUNCTION tat_enforce_structured_claim_link();

CREATE TABLE indicators (
  id uuid PRIMARY KEY,
  external_id text NOT NULL UNIQUE,
  slug text NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  name text NOT NULL,
  definition text NOT NULL,
  unit text NOT NULL,
  frequency text NOT NULL CHECK (frequency IN ('monthly', 'quarterly', 'annual', 'biennial', 'ad_hoc')),
  methodology text NOT NULL,
  sector_id uuid REFERENCES sectors(id) ON DELETE RESTRICT,
  source_institution_id uuid REFERENCES institutions(id) ON DELETE RESTRICT,
  causal_attribution_prohibited boolean NOT NULL DEFAULT true,
  active boolean NOT NULL DEFAULT true,
  created_by uuid NOT NULL REFERENCES actor_profiles(id) ON DELETE RESTRICT,
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX indicators_sector_name_idx ON indicators (sector_id, lower(name), active);

CREATE TABLE indicator_observations (
  id uuid PRIMARY KEY,
  external_id text NOT NULL UNIQUE,
  indicator_id uuid NOT NULL REFERENCES indicators(id) ON DELETE RESTRICT,
  claim_id uuid NOT NULL REFERENCES evidence_claims(id) ON DELETE RESTRICT,
  geographic_unit_id uuid REFERENCES geographic_units(id) ON DELETE RESTRICT,
  value_numeric numeric(30,8),
  value_display text NOT NULL,
  reporting_period_label text NOT NULL,
  period_start date NOT NULL,
  period_end date NOT NULL,
  data_value_nature text NOT NULL CHECK (data_value_nature IN (
    'actual', 'provisional', 'estimated', 'projected', 'target', 'calculated', 'modelled'
  )),
  source_origin text NOT NULL CHECK (source_origin IN (
    'government_reported', 'independently_reported', 'mixed', 'unknown'
  )),
  verification_status text NOT NULL CHECK (verification_status IN (
    'source_confirmed', 'cross_referenced', 'independently_corroborated', 'under_review',
    'unverified', 'disputed', 'corrected', 'withdrawn'
  )),
  provisional boolean NOT NULL DEFAULT false,
  revision integer NOT NULL DEFAULT 1 CHECK (revision > 0),
  created_by uuid NOT NULL REFERENCES actor_profiles(id) ON DELETE RESTRICT,
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CHECK (period_start <= period_end),
  UNIQUE (indicator_id, period_start, period_end, geographic_unit_id, data_value_nature, revision)
);

CREATE INDEX indicator_observations_series_idx ON indicator_observations (indicator_id, geographic_unit_id, period_start, period_end);

CREATE FUNCTION tat_enforce_indicator_claim_link() RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE actual_claim_type text;
BEGIN
  SELECT claim_type INTO actual_claim_type FROM evidence_claims WHERE id = NEW.claim_id;
  IF actual_claim_type <> 'statistical_indicator' THEN
    RAISE EXCEPTION 'indicator observation requires a statistical_indicator claim';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER indicator_observation_claim_guard
  BEFORE INSERT OR UPDATE OF claim_id ON indicator_observations
  FOR EACH ROW EXECUTE FUNCTION tat_enforce_indicator_claim_link();

CREATE TABLE timeline_events (
  id uuid PRIMARY KEY,
  external_id text NOT NULL UNIQUE,
  record_id uuid NOT NULL REFERENCES records(id) ON DELETE CASCADE,
  claim_id uuid REFERENCES evidence_claims(id) ON DELETE RESTRICT,
  event_type text NOT NULL CHECK (event_type IN (
    'announcement', 'approval', 'enactment', 'effectiveness', 'funding_approval',
    'funding_release', 'procurement', 'commencement', 'partial_delivery', 'completion',
    'operation', 'outcome_report', 'independent_assessment', 'correction'
  )),
  title text NOT NULL,
  description text,
  date_value date,
  date_precision text NOT NULL CHECK (date_precision IN (
    'exact_day', 'month', 'quarter', 'year', 'fiscal_year', 'range', 'unknown'
  )),
  period_start date,
  period_end date,
  reporting_period_label text,
  provisional boolean NOT NULL DEFAULT false,
  is_public boolean NOT NULL DEFAULT false,
  created_by uuid NOT NULL REFERENCES actor_profiles(id) ON DELETE RESTRICT,
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CHECK (tat_date_precision_valid(date_precision, date_value, period_start, period_end, reporting_period_label))
);

CREATE INDEX timeline_events_chronology_idx ON timeline_events (record_id, date_value, period_start, event_type);

CREATE FUNCTION tat_enforce_timeline_claim_link() RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE claim_record uuid;
BEGIN
  IF NEW.claim_id IS NULL THEN RETURN NEW; END IF;
  SELECT record_id INTO claim_record FROM evidence_claims WHERE id = NEW.claim_id;
  IF claim_record <> NEW.record_id THEN
    RAISE EXCEPTION 'timeline claim must belong to the same record';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER timeline_claim_guard
  BEFORE INSERT OR UPDATE OF record_id, claim_id ON timeline_events
  FOR EACH ROW EXECUTE FUNCTION tat_enforce_timeline_claim_link();

CREATE TABLE corrections (
  id uuid PRIMARY KEY,
  external_id text NOT NULL UNIQUE,
  record_id uuid NOT NULL REFERENCES records(id) ON DELETE RESTRICT,
  claim_id uuid REFERENCES evidence_claims(id) ON DELETE RESTRICT,
  source_id uuid REFERENCES sources(id) ON DELETE RESTRICT,
  correction_type text NOT NULL CHECK (correction_type IN (
    'factual_error', 'numerical_update', 'status_correction', 'date_refinement',
    'source_replacement', 'retraction', 'typographical'
  )),
  original_state jsonb NOT NULL,
  corrected_state jsonb NOT NULL,
  reason text NOT NULL,
  lifecycle_status text NOT NULL CHECK (lifecycle_status IN ('proposed', 'under_review', 'approved', 'published', 'rejected')),
  reviewed_by uuid REFERENCES actor_profiles(id) ON DELETE RESTRICT,
  approved_by uuid REFERENCES actor_profiles(id) ON DELETE RESTRICT,
  approved_at timestamptz,
  effective_at timestamptz,
  public_notice text,
  created_by uuid NOT NULL REFERENCES actor_profiles(id) ON DELETE RESTRICT,
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CHECK ((approved_by IS NULL) = (approved_at IS NULL)),
  CHECK (lifecycle_status NOT IN ('approved', 'published') OR approved_by IS NOT NULL)
);

CREATE INDEX corrections_record_time_idx ON corrections (record_id, created_at, lifecycle_status);

CREATE TABLE review_decisions (
  id uuid PRIMARY KEY,
  external_id text NOT NULL UNIQUE,
  record_id uuid NOT NULL REFERENCES records(id) ON DELETE RESTRICT,
  claim_id uuid REFERENCES evidence_claims(id) ON DELETE RESTRICT,
  relationship_id uuid REFERENCES claim_source_relationships(id) ON DELETE RESTRICT,
  subject_scope text NOT NULL CHECK (subject_scope IN ('record', 'claim', 'relationship')),
  record_revision integer NOT NULL CHECK (record_revision > 0),
  gate_code text NOT NULL CHECK (gate_code IN (
    'gate_0_task_authorization', 'gate_1_source_claim_capture', 'gate_2_resolution_evidence',
    'gate_3_automated_data_readiness', 'gate_4_editorial_human_approval',
    'gate_5_publication_stewardship'
  )),
  decision text NOT NULL CHECK (decision IN (
    'approved', 'approved_with_qualification', 'rejected', 'revision_requested',
    'escalated_to_human_lead', 'quarantined'
  )),
  reviewer_id uuid NOT NULL REFERENCES actor_profiles(id) ON DELETE RESTRICT,
  rationale text NOT NULL,
  risk_level text NOT NULL CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
  decided_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (record_id, record_revision, gate_code, reviewer_id),
  CHECK (
    (subject_scope = 'record' AND claim_id IS NULL AND relationship_id IS NULL) OR
    (subject_scope = 'claim' AND claim_id IS NOT NULL AND relationship_id IS NULL) OR
    (subject_scope = 'relationship' AND relationship_id IS NOT NULL)
  )
);

CREATE INDEX review_decisions_approval_idx ON review_decisions (record_id, record_revision, gate_code, decision, decided_at);

CREATE TABLE record_relationships (
  id uuid PRIMARY KEY,
  external_id text NOT NULL UNIQUE,
  from_record_id uuid NOT NULL REFERENCES records(id) ON DELETE RESTRICT,
  to_record_id uuid NOT NULL REFERENCES records(id) ON DELETE RESTRICT,
  relationship_role text NOT NULL CHECK (relationship_role IN (
    'parent_initiative', 'child_initiative', 'predecessor_policy', 'successor_policy',
    'enabling_legislation', 'dependent_project', 'co_funded_programme', 'thematic_cluster'
  )),
  valid_from date,
  valid_until date,
  created_by uuid NOT NULL REFERENCES actor_profiles(id) ON DELETE RESTRICT,
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (from_record_id, to_record_id, relationship_role),
  CHECK (from_record_id <> to_record_id),
  CHECK (valid_until IS NULL OR valid_from IS NULL OR valid_until >= valid_from)
);

CREATE INDEX record_relationships_reverse_idx ON record_relationships (to_record_id, relationship_role, from_record_id);

CREATE TABLE source_files (
  id uuid PRIMARY KEY,
  external_id text NOT NULL UNIQUE,
  source_id uuid NOT NULL REFERENCES sources(id) ON DELETE RESTRICT,
  bucket_name text NOT NULL,
  object_path text NOT NULL,
  object_generation text NOT NULL,
  visibility_class text NOT NULL CHECK (visibility_class IN ('public', 'internal', 'restricted')),
  file_kind text NOT NULL CHECK (file_kind IN ('original', 'snapshot', 'extract', 'public_asset')),
  content_type text NOT NULL,
  byte_size bigint NOT NULL CHECK (byte_size >= 0),
  sha256 text NOT NULL CHECK (sha256 ~ '^[a-f0-9]{64}$'),
  copyright_status text NOT NULL,
  retention_class text NOT NULL,
  legal_hold boolean NOT NULL DEFAULT false,
  captured_at timestamptz NOT NULL,
  captured_by uuid NOT NULL REFERENCES actor_profiles(id) ON DELETE RESTRICT,
  published_at timestamptz,
  supersedes_file_id uuid REFERENCES source_files(id) ON DELETE RESTRICT,
  deleted_at timestamptz,
  deletion_reason text,
  UNIQUE (bucket_name, object_path, object_generation),
  CHECK ((deleted_at IS NULL) = (deletion_reason IS NULL))
);

CREATE INDEX source_files_source_visibility_idx ON source_files (source_id, visibility_class, file_kind);

CREATE TABLE record_versions (
  id uuid PRIMARY KEY,
  record_id uuid NOT NULL REFERENCES records(id) ON DELETE RESTRICT,
  version_number integer NOT NULL CHECK (version_number > 0),
  changed_by uuid NOT NULL REFERENCES actor_profiles(id) ON DELETE RESTRICT,
  change_reason text NOT NULL,
  snapshot_json jsonb NOT NULL CHECK (jsonb_typeof(snapshot_json) = 'object'),
  diff_json jsonb NOT NULL CHECK (jsonb_typeof(diff_json) IN ('object', 'array')),
  research_batch_id uuid,
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (record_id, version_number)
);

CREATE INDEX record_versions_record_time_idx ON record_versions (record_id, version_number DESC, created_at);

CREATE TABLE research_batches (
  id uuid PRIMARY KEY,
  external_id text NOT NULL UNIQUE,
  idempotency_key text NOT NULL UNIQUE,
  package_checksum text NOT NULL UNIQUE CHECK (package_checksum ~ '^[a-f0-9]{64}$'),
  contract_version text NOT NULL CHECK (contract_version = '1.1.2'),
  schema_version text NOT NULL,
  taxonomy_version text NOT NULL CHECK (taxonomy_version = '1.1.2'),
  mode text NOT NULL CHECK (mode IN ('validate', 'dry_run', 'stage', 'commit', 'rollback')),
  status text NOT NULL CHECK (status IN ('pending', 'validated', 'staged', 'committed', 'failed', 'compensated')),
  submitted_by uuid NOT NULL REFERENCES actor_profiles(id) ON DELETE RESTRICT,
  approved_by uuid REFERENCES actor_profiles(id) ON DELETE RESTRICT,
  plan_hash text CHECK (plan_hash IS NULL OR plan_hash ~ '^[a-f0-9]{64}$'),
  manifest_json jsonb NOT NULL CHECK (jsonb_typeof(manifest_json) = 'object'),
  validation_report jsonb NOT NULL DEFAULT '{}'::jsonb,
  unresolved_fk_report jsonb NOT NULL DEFAULT '[]'::jsonb,
  duplicate_report jsonb NOT NULL DEFAULT '[]'::jsonb,
  import_summary jsonb NOT NULL DEFAULT '{}'::jsonb,
  started_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CHECK (approved_by IS NULL OR mode IN ('commit', 'rollback'))
);

ALTER TABLE record_versions
  ADD CONSTRAINT record_versions_research_batch_fk
  FOREIGN KEY (research_batch_id) REFERENCES research_batches(id) ON DELETE RESTRICT;

CREATE INDEX research_batches_status_time_idx ON research_batches (status, started_at DESC);

CREATE FUNCTION tat_block_history_mutation() RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  RAISE EXCEPTION '% is append-only; use a compensating record', TG_TABLE_NAME;
END;
$$;

CREATE TRIGGER corrections_append_only
  BEFORE UPDATE OR DELETE ON corrections FOR EACH ROW EXECUTE FUNCTION tat_block_history_mutation();
CREATE TRIGGER review_decisions_append_only
  BEFORE UPDATE OR DELETE ON review_decisions FOR EACH ROW EXECUTE FUNCTION tat_block_history_mutation();
CREATE TRIGGER record_versions_append_only
  BEFORE UPDATE OR DELETE ON record_versions FOR EACH ROW EXECUTE FUNCTION tat_block_history_mutation();

CREATE VIEW public_record_catalog AS
SELECT
  r.id,
  r.slug,
  r.record_type,
  r.title,
  r.short_title,
  r.summary,
  r.implementation_status,
  r.publication_status,
  r.verification_status,
  r.evidence_profile,
  r.qualification,
  r.published_at,
  r.updated_at
FROM records r
WHERE r.is_public = true
  AND r.publication_status IN ('published', 'corrected');

CREATE VIEW public_claim_evidence AS
SELECT
  c.id AS claim_id,
  c.record_id,
  c.claim_type,
  c.claim_text,
  c.value_numeric,
  c.value_text,
  c.unit_code,
  c.currency_code,
  c.reporting_period_label,
  c.data_value_nature,
  c.source_origin,
  c.verification_status,
  c.limitations,
  rel.relationship_type,
  rel.source_role,
  rel.evidence_location,
  rel.evidence_summary,
  s.id AS source_id,
  s.title AS source_title,
  s.publisher_name,
  s.source_type,
  s.source_level,
  s.original_url,
  s.archival_url,
  s.publication_date,
  s.publication_date_precision
FROM evidence_claims c
JOIN public_record_catalog r ON r.id = c.record_id
JOIN claim_source_relationships rel ON rel.claim_id = c.id
JOIN sources s ON s.id = rel.source_id
WHERE c.verification_status NOT IN ('unverified', 'withdrawn')
  AND c.workflow_status = 'ready_for_publication'
  AND rel.review_status = 'ready_for_publication'
  AND s.visibility_class = 'public';

CREATE VIEW public_financial_records AS
SELECT
  f.id,
  f.record_id,
  f.financial_type,
  f.amount::text AS amount_exact,
  f.currency_code,
  f.reporting_period_label,
  f.period_start,
  f.period_end,
  f.aggregation_basis,
  f.nominal_or_real,
  f.methodology,
  f.limitations
FROM financial_records f
JOIN public_record_catalog r ON r.id = f.record_id;

CREATE VIEW public_beneficiary_records AS
SELECT
  b.id,
  b.record_id,
  b.beneficiary_type,
  b.beneficiary_stage,
  b.count_value,
  b.unit,
  b.count_basis,
  b.cumulative,
  b.reporting_period_label,
  b.period_start,
  b.period_end,
  b.cohort_key,
  b.double_counting_notes,
  b.limitations
FROM beneficiary_records b
JOIN public_record_catalog r ON r.id = b.record_id;

COMMIT;
