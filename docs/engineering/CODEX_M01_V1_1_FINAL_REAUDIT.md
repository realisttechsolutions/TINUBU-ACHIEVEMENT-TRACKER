# Codex Technical Re-Audit 01.1 — Research Contract v1.1 Final Verification

**Audit branch:** `audit/codex-m01-v1.1-final`

**Research branch:** `research/mission-01-contract-v1.1`

**Starting commit:** `ac0c2dffb427d3c4b438a8aaafbd3a75639d853c`

**Previous Codex audit commit:** `f9624ec4dbcb43e5740a94f73327540b99d81fd2`

**Original Research Mission 01 commit:** `348a5a7cc8f350e77dc03a57f5c568cc8d4193ee`

**Audit date:** 2026-08-15

**Scope:** Independent repository verification only. No Firebase project, Cloud SQL instance, production migration, Firebase prototype, Research Mission 02 work, frontend change, production data import, deployment, Authentication configuration, or Storage resource was created.

## 1. Executive verdict

> **FAIL — CONTRACT REMAINS UNSAFE FOR IMPLEMENTATION**

Research Contract v1.1 makes substantial progress and genuinely closes the claim-source cardinality blocker. It also establishes useful human-readable standards for sectors, implementation status, source roles, dates, financial values, beneficiaries, quality gates, roadmap, risk, and document deprecation.

It does **not** close the canonical-vocabulary blocker. The claimed machine-readable source of truth omits important controlled namespaces, active schemas retain deprecated aliases and mixed classifications, active templates use those deprecated values, and the validator neither compares schema enums to the vocabulary nor rejects broken cross-file relationships. A safe negative test changed the canonical financial code from `funding_released` to `released_funding` and replaced valid claim/source relationship references with nonexistent IDs; the validator still returned exit 0.

The contract also claims implementation neutrality while canonical/supporting research documents prescribe Firebase connector operations, custom claims, SQL Connect directives, Admin SDK execution, Cloud SQL controls, and an active RLS document. Those mechanisms belong to engineering architecture, not the canonical research truth contract.

## 2. Git verification

| Check | Result | Verdict |
|---|---|---|
| Remote branch | `origin/research/mission-01-contract-v1.1` exists | PASS |
| Remote HEAD | `ac0c2dffb427d3c4b438a8aaafbd3a75639d853c` | PASS |
| Local research HEAD | Matches the remote and expected commit | PASS |
| Entry worktree | Clean | PASS |
| Parent of Research 01.1 | `f9624ec4dbcb43e5740a94f73327540b99d81fd2` | PASS |
| Original Mission 01 ancestry | `348a5a7...` is an ancestor through `f9624ec...` | PASS |
| Requested audit branch | Created at exact Research 01.1 HEAD | PASS |
| Unrelated Research 01.1 paths | None; all 56 changed paths are research docs, schemas, templates, or the validator | PASS |

### Effect of branching from the prior Codex audit

The lineage is linear and technically coherent:

```text
348a5a7 Research Mission 01
  -> f9624ec Codex Firebase architecture audit and validator hardening
    -> ac0c2df Research Contract v1.1 consolidation
      -> audit/codex-m01-v1.1-final
```

Using the Codex audit commit as the parent imported 11 historical engineering audit documents, the direct AJV dependency, lockfile update, and validator hardening that Contract v1.1 explicitly responds to. It did not import frontend, migration, Firebase configuration, deployment, or production-data changes. This caused no Git-history or dependency-contamination problem. The audit documents must remain historical evidence rather than canonical research definitions.

## 3. Exact Research 01.1 file inventory

Comparison: `f9624ec4dbcb43e5740a94f73327540b99d81fd2..ac0c2dffb427d3c4b438a8aaafbd3a75639d853c`.

| Change type | Count |
|---|---:|
| Created | 8 |
| Modified | 48 |
| Deleted | 0 |
| Renamed | 0 |
| Total changed | 56 |

