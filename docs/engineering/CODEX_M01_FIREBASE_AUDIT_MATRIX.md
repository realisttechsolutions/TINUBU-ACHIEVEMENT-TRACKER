# Codex Mission 01 Firebase Audit Matrix

Legend: **Y** yes; **P** partial; **N** no; **—** not applicable. “Security” means the deliverable was reviewed for public/internal/authorization implications, not that it is secure. Verdict values are limited to PASS, CONDITIONAL PASS and FAIL.

## Research documentation

| File | Purpose | Exists | Substantive | Internally consistent | Schema aligned | SQL Connect ready | Frontend aligned | Security reviewed | Finding | Severity | Recommendation | Verdict |
|---|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|---|---|---|---|
| `docs/research/CANONICAL_TAXONOMIES.md` | Legacy combined taxonomy | Y | Y | N | N | N | P | Y | Five-tier source and 4-class/status vocabularies conflict with correction set. | HIGH | Deprecate or reconcile to v1.1. | FAIL |
| `docs/research/DATA_INGESTION_CONTRACT.md` | Legacy ingestion/field boundary | Y | Y | N | P | N | P | Y | Promises schema/semantic checks and Supabase sync not implemented; fields embed arrays. | HIGH | Replace with Admin SDK batch contract. | FAIL |
| `docs/research/EVIDENCE_GOVERNANCE_AND_VERIFICATION.md` | Legacy evidence/governance detail | Y | Y | P | P | P | N | Y | Useful six-tier/role detail but capitalization and downstream schema drift remain. | MEDIUM | Make corrected, code-based evidence registry authoritative. | CONDITIONAL PASS |
| `docs/research/RESEARCH_TEMPLATES_GUIDE.md` | Legacy 17-template guide | Y | P | N | N | N | — | Y | Says 17 and points to old `templates/research` paths; canonical set is 18 in `research/templates`. | HIGH | Deprecate and link canonical 18-template guide. | FAIL |
| `docs/research/RESEARCH_TO_DEV_HANDOFF.md` | Legacy Supabase DDL/RLS/types | Y | Y | N | N | N | P | Y | Partial DDL, broad RLS and duplicated record tables are unsuitable for SQL Connect. | HIGH | Treat only as historical concept source. | FAIL |
| `docs/research/SUPABASE_DATA_CONTRACT_AND_ENTITY_MAP.md` | Legacy 35-table map/DDL | Y | Y | N | P | N | N | Y | Useful inventory but claim evidence is Later, polymorphic FKs are unenforceable, only four DDL examples. | HIGH | Replace with approved 27-table logical model. | FAIL |
| `docs/research/MISSION_R01_RESEARCH_DATA_BLUEPRINT.md` | Canonical correction-pass inventory | Y | Y | P | P | N | P | Y | Inventory is substantial but retains Supabase as engineering destination. | HIGH | Add canonical authority/deprecation and Firebase handoff. | CONDITIONAL PASS |
| `docs/research/TAT_RESEARCH_OBJECTIVES.md` | Research objectives | Y | P | P | P | N | P | Y | Objectives are sound but promise direct source traceability and Supabase ingestion without matching contract. | MEDIUM | Update terminology after architecture approval. | CONDITIONAL PASS |
| `docs/research/TAT_COMPLETE_DATA_UNIVERSE.md` | 35-entity universe | Y | P | N | P | N | N | Y | Duplicate correction concepts and achievement/subtype overlap; no table fields. | HIGH | Adopt 27-table classification. | FAIL |
| `docs/research/TAT_RECORD_TAXONOMY.md` | 20 conceptual record types | Y | Y | P | P | N | N | Y | Mixes content, evidence and publication artifacts; “Supabase destination” is stale. | MEDIUM | Separate record kind, subtype and resource concepts. | CONDITIONAL PASS |
| `docs/research/TAT_SECTOR_TAXONOMY.md` | Five groups/15 domains | Y | Y | P | Y | P | P | Y | Good coverage but treats five UI groups as canonical DB sectors. | HIGH | Use hierarchy: public group -> canonical sector -> subsector. | CONDITIONAL PASS |
| `docs/research/TAT_STATUS_AND_CLASSIFICATION_STANDARD.md` | 21 statuses/12 classifications | Y | Y | N | P | P | N | Y | Classification conflates value nature, origin and lifecycle; status values collide with workflow. | BLOCKER | Split namespaces and publish machine-readable codes. | FAIL |
| `docs/research/TAT_SOURCE_HIERARCHY.md` | Six source tiers | Y | Y | P | P | P | N | Y | Six-tier standard conflicts with legacy five-tier and public `SourceLevel` 1-5. | HIGH | Declare authoritative; keep Level 6 internal. | CONDITIONAL PASS |
| `docs/research/TAT_SOURCE_ROLE_STANDARD.md` | 11 relationship roles | Y | Y | Y | N | P | N | Y | Correct relationship-bound concept, but no relationship template/schema. | BLOCKER | Add claim-source relationship contract. | FAIL |
| `docs/research/TAT_EVIDENCE_STANDARD.md` | Atomic claim/verification | Y | Y | N | N | P | N | Y | Lists `source_id` on claim despite many-to-many; display statuses not constrained in schemas. | BLOCKER | Remove direct source and normalize relationships/review. | FAIL |
| `docs/research/TAT_EVIDENCE_PROFILE_STANDARD.md` | Eight record profiles | Y | P | P | N | P | N | Y | Profiles exist only as labels and conflict with four frontend sector profiles. | HIGH | Define derivation rules and canonical codes. | CONDITIONAL PASS |
| `docs/research/TAT_RESEARCH_WORKFLOW.md` | 14-stage workflow | Y | Y | P | P | P | — | Y | Preserves research stages but ends in Supabase and has no post-publication step. | MEDIUM | Map into six enforceable gates including stewardship. | CONDITIONAL PASS |
| `docs/research/TAT_VERIFICATION_WORKFLOW.md` | Per-record verification | Y | P | Y | P | P | — | Y | Sound minimum distinctions but incomplete for all record/risk types. | MEDIUM | Extend into executable review rules. | CONDITIONAL PASS |
| `docs/research/TAT_CONTRADICTION_PROTOCOL.md` | Contradiction handling | Y | Y | Y | P | P | — | Y | Preserves competing figures but uses notes/flat log without claim relationship links. | MEDIUM | Link contradiction to claims/sources/reviews. | CONDITIONAL PASS |
| `docs/research/TAT_DUPLICATE_DETECTION_STANDARD.md` | Duplicate signals/actions | Y | P | P | P | P | — | Y | Fuzzy threshold has no method/version; aliases tables deferred. | MEDIUM | Make fuzzy results review-only and preserve external keys. | CONDITIONAL PASS |
| `docs/research/TAT_DATA_FRESHNESS_POLICY.md` | Review velocity | Y | P | Y | P | P | — | Y | Useful thresholds; no risk/source-specific overrides or job ownership. | LOW | Calculate due dates initially; add Phase 2 logs/jobs. | CONDITIONAL PASS |
| `docs/research/TAT_RESEARCH_AGENT_OPERATING_MODEL.md` | 11 research roles | Y | Y | P | — | P | — | Y | Strong separation principle; “Data Publisher to Supabase” stale and roles do not map to auth roles exactly. | MEDIUM | Crosswalk operating actors to seven authorization roles. | CONDITIONAL PASS |
| `docs/research/TAT_RESEARCH_RISK_CLASSIFICATION.md` | Claim risk levels | Y | P | Y | P | P | — | Y | Four levels are useful but review requirements are not schema/workflow enforced. | HIGH | Encode gate requirements and distinct reviewer rules. | CONDITIONAL PASS |
| `docs/research/TAT_SUPABASE_DATA_CONTRACT_V1.md` | Naming/type rules | Y | N | N | P | N | N | Y | Four bullets are not a database contract; string dates and arrays are insufficient. | HIGH | Supersede with Firebase contract v1.1. | FAIL |
| `docs/research/TAT_SUPABASE_ENTITY_RELATIONSHIP_MAP.md` | 35-table inventory | Y | N | N | P | N | N | Y | Names tables only; no keys/fields/constraints; evidence marked separately and duplicated. | HIGH | Use database review as next design input. | FAIL |
| `docs/research/TAT_INTERNAL_PUBLIC_DATA_BOUNDARY.md` | Visibility/RLS rules | Y | P | N | P | N | N | Y | Supabase row filter is not SQL Connect auth; column projection is underspecified. | HIGH | Define public/staff/admin operations and restricted storage. | FAIL |
| `docs/research/TAT_RESEARCH_OUTPUT_TEMPLATES.md` | 18-template index | Y | P | Y | Y | P | — | Y | Correct list, but no field semantics/version/relationship coverage. | MEDIUM | Expand into versioned manifest/field registry. | CONDITIONAL PASS |
| `docs/research/TAT_IMPORT_EXPORT_STANDARD.md` | Supported formats | Y | N | Y | P | N | — | Y | Three bullets do not define validate/dry-run/stage/commit/rollback/idempotence. | HIGH | Adopt ingestion review. | FAIL |
| `docs/research/TAT_QUALITY_CONTROL_GATES.md` | Five quality gates | Y | P | N | P | P | — | Y | Does not explicitly preserve all ten responsibilities; no task authorization, DB readiness or stewardship. | HIGH | Adopt six gates/ten controls. | FAIL |
| `docs/research/TAT_RESEARCH_PRIORITISATION_STANDARD.md` | Research prioritization | Y | P | Y | — | — | — | Y | Positive scope is clear but pressure/selection bias controls are not explicit here. | MEDIUM | Pair with truth, contradiction and risk controls. | CONDITIONAL PASS |
| `docs/research/TAT_PILOT_RESEARCH_DESIGN.md` | Mission 02 pilot idea | Y | N | P | P | N | — | Y | Two bullets, no acceptance criteria, sampling, rollback or corrected contract dependency. | HIGH | Do not start until blockers close; rewrite pilot protocol. | FAIL |
| `docs/research/TAT_RESEARCH_ROADMAP.md` | Five-phase roadmap | Y | P | N | — | N | — | Y | Omits geographic expansion, evidence deepening and historical reconciliation; names Supabase. | HIGH | Restore eight responsibilities and engineering gate. | FAIL |
| `docs/research/TAT_RESEARCH_GOVERNANCE.md` | Oversight roles | Y | N | P | — | N | — | Y | Three roles omit security, privacy, cost, publisher separation and incident ownership. | HIGH | Expand accountable governance/RACI. | FAIL |
| `docs/research/TAT_DATA_VERSIONING_AND_CORRECTION_STANDARD.md` | Revisions/corrections | Y | P | P | P | P | P | Y | Good preservation intent; correction/version duplication and approval rules unresolved. | MEDIUM | One corrections table plus record versions and publish workflow. | CONDITIONAL PASS |
| `docs/research/TAT_RESEARCH_RISK_REGISTER.md` | Risk register | Y | N | P | — | N | — | Y | Only five risks; most required risks absent; no owners/likelihood/triggers. | HIGH | Replace with operational register. | FAIL |
| `docs/research/TAT_RESEARCH_TO_DEVELOPMENT_HANDOFF.md` | Technical proposal warning | Y | P | N | N | N | N | Y | Correctly says proposal only, but RLS SQL and Supabase references are stale and DDL is only referenced. | HIGH | Replace concept mapping; do not rewrite as migration. | FAIL |
| `docs/research/TAT_MISSION_R01_COMPLIANCE_MATRIX.md` | Claimed 60-criterion compliance | Y | Y | N | N | N | P | Y | Claims 100% and validation behaviors disproven by negative test; counts conflict. | HIGH | Regenerate after remediation using executable evidence. | FAIL |

