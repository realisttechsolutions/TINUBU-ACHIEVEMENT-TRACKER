# Codex Mission 01 Firebase SQL Connect Database Review

**Verdict:** Firebase SQL Connect is suitable for the MVP, but the proposed 35-entity Supabase map is not implementation-ready. Adopt a 27-table MVP (23 required plus 4 supporting) built around a canonical `records` table, typed extensions, claim-level evidence, and explicit workflow history.

This is a logical design review, not production DDL or a migration.

## Suitability assessment

SQL Connect meets the central requirements:

- Cloud SQL for PostgreSQL provides relational storage, foreign keys, unique constraints, indexes, transactions, backups/exports and established SQL reporting paths.
- SQL Connect schema directives support tables, references, composite keys, unique constraints and indexes, including join tables.
- Connector queries support filters, ordering, pagination, regular-expression/string search, aggregations and PostgreSQL-backed full-text search.
- Mutations can be transactional, and authorization queries/checks can participate in the transaction.
- Web and React clients use operation-specific generated SDK types rather than a generic database client.
- Admin SDK bulk operations and local SQL Connect emulation support future controlled ingestion.

Material constraints to design for:

- Client access is through predefined connector operations, not arbitrary SQL.
- Authorization is operation-level; it is not a copy of Supabase/PostgreSQL RLS.
- Schema migrations must be coordinated through SQL Connect. Direct schema changes can make the SQL Connect schema/connectors incompatible.
- Exact PostgreSQL decimal values must not be casually converted to JavaScript `number`; financial writes should be privileged and public SDK projections should return exact decimal strings/formatted values where necessary.
- Cloud SQL is continuously provisioned infrastructure with backup, region, availability and cost ownership.

## Core record decision

Use one canonical `records` table with typed subtype extensions. Do not retain four unrelated primary tables with duplicated title, slug, publication, sector, evidence and audit columns.

Recommended semantics:

- A `record` is the canonical research subject.
- Exactly one principal subtype extension describes a policy, project or programme when applicable.
- Institutional reforms and reported outcomes can initially live as typed records without an extension; add an extension only when subtype-specific fields justify it.
- `achievement_profiles` is an optional one-to-one editorial/public presentation layered on any qualifying record. “Achievement” is not mutually exclusive with “project”, “policy” or “programme”.
- `record_relationships` represents implements, enabled-by, phase-of, outcome-of, supersedes and related-context links.

This structure gives every claim, source, geography, financial value, beneficiary count, timeline event and correction one stable `record_id`. It also avoids duplicate evidence when a project is presented as an achievement.

Separate primary tables would make simple subtype inserts marginally easier, but would require polymorphic `entity_type/entity_id` columns without enforceable foreign keys or multiple parallel join tables. The canonical base plus extensions is superior for integrity, search, routing, imports, analytics, generated SDK operations and maintenance.

## Recommended MVP inventory: 27 tables

