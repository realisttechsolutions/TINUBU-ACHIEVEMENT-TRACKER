-- Obviously fictional, non-production E01 demonstration data.
-- No row describes a real person, institution, programme, project, or achievement.

BEGIN;

INSERT INTO actor_profiles (id, external_id, actor_kind, display_name, email) VALUES
  ('00000000-0000-4000-8000-000000000001', 'SYNTHETIC-DEMO-ACTOR-RESEARCHER', 'human', 'SYNTHETIC DEMO Researcher', 'researcher@example.invalid'),
  ('00000000-0000-4000-8000-000000000002', 'SYNTHETIC-DEMO-ACTOR-REVIEWER', 'human', 'SYNTHETIC DEMO Evidence Reviewer', 'reviewer@example.invalid'),
  ('00000000-0000-4000-8000-000000000003', 'SYNTHETIC-DEMO-ACTOR-EDITOR', 'human', 'SYNTHETIC DEMO Editor', 'editor@example.invalid'),
  ('00000000-0000-4000-8000-000000000004', 'SYNTHETIC-DEMO-ACTOR-PUBLISHER', 'human', 'SYNTHETIC DEMO Publisher', 'publisher@example.invalid'),
  ('00000000-0000-4000-8000-000000000005', 'SYNTHETIC-DEMO-ACTOR-ADMIN', 'human', 'SYNTHETIC DEMO Administrator', 'admin@example.invalid');

INSERT INTO actor_roles (id, actor_id, role_code, granted_by) VALUES
  ('01000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', 'researcher', '00000000-0000-4000-8000-000000000005'),
  ('01000000-0000-4000-8000-000000000002', '00000000-0000-4000-8000-000000000002', 'evidence_reviewer', '00000000-0000-4000-8000-000000000005'),
  ('01000000-0000-4000-8000-000000000003', '00000000-0000-4000-8000-000000000003', 'editor', '00000000-0000-4000-8000-000000000005'),
  ('01000000-0000-4000-8000-000000000004', '00000000-0000-4000-8000-000000000004', 'publisher', '00000000-0000-4000-8000-000000000005'),
  ('01000000-0000-4000-8000-000000000005', '00000000-0000-4000-8000-000000000005', 'administrator', '00000000-0000-4000-8000-000000000005');

INSERT INTO sectors (id, code, label, taxonomy_level, public_order) VALUES
  ('10000000-0000-4000-8000-000000000001', 'economy', 'Economy', 'LEVEL_1_GROUP', 1),
  ('10000000-0000-4000-8000-000000000002', 'security', 'Security', 'LEVEL_1_GROUP', 2),
  ('10000000-0000-4000-8000-000000000003', 'infrastructure', 'Infrastructure', 'LEVEL_1_GROUP', 3),
  ('10000000-0000-4000-8000-000000000004', 'social_services', 'Social Services', 'LEVEL_1_GROUP', 4),
  ('10000000-0000-4000-8000-000000000005', 'governance', 'Governance', 'LEVEL_1_GROUP', 5);