Current inventory is 42 research Markdown files, 19 CSV templates, and 20 JSON files in `research/schemas` (19 paired validation schemas plus one vocabulary dictionary).

Antigravity's total of 56 and count of 8 created files are correct. “20 canonical documents modified” should instead read **20 existing research documents modified** because several are now classified as deprecated or superseded. “18 templates modified” is incorrect: **9 existing templates were modified and 1 template was created**. All 18 prior validation schemas were modified and 2 JSON files were created.

### 3.1 Created files — 8

1. `docs/research/TAT_CODEX_AUDIT_RESOLUTION_LOG.md`
2. `docs/research/TAT_FRONTEND_CONTRACT_ALIGNMENT_REQUIREMENTS.md`
3. `docs/research/TAT_RESEARCH_CONTRACT_CHANGELOG.md`
4. `docs/research/TAT_RESEARCH_CONTRACT_V1_1.md`
5. `docs/research/TAT_RESEARCH_DOCUMENT_INDEX.md`
6. `research/schemas/canonical-vocabulary.v1.1.json`
7. `research/schemas/claim_source_relationship.schema.json`
8. `research/templates/claim_source_relationship.csv`

### 3.2 Modified research documents — 20

`CANONICAL_TAXONOMIES.md`, `DATA_INGESTION_CONTRACT.md`, `EVIDENCE_GOVERNANCE_AND_VERIFICATION.md`, `RESEARCH_TEMPLATES_GUIDE.md`, `RESEARCH_TO_DEV_HANDOFF.md`, `SUPABASE_DATA_CONTRACT_AND_ENTITY_MAP.md`, `TAT_EVIDENCE_PROFILE_STANDARD.md`, `TAT_EVIDENCE_STANDARD.md`, `TAT_MISSION_R01_COMPLIANCE_MATRIX.md`, `TAT_QUALITY_CONTROL_GATES.md`, `TAT_RESEARCH_AGENT_OPERATING_MODEL.md`, `TAT_RESEARCH_OUTPUT_TEMPLATES.md`, `TAT_RESEARCH_RISK_REGISTER.md`, `TAT_RESEARCH_ROADMAP.md`, `TAT_SECTOR_TAXONOMY.md`, `TAT_SOURCE_HIERARCHY.md`, `TAT_SOURCE_ROLE_STANDARD.md`, `TAT_STATUS_AND_CLASSIFICATION_STANDARD.md`, `TAT_SUPABASE_DATA_CONTRACT_V1.md`, and `TAT_SUPABASE_ENTITY_RELATIONSHIP_MAP.md`.

### 3.3 Modified schemas — 18

`achievement_record`, `beneficiary_record`, `claim_extraction`, `contradiction_log`, `correction_record`, `data_gap`, `duplicate_review`, `entity_discovery`, `financial_record`, `freshness_review`, `indicator_observation`, `indicator_record`, `policy_record`, `programme_record`, `project_record`, `publication_review`, `source_capture`, and `timeline_event`.

### 3.4 Modified templates — 9

`beneficiary_record.csv`, `claim_extraction.csv`, `contradiction_log.csv`, `correction_record.csv`, `duplicate_review.csv`, `financial_record.csv`, `indicator_observation.csv`, `publication_review.csv`, and `source_capture.csv`.

### 3.5 Other modified file — 1

`scripts/validate-research-foundation.mjs`.

### 3.6 Deprecation classification

The document index contains exactly one entry for each of the 42 research Markdown files:

- 16 `CANONICAL`
- 18 `SUPPORTING`
- 4 `SUPERSEDED`
- 4 `DEPRECATED`
- 0 unlisted

Superseded files are `CANONICAL_TAXONOMIES.md`, `DATA_INGESTION_CONTRACT.md`, `EVIDENCE_GOVERNANCE_AND_VERIFICATION.md`, and `RESEARCH_TEMPLATES_GUIDE.md`.

