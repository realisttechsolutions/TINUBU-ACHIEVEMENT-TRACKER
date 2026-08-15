# Codex Mission 01 Firebase Technical Audit

**Audit branch:** `audit/codex-m01-firebase`

**Starting branch:** `research/mission-01-foundation`

**Starting commit:** `348a5a7cc8f350e77dc03a57f5c568cc8d4193ee`

**Audit date:** 2026-08-15

**Scope:** Architecture and engineering readiness only. No Firebase/Cloud SQL resource, migration, production database, Authentication configuration, Storage bucket, Hosting deployment or production research import was created.

## A. Executive audit verdict

**CONDITIONAL PASS for Research Mission 01 as a foundation; FAIL for immediate implementation readiness.**

The repository contains the expected corrected commit, 31 canonical correction-pass research documents, 18 CSV templates and 18 Draft-07 JSON schemas. It has no production database migration and no production research rows under `research/`. The relational hypothesis is confirmed: Firebase SQL Connect/Cloud SQL PostgreSQL is the correct MVP system of record.

However, the contract has two blockers and multiple high-severity gaps: conflicting canonical vocabularies, a claim/source contract that contradicts its own many-to-many requirement, weak date/finance/beneficiary structures, five UI groups used as database sectors, incomplete imports, Supabase-specific security assumptions, frontend enum drift, an incomplete quality/roadmap/risk model, and a compliance matrix that overstates validation.

The original validator falsely passed malformed and schema-invalid CSV values. It was repaired within allowed scope and now passes the clean foundation and rejects controlled negative tests with non-zero exits.

## B. Repository verification

| Check | Result |
|---|---|
| Repository path | `C:\Users\DELL\Documents\111 ANTI & CODEX\TINUBU ACHIEVEMENTS TRACKER` |
| Remote | `https://github.com/realisttechsolutions/TINUBU-ACHIEVEMENT-TRACKER.git` |
| Entry branch | `research/mission-01-foundation` tracking origin |
| Entry HEAD | `348a5a7` |
| Commit exists | Yes; `git show --stat 348a5a7` succeeded |
| Entry worktree | Clean |
| Audit branch | Created from exact commit: `audit/codex-m01-firebase` |
| Production migrations | Absent; only conceptual SQL fenced inside Markdown |
| Production research data | Absent from `research/`; each canonical CSV row has a non-production marker |
| Static frontend content | Present under `src/data/**`; treated as prototype UI content, not approved research data |

## C. Research deliverable verification

Independent counts:

- 37 Markdown files in `docs/research`.
- 31 files in the canonical validator requirement list.
- Six earlier overlapping documents not marked deprecated.
- 18 CSV templates in `research/templates`.
- 18 JSON schemas in `research/schemas`.

The deliverables exist. Substantive quality varies: detailed legacy documents contain more content but stale Supabase assumptions; several corrected canonical documents are only lists or a few bullets. The [audit matrix](./CODEX_M01_FIREBASE_AUDIT_MATRIX.md) records the file-level verdict.

## D. Validation-engine verdict

Baseline: FAIL. AJV compiled schemas, but compiled functions were never applied to rows. The CSV parser accepted quotes inside unquoted fields and only compared one row's column count. Required values, enums, dates, URLs, IDs, currencies, decimals and pipe arrays were not genuinely checked.

After allowed correction: CONDITIONAL PASS. The script now declares direct AJV 8, compiles all explicit Draft-07 schemas, strictly parses all rows, enforces exact headers, runs AJV row validation, performs domain checks, checks each non-production marker and returns exit 1 on failures. Negative tests confirmed the behavior, and all mutations were restored. Schema content remains incomplete. See [validation audit](./CODEX_M01_VALIDATION_ENGINE_AUDIT.md).

## E. Canonical taxonomy findings

The named counts exist—20 conceptual record types, 21 implementation statuses, 12 data classifications, six source tiers, 11 source roles, eight verification statuses and eight evidence profiles—but they are not one coherent contract.

Key conflicts:

