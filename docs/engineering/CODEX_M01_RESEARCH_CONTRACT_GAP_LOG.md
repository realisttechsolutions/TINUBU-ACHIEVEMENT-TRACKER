# Codex Mission 01 Research Contract Gap Log

**Overall contract verdict:** **CONDITIONAL PASS.** Mission 01 is a useful research foundation, but its “100% PASS” claim is not supported. Open blockers prevent final approval and Research Mission 02 data collection against the current contract.

## Findings

| ID | Severity | Status | Gap and evidence | Required correction / gate |
|---|---|---|---|---|
| G-01 | BLOCKER | OPEN | There is no single canonical machine-readable vocabulary. Status/classification/source/profile values conflict across canonical docs, six legacy docs, JSON schemas and frontend types. | Publish contract v1.1 code registries and exhaustive crosswalks; schemas and adapters must consume them. |
| G-02 | BLOCKER | OPEN | `claim_extraction` requires one `source_id`, while the architecture requires claim-to-source many-to-many and separately names both `source_relationships` and `claim_source_relationships`. | Remove claim-side source FK from interchange; add a claim-source relationship template/schema with role/location/relationship/review fields. |
| G-03 | HIGH | OPEN | Five umbrella sectors are both public navigation and database canonical sectors, forcing distinct domains into misleading parents. | Keep five public groups; use approximately 15 granular canonical research sectors with hierarchical/configurable subsectors. |
| G-04 | HIGH | OPEN | The 35-entity map is primarily a list. The fuller legacy document contains DDL for only a few tables and uses unenforceable polymorphic `entity_type/entity_id`. | Approve the 27-table logical design and prototype it locally before migrations. |
| G-05 | HIGH | OPEN | Supabase RLS/Auth assumptions do not translate one-to-one. Proposed `TO authenticated` role logic is too broad and SQL Connect authorization is operation-level. | Design public/staff/admin connectors with `@auth`, filters, CEL, `@check`, `@redact`, transactions and Admin-only operations. |
| G-06 | HIGH | RESOLVED IN AUDIT | Baseline validator compiled schemas but never applied them to CSV rows; a deliberately invalid row passed with exit 0. | Validator repaired; keep the correction and add permanent automated negative fixtures in the next mission. |
| G-07 | HIGH | OPEN | Most dates/reporting periods are unconstrained strings; month/quarter/year/range semantics can create false precision. | Add date precision, value/start/end/label/provisional fields and cross-field constraints to schemas/database design. |
| G-08 | HIGH | OPEN | Financial schema has only five types, conflates FEC-approved contract with generic approval/contract value, and lacks aggregation/geography precision. | Adopt 11 financial classes, exact decimal/currency handling, period/geography/basis, claim evidence and aggregation rules. |
| G-09 | HIGH | OPEN | Beneficiary schema omits eligible applicant, unit, geography, cumulative/period basis, cohort and double-counting controls. | Extend schema and database constraints; never aggregate stages or overlapping cohorts by default. |
| G-10 | HIGH | OPEN | Eighteen templates do not cover institutions, sector hierarchy, geographies, relationship tables, roles or reference imports needed by the database. | Add a manifest-backed relational import package/templates or document authoritative pre-seeded lookup/version rules. |
| G-11 | HIGH | OPEN | Legacy canonical taxonomy uses a five-tier hierarchy where Level 5 is think tanks; corrected docs use six tiers where Level 5 is official statements and Level 6 discovery. Frontend supports only 1-5. | Declare the six-tier standard authoritative; keep Level 6 internal; map public display intentionally. |
| G-12 | HIGH | OPEN | Claim verification status and programme/project status are unconstrained in several schemas. | Add canonical enum/code references and transition/semantic tests. |
| G-13 | MEDIUM | OPEN | Six earlier `docs/research` documents overlap the 31 correction-pass files without deprecation banners or authority rules. | Mark superseded docs, add a canonical index and stop validators/compliance claims from treating file existence as consistency. |
| G-14 | HIGH | OPEN | The five-gate document does not explicitly preserve all ten required controls; Research Task Approval, Database Readiness and Post-Publication Review are absent as enforceable checkpoints. | Replace with the six-gate/ten-responsibility model below and require evidence per responsibility. |
| G-15 | HIGH | OPEN | The five-phase roadmap collapses or omits Geographic Expansion, Outcome/Evidence Deepening and Historical Reconciliation. | Restore the eight named roadmap responsibilities and place database implementation behind contract approval. |
| G-16 | HIGH | OPEN | Risk register contains only five entries and omits most required research, security, copyright, operational and Firebase/Cloud SQL risks. | Expand and assign owner, likelihood, impact, triggers and mitigation for the risk inventory below. |
| G-17 | HIGH | OPEN | Public/internal boundary is expressed mainly as row filtering while internal columns coexist with public fields. | Expose explicit public connector projections; test response shapes; store restricted data separately. |
| G-18 | HIGH | OPEN | Frontend types use display labels/kebab-case and embed nested sources/milestones, conflicting with snake_case relational schemas. | Keep them as view models; create exhaustive adapters from generated SQL Connect operation types. |
| G-19 | MEDIUM | OPEN | `src/data/**` contains public-looking static claims and values outside the Mission 01 research pipeline. | Treat as prototype content only; do not import automatically; plan reviewed cutover and remove dual-source truth. |
| G-20 | LOW | OPEN | Documentation/count claims conflict: validator heading said 30; canonical required array has 31; directory contains 37; legacy guide says 17 templates. | Use generated inventory output and clarify canonical versus legacy counts. |
| G-21 | HIGH | OPEN | `npm install` reports 28 vulnerabilities, including one critical. | Run a separate dependency/security remediation with lockfile review and regression tests; do not blind-run `npm audit fix`. |
| G-22 | MEDIUM | OPEN | No `typecheck` npm script. In this Windows path containing `&`, npm binary shims for Vite/ESLint/Vitest/tsc resolve outside the repository. | Add portable Node-based scripts or move/escape the workspace; test on Windows CI. |
| G-23 | MEDIUM | OPEN | No approved region, Cloud SQL size/HA/PITR/backup owner, budgets or restore objective exists. | Complete cost/operations readiness before provisioning. |
| G-24 | HIGH | OPEN | Storage/copyright/retention rules are absent despite proposed source files and snapshots. | Approve two-bucket separation, metadata, lawful capture, retention, private access and takedown process before Storage use. |
| G-25 | MEDIUM | OPEN | Correction and record version concepts overlap; two “Correction” entities appear in the 35-universe narrative. | Use one `corrections` table plus supporting `record_versions`; define public versus internal revision behavior. |
| G-26 | MEDIUM | OPEN | `under_review`, `corrected`, `withdrawn` and `archived` are reused across implementation, classification, publication and freshness concepts. | Namespace/split implementation status, value nature, reporting origin, verification and publication lifecycle. |
| G-27 | MEDIUM | OPEN | Source content storage can encourage copyright over-collection; evidence location is not bounded. | Store citation, locator, summary, hash and lawful archive/file reference; prohibit routine full-text copying. |
| G-28 | MEDIUM | OPEN | Compliance matrix equates document existence/size with substantive correctness and marks untested behaviors PASS. | Regenerate compliance evidence from executable tests and the engineering audit matrix. |