## CSV templates

| File | Purpose | Exists | Substantive | Internally consistent | Schema aligned | SQL Connect ready | Frontend aligned | Security reviewed | Finding | Severity | Recommendation | Verdict |
|---|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|---|---|---|---|
| `research/templates/achievement_record.csv` | Achievement/public record | Y | P | P | Y | N | P | Y | Embeds strings/arrays/internal fields; duplicates subtype subject. | HIGH | Import into record + subtype/profile + joins. | CONDITIONAL PASS |
| `research/templates/beneficiary_record.csv` | Beneficiary count | Y | P | N | Y | N | N | Y | Missing eligible stage, unit, geography, count basis/cohort. | HIGH | Extend v1.1. | FAIL |
| `research/templates/claim_extraction.csv` | Atomic claim | Y | P | N | Y | N | N | Y | Single `source_id` contradicts many-to-many evidence. | BLOCKER | Split claim and relationship rows. | FAIL |
| `research/templates/contradiction_log.csv` | Competing claims | Y | P | P | Y | P | — | Y | URL/value pairs are flat, not claim/source FKs. | MEDIUM | Relate to claims and review decisions. | CONDITIONAL PASS |
| `research/templates/correction_record.csv` | Correction event | Y | P | P | Y | P | — | Y | Camel-case field example and no revision/public-impact link. | MEDIUM | Normalize and link version/review. | CONDITIONAL PASS |
| `research/templates/data_gap.csv` | Research backlog | Y | P | Y | Y | PHASE_2 | — | Y | Valid research artifact, not MVP publication data. | LOW | Keep Phase 2/backlog. | PASS |
| `research/templates/duplicate_review.csv` | Duplicate adjudication | Y | P | P | Y | P | — | Y | Placeholder IDs and score lack method/version. | MEDIUM | Add algorithm/version and reviewer decision. | CONDITIONAL PASS |
| `research/templates/entity_discovery.csv` | Candidate discovery | Y | P | P | Y | P | — | Y | Candidate type vocabulary differs from 20 conceptual types. | MEDIUM | Crosswalk to canonical record kinds. | CONDITIONAL PASS |
| `research/templates/financial_record.csv` | Financial value | Y | P | N | Y | N | N | Y | Five types only; no geography/basis/claim FK. | HIGH | Adopt 11-type exact-value model. | FAIL |
| `research/templates/freshness_review.csv` | Staleness review | Y | P | Y | Y | PHASE_2 | — | Y | Operationally useful but can be computed initially. | LOW | Defer table; retain contract after v1.1. | PASS |
| `research/templates/indicator_observation.csv` | Time-series observation | Y | P | P | Y | P | P | Y | Verification is unconstrained; period/geography flat. | HIGH | Link claim, structured period/geography/status. | CONDITIONAL PASS |
| `research/templates/indicator_record.csv` | Indicator definition | Y | P | P | Y | P | P | Y | Formatted baseline/target values duplicate observations. | MEDIUM | Keep definition; move values to observations. | CONDITIONAL PASS |
| `research/templates/policy_record.csv` | Policy record | Y | P | N | Y | N | N | Y | Underscore enums conflict with frontend; embedded arrays/outcomes/dates. | HIGH | Map to records + policy details + relations/events. | FAIL |
| `research/templates/programme_record.csv` | Programme record | Y | P | N | Y | N | N | Y | Status/type unbounded; envelope stored as display string. | HIGH | Normalize subtype, finance, beneficiaries. | FAIL |
| `research/templates/project_record.csv` | Project record | Y | P | N | Y | N | N | Y | Status/type unbounded; value and locations denormalized. | HIGH | Normalize subtype, finance and geography. | FAIL |
| `research/templates/publication_review.csv` | Editorial decision | Y | P | P | Y | P | — | Y | Single editor/pass flag cannot express risk-based distinct approvals. | HIGH | Import immutable gate-specific review decisions. | CONDITIONAL PASS |
| `research/templates/source_capture.csv` | Source identity | Y | Y | P | Y | P | N | Y | Strongest template; lacks tier/rights/hash and structured date range. | MEDIUM | Extend and map publisher institution. | CONDITIONAL PASS |
| `research/templates/timeline_event.csv` | Dated event | Y | P | P | Y | P | P | Y | Has date precision, but duplicates year/quarter and stores source URL directly. | MEDIUM | Normalize date fields and link source claim. | CONDITIONAL PASS |