INSERT INTO sectors (id, code, label, taxonomy_level, parent_sector_id) VALUES
  ('11000000-0000-4000-8000-000000000001', 'economy_fiscal_reforms', 'Economy and Fiscal Reforms', 'LEVEL_2_SECTOR', '10000000-0000-4000-8000-000000000001'),
  ('11000000-0000-4000-8000-000000000002', 'security_national_stability', 'Security and National Stability', 'LEVEL_2_SECTOR', '10000000-0000-4000-8000-000000000002'),
  ('11000000-0000-4000-8000-000000000003', 'infrastructure_transportation', 'Infrastructure and Transportation', 'LEVEL_2_SECTOR', '10000000-0000-4000-8000-000000000003'),
  ('11000000-0000-4000-8000-000000000004', 'agriculture_food_security', 'Agriculture and Food Security', 'LEVEL_2_SECTOR', '10000000-0000-4000-8000-000000000001'),
  ('11000000-0000-4000-8000-000000000005', 'education_human_capital', 'Education and Human Capital', 'LEVEL_2_SECTOR', '10000000-0000-4000-8000-000000000004'),
  ('11000000-0000-4000-8000-000000000006', 'healthcare_public_health', 'Healthcare and Public Health', 'LEVEL_2_SECTOR', '10000000-0000-4000-8000-000000000004'),
  ('11000000-0000-4000-8000-000000000007', 'social_protection_human_development', 'Social Protection and Human Development', 'LEVEL_2_SECTOR', '10000000-0000-4000-8000-000000000004'),
  ('11000000-0000-4000-8000-000000000008', 'youth_employment_skills', 'Youth, Employment and Skills', 'LEVEL_2_SECTOR', '10000000-0000-4000-8000-000000000004'),
  ('11000000-0000-4000-8000-000000000009', 'power_energy_natural_resources', 'Power, Energy and Natural Resources', 'LEVEL_2_SECTOR', '10000000-0000-4000-8000-000000000003'),
  ('11000000-0000-4000-8000-000000000010', 'digital_economy_science_innovation', 'Digital Economy, Science and Innovation', 'LEVEL_2_SECTOR', '10000000-0000-4000-8000-000000000001'),
  ('11000000-0000-4000-8000-000000000011', 'housing_urban_development', 'Housing and Urban Development', 'LEVEL_2_SECTOR', '10000000-0000-4000-8000-000000000003'),
  ('11000000-0000-4000-8000-000000000012', 'environment_climate', 'Environment and Climate', 'LEVEL_2_SECTOR', '10000000-0000-4000-8000-000000000003'),
  ('11000000-0000-4000-8000-000000000013', 'governance_public_service', 'Governance and Public Service', 'LEVEL_2_SECTOR', '10000000-0000-4000-8000-000000000005'),
  ('11000000-0000-4000-8000-000000000014', 'foreign_affairs_international_cooperation', 'Foreign Affairs and International Cooperation', 'LEVEL_2_SECTOR', '10000000-0000-4000-8000-000000000005'),
  ('11000000-0000-4000-8000-000000000015', 'culture_tourism_creative_economy', 'Culture, Tourism and Creative Economy', 'LEVEL_2_SECTOR', '10000000-0000-4000-8000-000000000004');

INSERT INTO sectors (id, code, label, taxonomy_level, parent_sector_id) VALUES
  ('12000000-0000-4000-8000-000000000001', 'synthetic_demo_learning_labs', 'SYNTHETIC DEMO Learning Labs', 'LEVEL_3_SUBSECTOR', '11000000-0000-4000-8000-000000000005');

INSERT INTO institutions (id, external_id, slug, canonical_name, short_name, institution_type, official_url) VALUES
  ('20000000-0000-4000-8000-000000000001', 'SYNTHETIC-DEMO-INSTITUTION-001', 'synthetic-demo-ministry', 'SYNTHETIC DEMO Ministry of Imaginary Services', 'DEMO Ministry', 'ministry', 'https://example.invalid/demo-ministry'),
  ('20000000-0000-4000-8000-000000000002', 'SYNTHETIC-DEMO-INSTITUTION-002', 'synthetic-demo-statistics-lab', 'SYNTHETIC DEMO Statistics Laboratory', 'DEMO Stats Lab', 'implementation_partner', 'https://example.invalid/demo-statistics');

INSERT INTO geographic_units (id, external_id, code, name, geography_type) VALUES
  ('30000000-0000-4000-8000-000000000001', 'SYNTHETIC-DEMO-GEO-NATIONAL', 'SYNTHETIC-DEMO-NATIONAL', 'SYNTHETIC DEMO National Area', 'national');
INSERT INTO geographic_units (id, external_id, code, name, geography_type, parent_geographic_unit_id) VALUES
  ('30000000-0000-4000-8000-000000000002', 'SYNTHETIC-DEMO-GEO-STATE', 'SYNTHETIC-DEMO-STATE', 'SYNTHETIC DEMO State', 'state', '30000000-0000-4000-8000-000000000001');