Deprecated files are `RESEARCH_TO_DEV_HANDOFF.md`, `SUPABASE_DATA_CONTRACT_AND_ENTITY_MAP.md`, `TAT_SUPABASE_DATA_CONTRACT_V1.md`, and `TAT_SUPABASE_ENTITY_RELATIONSHIP_MAP.md`.

All eight retired files have visible top-of-file notices and point to replacements. However, active supporting documents still contain operative Supabase language; see section 8.

## 4. Original blocker verification

### G-01 — canonical machine-readable vocabulary

**FAIL — OPEN BLOCKER.**

`canonical-vocabulary.v1.1.json` is valid JSON and contains useful lists, but it is not a complete or enforced source of truth:

- It has no canonical registry for the five public groups, 15 research sector IDs, hierarchy levels, or parent relationships.
- Across 59 schema enum declarations, only 23 exactly match a vocabulary array; 36 enum declarations have no exact canonical set.
- Important absent namespaces include claim types, claim-source relationship types, contradiction severity/resolution, record subtype codes, source types/statuses, count/aggregation basis, review gates, and timeline event stages.
- Active schemas still accept deprecated aliases: `physical-project`, `policy-reform`, `programme-intervention`, `social-services`, `exact-day`, numeric source levels `1`–`6`, and the old combined classification codes.
- Active example templates use `physical-project`, umbrella sectors such as `infrastructure`/`economy`, `social-services`, `exact-day`, and freshness status `current`.
- `achievement_record.classification` and indicator `data_classification` still combine value nature, source origin, and review lifecycle despite the contract prohibiting an overloaded classification field.
- The status standard combines workflow and publication codes into a list that matches neither `workflow_statuses` nor `publication_statuses` in the vocabulary.
- The active timeline schema uses `funding_release`, while canonical implementation and financial vocabularies use `funding_released`.

The resolution log and compliance matrix therefore incorrectly mark G-01 and all related schema-drift findings as closed.

### G-02 — claim/source many-to-many architecture

**PASS — BLOCKER CLOSED AT THE INTERCHANGE-CONTRACT LEVEL.**

- `claim_extraction` no longer contains or requires `source_id`.
- `claim_source_relationship` contains `claim_id`, `source_id`, relationship-bound `source_role`, relationship type, evidence locator, summary, limitation, review fields, and supersession.
- Repeating a `record_id` supports one record to many claims.
- Repeating a `claim_id` across relationship rows supports one claim to many sources.
- Repeating a `source_id` across relationship rows supports one source to many claims.
- The same source may carry different roles on different claim relationships.

Database foreign keys and composite uniqueness remain engineering requirements. The research validator currently does not verify that relationship IDs resolve across CSV files.

## 5. High-severity correction verification

| Correction | Result | Finding |
|---|---|---|
| Hierarchical sectors | PARTIAL | Human-readable three-level model exists; vocabulary omits sector registry and active schemas/templates accept umbrella and legacy codes as canonical record sectors. |
| 21 implementation statuses | PASS | Canonical JSON and core record status schemas contain the same 21 codes. |
| Six-tier source hierarchy | PARTIAL | Canonical list is correct, but `source_level` is not required and its schema accepts numeric aliases. |
| 11 source roles | PASS | Vocabulary, standard, and relationship schema align; role is relationship-bound. |
| Classification-dimension separation | FAIL | Contract prose is correct, but achievement and indicator schemas retain combined classification fields. |
| Structured date precision | PARTIAL | Structured fields exist; active schemas and `timeline_event.csv` still accept/use `exact-day`. |
| Financial-value classification | PASS WITH ENGINEERING CONDITION | Eleven types, exact amount, currency, dates, geography, aggregation basis, claim link, methodology, and limitation exist. Cross-row aggregation restrictions are not executable in this validator. |
| Beneficiary stages | PASS | Six stages and supporting period/geography/cohort/deduplication fields exist. |
| Relationship interchange | PASS | New normalized claim-source template/schema closes G-02. Cross-file integrity remains unvalidated. |
| Quality-control gates | PASS | Six macro gates preserve all ten named responsibilities. |
| Eight-stage roadmap | PASS | All eight required phases are restored. |
| Risk register | PASS | 28 owned risks cover the requested research, security, copyright, workflow, schema, cost, and Cloud SQL areas. |
| Legacy-document deprecation | PARTIAL | Eight direct banners and a complete 42-file index exist, but active supporting documents contain stale Supabase instructions. |
| Public/internal boundaries | FAIL | The active supporting boundary document still defines “RLS Rules,” only three write roles, and outdated combined fields. |
| Supabase deprecation | PARTIAL | Named Supabase contracts are deprecated, but active blueprint, objectives, workflow, governance, record taxonomy, and handoff material still contain operational Supabase assumptions. |
| Firebase implementation boundary | FAIL | Canonical/supporting research documents prescribe specific Firebase mechanisms while claiming implementation neutrality. |