- Legacy docs use five source levels; corrected docs use six and redefine Level 5.
- Implementation vocabularies vary among 6, 7, 12, 17, 19 and 21 values across docs/types/schemas.
- Publication codes alternate between underscore and kebab case.
- Policy/legal codes alternate between underscore and kebab case.
- `under_review`, `corrected`, `withdrawn` and `archived` are reused across unrelated dimensions.
- The 12 “classifications” combine value nature, reporting origin and lifecycle.
- Frontend evidence profiles are a different four-value set.

Recommendation: snake_case database codes; separate value nature, reporting origin, implementation, verification and publication lifecycle; use relational/configurable lookup rows for taxonomies and presentation-only labels in frontend adapters.

## F. Sector architecture recommendation

Definitive decision: separate public navigation from research/database taxonomy.

- Public navigation remains the five umbrella groups.
- Database uses approximately 15 granular canonical sectors, linked to a public group.
- Configurable subsectors sit below canonical sectors.
- One hierarchical `sectors` table with `parent_sector_id` and `taxonomy_level` represents all three levels.

Agriculture, Education, Healthcare, Power/Energy, Digital Economy, Housing, Environment/Climate, Youth/Employment/Skills, Foreign Affairs and Culture/Creative Economy become first-class canonical research sectors. This improves classification, filters, analytics and cross-sector relationships without changing the five-item public navigation.

## G. Firebase architecture recommendation

Use:

- React 18 + Vite + TypeScript
- Firebase Hosting for the SPA
- Firebase Authentication and App Check
- Firebase SQL Connect as the declared client/API layer
- Cloud SQL for PostgreSQL as system of record
- SQL Connect generated web/React SDKs
- SQL Connect Admin SDK for privileged ingestion/administration
- Cloud Storage for Firebase only for approved source archives/managed assets
- Cloud Functions 2nd gen or Cloud Run only for concrete privileged/server workflows

Do not use Firestore as the primary database or add a hybrid in the MVP. See [architecture recommendation](./CODEX_M01_FIREBASE_ARCHITECTURE_RECOMMENDATION.md).

## H. Firebase SQL Connect suitability verdict

**PASS as the selected platform; CONDITIONAL PASS pending contract/schema/auth prototype.** It supports PostgreSQL relationships, constraints, indexes, join tables, transactions, queries, aggregation, full-text search, generated SDKs, Auth integration, local emulator and Admin SDK bulk operations. Operational obligations are Cloud SQL cost, region, backups/PITR, availability, connection/query monitoring, compatible schema evolution and authorization review of every connector operation.

## I. Firestore suitability verdict

**FAIL as primary evidence database.** Firestore is a schemaless document database. It would require denormalized references, application-managed integrity and duplicated data to support the evidence graph. Query/rules limitations and document-level reads complicate public/internal field separation. Its serverless/realtime strengths do not outweigh this model mismatch. No independent MVP requirement justifies a hybrid copy.

## J. Recommended MVP database design

Canonical `records` plus subtype extensions and an optional achievement presentation layer:

```text
records
  +-- policy_details | project_details | programme_details
  +-- achievement_profiles
  +-- record_institutions / record_sectors / record_geographies
  +-- record_relationships
  +-- evidence_claims
        +-- claim_source_relationships -- sources -- source_files
  +-- financial_records / beneficiary_records
  +-- timeline_events / corrections / reviews / versions

indicators -- indicator_observations -- evidence_claims
actors -- actor_roles
research_batches
```

Full key/constraint/index/import/query details are in [database review](./CODEX_M01_FIREBASE_SQL_CONNECT_DATABASE_REVIEW.md).

## K. Recommended MVP table count

**27 tables:** 23 `MVP_REQUIRED` and four `MVP_SUPPORTING`.

The supporting tables are `record_relationships`, `source_files`, `record_versions` and `research_batches`. `source_files` can remain deferred/empty if Storage is not approved at launch; the other supporting tables materially improve integrity and operations.

## L. Table classification

All 35 proposed entities are classified in the database review. Principal changes:

- Merge `profiles` + `research_actors` -> `actor_profiles`; add `actor_roles`.
- Merge separate core tables into `records` + typed extensions/presentation profile.
- Merge subsectors into hierarchical sectors.
- Merge milestones into timeline events.
- Remove duplicate generic `source_relationships`; retain claim-source relationships.
- Move evidence claims and claim-source links from Later to MVP_REQUIRED.
- Keep reports/datasets/methodologies/tasks/gaps/freshness logs in Phase 2.
- Consolidate correction concepts.

