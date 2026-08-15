# Canonical Database Data Dictionary

## 1. Schema Inventory

| Table Name | Primary Key | Domain | Description | Append-Only |
| :--- | :--- | :--- | :--- | :--- |
| `sectors` | `id (uuid)` | Taxonomy | 3-tier hierarchy: groups, sectors, subsectors | No |
| `geographic_units` | `id (uuid)` | Geometry | National, zones, states, LGAs | No |
| `institutions` | `id (uuid)` | Governance | Ministries, departments, agencies, presidencies | No |
| `actor_profiles` | `id (uuid)` | Security | Authenticated researchers, editors, reviewers | No |
| `actor_roles` | `id (uuid)` | RBAC | Role assignments (`data_editor`, `compliance_officer`) | No |
| `records` | `id (uuid)` | Core | Polymorphic container for all policy & delivery entities | No |
| `achievement_profiles` | `record_id (uuid)` | Core | Delivery profile and presidential alignment | No |
| `policy_details` | `record_id (uuid)` | Core | Statutory policy and legislative specifics | No |
| `project_details` | `record_id (uuid)` | Core | Physical capital project attributes | No |
| `programme_details` | `record_id (uuid)` | Core | Intervention & social programme attributes | No |
| `record_sectors` | `(record_id, sector_id)` | Classification | Primary and secondary sector associations | No |
| `record_geography` | `(record_id, geographic_unit_id)` | Geometry | Geographic scope and coverage | No |
| `sources` | `id (uuid)` | Evidence | Bibliographic and digital source inventory | No |
| `evidence_claims` | `id (uuid)` | Evidence | Specific empirical assertions | No |
| `claim_source_relationships` | `id (uuid)` | Evidence | Verifiable link between claims and sources | No |
| `financial_records` | `id (uuid)` | Structured | Budget, disbursement, expenditure allocations | No |
| `beneficiary_records` | `id (uuid)` | Structured | Disaggregated beneficiary counts by stage | No |
| `indicators` | `id (uuid)` | Structured | Statistical indicator definitions | No |
| `indicator_observations` | `id (uuid)` | Structured | Time-series observations and values | No |
| `timeline_events` | `id (uuid)` | Structured | Milestones and chronology events | No |
| `corrections` | `id (uuid)` | Audit | Public audit corrections and errata | **Yes** |
| `review_decisions` | `id (uuid)` | Audit | Editorial gate signoffs | **Yes** |
| `record_versions` | `id (uuid)` | Audit | Historical version snapshots | **Yes** |
| `research_batches` | `id (uuid)` | Ingestion | Ingestion execution runs and provenance | No |
| `dataset_manifests` | `id (uuid)` | Ingestion | Immutable checksum manifests for datasets | No |