| # | Table | Class | Key design, constraints and principal indexes |
|---:|---|---|---|
| 1 | `actor_profiles` | MVP_REQUIRED | UUID PK; nullable unique `firebase_uid`; actor kind; status; display identity. Index active Firebase UID. |
| 2 | `actor_roles` | MVP_REQUIRED | UUID PK; FKs actor/grantor; role code, scope, valid/revoked times. Unique active assignment; indexes actor/role/scope. |
| 3 | `sectors` | MVP_REQUIRED | UUID PK; self-FK parent; `taxonomy_level`; slug; label; public order. Unique `(parent_id, slug)`; indexes parent/level/active. Holds public groups, canonical sectors and subsectors. |
| 4 | `institutions` | MVP_REQUIRED | UUID PK; unique slug; name, acronym, category, website, active dates. Index normalized name/category. |
| 5 | `records` | MVP_REQUIRED | UUID PK; globally unique slug; record kind; title/copy; implementation, publication, risk and evidence-profile state; author; revision. Index published+kind, status, updated, title search. |
| 6 | `policy_details` | MVP_REQUIRED | `record_id` PK/FK; policy type, legal authority, reference, effect scope. Legal-event dates live in `timeline_events`. |
| 7 | `project_details` | MVP_REQUIRED | `record_id` PK/FK; project type, progress percentage, contract/project references, location narrative. Check progress 0-100. |
| 8 | `programme_details` | MVP_REQUIRED | `record_id` PK/FK; programme type, target group narrative, enrolment/disbursement model. Financial envelope belongs in `financial_records`. |
| 9 | `achievement_profiles` | MVP_REQUIRED | `record_id` PK/FK; public impact narrative, qualification, featured asset, display priority. Only approved qualifying records receive a row. |
| 10 | `record_institutions` | MVP_REQUIRED | Composite PK `(record_id, institution_id, role_code)`; FKs; valid dates. Index institution+role. |
| 11 | `record_sectors` | MVP_REQUIRED | Composite PK `(record_id, sector_id, role_code)`; exactly one primary canonical sector per record; additional cross-sector rows allowed. Index sector+published record query. |
| 12 | `geographic_units` | MVP_REQUIRED | UUID PK; self-FK parent; unique stable code; type, name, precision, optional geometry/centroid, sensitivity. Index parent/type/code. |
| 13 | `record_geographies` | MVP_REQUIRED | Composite PK `(record_id, geographic_unit_id, coverage_role)`; confidence, qualification, sensitivity. Index geography+record. |
| 14 | `record_relationships` | MVP_SUPPORTING | UUID PK; from/to record FKs, relationship type, valid dates. Unique directed relationship; indexes both directions. |
| 15 | `sources` | MVP_REQUIRED | UUID PK; canonical identifier/URL; title, publisher institution, source type/tier, publication precision, dates, language, status. Unique normalized URL/document number where present; full-text/title indexes. |
| 16 | `source_files` | MVP_SUPPORTING | UUID PK; source FK; bucket/path/generation, visibility, kind, MIME, bytes, hash, copyright/retention. Unique `(bucket, path, generation)`; index source/visibility. |
| 17 | `evidence_claims` | MVP_REQUIRED | UUID PK; record FK; atomic claim type/text; structured values; reporting/geography; classification split; limitation; verification; version. Index record/status/type/period/geography. |
| 18 | `claim_source_relationships` | MVP_REQUIRED | UUID PK; claim/source FKs; source role, relationship type, location, summary, review state/actor/time. Unique normalized claim-source-role-location; indexes claim and source. |
| 19 | `financial_records` | MVP_REQUIRED | UUID PK; record/claim/geography FKs; financial type; exact amount/currency; period and aggregation basis. Index record/type/period/geography; no negative amount. |
| 20 | `beneficiary_records` | MVP_REQUIRED | UUID PK; record/claim/geography FKs; stage/type/count/unit; period/cumulative basis; cohort key. Index record/stage/period/geography; non-negative integer count. |
| 21 | `indicators` | MVP_REQUIRED | UUID PK; unique slug; name, definition, unit, methodology, sector, source institution. Index sector/name. |
| 22 | `indicator_observations` | MVP_REQUIRED | UUID PK; indicator/claim/geography FKs; exact numeric/display value; period/classification. Unique indicator+period+geography+classification+revision; time-series index. |
| 23 | `timeline_events` | MVP_REQUIRED | UUID PK; record FK; event kind, date precision/value/range/label, title/body, source claim. Index record/date and public chronology. Includes milestones. |
| 24 | `corrections` | MVP_REQUIRED | UUID PK; record/claim FK; correction type, old/new value, reason, source/reviewer, effective/public dates. Immutable; index record/date/public. |
| 25 | `record_versions` | MVP_SUPPORTING | UUID PK; record FK; version number, changed-by, reason, snapshot/diff JSON, created time. Unique record+version; immutable. |
| 26 | `review_decisions` | MVP_REQUIRED | UUID PK; record/claim/relationship optional FKs; revision, gate, decision, reviewer, rationale, time. Unique reviewer+subject+revision+gate; index approval lookup. |
| 27 | `research_batches` | MVP_SUPPORTING | UUID PK; idempotency key; template/schema version; checksum; mode/status; actor; counts/times/artifact paths. Unique idempotency/checksum policy; index status/time. |