## M. Relationship-model findings

The proposed polymorphic `entity_type/entity_id` cannot enforce a foreign key. The canonical base record removes that weakness. All many-to-many relationships use join tables with composite uniqueness and real FKs. `record_relationships` represents typed links instead of slug arrays. Institution, sector and geography names become references, not uncontrolled repeated text.

## N. Claim-evidence model findings

Use `evidence_claims` without `source_id`, and `claim_source_relationships` containing `source_role`, relationship type, location, short summary, review status/time/actor and replacement link. This supports supporting, contradictory, replacement and contextual evidence while allowing the same source to play different roles per claim. Store citations/locators/summaries, not long copyrighted content.

## O. Financial-model findings

Current five-value enum is insufficient. Use 11 explicit types: budget allocation, approved funding, funding released, reported expenditure, contract value, programme envelope, public investment, private investment, revenue generated, revenue estimate and savings estimate. Use exact PostgreSQL decimals or approved minor units, ISO currency, period, geography, cumulative/period basis and a supporting evidence claim. Never aggregate across types/currencies/overlapping periods.

## P. Beneficiary-model findings

Add `eligible_applicant` to applicant, registered, approved, disbursement and active stages. Require type, integer count, unit, period, geography, cumulative/period basis, cohort key, evidence claim, method and double-count limitation. Never sum across stages. Exact duplicate uniqueness is enforceable; semantic overlap remains an ingestion/review rule.

## Q. Date/reporting-period findings

Use nullable `date_value`, `date_precision`, `period_start`, `period_end`, `reporting_period_label` and provisional flag. Preserve unknown precision; validate ranges. Store announcement, approval, enactment, funding, commencement, completion, operation and outcome reporting as separate timeline events.

## R. Authentication/authorization findings

Use Firebase Authentication plus both coarse custom claims and authoritative relational actor-role assignments. Enforce seven roles, scoped permissions, distinct reviewers for high/critical risk, immutable review decisions, transactional publish checks and auditable break-glass actions. Public operations select only public fields. Privileged imports/role changes are `NO_ACCESS` to clients and execute through Admin SDK. See [auth/security review](./CODEX_M01_FIREBASE_AUTH_SECURITY_REVIEW.md).

## S. Hosting findings

Firebase Hosting fits the Vite `dist` SPA. Future configuration requires a fallback to `index.html`, immutable hashed-asset caching, no-cache HTML, security headers, environment separation, staging-backed preview channels, controlled GitHub deployment and service-worker rollback testing. No deploy occurred. See [Hosting review](./CODEX_M01_FIREBASE_HOSTING_REVIEW.md).

## T. Storage findings

Storage is optional. If approved, use separate public-assets and evidence-private buckets per environment, public-access prevention on private evidence, database-canonical metadata, immutable generations/hashes, lawful capture/retention and server-mediated restricted access. Storage requires Blaze. See [Storage review](./CODEX_M01_FIREBASE_STORAGE_REVIEW.md).

## U. Frontend type findings

Frontend types are presentation models, not database types. They conflict on casing/status/classification/evidence profile/source tiers and embed denormalized sources/milestones. Generated SDK operation types should feed pure exhaustive adapters into existing UI view models. Internal/restricted fields must never appear in public operation shapes. See [type mapping audit](./CODEX_M01_TYPE_MAPPING_AUDIT.md).

## V. Data-ingestion findings

Use trusted Node.js tooling plus SQL Connect Admin SDK, not browser mutations. Require validate, dry-run, stage, commit and rollback modes; batch checksums/idempotency; deterministic plans; structured errors; FK/duplicate reports; transactional logical-record commits; post-commit verification and compensating rollback. Current templates need relationship/reference coverage first. See [ingestion review](./CODEX_M01_DATA_INGESTION_REVIEW.md).

## W. Quality-gate findings

The current five gates do not explicitly preserve all ten responsibilities. Adopt six gates:

1. Task authorization.
2. Source and claim capture.
3. Entity resolution and evidence/contradiction.
4. Automated schema and database readiness.
5. Editorial and human approval.
6. Publication and post-publication stewardship.

The crosswalk in the [gap log](./CODEX_M01_RESEARCH_CONTRACT_GAP_LOG.md) preserves all ten original responsibilities.

## X. Roadmap findings

The current five phases lose named responsibilities. Restore Foundation, Pilot Dataset, Core National Records, Sector Expansion, Geographic Expansion, Outcome/Evidence Deepening, Historical Reconciliation and Continuous Monitoring. Insert contract consolidation/local emulator engineering between Foundation and Pilot; do not replace research stages with backend work.

## Y. Risk-register findings

The five-row register is inadequate. It omits most specified research, evidence, copyright, security, workflow, schema, cost and Cloud SQL resilience risks. The gap log provides the required expanded inventory; the next mission must add owner, likelihood, impact, trigger, mitigation, contingency and review date.

## Z. Environment recommendation

Use local emulator/PGlite, one dedicated staging Firebase project with its own SQL Connect/Cloud SQL database, and one production project/database. Pull-request Hosting previews point only at staging. Never share database instances between staging and production.

## AA. Billing/cost considerations

- SQL Connect service operations and Cloud SQL are separately billable/limited; Cloud SQL is the material baseline cost.
- Hosting includes no-cost quotas then transfer/storage overages.
- Standard Auth is generally low-cost; Identity Platform, phone, SAML/OIDC and scale change pricing.
- Cloud Storage requires Blaze and charges storage/operations/egress/retained versions.
- Functions/Cloud Run are usage-billed and should be introduced sparingly.
- Backups, PITR, HA, replicas and exports affect Cloud SQL cost.
- Budget alerts do not stop spend; assign cost ownership and monitoring before provisioning.

## AB. Blockers

1. G-01: no single canonical machine-readable vocabulary across docs/schemas/frontend.
2. G-02: claim requires one source while the required architecture is many-to-many and lacks a relationship interchange schema.

These block Mission 01 final approval and Mission 02 data capture.

## AC. High-severity findings

Granular sector/database separation; incomplete 35-table contract; Supabase RLS migration; date/financial/beneficiary weakness; missing reference/relationship imports; source hierarchy drift; unconstrained statuses; incomplete quality/roadmap/risk controls; public/internal projection weakness; frontend enum mismatch; dependency vulnerabilities; Storage/copyright governance.

## AD. Medium-severity findings

Overlapping legacy/canonical documents; duplicate/version concepts; hard-coded frontend data; date/display mapping; actor-role crosswalk; npm Windows path portability; Cloud SQL operations ownership; evidence content minimization.

## AE. Low-severity findings

Count labels and inventory documentation drift; freshness logs may be computed initially; stale Browserslist data and large bundle warning are non-blocking for this audit.

## AF. Recommended corrections

1. Contract v1.1 canonical code registry and deprecation index.
2. Claim-source relationship template/schema; remove source from claim.
3. Hierarchical sector taxonomy.
4. Structured date/period, 11-type finance and six-stage beneficiary contracts.
5. Reference/relationship import manifest and permanent negative tests.
6. Six quality gates, eight-stage roadmap and full owned risk register.
7. Local 27-table SQL Connect schema/connector/auth prototype.
8. Generated SDK adapters and public-field response tests.
9. Separate dependency/tooling remediation and cloud cost/operations approval.

## AG. Files created

1. `docs/engineering/CODEX_M01_FIREBASE_TECHNICAL_AUDIT.md`
2. `docs/engineering/CODEX_M01_FIREBASE_ARCHITECTURE_RECOMMENDATION.md`
3. `docs/engineering/CODEX_M01_FIREBASE_SQL_CONNECT_DATABASE_REVIEW.md`
4. `docs/engineering/CODEX_M01_FIREBASE_AUTH_SECURITY_REVIEW.md`
5. `docs/engineering/CODEX_M01_FIREBASE_HOSTING_REVIEW.md`
6. `docs/engineering/CODEX_M01_FIREBASE_STORAGE_REVIEW.md`
7. `docs/engineering/CODEX_M01_DATA_INGESTION_REVIEW.md`
8. `docs/engineering/CODEX_M01_TYPE_MAPPING_AUDIT.md`
9. `docs/engineering/CODEX_M01_VALIDATION_ENGINE_AUDIT.md`
10. `docs/engineering/CODEX_M01_RESEARCH_CONTRACT_GAP_LOG.md`
11. `docs/engineering/CODEX_M01_FIREBASE_AUDIT_MATRIX.md`