## JSON schemas

| File | Purpose | Exists | Substantive | Internally consistent | Schema aligned | SQL Connect ready | Frontend aligned | Security reviewed | Finding | Severity | Recommendation | Verdict |
|---|---|:---:|:---:|:---:|:---:|:---:|:---:|---|---|---|---|
| `research/schemas/achievement_record.schema.json` | Achievement validation | Y | Y | P | Y | N | P | Y | Strong enums but string dates/arrays and duplicated core model. | HIGH | Revise to normalized import contract. | CONDITIONAL PASS |
| `research/schemas/beneficiary_record.schema.json` | Beneficiary validation | Y | P | N | Y | N | N | Y | Incomplete stages/fields; numeric string unconstrained. | HIGH | Extend semantics and constraints. | FAIL |
| `research/schemas/claim_extraction.schema.json` | Claim validation | Y | Y | N | Y | N | N | Y | Requires one source; no verification enum/review history. | BLOCKER | Split relationship schema. | FAIL |
| `research/schemas/contradiction_log.schema.json` | Contradiction validation | Y | P | P | Y | P | — | Y | URLs not formatted; flat values. | MEDIUM | Relationalize claims/sources. | CONDITIONAL PASS |
| `research/schemas/correction_record.schema.json` | Correction validation | Y | P | P | Y | P | — | Y | Date/ID/actor unconstrained. | MEDIUM | Add version/review/type constraints. | CONDITIONAL PASS |
| `research/schemas/data_gap.schema.json` | Gap validation | Y | P | Y | Y | PHASE_2 | — | Y | Adequate for backlog; target date unconstrained. | LOW | Tighten date in v1.1. | PASS |
| `research/schemas/duplicate_review.schema.json` | Duplicate validation | Y | P | P | Y | P | — | Y | Confidence accepts arbitrary string/number. | MEDIUM | Constrain 0-1 and method metadata. | CONDITIONAL PASS |
| `research/schemas/entity_discovery.schema.json` | Discovery validation | Y | P | P | Y | P | — | Y | Enum is only partial conceptual taxonomy. | MEDIUM | Canonical record-kind crosswalk. | CONDITIONAL PASS |
| `research/schemas/financial_record.schema.json` | Financial validation | Y | P | N | Y | N | N | Y | Incomplete types; currency/amount/period weak. | HIGH | Replace with exact financial contract. | FAIL |
| `research/schemas/freshness_review.schema.json` | Freshness validation | Y | P | P | Y | PHASE_2 | — | Y | Dates and day count weak; otherwise coherent. | LOW | Tighten for Phase 2. | PASS |
| `research/schemas/indicator_observation.schema.json` | Observation validation | Y | P | P | Y | P | P | Y | Verification unconstrained; numeric/period weak. | HIGH | Link claim and canonical status. | CONDITIONAL PASS |
| `research/schemas/indicator_record.schema.json` | Indicator validation | Y | P | P | Y | P | P | Y | Slug/date/value formats weak and values duplicate observations. | MEDIUM | Separate metadata and values. | CONDITIONAL PASS |
| `research/schemas/policy_record.schema.json` | Policy validation | Y | Y | N | Y | N | N | Y | Good enum coverage but code style conflicts and false-precision dates. | HIGH | Revise for base/extension/events. | FAIL |
| `research/schemas/programme_record.schema.json` | Programme validation | Y | N | N | Y | N | N | Y | Key type/status values are free strings. | HIGH | Add canonical types/status and normalize values. | FAIL |
| `research/schemas/project_record.schema.json` | Project validation | Y | P | N | Y | N | N | Y | Project/status free strings; numeric strings and URLs weak. | HIGH | Add canonical constraints/relationships. | FAIL |
| `research/schemas/publication_review.schema.json` | Publication review validation | Y | P | P | Y | P | — | Y | One pass flag cannot express all approval gates. | HIGH | Gate-specific decisions/distinct reviewers. | CONDITIONAL PASS |
| `research/schemas/source_capture.schema.json` | Source validation | Y | Y | P | Y | P | N | Y | URL format present; tier/rights/hash/range semantics absent. | MEDIUM | Extend source contract. | CONDITIONAL PASS |
| `research/schemas/timeline_event.schema.json` | Timeline validation | Y | P | P | Y | P | P | Y | Date/URL fields unconstrained; source is direct URL. | MEDIUM | Structured date consistency and claim link. | CONDITIONAL PASS |