## 6. Truth-rule mapping

The reduction from 18 principles to 13 numbered rules is **B — loss or weakening of at least one required safeguard**. Seventeen principles remain substantively represented; the prohibition on removing material qualifications is only partially preserved and is not an explicit immutable invariant in the active master contract.

| Original principle | Contract v1.1 rule or control | Verdict |
|---|---|---|
| No fabrication | Rule 1, Never Fabricate | PASS |
| No inflation | Rule 2, Never Inflate Figures | PASS |
| No reporting-period manipulation | Rule 3 plus structured period model | PASS |
| Announcement != completion | Rules 4 and 8 plus forbidden transition in status standard | PASS |
| Approval != funding | Rule 5 | PASS |
| Funding != release | Rule 6 | PASS |
| Release != expenditure | Rule 7 | PASS |
| Target != actual | Rule 10 | PASS |
| Applicant != beneficiary | Rule 11 | PASS |
| Approved beneficiary != disbursement recipient | Rule 12 | PASS |
| Government-reported != independently verified | Rule 13 | PASS |
| Material qualifications cannot be removed | Qualified publication and limitation fields exist, but the master contract does not state non-removability and the superseded taxonomy carries the clearest wording | PARTIAL |
| Contradictions preserved | Contradictory relationship role, Gate 2, contradiction protocol | PASS |
| Corrections preserved | Correction/revision record type, correction schema, Gate 5 | PASS |
| Provenance preserved | Source identity, relationship locators, source-role and archive requirements | PASS |
| Historical versions preserved | Gate 5 version audit and active versioning/correction standard | PASS |
| Public wording cannot exceed evidence | Section 2 critical rule | PASS |
| Positive selection cannot alter truth standards | Section 2 critical rule | PASS |

Required correction: add the five governance safeguards as explicit numbered or separately named mandatory invariants, especially an enforceable rule that qualifications, limitations, contradictions, corrections, provenance, and historical versions cannot be silently removed.

## 7. Firebase implementation-boundary findings

**FAIL.** Research may define required outcomes—public/private separation, role separation, approval, auditability, and least privilege—but Contract v1.1 crosses into implementation mechanisms:

- The master contract declares Firebase Hosting, Authentication, SQL Connect, Cloud SQL, and the Admin SDK as canonical target/execution mechanisms.
- The canonical resolution log prescribes `@auth`, `@check`, `@redact`, custom claims, connector projections, and Admin SDK isolation.
- The canonical operating model assigns database/auth roles and Admin SDK privileges.
- The canonical risk register prescribes connector operations, ADC/IAM, Cloud SQL sizing, PITR, and bucket controls.
- `TAT_INTERNAL_PUBLIC_DATA_BOUNDARY.md`, classified as an active supporting security standard, still prescribes generic RLS rules even though the project deprecates Supabase RLS.