## AH. Files modified

- `scripts/validate-research-foundation.mjs`
- `package.json`
- `package-lock.json`

No frontend component, research definition, CSV template, JSON schema or migration remains modified.

## AI. Commands executed

Repository: `git status`, `git branch -a`, `git log -5 --oneline`, `git show --stat 348a5a7`, `git remote -v`, inventory and `rg` searches.

Dependencies/validation: `npm install`, `npm install --save-dev ajv@8.17.1`, repeated `npm run validate:research`, `npm ls ajv --all`.

Checks: `npm run typecheck`, `npx tsc --noEmit`, `npm run lint`, `npm run test -- --run`, `npm run build`, plus direct local Node entry points for TypeScript, ESLint, Vitest and Vite.

Research: official Firebase, Google Cloud and Supabase documentation for SQL Connect, Auth, App Check, Hosting, Storage, Firestore, Cloud SQL, Admin SDK, pricing and Supabase RLS/type/function concepts.

## AJ. Test results

| Test | Result |
|---|---|
| Corrected research validation | PASS, 0 errors |
| Negative schema/domain test | PASS (validator correctly exited 1) |
| Negative currency/decimal/date/URL test | PASS (correctly exited 1) |
| Negative malformed-quote test | PASS (correctly exited 1) |
| Template restoration | PASS; no template diff |
| `npm run typecheck` | UNAVAILABLE; no script |
| Npm wrappers for tsc/lint/test/build | PRE-EXISTING TOOLING FAILURE in `&` workspace path before tool execution |
| Direct TypeScript | PASS |
| Direct Vitest | PASS, 6 files/26 tests |
| Direct Vite production build | PASS with chunk-size/Browserslist warnings |
| Direct ESLint | FAIL, 13 errors/10 warnings in pre-existing frontend/config files |

## AK. Starting commit

`348a5a7cc8f350e77dc03a57f5c568cc8d4193ee`

## AL. Final audit commit

Recorded in the completion response. A commit cannot embed its own final hash without changing itself.

## AM. Git diff summary

Expected committed scope: 11 new engineering Markdown reports, three modified validation/dependency files, no research fixture/schema/frontend/migration changes. The exact committed shortstat is recorded in the completion response after commit.

## AN. Research Mission 01 final approval

**NO.** Grant conditional foundation acceptance only. Final approval requires closure of the two blockers and high-severity contract/control gaps listed in the release gate.

## AO. May Research Mission 02 begin?

**NO.** Do not collect even the five-record pilot against conflicting vocabularies and a one-source claim template. The pilot may begin only after contract v1.1 and validator fixtures are approved.

## AP. May Firebase implementation begin?

**NO for provisioned/cloud implementation, migrations and production services.** A local-only, non-billable SQL Connect emulator design prototype may be part of the exact next engineering mission after the contract consolidation work is approved.

## AQ. Exact next engineering mission

**Engineering Mission E01 — Firebase Contract Consolidation and Local SQL Connect Emulator Prototype.**

Required outcomes:

1. Publish Research Contract v1.1 with canonical code registries and legacy-document deprecation map.
2. Repair/add templates and Draft-07 schemas for claim-source relationships, reference entities, structured dates, finance and beneficiaries.
3. Add permanent positive/negative validator tests and CI-safe portable package scripts.
4. Express the approved 27-table design as a local SQL Connect schema only; no cloud provisioning.
5. Define public/editorial/admin connectors and test Auth/role/separation-of-duty behavior in the emulator.
6. Generate SDKs locally and prove adapters for one record list/detail path without modifying public components beyond a separately approved scope.
7. Produce reviewed migration/cost/backup/region plans, but do not deploy them.
8. Re-run the audit matrix and request Mission 01 final approval before Mission 02.