## Validator, package and frontend types

| File | Purpose | Exists | Substantive | Internally consistent | Schema aligned | SQL Connect ready | Frontend aligned | Security reviewed | Finding | Severity | Recommendation | Verdict |
|---|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|---|---|---|---|
| `scripts/validate-research-foundation.mjs` | Foundation validation | Y | Y | Y | Y | P | — | Y | Corrected in audit; now validates rows and negative cases. Relational semantics remain future work. | LOW | Add permanent unit/fixture tests and CI. | PASS |
| `package.json` | Scripts/dependencies | Y | Y | P | — | N | Y | Y | AJV now direct; no typecheck script; npm binary shims fail in `&` path. | MEDIUM | Add portable scripts in separate tooling fix. | CONDITIONAL PASS |
| `src/types/achievement.ts` | Achievement UI model | Y | Y | P | N | N | — | Y | Presentation values/embedded evidence differ from database contract. | HIGH | Adapter from generated public operation type. | CONDITIONAL PASS |
| `src/types/sector.ts` | Sector dashboard UI model | Y | Y | N | N | N | — | Y | Aggregate/presentation shape and evidence profiles conflict with research model. | HIGH | Populate from dashboard query, not table. | FAIL |
| `src/types/policy.types.ts` | Policy UI model | Y | Y | N | N | N | — | Y | Canonical enum mismatch is a contract blocker. | BLOCKER | Approve codes and exhaustive mapping. | FAIL |
| `src/types/timeline.types.ts` | Timeline UI model | Y | Y | P | N | P | — | Y | Human-readable dates and category enum drift. | HIGH | Generated structured date/sector adapter. | CONDITIONAL PASS |
| `src/types/geography.types.ts` | Geography UI/map model | Y | Y | P | P | P | — | Y | Good concepts; overlapping scopes and sensitivity not database-enforced. | MEDIUM | Normalize canonical units and map DTOs. | CONDITIONAL PASS |

## Repository boundary checks

| Item | Purpose | Exists | Finding | Severity | Recommendation | Verdict |
|---|---|:---:|---|---|---|---|
| Production database migrations | Prohibited in Mission 01 | N | No migration directory/production SQL migration was found. DDL exists only inside conceptual Markdown. | INFORMATIONAL | Continue to prohibit until local design approval. | PASS |
| Production research data in `research/` | Prohibited in Mission 01 | N | All 18 canonical rows carry non-production markers. | INFORMATIONAL | Preserve marker and batch manifest rules. | PASS |
| Static frontend data | Prototype UI content | Y | Public-looking facts exist outside the research contract; not database data but a dual-source risk. | MEDIUM | Do not auto-import; reviewed cutover later. | CONDITIONAL PASS |