`MVP_SUPPORTING` tables are included in the recommended 27-table deployable MVP because relationships, source files, version traceability and import batches materially reduce operational risk. If storage is deferred, `source_files` may be created empty or postponed without blocking public evidence citations.

## Classification of all 35 proposed entities

| Proposed entity | Classification | Disposition |
|---|---|---|
| `profiles` | REMOVE_OR_MERGE | Merge with `research_actors` into `actor_profiles`; Firebase UID is unique but nullable. |
| `research_actors` | REMOVE_OR_MERGE | Merge into `actor_profiles`; include human, AI and service actor kinds. |
| `institutions` | MVP_REQUIRED | Retain. |
| `institution_aliases` | PHASE_2 | Add when real entity-resolution volume justifies it. |
| `sectors` | MVP_REQUIRED | Retain as hierarchical table containing all taxonomy levels. |
| `subsectors` | REMOVE_OR_MERGE | Merge into hierarchical `sectors`. |
| `geographic_units` | MVP_REQUIRED | Retain with parent hierarchy and sensitivity. |
| `geographic_aliases` | PHASE_2 | Add for import/entity resolution. |
| `geographic_coverages` | REMOVE_OR_MERGE | Replace with `record_geographies`. |
| `policies` | REMOVE_OR_MERGE | Replace with `records` + `policy_details`. |
| `projects` | REMOVE_OR_MERGE | Replace with `records` + `project_details`. |
| `programmes` | REMOVE_OR_MERGE | Replace with `records` + `programme_details`. |
| `achievements` | REMOVE_OR_MERGE | Replace with `records` + optional `achievement_profiles`. |
| `indicators` | MVP_REQUIRED | Retain. |
| `indicator_observations` | MVP_REQUIRED | Retain; link observation to an evidence claim. |
| `timeline_events` | MVP_REQUIRED | Retain. |
| `milestones` | REMOVE_OR_MERGE | Model as a `timeline_events.event_kind`. |
| `beneficiary_records` | MVP_REQUIRED | Retain and strengthen. |
| `financial_records` | MVP_REQUIRED | Retain and strengthen. |
| `sources` | MVP_REQUIRED | Retain. |
| `source_files` | MVP_SUPPORTING | Retain only if Storage/source archiving is approved. |
| `source_snapshots` | REMOVE_OR_MERGE | Represent as `source_files.file_kind = snapshot` or an archive URL on source metadata. |
| `source_relationships` | REMOVE_OR_MERGE | Duplicate of `claim_source_relationships`; remove direct record-source attribution. |
| `evidence_claims` | MVP_REQUIRED | Move from “Later” to required; evidence is not MVP-safe without it. |
| `claim_source_relationships` | MVP_REQUIRED | Move from “Later” to required. |
| `reports` | PHASE_2 | Treat generated reports as publication assets until a catalog is required. |
| `datasets` | PHASE_2 | Treat generated datasets as publication assets until a catalog is required. |
| `methodologies` | PHASE_2 | Keep versioned Markdown initially; add table only for runtime-managed methods. |
| `corrections` | MVP_REQUIRED | Retain; consolidate the duplicate “Correction Record” concept. |
| `record_versions` | MVP_SUPPORTING | Retain basic immutable snapshot/diff history. |
| `research_tasks` | PHASE_2 | External task management or later workflow table. |
| `research_batches` | MVP_SUPPORTING | Retain for idempotent imports. |
| `review_decisions` | MVP_REQUIRED | Retain for human approval and separation of duties. |
| `data_gaps` | PHASE_2 | Useful research backlog, not publication MVP runtime. |
| `freshness_reviews` | PHASE_2 | Initially compute due status from verification timestamps; add scheduled review log later. |

Missing from the 35-entity map and added to the 27-table design: `actor_roles`, `record_institutions`, `record_sectors`, `record_relationships`, and the four subtype/presentation extension tables.