INSERT INTO records (
  id, external_id, slug, record_type, title, short_title, summary, body,
  implementation_status, workflow_status, publication_status, verification_status,
  evidence_profile, risk_level, is_public, qualification, internal_notes, created_by, published_at
) VALUES
  ('40000000-0000-4000-8000-000000000001', 'SYNTHETIC-DEMO-RECORD-001', 'synthetic-demo-learning-labs', 'programme',
   'SYNTHETIC DEMO Interplanetary Learning Labs', 'DEMO Learning Labs',
   'NON-PRODUCTION fictional programme used only to verify the E01 relational foundation.',
   'SYNTHETIC demonstration body. It makes no claim about any real government action.',
   'operational', 'ready_for_publication', 'published', 'independently_corroborated',
   'third_party_independent_assessment', 'low', true, 'SYNTHETIC DEMO NON-PRODUCTION.',
   'Internal-only synthetic reviewer note.', '00000000-0000-4000-8000-000000000001', '2026-08-15T08:00:00Z'),
  ('40000000-0000-4000-8000-000000000002', 'SYNTHETIC-DEMO-RECORD-002', 'synthetic-demo-solar-road', 'physical_project',
   'SYNTHETIC DEMO Solar Road to Nowhere', 'DEMO Solar Road',
   'NON-PRODUCTION fictional project retained as an unpublished boundary test record.',
   'SYNTHETIC demonstration only.', 'implementation_planning', 'draft', 'unpublished', 'unverified',
   'direct_physical_delivery', 'medium', false, NULL, 'This draft must never appear in public projections.',
   '00000000-0000-4000-8000-000000000001', NULL),
  ('40000000-0000-4000-8000-000000000003', 'SYNTHETIC-DEMO-RECORD-003', 'synthetic-demo-moonlight-policy', 'policy',
   'SYNTHETIC DEMO Moonlight Filing Policy', 'DEMO Filing Policy',
   'NON-PRODUCTION fictional policy used only to test record relationships and filtering.',
   'SYNTHETIC demonstration only.', 'effective', 'ready_for_publication', 'published', 'cross_referenced',
   'statutory_legal_enactment', 'low', true, 'SYNTHETIC DEMO NON-PRODUCTION.',
   'Internal-only synthetic policy note.', '00000000-0000-4000-8000-000000000001', '2026-08-14T08:00:00Z');

INSERT INTO programme_details (record_id, programme_type, target_group_narrative, enrolment_model, disbursement_model) VALUES
  ('40000000-0000-4000-8000-000000000001', 'digital_transformation', 'Fictional demo participants', 'SYNTHETIC opt-in', 'No real disbursement');
INSERT INTO project_details (record_id, project_type, progress_percentage, project_reference, location_narrative) VALUES
  ('40000000-0000-4000-8000-000000000002', 'highway_road', 12.50, 'SYNTHETIC-DEMO-PROJECT', 'Fictional location');
INSERT INTO policy_details (record_id, policy_type, legal_authority, reference_number, effect_scope) VALUES
  ('40000000-0000-4000-8000-000000000003', 'national_policy', 'SYNTHETIC DEMO authority only', 'SYNTHETIC-DEMO-POLICY', 'Fictional scope');
INSERT INTO achievement_profiles (record_id, public_impact_narrative, public_qualification, display_priority) VALUES
  ('40000000-0000-4000-8000-000000000001', 'SYNTHETIC DEMO impact narrative.', 'NON-PRODUCTION demonstration.', 10);

INSERT INTO record_institutions (record_id, institution_id, role_code) VALUES
  ('40000000-0000-4000-8000-000000000001', '20000000-0000-4000-8000-000000000001', 'lead'),
  ('40000000-0000-4000-8000-000000000001', '20000000-0000-4000-8000-000000000002', 'partner'),
  ('40000000-0000-4000-8000-000000000002', '20000000-0000-4000-8000-000000000001', 'implementing'),
  ('40000000-0000-4000-8000-000000000003', '20000000-0000-4000-8000-000000000001', 'regulatory');
INSERT INTO record_sectors (record_id, sector_id, role_code) VALUES
  ('40000000-0000-4000-8000-000000000001', '11000000-0000-4000-8000-000000000005', 'primary'),
  ('40000000-0000-4000-8000-000000000002', '11000000-0000-4000-8000-000000000003', 'primary'),
  ('40000000-0000-4000-8000-000000000003', '11000000-0000-4000-8000-000000000013', 'primary');
INSERT INTO record_geographies (record_id, geographic_unit_id, coverage_role, confidence) VALUES
  ('40000000-0000-4000-8000-000000000001', '30000000-0000-4000-8000-000000000002', 'covered', 1.000),
  ('40000000-0000-4000-8000-000000000002', '30000000-0000-4000-8000-000000000002', 'implementation_site', 0.500),
  ('40000000-0000-4000-8000-000000000003', '30000000-0000-4000-8000-000000000001', 'primary', 1.000);

