-- Canonical Database Seeds: System Actors, 5 Public Navigation Groups, 15 Canonical Sectors, Geographic Units
BEGIN;

INSERT INTO actor_profiles (id, external_id, actor_kind, display_name, email) VALUES
  ('00000000-0000-4000-8000-000000000001', 'TAT-SYSTEM-RESEARCHER', 'service', 'TAT Research Ingestion Service', 'research@tat.gov.ng'),
  ('00000000-0000-4000-8000-000000000002', 'TAT-SYSTEM-REVIEWER', 'service', 'TAT Evidence Reviewer Service', 'reviewer@tat.gov.ng'),
  ('00000000-0000-4000-8000-000000000003', 'TAT-SYSTEM-EDITOR', 'service', 'TAT Editorial Service', 'editor@tat.gov.ng'),
  ('00000000-0000-4000-8000-000000000004', 'TAT-SYSTEM-PUBLISHER', 'service', 'TAT Publication Service', 'publisher@tat.gov.ng'),
  ('00000000-0000-4000-8000-000000000005', 'TAT-SYSTEM-ADMIN', 'service', 'TAT System Administrator', 'admin@tat.gov.ng')
ON CONFLICT (id) DO NOTHING;

INSERT INTO actor_roles (id, actor_id, role_code, granted_by) VALUES
  ('01000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', 'researcher', '00000000-0000-4000-8000-000000000005'),
  ('01000000-0000-4000-8000-000000000002', '00000000-0000-4000-8000-000000000002', 'evidence_reviewer', '00000000-0000-4000-8000-000000000005'),
  ('01000000-0000-4000-8000-000000000003', '00000000-0000-4000-8000-000000000003', 'editor', '00000000-0000-4000-8000-000000000005'),
  ('01000000-0000-4000-8000-000000000004', '00000000-0000-4000-8000-000000000004', 'publisher', '00000000-0000-4000-8000-000000000005'),
  ('01000000-0000-4000-8000-000000000005', '00000000-0000-4000-8000-000000000005', 'administrator', '00000000-0000-4000-8000-000000000005')
ON CONFLICT (id) DO NOTHING;

INSERT INTO sectors (id, code, label, taxonomy_level, public_order) VALUES
  ('10000000-0000-4000-8000-000000000001', 'economy', 'Economy', 'LEVEL_1_GROUP', 1),
  ('10000000-0000-4000-8000-000000000002', 'security', 'Security', 'LEVEL_1_GROUP', 2),
  ('10000000-0000-4000-8000-000000000003', 'infrastructure', 'Infrastructure', 'LEVEL_1_GROUP', 3),
  ('10000000-0000-4000-8000-000000000004', 'social_services', 'Social Services', 'LEVEL_1_GROUP', 4),
  ('10000000-0000-4000-8000-000000000005', 'governance', 'Governance', 'LEVEL_1_GROUP', 5)
ON CONFLICT (code) DO NOTHING;

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
  ('11000000-0000-4000-8000-000000000015', 'culture_tourism_creative_economy', 'Culture, Tourism and Creative Economy', 'LEVEL_2_SECTOR', '10000000-0000-4000-8000-000000000004')
ON CONFLICT (code) DO NOTHING;

INSERT INTO geographic_units (id, code, name, geography_type, parent_geographic_unit_id) VALUES
  ('30000000-0000-4000-8000-000000000001', 'NGA', 'Nigeria', 'national', NULL),
  ('31000000-0000-4000-8000-000000000001', 'NG-FC', 'Federal Capital Territory', 'fct', '30000000-0000-4000-8000-000000000001'),
  ('31000000-0000-4000-8000-000000000002', 'NG-LA', 'Lagos State', 'state', '30000000-0000-4000-8000-000000000001'),
  ('31000000-0000-4000-8000-000000000003', 'NG-KN', 'Kano State', 'state', '30000000-0000-4000-8000-000000000001'),
  ('31000000-0000-4000-8000-000000000004', 'NG-RV', 'Rivers State', 'state', '30000000-0000-4000-8000-000000000001')
ON CONFLICT (code) DO NOTHING;

COMMIT;