## Exact claim-level evidence structure

### `evidence_claims`

Required fields:

- `id`, `record_id`, `claim_type`, `claim_text`
- `value_numeric`, `value_text`, `unit_code` (at least claim text; structured value optional)
- `currency_code` when the value is monetary
- `date_value`, `date_precision`, `period_start`, `period_end`, `reporting_period_label`, `period_is_provisional`
- nullable `geographic_unit_id` plus scope/qualification
- `value_nature`: actual, provisional, estimated, projected, target, calculated or modelled
- `reporting_origin`: government, independent, mixed or unknown
- `verification_status`, `risk_level`, `limitations`
- `created_by`, `created_at`, `current_revision`, `withdrawn_at`

Do not place `source_id` on the claim. A required claim-side `source_id` conflicts with the mandated many-to-many model.

### `claim_source_relationships`

Required fields:

- `id`, `claim_id`, `source_id`
- `source_role`: primary, official_statistical, direct_implementation, independent_assessment, corroborating, supporting, contextual, contradictory, replacement, archived or discovery_lead
- `relationship_type`: supports, contradicts, replaces, contextualises or discovery_only
- `evidence_location`: page/section/table/paragraph locator, not copied source content
- `evidence_summary`: short researcher-authored explanation
- `review_status`, `reviewed_at`, `reviewed_by`
- `created_at`, `created_by`, optional `supersedes_relationship_id`

Store a concise locator and summary, plus a lawful file/archive reference when approved. Do not copy long copyrighted passages into `claim_text` or `evidence_summary`.

The model supports one record to many claims, one claim to many sources, one source to many claims, and different roles for the same source on different claims. Contradictory and replacement relationships remain first-class rather than overwriting prior evidence.

## Financial model

Use exactly distinguishable financial types:

1. `budget_allocation`
2. `approved_funding`
3. `funding_released`
4. `reported_expenditure`
5. `contract_value`
6. `programme_envelope`
7. `public_investment`
8. `private_investment`
9. `revenue_generated`
10. `revenue_estimate`
11. `savings_estimate`

Required structure: `record_id`, supporting `claim_id`, `financial_type`, exact `amount`, ISO 4217 currency, period fields, geography, `aggregation_basis` (`period`/`cumulative`), coverage/cohort, and notes on nominal/real basis. Use PostgreSQL `NUMERIC(24,4)` (or an approved minor-unit `BIGINT` representation) and never binary floating point as the authoritative amount. Generated client operations should return exact strings/formatted values if SDK number conversion could lose precision.

Database checks can ensure positive values, known type, currency shape and valid periods. Trusted ingestion rules must additionally prohibit treating a row of one type as evidence for another. Aggregations must never sum across currencies, financial types, overlapping periods/geographies, or cumulative and period values without an explicit method.

## Beneficiary model

Stages must include:

- `applicant`
- `registered_participant`
- `eligible_applicant`
- `approved_beneficiary`
- `disbursement_recipient`
- `active_beneficiary`

Required fields: beneficiary type, stage, non-negative integer `count_value`, unit, period, geography, `count_basis` (`period`/`cumulative`), cohort key, source claim, methodology and double-counting limitation. A unique constraint across record/stage/type/period/geography/cohort/revision prevents exact duplicate rows. Cross-stage counts are never added. Imports should reject an active/disbursement count sourced only by an applicant/registration claim.

## Date and reporting periods

Do not store dates solely in unconstrained strings. Use:

- `date_value DATE NULL` for an exact day or a normalized anchor when appropriate.
- `date_precision` fixed value: exact_day, month, quarter, year, fiscal_year, range or unknown.
- `period_start DATE NULL` and `period_end DATE NULL` for known bounds.
- `reporting_period_label TEXT` preserving “Q2 2024”, “FY2023/24”, or a source's provisional wording.
- `period_is_provisional BOOLEAN`.

Unknown day/month components remain null; the label preserves the source representation. Validate consistency, such as exact day requiring `date_value`, range requiring start/end, and start not after end.