INSERT INTO record_relationships (id, external_id, from_record_id, to_record_id, relationship_role, created_by) VALUES
  ('41000000-0000-4000-8000-000000000001', 'SYNTHETIC-DEMO-REL-001', '40000000-0000-4000-8000-000000000001', '40000000-0000-4000-8000-000000000003', 'enabling_legislation', '00000000-0000-4000-8000-000000000001');

INSERT INTO sources (
  id, external_id, title, publisher_institution_id, publisher_name, source_type, source_level,
  original_url, document_number, publication_date, publication_date_precision, access_date,
  source_status, sha256, visibility_class, created_by
) VALUES
  ('50000000-0000-4000-8000-000000000001', 'SYNTHETIC-DEMO-SOURCE-001', 'SYNTHETIC DEMO Fictional Programme Register',
   '20000000-0000-4000-8000-000000000001', 'SYNTHETIC DEMO Ministry', 'agency_portal', 'LEVEL_3',
   'https://example.invalid/demo-register', 'SYNTHETIC-DEMO-DOC-001', '2026-06-30', 'exact_day', '2026-08-15',
   'active', 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', 'public', '00000000-0000-4000-8000-000000000001'),
  ('50000000-0000-4000-8000-000000000002', 'SYNTHETIC-DEMO-SOURCE-002', 'SYNTHETIC DEMO Independent Fiction Audit',
   '20000000-0000-4000-8000-000000000002', 'SYNTHETIC DEMO Statistics Laboratory', 'audit_report', 'LEVEL_3',
   'https://example.invalid/demo-audit', 'SYNTHETIC-DEMO-DOC-002', '2026-07-15', 'exact_day', '2026-08-15',
   'active', 'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb', 'public', '00000000-0000-4000-8000-000000000001');

INSERT INTO evidence_claims (
  id, external_id, record_id, claim_type, claim_text, value_numeric, value_text, unit_code,
  date_value, date_precision, period_start, period_end, reporting_period_label,
  data_value_nature, source_origin, verification_status, evidence_profile, risk_level,
  workflow_status, limitations, created_by
) VALUES
  ('60000000-0000-4000-8000-000000000001', 'SYNTHETIC-DEMO-CLAIM-001', '40000000-0000-4000-8000-000000000001',
   'reported_outcome', 'SYNTHETIC DEMO claim: forty imaginary learning labs are operational.', 40, NULL, 'fictional_labs',
   '2026-06-30', 'exact_day', NULL, NULL, NULL, 'actual', 'mixed', 'independently_corroborated',
   'third_party_independent_assessment', 'low', 'ready_for_publication', 'Fictional values for non-production testing only.',
   '00000000-0000-4000-8000-000000000001'),
  ('60000000-0000-4000-8000-000000000002', 'SYNTHETIC-DEMO-CLAIM-002', '40000000-0000-4000-8000-000000000001',
   'financial_value', 'SYNTHETIC DEMO claim: a fictional budget and release are separately reported.', NULL, 'SYNTHETIC ONLY', 'currency_units',
   NULL, 'range', '2026-04-01', '2026-06-30', 'SYNTHETIC Q2 2026', 'actual', 'government_reported', 'source_confirmed',
   'verified_administrative_disbursement', 'medium', 'ready_for_publication', 'Never aggregate unlike financial types.',
   '00000000-0000-4000-8000-000000000001'),
  ('60000000-0000-4000-8000-000000000003', 'SYNTHETIC-DEMO-CLAIM-003', '40000000-0000-4000-8000-000000000001',
   'beneficiary_value', 'SYNTHETIC DEMO claim: fictional applicants and recipients are separate populations.', NULL, 'SYNTHETIC ONLY', 'fictional_people',
   NULL, 'range', '2026-04-01', '2026-06-30', 'SYNTHETIC Q2 2026', 'actual', 'mixed', 'cross_referenced',
   'third_party_independent_assessment', 'medium', 'ready_for_publication', 'Stages and cohorts must not be summed.',
   '00000000-0000-4000-8000-000000000001'),
  ('60000000-0000-4000-8000-000000000004', 'SYNTHETIC-DEMO-CLAIM-004', '40000000-0000-4000-8000-000000000001',
   'statistical_indicator', 'SYNTHETIC DEMO claim: a fictional learning index has a value of 12.5.', 12.5, NULL, 'demo_points',
   NULL, 'range', '2026-04-01', '2026-06-30', 'SYNTHETIC Q2 2026', 'actual', 'independently_reported', 'cross_referenced',
   'statistical_indicator_movement', 'low', 'ready_for_publication', 'No causal attribution is asserted.',
   '00000000-0000-4000-8000-000000000001');

INSERT INTO claim_source_relationships (
  id, external_id, claim_id, source_id, source_role, relationship_type, evidence_location,
  evidence_summary, review_status, reviewed_by, reviewed_at, created_by
) VALUES
  ('61000000-0000-4000-8000-000000000001', 'SYNTHETIC-DEMO-CLAIM-SOURCE-001', '60000000-0000-4000-8000-000000000001',
   '50000000-0000-4000-8000-000000000001', 'primary', 'supports', 'SYNTHETIC table A',
   'SYNTHETIC DEMO register supports the fictional lab count.', 'ready_for_publication',
   '00000000-0000-4000-8000-000000000002', '2026-08-14T10:00:00Z', '00000000-0000-4000-8000-000000000001'),
  ('61000000-0000-4000-8000-000000000002', 'SYNTHETIC-DEMO-CLAIM-SOURCE-002', '60000000-0000-4000-8000-000000000001',
   '50000000-0000-4000-8000-000000000002', 'independent_assessment', 'supports', 'SYNTHETIC page 4',
   'SYNTHETIC DEMO audit independently supports the fictional count.', 'ready_for_publication',
   '00000000-0000-4000-8000-000000000002', '2026-08-14T10:05:00Z', '00000000-0000-4000-8000-000000000001'),
  ('61000000-0000-4000-8000-000000000003', 'SYNTHETIC-DEMO-CLAIM-SOURCE-003', '60000000-0000-4000-8000-000000000002',
   '50000000-0000-4000-8000-000000000001', 'primary', 'supports', 'SYNTHETIC finance table',
   'SYNTHETIC DEMO register separates allocation and release.', 'ready_for_publication',
   '00000000-0000-4000-8000-000000000002', '2026-08-14T10:10:00Z', '00000000-0000-4000-8000-000000000001'),
  ('61000000-0000-4000-8000-000000000004', 'SYNTHETIC-DEMO-CLAIM-SOURCE-004', '60000000-0000-4000-8000-000000000003',
   '50000000-0000-4000-8000-000000000002', 'independent_assessment', 'supports', 'SYNTHETIC beneficiary appendix',
   'SYNTHETIC DEMO audit separates applicant and recipient stages.', 'ready_for_publication',
   '00000000-0000-4000-8000-000000000002', '2026-08-14T10:15:00Z', '00000000-0000-4000-8000-000000000001'),
  ('61000000-0000-4000-8000-000000000005', 'SYNTHETIC-DEMO-CLAIM-SOURCE-005', '60000000-0000-4000-8000-000000000004',
   '50000000-0000-4000-8000-000000000002', 'independent_assessment', 'supports', 'SYNTHETIC indicator table',
   'SYNTHETIC DEMO audit supplies the fictional indicator observation.', 'ready_for_publication',
   '00000000-0000-4000-8000-000000000002', '2026-08-14T10:20:00Z', '00000000-0000-4000-8000-000000000001');

INSERT INTO financial_records (
  id, external_id, record_id, claim_id, geographic_unit_id, financial_type, amount,
  currency_code, reporting_period_label, period_start, period_end, date_precision,
  aggregation_basis, nominal_or_real, methodology, limitations, created_by
) VALUES
  ('70000000-0000-4000-8000-000000000001', 'SYNTHETIC-DEMO-FINANCE-001', '40000000-0000-4000-8000-000000000001',
   '60000000-0000-4000-8000-000000000002', '30000000-0000-4000-8000-000000000002', 'budget_allocation', 1000.0000,
   'NGN', 'SYNTHETIC Q2 2026', '2026-04-01', '2026-06-30', 'quarter', 'period', 'nominal',
   'SYNTHETIC DEMO method', 'Do not combine with release.', '00000000-0000-4000-8000-000000000001'),
  ('70000000-0000-4000-8000-000000000002', 'SYNTHETIC-DEMO-FINANCE-002', '40000000-0000-4000-8000-000000000001',
   '60000000-0000-4000-8000-000000000002', '30000000-0000-4000-8000-000000000002', 'funding_released', 600.0000,
   'NGN', 'SYNTHETIC Q2 2026', '2026-04-01', '2026-06-30', 'quarter', 'period', 'nominal',
   'SYNTHETIC DEMO method', 'Do not combine with allocation.', '00000000-0000-4000-8000-000000000001');

INSERT INTO beneficiary_records (
  id, external_id, record_id, claim_id, geographic_unit_id, beneficiary_type,
  beneficiary_stage, count_value, unit, count_basis, cumulative, reporting_period_label,
  period_start, period_end, cohort_key, methodology, double_counting_notes, limitations, created_by
) VALUES
  ('71000000-0000-4000-8000-000000000001', 'SYNTHETIC-DEMO-BENEFICIARY-001', '40000000-0000-4000-8000-000000000001',
   '60000000-0000-4000-8000-000000000003', '30000000-0000-4000-8000-000000000002', 'students', 'applicant', 100,
   'fictional_people', 'period_specific', false, 'SYNTHETIC Q2 2026', '2026-04-01', '2026-06-30', 'SYNTHETIC-COHORT-A',
   'SYNTHETIC DEMO method', 'Applicants overlap with later stages.', 'Never describe applicants as recipients.',
   '00000000-0000-4000-8000-000000000001'),
  ('71000000-0000-4000-8000-000000000002', 'SYNTHETIC-DEMO-BENEFICIARY-002', '40000000-0000-4000-8000-000000000001',
   '60000000-0000-4000-8000-000000000003', '30000000-0000-4000-8000-000000000002', 'students', 'disbursement_recipient', 40,
   'fictional_people', 'period_specific', false, 'SYNTHETIC Q2 2026', '2026-04-01', '2026-06-30', 'SYNTHETIC-COHORT-A',
   'SYNTHETIC DEMO method', 'Recipients are a subset of applicants.', 'Keep stages separate.',
   '00000000-0000-4000-8000-000000000001');

INSERT INTO indicators (
  id, external_id, slug, name, definition, unit, frequency, methodology, sector_id,
  source_institution_id, created_by
) VALUES
  ('72000000-0000-4000-8000-000000000001', 'SYNTHETIC-DEMO-INDICATOR-001', 'synthetic-demo-learning-index',
   'SYNTHETIC DEMO Learning Index', 'A fictional non-production measurement used only to test the indicator model.',
   'demo_points', 'quarterly', 'SYNTHETIC DEMO calculation with no causal inference.',
   '11000000-0000-4000-8000-000000000005', '20000000-0000-4000-8000-000000000002',
   '00000000-0000-4000-8000-000000000001');

INSERT INTO indicator_observations (
  id, external_id, indicator_id, claim_id, geographic_unit_id, value_numeric, value_display,
  reporting_period_label, period_start, period_end, data_value_nature, source_origin,
  verification_status, provisional, created_by
) VALUES
  ('73000000-0000-4000-8000-000000000001', 'SYNTHETIC-DEMO-OBSERVATION-001', '72000000-0000-4000-8000-000000000001',
   '60000000-0000-4000-8000-000000000004', '30000000-0000-4000-8000-000000000002', 12.50000000, '12.5 demo points',
   'SYNTHETIC Q2 2026', '2026-04-01', '2026-06-30', 'actual', 'independently_reported', 'cross_referenced', false,
   '00000000-0000-4000-8000-000000000001');

INSERT INTO timeline_events (
  id, external_id, record_id, claim_id, event_type, title, description, date_value,
  date_precision, provisional, is_public, created_by
) VALUES
  ('74000000-0000-4000-8000-000000000001', 'SYNTHETIC-DEMO-TIMELINE-001', '40000000-0000-4000-8000-000000000001',
   NULL, 'announcement', 'SYNTHETIC DEMO announcement', 'Fictional announcement; not completion.', '2026-01-15',
   'exact_day', false, true, '00000000-0000-4000-8000-000000000001'),
  ('74000000-0000-4000-8000-000000000002', 'SYNTHETIC-DEMO-TIMELINE-002', '40000000-0000-4000-8000-000000000001',
   '60000000-0000-4000-8000-000000000001', 'operation', 'SYNTHETIC DEMO operation',
   'Fictional operational event distinct from announcement.', '2026-06-30', 'exact_day', false, true,
   '00000000-0000-4000-8000-000000000001');

INSERT INTO research_batches (
  id, external_id, idempotency_key, package_checksum, contract_version, schema_version,
  taxonomy_version, mode, status, submitted_by, approved_by, plan_hash, manifest_json,
  validation_report, import_summary, completed_at
) VALUES
  ('80000000-0000-4000-8000-000000000001', 'SYNTHETIC-DEMO-BATCH-001', 'SYNTHETIC-DEMO-IDEMPOTENCY-001',
   'cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc', '1.1.2', 'e01-local-1', '1.1.2',
   'commit', 'committed', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000004',
   'dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd',
   '{"classification":"SYNTHETIC DEMO NON-PRODUCTION","files":[]}'::jsonb,
   '{"errors":0,"warnings":0}'::jsonb, '{"inserted":42,"synthetic":true}'::jsonb, '2026-08-15T12:00:00Z');

INSERT INTO record_versions (id, record_id, version_number, changed_by, change_reason, snapshot_json, diff_json, research_batch_id) VALUES
  ('81000000-0000-4000-8000-000000000001', '40000000-0000-4000-8000-000000000001', 1,
   '00000000-0000-4000-8000-000000000001', 'SYNTHETIC DEMO initial version',
   '{"title":"SYNTHETIC DEMO Interplanetary Learning Labs","nonProduction":true}'::jsonb,
   '{"created":true}'::jsonb, '80000000-0000-4000-8000-000000000001');

INSERT INTO review_decisions (
  id, external_id, record_id, subject_scope, record_revision, gate_code, decision,
  reviewer_id, rationale, risk_level, decided_at
) VALUES
  ('82000000-0000-4000-8000-000000000001', 'SYNTHETIC-DEMO-REVIEW-001', '40000000-0000-4000-8000-000000000001',
   'record', 1, 'gate_2_resolution_evidence', 'approved', '00000000-0000-4000-8000-000000000002',
   'SYNTHETIC DEMO evidence review only.', 'low', '2026-08-14T11:00:00Z'),
  ('82000000-0000-4000-8000-000000000002', 'SYNTHETIC-DEMO-REVIEW-002', '40000000-0000-4000-8000-000000000001',
   'record', 1, 'gate_4_editorial_human_approval', 'approved', '00000000-0000-4000-8000-000000000003',
   'SYNTHETIC DEMO editorial review only.', 'low', '2026-08-14T11:10:00Z'),
  ('82000000-0000-4000-8000-000000000003', 'SYNTHETIC-DEMO-REVIEW-003', '40000000-0000-4000-8000-000000000001',
   'record', 1, 'gate_5_publication_stewardship', 'approved', '00000000-0000-4000-8000-000000000004',
   'SYNTHETIC DEMO publisher decision only.', 'low', '2026-08-14T11:20:00Z');

INSERT INTO corrections (
  id, external_id, record_id, claim_id, source_id, correction_type, original_state,
  corrected_state, reason, lifecycle_status, reviewed_by, approved_by, approved_at,
  effective_at, public_notice, created_by
) VALUES
  ('83000000-0000-4000-8000-000000000001', 'SYNTHETIC-DEMO-CORRECTION-001', '40000000-0000-4000-8000-000000000001',
   '60000000-0000-4000-8000-000000000001', '50000000-0000-4000-8000-000000000002', 'typographical',
   '{"syntheticLabel":"DEOM"}'::jsonb, '{"syntheticLabel":"DEMO"}'::jsonb,
   'Correct an obvious fictional label typo while preserving history.', 'published',
   '00000000-0000-4000-8000-000000000002', '00000000-0000-4000-8000-000000000003',
   '2026-08-14T12:00:00Z', '2026-08-14T12:05:00Z', 'SYNTHETIC DEMO NON-PRODUCTION correction.',
   '00000000-0000-4000-8000-000000000001');

COMMIT;
