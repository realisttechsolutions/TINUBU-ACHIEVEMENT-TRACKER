# TAT Mission 10B — Cloud Physical Parity

**Certification date:** 2026-08-15  
**Canonical DDL:** `database/schema.sql`  
**Live target:** `tinubu-achievement-stg:us-central1:tat-db-staging` / `tat_staging`  
**Runtime:** PostgreSQL 17.10

## Executive result

The complete canonical DDL was applied to a newly created, empty `tat_staging` database. PostgreSQL returned 82 result blocks without a failed statement. Because the DDL is wrapped in its own transaction, a statement failure would have rolled back the schema and stopped the mission.

An independent catalog audit then built the expected catalog from the same committed DDL in a fresh local PostgreSQL-compatible engine and compared it object-for-object with the live Cloud SQL PostgreSQL 17 catalog. The comparison covered tables, column order and semantics, all constraints and delete actions, every index, triggers and trigger functions, application functions, views, generated-column state, and installed extensions.

**Result: 100% parity; 0 missing, extra, or mismatched canonical catalog objects.**

## Certified totals

| Physical surface | Canonical | Cloud SQL | Differences | Result |
|---|---:|---:|---:|---|
| Base tables | 27 | 27 | 0 | PASS |
| Columns | 372 | 372 | 0 | PASS |
| Primary keys | 27 | 27 | 0 | PASS |
| Foreign keys | 65 | 65 | 0 | PASS |
| `ON DELETE RESTRICT` actions | 53 | 53 | 0 | PASS |
| `ON DELETE CASCADE` actions | 12 | 12 | 0 | PASS |
| Declared uniqueness rules | 33 | 33 | 0 | PASS |
| Check constraints | 128 | 128 | 0 | PASS |
| All indexes | 91 | 91 | 0 | PASS |
| Partial/expression/GIN indexes | 8 | 8 | 0 | PASS |
| Application triggers | 9 | 9 | 0 | PASS |
| Application functions | 8 | 8 | 0 | PASS |
| Public projection views | 4 | 4 | 0 | PASS |
| Generated columns | 0 | 0 | 0 | PASS |
| Extensions | `plpgsql` | `plpgsql` | 0 | PASS |
| Mission 10A PostgreSQL-only controls | 149 | 149 | 0 | PASS |

The 149 PostgreSQL-only controls are exactly 128 checks + 8 special indexes + 9 triggers + 4 views. The eight supporting functions are audited separately and are not double-counted in that Mission 10A figure.

## 27-table certification matrix

| Table | Columns | Primary key | Unique rules | FKs | Cloud result |
|---|---:|---|---:|---:|---|
| `achievement_profiles` | 7 | `record_id` | 0 | 1 | PASS |
| `actor_profiles` | 9 | `id` | 2 | 0 | PASS |
| `actor_roles` | 11 | `id` | 0 | 2 | PASS |
| `beneficiary_records` | 21 | `id` | 2 | 4 | PASS |
| `claim_source_relationships` | 16 | `id` | 2 | 5 | PASS |
| `corrections` | 17 | `id` | 1 | 6 | PASS |
| `evidence_claims` | 29 | `id` | 1 | 3 | PASS |
| `financial_records` | 19 | `id` | 2 | 4 | PASS |
| `geographic_units` | 13 | `id` | 2 | 1 | PASS |
| `indicator_observations` | 17 | `id` | 2 | 4 | PASS |
| `indicators` | 15 | `id` | 2 | 3 | PASS |
| `institutions` | 12 | `id` | 2 | 1 | PASS |
| `policy_details` | 7 | `record_id` | 0 | 1 | PASS |
| `programme_details` | 7 | `record_id` | 0 | 1 | PASS |
| `project_details` | 8 | `record_id` | 0 | 1 | PASS |
| `record_geographies` | 7 | `record_id, geographic_unit_id, coverage_role` | 0 | 2 | PASS |
| `record_institutions` | 6 | `record_id, institution_id, role_code` | 0 | 2 | PASS |
| `record_relationships` | 9 | `id` | 2 | 3 | PASS |
| `record_sectors` | 4 | `record_id, sector_id, role_code` | 0 | 2 | PASS |
| `record_versions` | 9 | `id` | 1 | 3 | PASS |
| `records` | 23 | `id` | 2 | 1 | PASS |
| `research_batches` | 20 | `id` | 3 | 2 | PASS |
| `review_decisions` | 14 | `id` | 2 | 4 | PASS |
| `sectors` | 11 | `id` | 1 | 1 | PASS |
| `source_files` | 20 | `id` | 2 | 3 | PASS |
| `sources` | 24 | `id` | 1 | 2 | PASS |
| `timeline_events` | 17 | `id` | 1 | 3 | PASS |