Announcement, approval, enactment, funding, commencement, completion, operation and outcome reporting are distinct `timeline_events.event_kind` rows. Do not overwrite one generic record date as the record advances.

## Controlled vocabulary placement

| Kind | Recommended representation | Examples |
|---|---|---|
| Fixed technical values | Small database CHECK/enum plus generated code constants | date precision, relationship direction, visibility class, period/cumulative basis |
| Relational lookup | Table row with label, definition, active/version metadata | hierarchical sectors, institutions, geography, configurable beneficiary types |
| Configurable taxonomy | Versioned lookup or hierarchical table | policy/project/programme subtypes, claim types, source types |
| Workflow state | Explicit state code plus allowed transition logic and immutable decisions | publication status, verification status, review decision |
| Ordinary content | Text/value columns | title, evidence summary, limitation, qualification, evidence location |

The current `data_classification` combines value nature, reporting origin and lifecycle. Split it. `corrected` and `withdrawn` are lifecycle states; `government_reported` and `independently_reported` are origins; `actual`, `provisional`, `estimated`, `projected`, `target`, `calculated` and `modelled` describe value nature.

## Import order

1. `actor_profiles`, `actor_roles`, `sectors`, `institutions`, `geographic_units`.
2. `sources`; optionally `source_files`.
3. `research_batches`.
4. `records` and subtype/achievement extensions.
5. `record_institutions`, `record_sectors`, `record_geographies`, `record_relationships`.
6. `evidence_claims`.
7. `claim_source_relationships`.
8. `financial_records`, `beneficiary_records`, `indicators`, `indicator_observations`, `timeline_events`.
9. `review_decisions`, `record_versions`, `corrections` as their triggering workflow executes.

No batch moves to commit unless every foreign key resolves, duplicate/idempotency checks pass, and the database transaction plus resulting counts match the dry-run plan.

## Expected query patterns and indexes

- Public catalogue by publication state, public group/canonical sector, record kind, implementation status, geography and recency.
- Record detail by slug with subtype, achievement profile, institutions, sectors, geographies, claims and public source citations.
- Full-text search over record title/summary/body and source title; apply publication/sensitivity filters inside the operation.
- Timeline by date bounds/event kind/sector.
- Indicator series by indicator/geography/period.
- Financial and beneficiary summaries grouped only by compatible type/currency/unit/period basis.
- Editorial queues by risk, review gate, assignee, stale verification and unresolved contradiction.
- Source impact: all claims/records supported, contradicted or replaced by a source.

Create composite indexes from measured query plans, starting with publication filters, sector/geography joins, record/date chronology, indicator series, claim verification queues, and source reverse lookup. Avoid redundant indexes on unique keys.

## Cloud SQL operations

- Select the SQL Connect service and Cloud SQL instance in the same approved region.
- Use local emulator/PGlite for development and a separate staging project/database.
- Enable and test automated backups and point-in-time recovery before production imports.
- Define retention and export procedures; Cloud SQL import/export can block other operations unless planned appropriately.
- Start with a cost-appropriate instance, monitor CPU/connections/storage/query latency, and scale based on evidence.
- High availability is a business decision; document acceptable recovery time/data loss before production.

## Final database verdict

**CONDITIONAL PASS.** The SQL Connect hypothesis is confirmed. The Mission 01 database contract itself fails implementation readiness until canonical vocabulary, evidence-link, date, finance, beneficiary, auth and import contracts are consolidated. No production migration should be written from the current 35-table document.

Official references: [SQL Connect overview](https://firebase.google.com/docs/sql-connect), [schema directives](https://firebase.google.com/docs/reference/sql-connect/gql/directive), [queries](https://firebase.google.com/docs/sql-connect/queries-guide), [full-text search](https://firebase.google.com/docs/sql-connect/solutions-full-text-search), [Admin SDK](https://firebase.google.com/docs/sql-connect/admin-sdk), [schema deployment](https://firebase.google.com/docs/sql-connect/manage-schemas-and-connectors), and [Cloud SQL backup options](https://cloud.google.com/sql/docs/postgres/backup-recovery/backup-options).