Supabase RLS is a PostgreSQL/Data API row-access mechanism; SQL Connect authorization is expressed at schema and operation boundaries and the Admin SDK is a trusted server mechanism. They are not interchangeable. See the official [Supabase RLS guide](https://supabase.com/docs/guides/database/postgres/row-level-security), [Firebase SQL Connect authorization guide](https://firebase.google.com/docs/sql-connect/authorization-and-security), and [SQL Connect Admin SDK guide](https://firebase.google.com/docs/sql-connect/admin-sdk).

Required correction: make the master research contract implementation-neutral. Move all Firebase-specific choices into engineering documents labelled **NON-CANONICAL ENGINEERING RECOMMENDATION**. Rewrite the active public/internal boundary as requirements and retire its RLS section.

## 8. Human-review threshold findings

**CONDITIONAL PASS.** The ₦100 billion/$100 million and 500,000-beneficiary thresholds are not the sole definitions of “major.” Human review is also triggered by high/critical risk, security/strategic sensitivity, contradiction, legal exposure, and politically sensitive causal claims. Mandatory human approval also exists before publication generally.

The numeric values have no recorded derivation, owner, review cadence, currency-conversion date, inflation adjustment, or sector-relative materiality rule. Hard-coding them into canonical risk descriptions can under-escalate smaller but highly material claims and will age poorly.

Required correction: make risk tier, sensitivity, uncertainty, contradiction, legal/reputational exposure, and contextual materiality the primary triggers. Retain numeric values only as configurable automatic escalation floors with documented rationale, owner, effective date, currency conversion rule, and periodic review.

## 9. Canonical vocabulary consistency findings

| Focus | Result | Evidence |
|---|---|---|
| `funding_released` vs `released_funding` | PARTIAL | `funding_released` is canonical in active finance/status artifacts; `released_funding` remains inside a visibly deprecated legacy document. Active timeline code `funding_release` is an unregistered third spelling. |
| Publication vs workflow status | FAIL | Vocabulary defines two six-code namespaces; the master uses workflow codes, the status standard merges them, and templates use only publication decisions. |
| Correction status | PARTIAL | Seven correction types are canonical, but there is no canonical correction lifecycle/status set. Contradiction `resolution_status` is a separate uncontrolled local enum. |
| Source hierarchy | PARTIAL | Six canonical `LEVEL_#` values exist; source schema also accepts numeric aliases and does not require the field. |
| Relationship types | FAIL | `supports`, `contradicts`, `replaces`, `contextualises`, and `discovery_only` exist only in the relationship schema, not the canonical vocabulary. |
| Evidence profiles | PASS | Eight codes align between vocabulary and the evidence-profile standard. |
| Beneficiary stages | PASS | Six codes align across vocabulary, schema, template, and contract. |
| Date precision | PARTIAL | Seven canonical snake_case codes exist; active source/timeline schemas retain `exact-day`, and timeline example uses it. |
| Sector identifiers | FAIL | Fifteen IDs are documented, but absent from the vocabulary; schemas mix them with public umbrella and legacy aliases. |
| Classification dimensions | FAIL | Atomic claims use split fields; achievement/indicator schemas still use an overloaded 13-code classification set. |

There is not yet exactly one spelling and namespace for every controlled concept.

## 10. Validator findings

### Behaviors that pass

- Uses AJV and compiles all 19 paired Draft-07 schemas.
- Strictly parses quoted CSV, including escaped quotes and embedded commas/newlines.
- Validates all current CSV rows against their paired schemas.
- Checks nonblank required fields, URLs, identifiers, dates, currencies, amount precision, counts, percentages, pipe-delimited values, and example markers.
- Returns non-zero for malformed CSV and invalid schema/domain values.
- The safe invalid finance/beneficiary test returned 13 errors and exit 1.
- The malformed quote test returned one parser error and exit 1.

### Behaviors that fail or remain incomplete

- Vocabulary validation checks version and minimum array lengths only.
- It does not validate uniqueness, exact counts, object structure, or schema enums against the vocabulary.
- It does not detect deprecated aliases.
- It accepts the active deprecated codes already present in schemas/templates.
- It does not verify claim, source, record, geography, or batch references across files.
- It does not enforce composite uniqueness for claim-source relationships.
- Its only embedded negative assertion tests one invalid financial enum.
- It has no persistent positive/negative fixture suite for relationships, deprecated codes, dates, beneficiaries, or vocabulary drift.
- The non-production check accepts any field containing the word `EXAMPLE`, rather than requiring an approved explicit marker field/value.
- It requires only 36 of the 42 indexed research documents.

### Decisive false-positive test

Temporary, restored mutations:

1. Changed vocabulary code `funding_released` to `released_funding` while schemas retained `funding_released`.
2. Changed a relationship to nonexistent `[MISSING-CLM-999]` and `[MISSING-SRC-999]` references.
3. Removed its explicit marker field/value while leaving an example-like identifier.

Result: `npm run validate:research` returned **exit 0** and reported `VALIDATION PASSED: 0 errors`.

This proves the validator's “canonical vocabulary validated successfully” message does not establish canonical consistency or referential readiness.

## 11. Application and dependency test results

| Command/check | Result | Classification |
|---|---|---|
| `npm install` | PASS; no worktree changes | Dependency warnings only |
| npm dependency report | 28 vulnerabilities: 3 low, 5 moderate, 19 high, 1 critical | Pre-existing dependency risk |
| `npm run validate:research` on restored repository | PASS: 36 docs, 19 schemas, 19 templates | Contract validator baseline |
| Vocabulary/reference false-positive mutation | Unexpected PASS, exit 0 | Contract v1.1 validator failure |
| Invalid finance/beneficiary mutation | Expected FAIL, 13 errors, exit 1 | Validator behavior correct |
| Malformed quoted CSV mutation | Expected FAIL, 1 error, exit 1 | Validator behavior correct |
| `npm run typecheck` | Unavailable; no script | Tooling issue |
| `npm run lint` | Wrapper failed before ESLint because `&` in workspace path caused bad binary resolution | Environment/package-script portability issue |
| Direct local ESLint | 13 errors, 10 warnings | Pre-existing frontend/configuration issues; Contract v1.1 changed no frontend files |
| `npm run test -- --run` | Wrapper failed before Vitest for the same path issue | Environment/package-script portability issue |
| Direct local Vitest | PASS: 6 files, 26 tests | Application pass |
| `npm run build` | Wrapper failed before Vite for the same path issue | Environment/package-script portability issue |
| Direct local TypeScript | PASS | Application pass |
| Direct local Vite build | PASS: 3,491 modules | Application pass with warnings |
| Build warnings | Browserslist data seven months old; main chunk 526.29 kB | Pre-existing non-blocking warnings |

All temporary negative-test changes were restored. The application build generated no tracked worktree change.

## 12. Remaining blockers

### B-01 — canonical vocabulary is neither complete nor enforced

Schemas and examples still accept multiple spellings and mixed conceptual dimensions, while the validator does not compare them to the claimed authority. G-01 remains open.

### B-02 — validator provides false implementation-readiness confidence

Vocabulary drift and broken claim/source references pass with exit 0. Mission 02 or a schema prototype would encode data that cannot be treated as canonically resolved.

## 13. Remaining high findings

1. Active schemas/templates retain deprecated aliases and five-group sector codes.
2. Classification separation is asserted but not implemented across achievement and indicator interchange contracts.
3. Workflow and publication namespaces conflict across master contract, vocabulary, standard, schemas, and templates.
4. Firebase-specific mechanisms leak into the canonical research contract, while the active boundary standard still prescribes RLS.
5. Active supporting documents retain operative Supabase assumptions despite the deprecation claim.
6. Resolution and compliance documents claim all findings are closed/100% passed contrary to executable evidence.

## 14. Remaining medium findings

1. Numeric human-review thresholds lack a governance rationale and lifecycle.
2. Relationship schemas have no executable cross-file FK or composite-uniqueness checks.
3. Thirty-six schema enum declarations are outside an exact canonical vocabulary set; some are legitimate local domains but are undocumented as such.
4. The explicit “material qualifications cannot be removed” truth safeguard is weakened.
5. The validator's document list covers 36 of 42 indexed research documents.
6. Package scripts are not portable to this Windows workspace path containing `&`.
7. `npm install` reports 28 dependency vulnerabilities.

## 15. Remaining low findings

1. Incoming Research 01.1 Markdown adds trailing-space hard breaks that make commit-level `git diff --check` noisy.
2. Canonical/supporting status is centralized in the document index rather than repeated in every active document.
3. Browserslist data is stale and the main production chunk exceeds 500 kB.
4. The reported template-modification count was inaccurate even though the total changed-file count was correct.

## 16. Required corrections

1. Publish Contract v1.1.1 with a complete vocabulary registry for sectors, relationship types, claim types, event types, record subtypes, source types/statuses, review gates, correction lifecycle, and other controlled local domains.
2. Define whether publication and workflow are one lifecycle or two independent fields; make the master, standard, schemas, and templates match exactly.
3. Remove all deprecated aliases from active schemas and convert all 19 example rows to canonical v1.1 codes.
4. Replace combined `classification`/`data_classification` fields with distinct value-nature, source-origin, verification, and workflow/publication fields where applicable.
5. Make source level required and allow only `LEVEL_1` through `LEVEL_6`.
6. Add validator checks for exact vocabulary/schema equality, unique codes, deprecated codes, cross-file references, relationship uniqueness, date-period consistency, and approved example markers.
7. Add permanent negative fixtures and CI execution for every required validator behavior.
8. Rewrite active Supabase/RLS material or reclassify it as deprecated; do not leave operative Supabase instructions in supporting standards.
9. Move Firebase connector/Auth/Admin SDK/Cloud SQL mechanisms out of canonical research documents into clearly non-canonical engineering recommendations.
10. Restore the material-qualification safeguard as an explicit immutable truth rule.
11. Convert numeric review thresholds into governed, configurable escalation triggers subordinate to contextual materiality and risk.
12. Correct the resolution log and compliance matrix so open/partial findings are not marked closed or 100% pass.

## 17. Final Mission 01 decision

**NO. Research Mission 01 may not receive final approval.**

The human-readable design is close, but the machine contract and validator do not yet support the claim of a single canonical, implementation-safe data contract.

## 18. Firebase prototype decision

**NO. Codex should not begin the local-only Firebase SQL Connect prototype against Contract v1.1.**

Doing so would encode deprecated sectors, mixed classifications, and conflicting workflow/publication codes. Begin only after Contract v1.1.1 and its validator pass the same re-audit.

## 19. Frontend V2 decision

**NO. Frontend V2 transformation should not begin against Contract v1.1.**

Presentation-only design exploration that does not bind to contract types could be separately authorized, but generated types, adapters, filters, and data integration must wait for canonical code closure.

## 20. Research Mission 02 decision

**NO. Research Mission 02 must not begin.**

Pilot records would preserve legacy aliases and ambiguous classifications, defeating the purpose of the pilot and creating avoidable migration/reconciliation work.

## 21. Exact next mission

**Research Mission 01.1A — Contract v1.1.1 Canonical Vocabulary and Validator Closure**

Exit criteria:

1. All controlled schema enums are either exactly registry-backed or explicitly documented as local non-canonical domains.
2. No active schema or template accepts a deprecated alias.
3. All 19 templates use canonical codes.
4. Classification and publication/workflow dimensions are structurally consistent.
5. Cross-file claim/source/record/geography/batch references are validated.
6. Permanent negative fixtures demonstrate non-zero exits for vocabulary drift, deprecated codes, missing references, malformed CSV, invalid finance/beneficiary/date values, and missing markers.
7. Active Supabase/RLS instructions are removed or deprecated, and Firebase mechanisms are moved to non-canonical engineering documents.
8. Truth-rule and human-review policy corrections are approved.
9. Resolution/compliance matrices accurately reflect executable evidence.
10. A clean final re-audit returns `PASS — RESEARCH MISSION 01 FINALLY APPROVED` before any prototype, Frontend V2 contract integration, or Research Mission 02 work begins.