The uniqueness column reports the 33 canonical application rules. PostgreSQL-only partial uniqueness is retained and audited among the eight special indexes.

## PostgreSQL-only object inventory

Special indexes:

- `actor_roles_active_assignment_uidx`
- `indicators_sector_name_idx`
- `institutions_name_type_idx`
- `record_sectors_one_primary_uidx`
- `records_search_idx`
- `sources_document_number_uidx`
- `sources_original_url_uidx`
- `sources_search_idx`

Application triggers:

- `beneficiary_claim_guard`
- `corrections_append_only`
- `financial_claim_guard`
- `indicator_observation_claim_guard`
- `record_sectors_level_guard`
- `record_versions_append_only`
- `review_decisions_append_only`
- `sectors_hierarchy_guard`
- `timeline_claim_guard`

Application functions:

- `tat_block_history_mutation`
- `tat_date_precision_valid`
- `tat_enforce_indicator_claim_link`
- `tat_enforce_sector_hierarchy`
- `tat_enforce_structured_claim_link`
- `tat_enforce_timeline_claim_link`
- `tat_expected_public_group`
- `tat_require_level_two_sector`

Public views:

- `public_beneficiary_records`
- `public_claim_evidence`
- `public_financial_records`
- `public_record_catalog`

The three append-only history guards are present through `corrections_append_only`, `record_versions_append_only`, and `review_decisions_append_only`, all backed by `tat_block_history_mutation`.

## Audit implementation and stop conditions

`scripts/mission-10b/schema-catalog.mjs` normalizes catalog presentation only; it does not relax object semantics. Keys include table/object names, and row values include full definitions, types, nullability, defaults, column positions, generated state, FK delete actions, index predicates, trigger definitions, function identity/signature/body attributes, and view definitions.

`scripts/mission-10b/provision-cloud-sql-staging.mjs` requires:

- an empty target public schema before DDL;
- all fixed Mission 10B metric totals;
- zero catalog comparison issues;
- PostgreSQL major version 17 and the exact database name;
- successful credential rotation and network cleanup.

Any failed condition exits nonzero and prevents progression to SQL Connect activation.

## Post-brownfield re-certification

After `dataconnect:sql:setup` completed in brownfield mode, the live database was audited again over a Cloud SQL IAM connector using `scripts/mission-10b/audit-cloud-sql-via-iam.mjs`.

Results:

- canonical catalog differences: `0`;
- all certified totals above unchanged;
- `public` schema owner: `pg_database_owner`;
- `tat_staging` database owner: `cloudsqlsuperuser`;
- canonical table owners: 27/27 `postgres`;
- distinct canonical table owners: 1;
- `firebaseowner_tat_staging_public`: absent;
- SQL Connect writer/reader roles: present;
- SQL Connect service agent writer membership and SELECT/INSERT/UPDATE/DELETE privileges: present;
- canonical table rows before M02 ingestion: 0 across all 27 tables.

The subsequent `dataconnect:sql:diff` was validate-only and did not alter this catalog. No SQL Connect schema or connector deployment followed because the diff was destructive.

## Restart recovery verification — 2026-08-16

The same IAM connector audit was rerun with `--expect-empty` after the Codex desktop restart. It completed successfully and again reported:

- 27 tables and 372 columns;
- 27 primary keys, 33 uniqueness rules, and 65 foreign keys;
- 53 `RESTRICT` and 12 `CASCADE` delete actions;
- 128 checks, 91 indexes, eight special indexes, nine triggers, eight functions, and four views;
- 149 PostgreSQL-only controls;
- zero canonical catalog differences;
- zero rows across all 27 canonical tables;
- retained non-Firebase ownership and brownfield reader/writer roles.

This was a read-only catalog and row-count verification. Canonical DDL was not reapplied.

## Verdict

**CANONICAL POSTGRESQL CLOUD PARITY: PASS (100%)**
