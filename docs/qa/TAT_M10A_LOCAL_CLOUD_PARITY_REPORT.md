# Local–Cloud Parity Report: 27-Table Canonical Inventory

## 1. 27-Table Canonical Schema Inventory & Row Parity

| # | Table Name | Domain | Local Count (Seed + M02) | Expected Cloud Staging | Public/Private |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | `records` | Core Container | 59 (3 ref + 56 M02) | 59 | Public via View |
| 2 | `achievement_profiles` | Delivery Detail | 31 (1 ref + 30 M02) | 31 | Public via View |
| 3 | `policy_details` | Policy Detail | 11 (1 ref + 10 M02) | 11 | Public via View |
| 4 | `project_details` | Capital Projects | 9 (1 ref + 8 M02) | 9 | Public via View |
| 5 | `programme_details` | Social Programmes | 9 (1 ref + 8 M02) | 9 | Public via View |
| 6 | `sources` | Evidence Base | 37 (2 ref + 35 M02) | 37 | Public |
| 7 | `evidence_claims` | Assertions | 37 (4 ref + 33 M02) | 37 | Public via View |
| 8 | `claim_source_relationships` | Verifications | 41 (5 ref + 36 M02) | 41 | Public via View |
| 9 | `financial_records` | Financials | 10 (2 ref + 8 M02) | 10 | Public via View |
| 10 | `beneficiary_records` | Beneficiaries | 10 (2 ref + 8 M02) | 10 | Public via View |
| 11 | `indicators` | Metrics | 4 (1 ref + 3 M02) | 4 | Public |
| 12 | `indicator_observations` | Time Series | 5 (1 ref + 4 M02) | 5 | Public |
| 13 | `timeline_events` | Chronology | 17 (2 ref + 15 M02) | 17 | Public |
| 14 | `corrections` | Audit Errata | 3 (1 ref + 2 M02) | 3 | Public (Append-Only) |
| 15 | `review_decisions` | Editorial Gates | 33 (3 ref + 30 M02) | 33 | Private (Append-Only) |
| 16 | `sectors` | Taxonomy | 21 (5 G + 15 S + 1 Sub) | 21 | Public |
| 17 | `geographic_units` | Geography | 2 (National + State) | 2 | Public |
| 18 | `institutions` | Governance | 2 (Presidency + MDA) | 2 | Public |
| 19 | `actor_profiles` | Identity | 5 (Staff & Reviewers) | 5 | Private |
| 20 | `actor_roles` | RBAC | 5 (Assignments) | 5 | Private |
| 21 | `record_sectors` | Classification | 3 (Links) | 3 | Public via View |
| 22 | `record_geographies` | Geometry | 3 (Links) | 3 | Public via View |
| 23 | `record_institutions` | Institutional | 4 (Links) | 4 | Public via View |
| 24 | `record_relationships` | Graph Links | 1 (Dependency Link) | 1 | Public via View |
| 25 | `record_versions` | Version Audit | 1 (Snapshot) | 1 | Private (Append-Only) |
| 26 | `research_batches` | Ingestion Log | 2 (E01 + M02) | 1 (Cloud Batch) | Private |
| 27 | `source_files` | Auxiliary | 0 (No raw binaries) | 0 | Private |

## 2. Core Public Relational Views
1. `public_record_catalog` (58 rows published)
2. `public_claim_evidence` (41 rows corroborated)
3. `public_financial_records` (10 rows disaggregated)
4. `public_beneficiary_records` (10 rows stage-separated)