## Canonical terminology recommendation

### Fixed database codes

- Date precision, visibility class, relation direction/type, financial type, count basis and period kind.
- Keep database codes snake_case. Kebab-case and title case are presentation/URL concerns only.

### Relational lookup/configurable taxonomies

- Sectors/subsectors, institutions, geographies, record subtypes, policy/programme/project types, beneficiary types and source types.
- Each row needs stable code, label, definition, version/active dates and aliases where applicable.

### Workflow state

- Publication status, verification status, review gate/decision, correction state and freshness state.
- Enforce allowed transitions and immutable decisions; do not mix these values into implementation status.

### Ordinary content

- Titles, summaries, limitations, evidence summaries, evidence locations, qualification notes and human reporting labels.

## Six gates preserving all ten responsibilities

| Gate | Preserved responsibilities | Exit evidence |
|---|---|---|
| 0. Task authorization | 1. Research Task Approval | Approved scope, risk, actors and target contract version. |
| 1. Source and claim capture | 2. Source Identity; 3. Claim Extraction | Canonical source metadata; atomic claims; lawful locator. |
| 2. Resolution and evidence | 4. Entity and Taxonomy; 5. Evidence and Contradiction | Resolved IDs; roles; duplicate/contradiction results. |
| 3. Automated data readiness | 6. Schema Validation; 9. Database Readiness | Parser/schema/semantic/FK/idempotency/dry-run pass. |
| 4. Editorial and human approval | 7. Editorial Review; 8. Human Approval | Risk-appropriate distinct reviewers and publish decision. |
| 5. Publication and stewardship | 10. Post-Publication Review | Public projection check, correction/version/freshness owner and schedule. |

The current five-gate document does not supply Gate 0 or Gate 5 and treats database readiness as a format linter rather than referential/import readiness.

## Roadmap correction

Retain these responsibilities as named stages, even if calendar work overlaps:

1. Foundation
2. Pilot Dataset
3. Core National Records
4. Sector Expansion
5. Geographic Expansion
6. Outcome/Evidence Deepening
7. Historical Reconciliation
8. Continuous Monitoring

Add the Firebase contract/emulator engineering mission after Foundation and before Pilot Dataset. Database implementation is an engineering gate, not a replacement for a research stage.

## Risk-register expansion

The revised register must cover, at minimum:

- insufficient official data and restricted/security-sensitive data
- broken links, source disappearance and archive integrity
- conflicting figures, stale data, duplicate records and circular sourcing
- status, financial and beneficiary misclassification
- AI hallucination, unsupported causal claims and overstatement pressure
- copyright, data protection and retention/takedown
- schema/taxonomy drift and research-development misalignment
- review backlog, translation inconsistency and human-review capacity
- corrections/version loss and unreviewed rollback
- authorization misconfiguration, public-field leakage, credential/service-account compromise and Admin SDK bypass
- importer partial commits, idempotency failure and production/staging confusion
- Firebase/Cloud SQL cost escalation, quota exhaustion and query abuse
- Cloud SQL availability, backup/PITR failure, restore failure and region/data-residency decisions
- Storage exposure, permanent restricted download URLs and excessive evidence capture
- third-party/API/official-site format change and vendor product change

Every risk needs owner, likelihood, impact, trigger/indicator, preventive control, contingency and review date. A five-row list is not a usable operational risk register.

## Release gates

Research Mission 01 receives final approval only when G-01, G-02, G-07, G-08, G-09, G-10, G-11, G-12, G-14, G-15 and G-16 are closed and validation fixtures pass.

Research Mission 02 should **not begin now**. Its five-record pilot would encode unresolved vocabulary/evidence/date/value ambiguities.

Firebase cloud implementation should **not begin now**. A local, non-provisioning SQL Connect contract/emulator prototype is the next appropriate engineering mission after contract remediation is approved.
