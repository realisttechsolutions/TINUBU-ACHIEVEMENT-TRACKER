# TAT Mission 10B — SQL Connect Destructive Diff Analysis

**Recovery date:** 2026-08-16
**Project:** `tinubu-achievement-stg` only
**Service:** `tat-staging` / `us-central1`
**Database:** `tat-db-staging` / `tat_staging` / `public`
**Validation mode:** `COMPATIBLE`
**Canonical authority:** `database/schema.sql`
**Decision:** SQL Connect is **RESTRICTED**; full 27-table activation is blocked

## Recovery method and safety boundary

No complete raw diff log survived the desktop restart. The pre-restart aggregate evidence remained in `TAT_M10B_SQL_CONNECT_BROWNFIELD_ACTIVATION.md` and `TAT_M10B_COMPLETION_REPORT.md`.

The installed Firebase CLI help defines `dataconnect:sql:diff` as a command that displays differences between the local SQL Connect schema and the Cloud SQL schema. The current official deployment guide likewise distinguishes the display-only `sql:diff` step from the mutating `sql:migrate` step. The recovery therefore reran only:

```text
firebase dataconnect:sql:diff \
  --service tat-staging \
  --location us-central1 \
  --project tinubu-achievement-stg
```

The output was parsed in memory by `scripts/mission-10b/analyze-sql-connect-diff.mjs`. That audit tool contains no `sql:migrate`, deploy, import, DDL, or write-API invocation. No migration was accepted or executed.

Official references:

- [Deploy and manage SQL Connect schemas and connectors](https://firebase.google.com/docs/sql-connect/manage-schemas-and-connectors)
- [Integrate existing Cloud SQL databases](https://firebase.google.com/docs/sql-connect/manage-services-and-databases#integrate_existing_cloud_sql_for_postgresql_databases)
- [SQL Connect GraphQL directives](https://firebase.google.com/docs/reference/sql-connect/gql/directive)
- [SQL Connect configuration reference](https://firebase.google.com/docs/sql-connect/configuration-reference)

## Recovered plan totals

| Recovered item | Count | Safety result |
|---|---:|---|
| Table modification blocks | 27 | destructive |
| All blocks labeled `Destructive` by the CLI | 129 | unsafe |
| `DROP CONSTRAINT` clauses | 214 | unsafe |
| Canonical check constraints dropped | 128 | critical |
| Canonical unique constraints dropped | 33 | high |
| Canonical primary keys dropped | 0 | preserved |
| Canonical `RESTRICT` FKs dropped and replaced | 53 | critical |
| Proposed replacements using `CASCADE` | 30 | critical semantic change |
| Proposed replacements using `SET NULL` | 23 | critical semantic change |
| Canonical partial unique indexes dropped | 4 | critical/high |
| SQL Connect unique indexes created | 33 | noncanonical replacement |
| SQL Connect relation indexes created | 65 | additive/redundant |
| Column type/default/nullability alterations | 0 | preserved |
| Extension installs | 1 (`uuid-ossp`) | additive/noncanonical |
| Trigger drops | 0 | preserved by `COMPATIBLE` |
| Function drops | 0 | preserved by `COMPATIBLE` |
| View drops | 0 | preserved by `COMPATIBLE` |

The 214 constraint drops reconcile exactly as `128 CHECK + 33 UNIQUE + 53 FK`. The 98 index creations reconcile as `33 unique + 65 relation indexes`. The counts reproduce the pre-restart summary exactly.

## Category decision matrix

| Category | Evidence | Severity | Does `COMPATIBLE` prevent it? | Safe GraphQL adjustment? | Unavoidable in current full model? |
|---|---|---|---|---|---|
| 1. FK delete-action mismatch | 53 canonical `RESTRICT` FKs become 30 `CASCADE` + 23 `SET NULL` | Critical | No; the CLI treats the rewrites as required compatibility work | Constraint names can be customized, but delete actions cannot | Yes, while the 53 relations remain `@ref` fields |
| 2. Primary-key mismatch | 0 PK changes; all 27 canonical PKs remain | None | Not applicable | Existing `@table(key:)` mappings are adequate | No mismatch observed |
| 3. Unique-constraint mismatch | 33 canonical `UNIQUE` constraints are dropped and recreated as SQL Connect-named unique indexes | High | No | `@unique(indexName:)` can control names, but the recovered plan proves the current mapping is not equivalent | Material in the current schema; naming experiments alone cannot solve checks/FKs |
| 4. Nullability mismatch | 0 `ALTER COLUMN` clauses | None | Not applicable | No change needed | No mismatch observed |
| 5. Type/default mismatch | 0 column changes; one additive `uuid-ossp` install | Low for extension, otherwise none | No for the extension proposal | Defaults/types already map; extension is SQL Connect runtime metadata | Extension is avoidable only if the future schema/tooling no longer requires it |
| 6. PostgreSQL-only object deletion | 128 checks and four predicate unique indexes are removed | Critical | No | SQL Connect has no physical `CHECK` directive and no predicate option for `@unique`/`@index` | Yes for full base-table mapping |
| 7. Trigger/function loss | 0 of nine triggers and 0 of eight functions appear in the plan | None in this diff | Yes, as additional objects | No change needed | No loss proposed |
| 8. Index loss | Four canonical predicate unique indexes dropped; 98 new SQL Connect indexes added | Critical/high for four drops; low for additive indexes | No for the four drops | No directive expresses the four predicates | Yes for current mapping |
| 9. View loss | 0 of four canonical public views appear in the plan | None | Yes, as additional objects | Views can be mapped separately with `@view(name:)` | No loss proposed |
| 10. Schema-ownership conflict | No ownership DDL in the diff; Firebase owner role remains absent | None in this diff | Brownfield setup, not `COMPATIBLE`, protects ownership | Migration handling remains declined | Resolved at permission layer |
| 11. Unsupported GraphQL mapping | `@ref` exposes no delete-action argument; checks and partial-index predicates are not representable | Critical | No | Only by removing full-table relationship/write semantics or using a different access layer | Yes for full CRUD parity |
| 12. Harmless/additive metadata | 65 relation indexes plus `uuid-ossp` | Low, but noncanonical | No | Could be tolerated only after all destructive items reach zero | Not a standalone blocker |

`COMPATIBLE` prevented unknown tables, columns, triggers, functions, views, and several special indexes from being removed. It did **not** make checks, mapped uniqueness, predicate uniqueness, or `@ref` delete behavior optional. A zero exit status from `sql:diff` means the plan was generated successfully; it is not a compatibility pass.

## Appendix A — 128 canonical checks proposed for removal

For every item below, canonical behavior is the exact `CHECK` expression in `database/schema.sql`; the proposed behavior is complete removal with no physical replacement. Severity is **critical** because the checks enforce controlled vocabularies, cross-field consistency, numeric/date ranges, JSON shape, workflow invariants, hashes, URLs, and public/internal data rules. `COMPATIBLE` does not suppress these drops.

| Table | Count | Canonical check objects |
|---|---:|---|
| `achievement_profiles` | 1 | `achievement_profiles_featured_asset_url_check` |
| `actor_profiles` | 3 | `actor_profiles_actor_kind_check`, `actor_profiles_check`, `actor_profiles_status_check` |
| `actor_roles` | 4 | `actor_roles_check`, `actor_roles_check1`, `actor_roles_role_code_check`, `actor_roles_scope_type_check` |
| `beneficiary_records` | 6 | `beneficiary_records_beneficiary_stage_check`, `beneficiary_records_beneficiary_type_check`, `beneficiary_records_check`, `beneficiary_records_check1`, `beneficiary_records_count_basis_check`, `beneficiary_records_count_value_check` |
| `claim_source_relationships` | 6 | `claim_source_relationships_check`, `claim_source_relationships_check1`, `claim_source_relationships_evidence_summary_check`, `claim_source_relationships_relationship_type_check`, `claim_source_relationships_review_status_check`, `claim_source_relationships_source_role_check` |
| `corrections` | 4 | `corrections_check`, `corrections_check1`, `corrections_correction_type_check`, `corrections_lifecycle_status_check` |
| `evidence_claims` | 12 | `evidence_claims_check`, `evidence_claims_claim_text_check`, `evidence_claims_claim_type_check`, `evidence_claims_currency_code_check`, `evidence_claims_current_revision_check`, `evidence_claims_data_value_nature_check`, `evidence_claims_date_precision_check`, `evidence_claims_evidence_profile_check`, `evidence_claims_risk_level_check`, `evidence_claims_source_origin_check`, `evidence_claims_verification_status_check`, `evidence_claims_workflow_status_check` |
| `financial_records` | 7 | `financial_records_aggregation_basis_check`, `financial_records_amount_check`, `financial_records_check`, `financial_records_currency_code_check`, `financial_records_date_precision_check`, `financial_records_financial_type_check`, `financial_records_nominal_or_real_check` |
| `geographic_units` | 7 | `geographic_units_check`, `geographic_units_check1`, `geographic_units_check2`, `geographic_units_geography_type_check`, `geographic_units_latitude_check`, `geographic_units_longitude_check`, `geographic_units_sensitivity_class_check` |
| `indicator_observations` | 5 | `indicator_observations_check`, `indicator_observations_data_value_nature_check`, `indicator_observations_revision_check`, `indicator_observations_source_origin_check`, `indicator_observations_verification_status_check` |
| `indicators` | 2 | `indicators_frequency_check`, `indicators_slug_check` |
| `institutions` | 4 | `institutions_aliases_check`, `institutions_institution_type_check`, `institutions_official_url_check`, `institutions_slug_check` |
| `policy_details` | 1 | `policy_details_policy_type_check` |
| `programme_details` | 1 | `programme_details_programme_type_check` |
| `project_details` | 2 | `project_details_progress_percentage_check`, `project_details_project_type_check` |
| `record_geographies` | 3 | `record_geographies_confidence_check`, `record_geographies_coverage_role_check`, `record_geographies_sensitivity_class_check` |
| `record_institutions` | 2 | `record_institutions_check`, `record_institutions_role_code_check` |
| `record_relationships` | 3 | `record_relationships_check`, `record_relationships_check1`, `record_relationships_relationship_role_check` |
| `record_sectors` | 1 | `record_sectors_role_code_check` |
| `record_versions` | 3 | `record_versions_diff_json_check`, `record_versions_snapshot_json_check`, `record_versions_version_number_check` |
| `records` | 13 | `records_check`, `records_check1`, `records_current_revision_check`, `records_evidence_profile_check`, `records_implementation_status_check`, `records_publication_status_check`, `records_record_type_check`, `records_risk_level_check`, `records_slug_check`, `records_summary_check`, `records_title_check`, `records_verification_status_check`, `records_workflow_status_check` |
| `research_batches` | 8 | `research_batches_check`, `research_batches_contract_version_check`, `research_batches_manifest_json_check`, `research_batches_mode_check`, `research_batches_package_checksum_check`, `research_batches_plan_hash_check`, `research_batches_status_check`, `research_batches_taxonomy_version_check` |
| `review_decisions` | 6 | `review_decisions_check`, `review_decisions_decision_check`, `review_decisions_gate_code_check`, `review_decisions_record_revision_check`, `review_decisions_risk_level_check`, `review_decisions_subject_scope_check` |
| `sectors` | 4 | `sectors_check`, `sectors_code_check`, `sectors_taxonomy_level_check`, `sectors_vocabulary_version_check` |
| `source_files` | 5 | `source_files_byte_size_check`, `source_files_check`, `source_files_file_kind_check`, `source_files_sha256_check`, `source_files_visibility_class_check` |
| `sources` | 12 | `sources_archival_url_check`, `sources_check`, `sources_check1`, `sources_language_code_check`, `sources_metadata_check`, `sources_original_url_check`, `sources_publication_date_precision_check`, `sources_sha256_check`, `sources_source_level_check`, `sources_source_status_check`, `sources_source_type_check`, `sources_visibility_class_check` |
| `timeline_events` | 3 | `timeline_events_check`, `timeline_events_date_precision_check`, `timeline_events_event_type_check` |

## Appendix B — 33 canonical uniqueness rules proposed for replacement

Each listed PostgreSQL `UNIQUE` constraint presently enforces the named single/composite key and is part of the certified canonical catalog. SQL Connect proposes dropping it and creating a unique index with a different generated name. Uniqueness may remain at the raw value level, but constraint identity and canonical physical form do not. Severity is **high**, `COMPATIBLE` does not prevent the replacement, and no such replacement is authorized.

| Table | Count | Canonical unique constraints |
|---|---:|---|
| `actor_profiles` | 2 | `actor_profiles_external_id_key`, `actor_profiles_firebase_uid_key` |
| `beneficiary_records` | 2 | `beneficiary_records_external_id_key`, `beneficiary_records_record_id_beneficiary_stage_beneficiary_key` |
| `claim_source_relationships` | 2 | `claim_source_relationships_claim_id_source_id_source_role_r_key`, `claim_source_relationships_external_id_key` |
| `corrections` | 1 | `corrections_external_id_key` |
| `evidence_claims` | 1 | `evidence_claims_external_id_key` |
| `financial_records` | 2 | `financial_records_external_id_key`, `financial_records_record_id_claim_id_financial_type_currenc_key` |
| `geographic_units` | 2 | `geographic_units_code_key`, `geographic_units_external_id_key` |
| `indicator_observations` | 2 | `indicator_observations_external_id_key`, `indicator_observations_indicator_id_period_start_period_end_key` |
| `indicators` | 2 | `indicators_external_id_key`, `indicators_slug_key` |
| `institutions` | 2 | `institutions_external_id_key`, `institutions_slug_key` |
| `record_relationships` | 2 | `record_relationships_external_id_key`, `record_relationships_from_record_id_to_record_id_relationsh_key` |
| `record_versions` | 1 | `record_versions_record_id_version_number_key` |
| `records` | 2 | `records_external_id_key`, `records_slug_key` |
| `research_batches` | 3 | `research_batches_external_id_key`, `research_batches_idempotency_key_key`, `research_batches_package_checksum_key` |
| `review_decisions` | 2 | `review_decisions_external_id_key`, `review_decisions_record_id_record_revision_gate_code_review_key` |
| `sectors` | 1 | `sectors_code_key` |
| `source_files` | 2 | `source_files_bucket_name_object_path_object_generation_key`, `source_files_external_id_key` |
| `sources` | 1 | `sources_external_id_key` |
| `timeline_events` | 1 | `timeline_events_external_id_key` |

## Appendix C — 53 noncanonical FK delete-action rewrites

Every canonical FK below uses `ON DELETE RESTRICT`. SQL Connect derives delete behavior from GraphQL nullability: required `@ref` fields use `CASCADE`, while optional fields use `SET NULL`. Its documented `@ref` arguments permit constraint name, local fields, and referenced fields, but no delete-action override. Renaming can remove naming noise; it cannot preserve `RESTRICT`.

All 53 are **critical**, `COMPATIBLE` does not prevent them, and they are unavoidable while these relations remain in the full SQL Connect table model.

| # | Table.column → target | Canonical constraint/action | SQL Connect proposed constraint/action |
|---:|---|---|---|
| 1 | `actor_roles.actor_id → actor_profiles` | `actor_roles_actor_id_fkey` / `RESTRICT` | `actor_roles_actor_id_fkey` / `CASCADE` |
| 2 | `actor_roles.granted_by → actor_profiles` | `actor_roles_granted_by_fkey` / `RESTRICT` | `actor_roles_granted_by_id_fkey` / `SET NULL` |
| 3 | `beneficiary_records.claim_id → evidence_claims` | `beneficiary_records_claim_id_fkey` / `RESTRICT` | same / `CASCADE` |
| 4 | `beneficiary_records.created_by → actor_profiles` | `beneficiary_records_created_by_fkey` / `RESTRICT` | `beneficiary_records_created_by_id_fkey` / `CASCADE` |
| 5 | `beneficiary_records.geographic_unit_id → geographic_units` | `beneficiary_records_geographic_unit_id_fkey` / `RESTRICT` | same / `SET NULL` |
| 6 | `claim_source_relationships.created_by → actor_profiles` | `claim_source_relationships_created_by_fkey` / `RESTRICT` | `claim_source_relationships_created_by_id_fkey` / `CASCADE` |
| 7 | `claim_source_relationships.reviewed_by → actor_profiles` | `claim_source_relationships_reviewed_by_fkey` / `RESTRICT` | `claim_source_relationships_reviewed_by_id_fkey` / `SET NULL` |
| 8 | `claim_source_relationships.source_id → sources` | `claim_source_relationships_source_id_fkey` / `RESTRICT` | same / `CASCADE` |
| 9 | `claim_source_relationships.supersedes_relationship_id → claim_source_relationships` | `claim_source_relationships_supersedes_relationship_id_fkey` / `RESTRICT` | same / `SET NULL` |
| 10 | `corrections.approved_by → actor_profiles` | `corrections_approved_by_fkey` / `RESTRICT` | `corrections_approved_by_id_fkey` / `SET NULL` |
| 11 | `corrections.claim_id → evidence_claims` | `corrections_claim_id_fkey` / `RESTRICT` | same / `SET NULL` |
| 12 | `corrections.created_by → actor_profiles` | `corrections_created_by_fkey` / `RESTRICT` | `corrections_created_by_id_fkey` / `CASCADE` |
| 13 | `corrections.record_id → records` | `corrections_record_id_fkey` / `RESTRICT` | same / `CASCADE` |
| 14 | `corrections.reviewed_by → actor_profiles` | `corrections_reviewed_by_fkey` / `RESTRICT` | `corrections_reviewed_by_id_fkey` / `SET NULL` |
| 15 | `corrections.source_id → sources` | `corrections_source_id_fkey` / `RESTRICT` | same / `SET NULL` |
| 16 | `evidence_claims.created_by → actor_profiles` | `evidence_claims_created_by_fkey` / `RESTRICT` | `evidence_claims_created_by_id_fkey` / `CASCADE` |
| 17 | `evidence_claims.geographic_unit_id → geographic_units` | `evidence_claims_geographic_unit_id_fkey` / `RESTRICT` | same / `SET NULL` |
| 18 | `financial_records.claim_id → evidence_claims` | `financial_records_claim_id_fkey` / `RESTRICT` | same / `CASCADE` |
| 19 | `financial_records.created_by → actor_profiles` | `financial_records_created_by_fkey` / `RESTRICT` | `financial_records_created_by_id_fkey` / `CASCADE` |
| 20 | `financial_records.geographic_unit_id → geographic_units` | `financial_records_geographic_unit_id_fkey` / `RESTRICT` | same / `SET NULL` |
| 21 | `geographic_units.parent_geographic_unit_id → geographic_units` | `geographic_units_parent_geographic_unit_id_fkey` / `RESTRICT` | same / `SET NULL` |
| 22 | `indicator_observations.claim_id → evidence_claims` | `indicator_observations_claim_id_fkey` / `RESTRICT` | same / `CASCADE` |
| 23 | `indicator_observations.created_by → actor_profiles` | `indicator_observations_created_by_fkey` / `RESTRICT` | `indicator_observations_created_by_id_fkey` / `CASCADE` |
| 24 | `indicator_observations.geographic_unit_id → geographic_units` | `indicator_observations_geographic_unit_id_fkey` / `RESTRICT` | same / `SET NULL` |
| 25 | `indicator_observations.indicator_id → indicators` | `indicator_observations_indicator_id_fkey` / `RESTRICT` | same / `CASCADE` |
| 26 | `indicators.created_by → actor_profiles` | `indicators_created_by_fkey` / `RESTRICT` | `indicators_created_by_id_fkey` / `CASCADE` |
| 27 | `indicators.sector_id → sectors` | `indicators_sector_id_fkey` / `RESTRICT` | same / `SET NULL` |
| 28 | `indicators.source_institution_id → institutions` | `indicators_source_institution_id_fkey` / `RESTRICT` | same / `SET NULL` |
| 29 | `institutions.parent_institution_id → institutions` | `institutions_parent_institution_id_fkey` / `RESTRICT` | same / `SET NULL` |
| 30 | `record_geographies.geographic_unit_id → geographic_units` | `record_geographies_geographic_unit_id_fkey` / `RESTRICT` | same / `CASCADE` |
| 31 | `record_institutions.institution_id → institutions` | `record_institutions_institution_id_fkey` / `RESTRICT` | same / `CASCADE` |
| 32 | `record_relationships.created_by → actor_profiles` | `record_relationships_created_by_fkey` / `RESTRICT` | `record_relationships_created_by_id_fkey` / `CASCADE` |
| 33 | `record_relationships.from_record_id → records` | `record_relationships_from_record_id_fkey` / `RESTRICT` | same / `CASCADE` |
| 34 | `record_relationships.to_record_id → records` | `record_relationships_to_record_id_fkey` / `RESTRICT` | same / `CASCADE` |
| 35 | `record_sectors.sector_id → sectors` | `record_sectors_sector_id_fkey` / `RESTRICT` | same / `CASCADE` |
| 36 | `record_versions.changed_by → actor_profiles` | `record_versions_changed_by_fkey` / `RESTRICT` | `record_versions_changed_by_id_fkey` / `CASCADE` |
| 37 | `record_versions.record_id → records` | `record_versions_record_id_fkey` / `RESTRICT` | same / `CASCADE` |
| 38 | `record_versions.research_batch_id → research_batches` | `record_versions_research_batch_fk` / `RESTRICT` | `record_versions_research_batch_id_fkey` / `SET NULL` |
| 39 | `records.created_by → actor_profiles` | `records_created_by_fkey` / `RESTRICT` | `records_created_by_id_fkey` / `CASCADE` |
| 40 | `research_batches.approved_by → actor_profiles` | `research_batches_approved_by_fkey` / `RESTRICT` | `research_batches_approved_by_id_fkey` / `SET NULL` |
| 41 | `research_batches.submitted_by → actor_profiles` | `research_batches_submitted_by_fkey` / `RESTRICT` | `research_batches_submitted_by_id_fkey` / `CASCADE` |
| 42 | `review_decisions.claim_id → evidence_claims` | `review_decisions_claim_id_fkey` / `RESTRICT` | same / `SET NULL` |
| 43 | `review_decisions.record_id → records` | `review_decisions_record_id_fkey` / `RESTRICT` | same / `CASCADE` |
| 44 | `review_decisions.relationship_id → claim_source_relationships` | `review_decisions_relationship_id_fkey` / `RESTRICT` | same / `SET NULL` |
| 45 | `review_decisions.reviewer_id → actor_profiles` | `review_decisions_reviewer_id_fkey` / `RESTRICT` | same / `CASCADE` |
| 46 | `sectors.parent_sector_id → sectors` | `sectors_parent_sector_id_fkey` / `RESTRICT` | same / `SET NULL` |
| 47 | `source_files.captured_by → actor_profiles` | `source_files_captured_by_fkey` / `RESTRICT` | `source_files_captured_by_id_fkey` / `CASCADE` |
| 48 | `source_files.source_id → sources` | `source_files_source_id_fkey` / `RESTRICT` | same / `CASCADE` |
| 49 | `source_files.supersedes_file_id → source_files` | `source_files_supersedes_file_id_fkey` / `RESTRICT` | same / `SET NULL` |
| 50 | `sources.created_by → actor_profiles` | `sources_created_by_fkey` / `RESTRICT` | `sources_created_by_id_fkey` / `CASCADE` |
| 51 | `sources.publisher_institution_id → institutions` | `sources_publisher_institution_id_fkey` / `RESTRICT` | same / `SET NULL` |
| 52 | `timeline_events.claim_id → evidence_claims` | `timeline_events_claim_id_fkey` / `RESTRICT` | same / `SET NULL` |
| 53 | `timeline_events.created_by → actor_profiles` | `timeline_events_created_by_fkey` / `RESTRICT` | `timeline_events_created_by_id_fkey` / `CASCADE` |

The other 12 canonical FKs already use `CASCADE`; they do not appear in the plan and remain preserved.

## Appendix D — index changes

### Four canonical predicate unique indexes proposed for deletion

| Index | Canonical behavior | Proposed behavior | Severity / safe adjustment |
|---|---|---|---|
| `actor_roles_active_assignment_uidx` | Unique `(actor_id, role_code, scope_type, scope_key)` only while `revoked_at IS NULL` | Drop with no equivalent | Critical; prevents multiple active assignments; GraphQL has no predicate-unique control |
| `record_sectors_one_primary_uidx` | At most one `primary` sector per record | Drop with no equivalent | Critical; GraphQL has no predicate-unique control |
| `sources_document_number_uidx` | Unique non-null `document_number` | Drop with no equivalent | High; conditional source identity rule would be lost |
| `sources_original_url_uidx` | Unique non-null `original_url` | Drop with no equivalent | High; conditional source identity rule would be lost |

Four other special indexes are absent from the plan and therefore preserved: `indicators_sector_name_idx`, `institutions_name_type_idx`, `records_search_idx`, and `sources_search_idx`.

### 33 replacement unique indexes

These are one-for-one SQL Connect representations of the 33 canonical uniqueness rules, but with generated index names and noncanonical physical form. They do not compensate for the four predicate unique indexes.

| Table | Proposed indexes |
|---|---|
| `actor_profiles` | `actor_profiles_externalId_uidx`, `actor_profiles_firebaseUid_uidx` |
| `beneficiary_records` | `beneficiary_records_externalId_uidx`, `beneficiary_records_recordId_beneficiaryicUnitId_cohortKey_uidx` |
| `claim_source_relationships` | `claim_source_relationships_claimId_source_evidenceLocation_uidx`, `claim_source_relationships_externalId_uidx` |
| `corrections` | `corrections_externalId_uidx` |
| `evidence_claims` | `evidence_claims_externalId_uidx` |
| `financial_records` | `financial_records_externalId_uidx`, `financial_records_recordId_claimId_finand_aggregationBasis_uidx` |
| `geographic_units` | `geographic_units_code_uidx`, `geographic_units_externalId_uidx` |
| `indicator_observations` | `indicator_observations_externalId_uidx`, `indicator_observations_indicatorId_periolueNature_revision_uidx` |
| `indicators` | `indicators_externalId_uidx`, `indicators_slug_uidx` |
| `institutions` | `institutions_externalId_uidx`, `institutions_slug_uidx` |
| `record_relationships` | `record_relationships_externalId_uidx`, `record_relationships_fromRecordId_toRecod_relationshipRole_uidx` |
| `record_versions` | `record_versions_recordId_versionNumber_uidx` |
| `records` | `records_externalId_uidx`, `records_slug_uidx` |
| `research_batches` | `research_batches_externalId_uidx`, `research_batches_idempotencyKey_uidx`, `research_batches_packageChecksum_uidx` |
| `review_decisions` | `review_decisions_externalId_uidx`, `review_decisions_recordId_recordRevisionateCode_reviewerId_uidx` |
| `sectors` | `sectors_code_uidx` |
| `source_files` | `source_files_bucketName_objectPath_objectGeneration_uidx`, `source_files_externalId_uidx` |
| `sources` | `sources_externalId_uidx` |
| `timeline_events` | `timeline_events_externalId_uidx` |

### 65 additive relation indexes

The CLI proposes one ordinary relation index per canonical FK. These are generally performance metadata rather than integrity changes, but several are redundant with primary/unique indexes and all are noncanonical until deliberately accepted. They are not a safety blocker by themselves; the coupled destructive plan is the blocker.

| Table | Count | Proposed relation indexes |
|---|---:|---|
| `achievement_profiles` | 1 | `achievement_profiles_recordId_idx` |
| `actor_roles` | 2 | `actor_roles_actorId_idx`, `actor_roles_grantedById_idx` |
| `beneficiary_records` | 4 | `beneficiary_records_claimId_idx`, `beneficiary_records_createdById_idx`, `beneficiary_records_geographicUnitId_idx`, `beneficiary_records_recordId_idx` |
| `claim_source_relationships` | 5 | `claim_source_relationships_claimId_idx`, `claim_source_relationships_createdById_idx`, `claim_source_relationships_reviewedById_idx`, `claim_source_relationships_sourceId_idx`, `claim_source_relationships_supersedesRelationshipId_idx` |
| `corrections` | 6 | `corrections_approvedById_idx`, `corrections_claimId_idx`, `corrections_createdById_idx`, `corrections_recordId_idx`, `corrections_reviewedById_idx`, `corrections_sourceId_idx` |
| `evidence_claims` | 3 | `evidence_claims_createdById_idx`, `evidence_claims_geographicUnitId_idx`, `evidence_claims_recordId_idx` |
| `financial_records` | 4 | `financial_records_claimId_idx`, `financial_records_createdById_idx`, `financial_records_geographicUnitId_idx`, `financial_records_recordId_idx` |
| `geographic_units` | 1 | `geographic_units_parentGeographicUnitId_idx` |
| `indicator_observations` | 4 | `indicator_observations_claimId_idx`, `indicator_observations_createdById_idx`, `indicator_observations_geographicUnitId_idx`, `indicator_observations_indicatorId_idx` |
| `indicators` | 3 | `indicators_createdById_idx`, `indicators_sectorId_idx`, `indicators_sourceInstitutionId_idx` |
| `institutions` | 1 | `institutions_parentInstitutionId_idx` |
| `policy_details` | 1 | `policy_details_recordId_idx` |
| `programme_details` | 1 | `programme_details_recordId_idx` |
| `project_details` | 1 | `project_details_recordId_idx` |
| `record_geographies` | 2 | `record_geographies_geographicUnitId_idx`, `record_geographies_recordId_idx` |
| `record_institutions` | 2 | `record_institutions_institutionId_idx`, `record_institutions_recordId_idx` |
| `record_relationships` | 3 | `record_relationships_createdById_idx`, `record_relationships_fromRecordId_idx`, `record_relationships_toRecordId_idx` |
| `record_sectors` | 2 | `record_sectors_recordId_idx`, `record_sectors_sectorId_idx` |
| `record_versions` | 3 | `record_versions_changedById_idx`, `record_versions_recordId_idx`, `record_versions_researchBatchId_idx` |
| `records` | 1 | `records_createdById_idx` |
| `research_batches` | 2 | `research_batches_approvedById_idx`, `research_batches_submittedById_idx` |
| `review_decisions` | 4 | `review_decisions_claimId_idx`, `review_decisions_recordId_idx`, `review_decisions_relationshipId_idx`, `review_decisions_reviewerId_idx` |
| `sectors` | 1 | `sectors_parentSectorId_idx` |
| `source_files` | 3 | `source_files_capturedById_idx`, `source_files_sourceId_idx`, `source_files_supersedesFileId_idx` |
| `sources` | 2 | `sources_createdById_idx`, `sources_publisherInstitutionId_idx` |
| `timeline_events` | 3 | `timeline_events_claimId_idx`, `timeline_events_createdById_idx`, `timeline_events_recordId_idx` |

## Viability decision

### A. Safe full-model fix available — rejected

Custom `@ref(constraintName:)` and `@unique(indexName:)` values could remove some naming differences. They cannot express `ON DELETE RESTRICT`, 128 physical checks, or the four predicate unique indexes. The full 27-table GraphQL schema therefore cannot reach a zero-destructive diff without weakening canonical PostgreSQL semantics.

### B. Read/API-only use with restrictions — technically viable, not yet activated

SQL Connect officially supports mapping an existing PostgreSQL view with `@view(name:)`, and views cannot be mutated. A separately authorized schema could expose only the four canonical public projection views:

- `public_beneficiary_records`;
- `public_claim_evidence`;
- `public_financial_records`;
- `public_record_catalog`.

This would deliberately omit base-table CRUD, relationship traversal, staff mutations, and M02 ingestion. It must remain a future experiment until a view-only `COMPATIBLE` diff proves zero destructive physical changes. No such schema was created or deployed in M10B recovery.

### C. Full application/data layer suitability — rejected

SQL Connect is not suitable as the full write/read access layer for this canonical database under current semantics. In particular, it cannot safely own M02 ingestion or internal write operations.

**Overall SQL Connect viability: RESTRICTED.** The brownfield permission foundation is valid, but application schema and connector activation remain blocked.

## Smallest viable layer for required writes and full reads

The smallest practical full-access alternative is the existing Next.js server boundary using `pg` through the Cloud SQL Node.js Connector, with automatic IAM database authentication and a dedicated least-privilege database role. Route Handlers/Server Components would expose only reviewed APIs; PostgreSQL would continue enforcing all canonical controls. The same server-side data layer could later host the controlled M02 importer.

Cloud Run is the natural deployment target if the application runtime cannot host the connector directly. Google documents that Cloud SQL language connectors provide encrypted connections and IAM-based authorization without authorized networks.

References:

- [Cloud SQL language connectors for PostgreSQL](https://cloud.google.com/sql/docs/postgres/connect-connectors)
- [Connect from Cloud Run to Cloud SQL for PostgreSQL](https://cloud.google.com/sql/docs/postgres/connect-run)
- [IAM database authentication](https://cloud.google.com/sql/docs/postgres/iam-authentication)

This alternative is an architectural recommendation only. It was not implemented, deployed, or granted IAM access in Mission 10B recovery.

## Stop decision

- Do not run `dataconnect:sql:migrate`.
- Do not deploy the current SQL Connect schema or connectors.
- Do not use `--force`, `STRICT`, or `NONE` to bypass the gate.
- Do not ingest M02 through SQL Connect.
- Do not deploy App Hosting.
- Do not touch production.

**DESTRUCTIVE DIFF RECOVERY: PASS**

**FULL SQL CONNECT ACTIVATION: BLOCKED**

**SQL CONNECT VIABILITY: RESTRICTED TO A FUTURE READ-ONLY VIEW SURFACE**
