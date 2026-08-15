# Codex Final Closure Audit — Research Mission 01

**Audit:** Contract v1.1.1 Independent Verification

**Audited branch:** `research/mission-01-contract-v1.1.1`

**Audited commit:** `8455a5fb50280fa9311f4bdae03bdb3085d9bc2e`

**Audit branch:** `audit/codex-m01-final-closure`

**Previous Codex re-audit commit:** `bf44564a6cf98d6a82e1bbc20ae1626fec568fd7`

**Audit date:** 2026-08-15
**Scope:** Audit only; no Firebase, Cloud SQL, migration, frontend, production-data, harvesting, or Mission 02 implementation work was performed.

## A. Executive Verdict

> **FAIL — RESEARCH CONTRACT REMAINS UNSAFE**

Contract v1.1.1 materially improves the research foundation. The current 19 schemas and 19 examples are internally aligned to a new 43-namespace registry; the many-to-many claim-source model is sound; current foreign keys covered by the validator resolve; all 18 substantive truth safeguards are present; and the restored baseline validator exits 0.

Final closure is nevertheless unsafe because the executable evidence contradicts several closure claims:

1. Removing a canonical enum from a schema still produces validator exit 0. The claimed bidirectional equality check is one-way only.
2. A timeline `event_date` that contradicts `date_precision` produces exit 0.
3. A sector paired with the wrong public parent group produces exit 0.
4. A nonexistent `duplicate_review.record_id_1` produces exit 0; that template's three record references are not checked.
5. The permanent suite has 13 negative fixtures and zero positive fixtures. It omits required identifier, required-field, source-role, financial-value, and other end-to-end coverage; NEG-13 is not a rejection test.
6. The definitive document index contains 42 entries while 43 Markdown documents exist. The validator claims 43 “indexed” documents from its own hardcoded list without parsing the index.
7. The purported 90-point matrix contains only 30 enumerated evidence items and includes demonstrably unsupported PASS claims.
8. Both vocabulary v1.1 and v1.1.1 describe themselves as authoritative. Six active canonical documents still direct readers to v1.1, and the index still classifies the Firebase-specific v1.1 contract as CANONICAL.
9. The contract says four classification dimensions while defining five independently stored namespaces.
10. Financial and beneficiary materiality below the numerical floors are not explicit qualitative human-review triggers.

The clean baseline is therefore evidence that the supplied examples satisfy the current checks, not evidence that the contract is durably closed or implementation-safe.

## B. Git Verification

| Check | Evidence | Result |
|---|---|---|
| Remote | `origin https://github.com/realisttechsolutions/TINUBU-ACHIEVEMENT-TRACKER.git` | PASS |
| Expected remote branch | `git ls-remote` returned `8455a5f... refs/heads/research/mission-01-contract-v1.1.1` | PASS |
| Expected commit | Commit object exists; subject is `research: close canonical vocabulary and validator contract v1.1.1` | PASS |
| Local branch head | `research/mission-01-contract-v1.1.1` = `8455a5f...` | PASS |
| Remote-tracking head | `origin/research/mission-01-contract-v1.1.1` = `8455a5f...` | PASS |
| Audit branch start | `audit/codex-m01-final-closure` was created at `8455a5f...` | PASS |
| Working tree at start | Clean | PASS |
| Direct ancestry from previous re-audit | `git merge-base --is-ancestor bf44564... 8455a5f...` exited 1 | FAIL |
| Merge base | Both commits descend independently from `ac0c2dffb427d3c4b438a8aaafbd3a75639d853c` | INFO |
| Previous report preservation | The prior audit report is byte-identical between `bf44564...` and `8455a5f...` | PASS (content), not ancestry |
| Frontend/production paths in v1.1.1 delta | No changes under `src`, `public`, `supabase`, `firebase`, `migrations`, or `data` | PASS |

The expected commit has one parent, `ac0c2dffb427d3c4b438a8aaafbd3a75639d853c`. The previous Codex commit is a sibling rather than an ancestor. Its audit document was preserved by identical content, but the requested ancestry assertion is false.

## C. B-01 Verification

**Previous blocker:** the machine-readable canonical vocabulary was incomplete and unenforced.

**Required resolution:** publish one unambiguous, complete registry; align every controlled schema enum exactly; reject both extra schema codes and missing canonical schema codes; remove deprecated active aliases; enforce hierarchy relationships.

**Implementation evidence:** `canonical-vocabulary.v1.1.1.json` contains 43 unique arrays, 15 sectors with valid parent-group references, and no duplicate codes. Independent comparison found 71 enum-bearing schema properties: 70 registry-backed properties exactly equal their mapped registry sets and one local boolean-string enum (`truth_rules_audit_pass`). Current schemas/templates do not accept the tested deprecated aliases.

**Contrary evidence:**

- The validator iterates schema values and rejects only values absent from the registry. It never checks registry values missing from a mapped schema.
- Removing unused canonical code `savings_estimate` from `financial_record.schema.json` returned exit 0 and printed “all enums verified.”
- The old `canonical-vocabulary.v1.1.json` remains present and calls itself authoritative, without a deprecation marker.
- Six documents classified CANONICAL still point operationally to v1.1: `TAT_EVIDENCE_PROFILE_STANDARD.md`, `TAT_QUALITY_CONTROL_GATES.md`, `TAT_RESEARCH_ROADMAP.md`, `TAT_RESEARCH_RISK_REGISTER.md`, `TAT_SECTOR_TAXONOMY.md`, and `TAT_SOURCE_HIERARCHY.md`.
- A parent/sector mismatch in an example row returned exit 0.

**B-01 result: FAIL.** The registry content is substantially complete, but authority and enforcement are not closed.

## D. B-02 Verification

**Previous blocker:** the validator provided false implementation confidence and the interchange contract did not safely enforce claim-source and cross-file relationships.

**Required resolution:** model claim/source many-to-many relationships, validate all relevant foreign keys and relationship uniqueness, and make negative failures reliably nonzero.

**Implementation evidence:**

- `claim_extraction` no longer contains or requires `source_id`.
- `claim_source_relationship` requires `claim_id`, `source_id`, relationship-bound `source_role`, `relationship_type`, `evidence_location`, and evidence summary.
- Relationship type supports `supports`, `contradicts`, `replaces`, `contextualises`, and `discovery_only`.
- A missing relationship `source_id` returned exit 1.
- A duplicate composite relationship returned exit 1.
- The current examples' checked claim, source, record, and indicator references resolve.

**Contrary evidence:**

- `duplicate_review.record_id_1`, `record_id_2`, and `primary_record_id` are not checked. A nonexistent `record_id_1` returned exit 0.
- `superseded_by_relationship_id` is identifier-validated when nonblank but is not referentially resolved.
- Primary identifier uniqueness is not enforced across template rows.
- Vocabulary equality, date-field wiring, hierarchy pairing, registry truth, and fixture completeness still yield false-positive readiness output.

**B-02 result: FAIL (partial closure only).** The core claim-source relationship and its direct claim/source checks are closed; the broader false-confidence blocker is not.

## E. Canonical Vocabulary Audit

Independent results: exactly **43** array namespaces, no missing code-bearing entries, no duplicate codes, and no invalid `canonical_sectors.parent_public_group` references. The exact registry is:

| # | Namespace | Count | Exact codes |
|---:|---|---:|---|
| 1 | `public_navigation_groups` | 5 | `economy`, `security`, `infrastructure`, `social_services`, `governance` |
| 2 | `canonical_sectors` | 15 | `economy_fiscal_reforms`, `security_national_stability`, `infrastructure_transportation`, `agriculture_food_security`, `education_human_capital`, `healthcare_public_health`, `social_protection_human_development`, `youth_employment_skills`, `power_energy_natural_resources`, `digital_economy_science_innovation`, `housing_urban_development`, `environment_climate`, `governance_public_service`, `foreign_affairs_international_cooperation`, `culture_tourism_creative_economy` |
| 3 | `sector_hierarchy_levels` | 3 | `LEVEL_1_GROUP`, `LEVEL_2_SECTOR`, `LEVEL_3_SUBSECTOR` |
| 4 | `record_types` | 20 | `achievement`, `policy`, `reform`, `executive_action`, `legislation`, `regulation`, `programme`, `intervention`, `physical_project`, `institutional_reform`, `reported_outcome`, `timeline_event`, `milestone`, `indicator`, `indicator_observation`, `source`, `correction_revision`, `report`, `dataset`, `methodology` |
| 5 | `policy_types` | 6 | `national_policy`, `executive_order`, `statutory_act`, `regulatory_framework`, `presidential_directive`, `strategic_roadmap` |
| 6 | `project_types` | 12 | `highway_road`, `bridge_tunnel`, `rail_system`, `port_maritime`, `airport_aviation`, `power_plant_grid`, `housing_estate`, `hospital_health_center`, `school_educational_facility`, `water_dam_irrigation`, `digital_broadband`, `public_building` |
| 7 | `programme_types` | 8 | `social_investment`, `financial_credit`, `youth_employment`, `agricultural_intervention`, `industrial_acceleration`, `health_intervention`, `energy_access`, `digital_transformation` |
| 8 | `implementation_statuses` | 21 | `proposed`, `announced`, `approved`, `enacted`, `effective`, `funded`, `funding_released`, `procurement`, `implementation_planning`, `implementation_ongoing`, `partially_delivered`, `completed`, `operational`, `outcome_reported`, `independently_assessed`, `suspended`, `superseded`, `repealed`, `under_review`, `archived`, `withdrawn` |
| 9 | `data_value_nature` | 7 | `actual`, `provisional`, `estimated`, `projected`, `target`, `calculated`, `modelled` |
| 10 | `source_origin` | 4 | `government_reported`, `independently_reported`, `mixed`, `unknown` |
| 11 | `verification_statuses` | 8 | `source_confirmed`, `cross_referenced`, `independently_corroborated`, `under_review`, `unverified`, `disputed`, `corrected`, `withdrawn` |
| 12 | `workflow_statuses` | 8 | `draft`, `research_review`, `evidence_review`, `editorial_review`, `human_approval`, `ready_for_publication`, `rejected`, `archived` |
| 13 | `publication_statuses` | 8 | `unpublished`, `under_review`, `publishable`, `publishable_with_qualification`, `published`, `corrected`, `withdrawn`, `archived` |
| 14 | `source_levels` | 6 | `LEVEL_1`, `LEVEL_2`, `LEVEL_3`, `LEVEL_4`, `LEVEL_5`, `LEVEL_6` |
| 15 | `source_roles` | 11 | `primary`, `official_statistical`, `direct_implementation`, `independent_assessment`, `corroborating`, `supporting`, `contextual`, `contradictory`, `replacement`, `archived`, `discovery_lead` |
| 16 | `source_types` | 17 | `gazette`, `act_statute`, `executive_order`, `court_ruling`, `statistical_bulletin`, `economic_report`, `debt_report`, `multilateral_report`, `audit_report`, `academic_study`, `investigative_report`, `mainstream_media`, `specialist_press`, `state_house_release`, `ministerial_statement`, `agency_portal`, `social_lead` |
| 17 | `source_statuses` | 5 | `active`, `archived`, `under_review`, `retracted`, `dead_link` |
| 18 | `claim_types` | 12 | `legal_status`, `policy_action`, `implementation_status`, `project_status`, `financial_value`, `beneficiary_value`, `statistical_indicator`, `geographic_scope`, `timeline_event`, `reported_outcome`, `institutional_responsibility`, `context` |
| 19 | `claim_source_relationship_types` | 5 | `supports`, `contradicts`, `replaces`, `contextualises`, `discovery_only` |
| 20 | `evidence_profiles` | 8 | `direct_physical_delivery`, `statutory_legal_enactment`, `verified_administrative_disbursement`, `statistical_indicator_movement`, `official_policy_declaration`, `third_party_independent_assessment`, `multilateral_partner_evaluation`, `institutional_reform_milestone` |
| 21 | `financial_value_types` | 11 | `budget_allocation`, `approved_funding`, `funding_released`, `reported_expenditure`, `contract_value`, `programme_envelope`, `public_investment`, `private_investment`, `revenue_generated`, `revenue_estimate`, `savings_estimate` |
| 22 | `beneficiary_stages` | 6 | `applicant`, `registered_participant`, `eligible_applicant`, `approved_beneficiary`, `disbursement_recipient`, `active_beneficiary` |
| 23 | `beneficiary_types` | 7 | `individuals`, `households`, `farmers`, `students`, `msmes`, `enterprises`, `communities` |
| 24 | `date_precisions` | 7 | `exact_day`, `month`, `quarter`, `year`, `fiscal_year`, `range`, `unknown` |
| 25 | `timeline_event_types` | 14 | `announcement`, `approval`, `enactment`, `effectiveness`, `funding_approval`, `funding_release`, `procurement`, `commencement`, `partial_delivery`, `completion`, `operation`, `outcome_report`, `independent_assessment`, `correction` |
| 26 | `geographic_scope_types` | 11 | `national`, `geopolitical_zone`, `state`, `fct`, `lga`, `city_town`, `project_site`, `corridor`, `multi_state`, `coordinate`, `geographic_boundary` |
| 27 | `relationship_roles` | 8 | `parent_initiative`, `child_initiative`, `predecessor_policy`, `successor_policy`, `enabling_legislation`, `dependent_project`, `co_funded_programme`, `thematic_cluster` |
| 28 | `contradiction_severities` | 4 | `critical`, `high`, `medium`, `low` |
| 29 | `contradiction_resolution_statuses` | 6 | `open`, `under_investigation`, `resolved_by_primary_evidence`, `resolved_by_conservative_figure`, `unresolved_retained_with_qualification`, `dismissed_as_erroneous` |
| 30 | `correction_types` | 7 | `factual_error`, `numerical_update`, `status_correction`, `date_refinement`, `source_replacement`, `retraction`, `typographical` |
| 31 | `correction_lifecycle_statuses` | 5 | `proposed`, `under_review`, `approved`, `published`, `rejected` |
| 32 | `freshness_statuses` | 5 | `fresh`, `due_for_review`, `stale`, `review_in_progress`, `historical_closed` |
| 33 | `research_risk_levels` | 4 | `low`, `medium`, `high`, `critical` |
| 34 | `review_gates` | 6 | `gate_0_task_authorization`, `gate_1_source_claim_capture`, `gate_2_resolution_evidence`, `gate_3_automated_data_readiness`, `gate_4_editorial_human_approval`, `gate_5_publication_stewardship` |
| 35 | `review_decisions` | 6 | `approved`, `approved_with_qualification`, `rejected`, `revision_requested`, `escalated_to_human_lead`, `quarantined` |
| 36 | `count_basis` | 4 | `cumulative_to_date`, `period_specific`, `target_capacity`, `annual_average` |
| 37 | `aggregation_basis` | 2 | `period`, `cumulative` |
| 38 | `discovery_statuses` | 4 | `proposed`, `under_review`, `approved`, `rejected` |
| 39 | `gap_statuses` | 4 | `open`, `investigating`, `resolved`, `blocked` |
| 40 | `gap_evidence_types` | 10 | `statutory_instrument`, `funding_appropriation`, `cash_release_warrant`, `contract_award_notice`, `contractor_progress_certificate`, `disbursement_audit_log`, `beneficiary_register`, `statistical_time_series`, `third_party_evaluation`, `independent_audit` |
| 41 | `indicator_frequencies` | 5 | `monthly`, `quarterly`, `annual`, `biennial`, `ad_hoc` |
| 42 | `duplicate_resolution_actions` | 5 | `merge`, `keep_both_distinct`, `mark_as_alias`, `archive_duplicate`, `quarantine_for_investigation` |
| 43 | `nominal_or_real` | 2 | `nominal`, `real` |

The registry's sector parents are internally valid, but its three-level hierarchy is only partly machine-resolved: Level 3 subsectors are free strings and row-level public-group/sector parent consistency is not enforced. The registry is also not genuinely singular while v1.1 remains self-described as authoritative and active documents point to it.

## F. Classification-Dimension Audit

The canonical data model has **five**, not four, independent classification dimensions:

1. `data_value_nature`
2. `source_origin`
3. `verification_status`
4. `workflow_status`
5. `publication_status`

Workflow and publication are separate fields, separate schema properties where applicable, and separate eight-code registry namespaces. Calling them “4A” and “4B” does not make them one dimension. Implementation status is a further lifecycle field and is not one of those five evidence/publication classifications. The master contract and status standard must use the same unambiguous count.

**Result: FAIL.**

## G. Schema Audit

Exactly 19 `*.schema.json` files exist:

`achievement_record`, `beneficiary_record`, `claim_extraction`, `claim_source_relationship`, `contradiction_log`, `correction_record`, `data_gap`, `duplicate_review`, `entity_discovery`, `financial_record`, `freshness_review`, `indicator_observation`, `indicator_record`, `policy_record`, `programme_record`, `project_record`, `publication_review`, `source_capture`, and `timeline_event`.

| Check | Independent result |
|---|---|
| JSON parse | 19/19 pass |
| Explicit Draft-07 declaration | 19/19 pass |
| AJV compile | 19/19 pass |
| Root object schema | 19/19 pass |
| `additionalProperties: false` | 19/19 pass |
| Required arrays reference defined properties | 19/19 pass |
| Header/property set equality | 19/19 pass |
| Current registry-backed enum set equality | 70/70 mapped properties pass independently |
| Null behavior | No schema accepts JSON `null`; optional CSV cells are represented as empty strings |
| Identifier behavior | Required entity/FK identifiers generally have bracketed-ID patterns; the supplemental validator also checks identifier-shaped fields. Some optional/actor identifiers rely only on supplemental checks. |
| Dates | Calendar/reporting syntax and some precision pairings are supplemental validator rules, not fully encoded in JSON Schema. `event_date`, `start_date`, `launch_date`, and similar fields are not all paired to `date_precision`. |
| Currency | Three-uppercase-letter schema pattern plus recognized ISO currency supplemental check |
| Financial | Type, amount syntax, aggregation, and nominal/real vocabularies exist; positivity is supplemental |
| Beneficiary | Stage, type, count basis, scope, and integer count rules exist |
| Evidence/relationship | Claim/source relationship roles, types, locators, summaries, and IDs are required |

The schemas are valid and the current checked examples compile, but date/parent/referential rules that span fields or files are not complete. Schema audit result: **PARTIAL**.

## H. Template Audit

Exactly 19 CSV files exist, one for each schema. Each contains exactly one illustrative row; there are 19 exact occurrences of `[EXAMPLE ONLY - NOT A PRODUCTION RECORD]`. Independent header comparison found no missing, extra, or duplicate schema fields. All current rows are schema-valid and pass supplemental domain checks. Current dates, financial classifications, beneficiary stage/count, and checked foreign keys are valid. All examples use `EXAMPLE-ONLY` identifiers and no production achievement row was found.

The files are: `achievement_record.csv`, `beneficiary_record.csv`, `claim_extraction.csv`, `claim_source_relationship.csv`, `contradiction_log.csv`, `correction_record.csv`, `data_gap.csv`, `duplicate_review.csv`, `entity_discovery.csv`, `financial_record.csv`, `freshness_review.csv`, `indicator_observation.csv`, `indicator_record.csv`, `policy_record.csv`, `programme_record.csv`, `project_record.csv`, `publication_review.csv`, `source_capture.csv`, and `timeline_event.csv`.

**Current-example result: PASS. Durable validation result: PARTIAL**, because safe inconsistent mutations described in sections J and N pass.

## I. Claim-Source Audit

| Requirement | Result | Evidence |
|---|---|---|
| Record to many claims | PASS | `claim_extraction.record_id` is repeatable; no one-claim constraint |
| Claim to many sources | PASS | Multiple relationship rows may share `claim_id` |
| Source to many claims | PASS | Multiple relationship rows may share `source_id` |
| Role on relationship | PASS | `source_role` is required by the relationship schema |
| Type on relationship | PASS | `relationship_type` is required |
| Composite uniqueness | PASS | Validator key is claim + source + role + type + locator; duplicate mutation exited 1 |
| No mandatory source on claim | PASS | `claim_extraction` has no `source_id` property |
| Five required relationship types | PASS | All five are in registry and schema |
| Provenance preservation | PASS | Exact evidence locator and summary are required; replacement/supersession can be recorded without altering the source entity |

The many-to-many claim-source interchange model is structurally sound.

## J. Referential Integrity Audit

| Reference/domain | Result | Evidence |
|---|---|---|
| `source_id` | PASS for implemented loops | Relationships, timeline evidence, contradictions, and corrections are checked; missing relationship source exited 1 |
| `claim_id` | PASS for implemented loops | Relationships, finance, beneficiary, observations, contradictions, and corrections are checked |
| `record_id` | PARTIAL | Claims, finance, beneficiary, timeline, corrections, publication, and freshness are checked; duplicate-review record references are not |
| `indicator_id` | PASS | Observation IDs are resolved against indicator records |
| Sector code | PASS | Schema enums equal the 15-sector registry |
| Sector parent pairing | FAIL | `security` paired with `power_energy_natural_resources` returned exit 0 |
| Geography reference | NOT IMPLEMENTED | Only scope enums and free-text state lists exist; no geographic-unit ID/template is available to resolve |
| Institution reference | NOT IMPLEMENTED | Institution values are free text; no institution ID/template is available to resolve |
| Primary ID uniqueness | NOT IMPLEMENTED | The validator builds sets but does not reject duplicate primary IDs |
| Relationship composite | PASS | Deliberate duplicate returned exit 1 |

Safe mutation results, all restored afterward:

| Mutation | Expected | Actual validator exit | Result |
|---|---:|---:|---|
| Relationship points to `[MISSING-SRC-999]` | 1 | 1 | PASS |
| Duplicate claim/source/role/type/location | 1 | 1 | PASS |
| Invalid identifier plus blank required MDA | 1 | 1 | PASS |
| Invalid source role plus zero financial amount | 1 | 1 | PASS |
| Remove canonical `savings_estimate` from schema | 1 | 0 | FAIL |
| `event_date=2023-06`, `date_precision=exact_day` | 1 | 0 | FAIL |
| Sector paired to wrong public parent group | 1 | 0 | FAIL |
| Missing `duplicate_review.record_id_1` | 1 | 0 | FAIL |

## K. Truth-Safeguard Matrix

| # | Required substantive safeguard | Contract evidence | Result |
|---:|---|---|---|
| 1 | No fabrication | Invariant 1, “Never Fabricate” | PASS |
| 2 | No inflation | Invariant 2, “Never Inflate Figures” | PASS |
| 3 | No reporting-period manipulation | Invariant 3 | PASS |
| 4 | Announcement is not completion | Invariants 4 and 8 separately distinguish announcement/approval and commencement/completion; 21-stage lifecycle preserves the separation | PASS |
| 5 | Approval is not funding | Invariant 5 | PASS |
| 6 | Funding is not release | Invariant 6 | PASS |
| 7 | Release is not expenditure | Invariant 7 | PASS |
| 8 | Target is not actual | Invariant 10, “Target ≠ Result” | PASS |
| 9 | Applicant is not beneficiary | Invariant 11 | PASS |
| 10 | Approved beneficiary is not recipient | Invariant 12, “Approved ≠ Paid” | PASS |
| 11 | Government-reported is not independently verified | Invariant 13 | PASS |
| 12 | Material qualifications cannot be removed | Invariant 14 | PASS |
| 13 | Contradictions preserved | Invariant 15 | PASS |
| 14 | Corrections preserved | Invariant 16 | PASS |
| 15 | Source provenance preserved | Invariant 17 | PASS |
| 16 | Historical versions preserved | Invariant 18 | PASS |
| 17 | Public wording cannot exceed evidence | Critical rule immediately before the numbered invariants | PASS |
| 18 | Positive selection cannot alter truth standards | Same critical rule | PASS |

All 18 requested substantive safeguards are present. The contract's numbered list partitions some concepts differently, but no requested safeguard is substantively lost.

## L. Governance Boundary Audit

The three specifically requested v1.1.1 documents perform well in isolation:

- `TAT_INTERNAL_PUBLIC_DATA_BOUNDARY.md` defines public projections, restricted fields, authentication/authorization outcomes, draft quarantine, and immutable audits without prescribing RLS or connector operations.
- `TAT_RESEARCH_AGENT_OPERATING_MODEL.md` defines separation of duties and human approval through functional roles, not vendor APIs.
- `TAT_RESEARCH_CONTRACT_V1_1_1.md` labels Firebase/SQL Connect as a current non-canonical target and puts mechanisms under engineering ownership.

At corpus level, however, the boundary remains ambiguous:

- The index classifies `TAT_RESEARCH_CONTRACT_V1_1.md` as CANONICAL even though it is replaced by v1.1.1; v1.1 prescribes Firebase architecture, custom claims, Admin SDK ingestion, and Cloud SQL details.
- Active SUPPORTING documents retain operative Supabase/RLS terminology, including `MISSION_R01_RESEARCH_DATA_BLUEPRINT.md`, `TAT_RESEARCH_OBJECTIVES.md`, `TAT_RESEARCH_GOVERNANCE.md`, `TAT_RESEARCH_WORKFLOW.md`, `TAT_RECORD_TAXONOMY.md`, and `TAT_RESEARCH_TO_DEVELOPMENT_HANDOFF.md`.

**Requested-document result: PASS. Active-corpus governance result: FAIL.**

## M. Human-Review Policy Audit

Numeric floors are explicitly additional, governed by the Data Governance Directorate, reviewed semi-annually, and subordinate to qualitative triggers. Smaller claims cannot bypass review when a qualitative trigger applies. That part passes.

| Required trigger | Result | Evidence/gap |
|---|---|---|
| Risk | PASS | High/Critical risk tier |
| Sensitivity | PASS | Defense, strategic security, exceptional public significance |
| Uncertainty | PASS | Factual uncertainty is explicit |
| Contradiction | PASS | Conflicting official reports are explicit |
| Financial materiality below floor | PARTIAL | Financial review is explicit as a numeric floor; qualitative financial materiality below it is not independently named |
| Beneficiary materiality below floor | PARTIAL | Beneficiary review is explicit as a numeric floor; qualitative beneficiary materiality below it is not independently named |
| Legal/reputational exposure | PASS | Explicit trigger |
| Security sensitivity | PASS | Explicit trigger |
| Politically sensitive causal attribution | PASS | Explicit contextual-materiality trigger |

The policy is much stronger than v1.1, but it does not fully satisfy the instruction that financial and beneficiary materiality themselves remain triggers even below numeric thresholds.

## N. Validator Audit

The baseline `npm run validate:research` exits 0 and reports 43 documents, 43 namespaces, 19 schemas, 19 templates, valid current references, link resolution, and 13 expected negative rejections. Code inspection and mutation testing show:

| Claimed capability | Actual behavior |
|---|---|
| 43 indexed documents | Hardcoded 43-file array; does not parse the 42-entry index or verify classifications |
| Canonical vocabulary | Validates 43 named arrays, unique codes, and existence of sector parents |
| Bidirectional enum equality | False; only schema-to-registry subset direction is implemented |
| 19 schemas | Correctly counted and compiled |
| 19 templates | Correctly counted, headers compared, current rows validated |
| Required nonblank fields | Enforced by a supplemental function |
| Exact marker | Enforced as substring presence of the exact marker |
| Date precision | Helper is correct, but wiring covers only `date`, `date_value`, and `publication_date`; other paired date fields escape |
| Period ranges | `period_start <= period_end` enforced when both exist |
| Cross-file FKs | Several important loops exist, but duplicate-review and relationship-supersession references are omitted |
| Sector hierarchy | Registry parent existence checked; row-level group/sector pairing omitted |
| Composite uniqueness | Implemented for the required five-part claim-source key |
| Fixture suite | Runs 13 negative assertions in-process; no positive fixture |

Because the validator prints broad PASS claims for known passing defects, it cannot be treated as a closure oracle.

## O. Fixture Audit

Exact fixture count: **13 negative, 0 positive**.

| Fixture | What it actually tests | Real failure path? |
|---|---|---|
| NEG-01 | Synthetic schema contains an unregistered implementation status | Yes, one-way vocabulary helper |
| NEG-02 | Synthetic schema contains `exact-day`, `social-services`, and numeric source level `1` | Yes, deprecated-code helper |
| NEG-03 | Relationship references a missing claim | Yes, relationship FK helper |
| NEG-04 | Relationship references a missing source | Yes, relationship FK helper |
| NEG-05 | Two relationships share the required composite | Yes, uniqueness helper |
| NEG-06 | Financial row has invalid `financial_type` | Yes, AJV schema rejection; does not test invalid amount/value |
| NEG-07 | Beneficiary row has invalid stage | Yes, AJV schema rejection |
| NEG-08 | Achievement row has invalid sector ID | Yes, AJV schema rejection |
| NEG-09 | `2024-05` is paired with `exact_day` | Yes, helper call; not an end-to-end template/date-field test |
| NEG-10 | Period start is after period end | Yes, helper call |
| NEG-11 | Row lacks the exact example marker | Yes, marker helper |
| NEG-12 | CSV has an unclosed quoted field | Yes, parser exception |
| NEG-13 | Confirms `achievement_record` has no `classification` property | No; this is a positive structural assertion mislabeled as a negative rejection |

Minimum-coverage reconciliation:

| Required coverage | Status |
|---|---|
| Invalid vocabulary | Present |
| Deprecated vocabulary | Present |
| Missing FK | Present only for relationship claim/source helpers; not comprehensive |
| Invalid claim-source relationship | Partial; FK and duplicate covered, invalid role/type absent |
| Duplicate relationship | Present |
| Invalid financial type/value | Partial; type present, invalid numeric value absent |
| Invalid beneficiary stage | Present |
| Malformed date precision | Present as a helper only; field wiring gap not caught |
| `period_start > period_end` | Present |
| Invalid source level/role | Partial; level present, role absent |
| Missing example marker | Present |
| Invalid identifier | Absent |
| Schema-required field failure | Absent |
| Positive fixture | Absent |

The file comment claims both positive and negative fixture behavior, but no positive fixture collection exists and individual negative process exit behavior is not exercised.

## P. Document Registry Audit

Filesystem count: **43 Markdown documents** in `docs/research`.

Index body count: **42 entries**:

- 17 CANONICAL
- 18 SUPPORTING
- 4 SUPERSEDED
- 3 DEPRECATED

The index headings claim four deprecated files, but `TAT_SUPABASE_ENTITY_RELATIONSHIP_MAP.md` is absent from the table. The validator separately hardcodes that file as the eighth retired document and therefore prints “43 indexed” even though the authoritative index has 42 entries.

Other authority problems:

- `TAT_RESEARCH_CONTRACT_V1_1.md` is marked CANONICAL while simultaneously naming v1.1.1 as its replacement.
- The old vocabulary remains self-described as authoritative.
- Active canonical standards point to the old vocabulary.
- `TAT_COMPLETE_DATA_UNIVERSE.md`, classified SUPPORTING, still presents deprecated hyphenated `social-services` as an active umbrella code.
- Four genuinely deprecated Supabase files have visible top-of-file warnings, but active supporting documents still use operative Supabase terminology and links.

**Result: FAIL.** Not every document is registered, and the active/retired boundary can reasonably be misunderstood.

## Q. Compliance Matrix Audit

The file claims 90/90, but its evidence body contains exactly **30 numbered items**, divided 8 + 10 + 7 + 5. It does not enumerate the asserted original 60 checks or the 28 G-findings as independently evidenced rows.

Demonstrably unsupported PASS statements include:

- “4 separated classification dimensions” when five independent namespaces are defined.
- “Permanent Fixture Suite” without a positive fixture and with required negative gaps.
- “42 Indexed Documents Checked” when 43 files exist and only 42 index entries exist.
- “Cross-File Referential Integrity” while duplicate-review references are unchecked.
- The resolution-log claim of bidirectional enum equality.
- “100% VERIFIED PASS” despite the safe mutations that exit 0.

The no-frontend-change claim is supported by Git. The no-cloud-provisioning statement is not independently provable from repository contents alone. **Result: FAIL.**

## R. Application Tests

| Command | Result | Notes |
|---|---|---|
| `npm install` | PASS | No tracked changes; peer warning observed |
| `npm run validate:research` | PASS | Restored baseline: exit 0, 0 reported errors |
| `npm run typecheck` | UNAVAILABLE | No `typecheck` package script |
| `node .\node_modules\typescript\bin\tsc --noEmit` | PASS | Exit 0 |
| `npm run lint` | WRAPPER FAIL | Windows `&` path caused local binary to resolve under `C:\Users\DELL\Documents` |
| `node .\node_modules\eslint\bin\eslint.js .` | FAIL | 13 errors and 10 warnings, all outside the v1.1.1 research delta |
| `npm run test:run` | WRAPPER FAIL | Same Windows `&` path issue |
| `node .\node_modules\vitest\vitest.mjs run` | PASS | 6 files, 26 tests |
| `npm run build` | WRAPPER FAIL | Same Windows `&` path issue |
| `node .\node_modules\vite\bin\vite.js build` | PASS | 3,491 modules; stale Browserslist data and >500 kB chunk warning |
| `npm audit --json` | FAIL | 28 vulnerabilities: 3 low, 5 moderate, 19 high, 1 critical |

Research-contract failures are the false-positive validator paths, registry/compliance defects, and governance ambiguity. Frontend lint failures, dependency vulnerabilities, wrapper portability, and build warnings are application/dependency findings and were not introduced by commit `8455a5f...`.

Principal commands executed included Git remote/ref/show/merge-base/diff/status checks; `npm install`; repeated baseline and mutation `npm run validate:research` runs; independent Node/PowerShell JSON, enum, header, count, and registry checks; direct TypeScript, ESLint, Vitest, and Vite invocations; `npm audit --json`; `rg`; and read-only file inspection. Every temporary mutation was made with a patch, tested, reversed with a patch, and verified absent by `git diff --exit-code` before this report was created.

## S. File Inventory

Audited v1.1.1 delta (`ac0c2dff...` to `8455a5f...`): **49 files changed, 2,477 insertions, 1,211 deletions**.

- Created: 4
  - `docs/engineering/CODEX_M01_V1_1_FINAL_REAUDIT.md`
  - `docs/research/TAT_RESEARCH_CONTRACT_V1_1_1.md`
  - `research/schemas/canonical-vocabulary.v1.1.1.json`
  - `scripts/test-research-fixtures.mjs`
- Modified: 45
  - 7 research documents: resolution log, boundary, compliance matrix, operating model, changelog, document index, and classification standard
  - all 19 JSON schemas
  - 18 CSV templates (all except `source_capture.csv`)
  - `scripts/validate-research-foundation.mjs`
- Deleted: 0
- Renamed: 0
- Frontend/production-data files changed: 0

Current independent totals:

- Schemas: 19
- Templates: 19
- Research Markdown documents: 43
- Vocabulary namespaces: 43
- Negative fixtures: 13
- Positive fixtures: 0
- Deprecated research documents on disk: 4 with banners; only 3 are registered as DEPRECATED
- Superseded research documents: 4

This audit adds only `docs/engineering/CODEX_M01_FINAL_CLOSURE_AUDIT.md`.

## T. Remaining Blockers

### B-01 — Canonical authority and enforcement are not closed

The v1.1.1 registry is complete enough for current schemas, but it is not the sole unambiguous authority and the validator does not enforce exact bidirectional equality or parent pairing.

### B-02 — Validator still gives false closure confidence

The claim-source relationship core is fixed, but missing duplicate-review references, miswired date precision, hierarchy mismatch, registry/index divergence, and incomplete fixtures all pass under broad success messages.

## U. Remaining High Findings

1. One-way vocabulary comparison is represented as exact bidirectional equality.
2. `event_date` and other date fields are not consistently paired to declared precision.
3. Not all record foreign keys are checked; duplicate-review references demonstrably pass when missing.
4. Sector/public-group parent mismatch is not enforced.
5. The document registry and validator disagree while the validator falsely calls its hardcoded array “indexed.”
6. The compliance matrix asserts 90/90 on only 30 enumerated items and contains false PASS claims.
7. Canonical authority is split between v1.1 and v1.1.1; active documents still point to the old vocabulary and the old Firebase-specific contract remains CANONICAL.
8. Permanent fixture coverage is incomplete and has no positive fixture.
9. Dependency audit reports 19 high and 1 critical vulnerability; this is outside the research delta but remains an application security finding.

## V. Remaining Medium Findings

1. Five classification dimensions are described as four.
2. Financial and beneficiary materiality below numeric floors are not explicit standalone qualitative review triggers.
3. Geography and institution references are free text and cannot receive FK verification.
4. Primary ID uniqueness and relationship supersession references are not checked.
5. The target preserves the prior audit report by content but does not descend from the stated previous Codex commit.
6. Active supporting documents retain operative Supabase/RLS terminology after the claimed implementation-neutral cleanup.

## W. Remaining Low Findings

1. Package-script local-binary resolution is not portable to this Windows path containing `&`.
2. No dedicated `typecheck` package script exists, although direct `tsc --noEmit` passes.
3. Browserslist data is stale and the main production chunk is 526.29 kB.
4. Validator success messages overstate what each section actually verifies.

## X. Required Corrections

1. Enforce set equality in both directions for every mapped schema enum and fail unmapped controlled enums unless explicitly allowlisted as local.
2. Wire every date/precision pair end-to-end, including `event_date`, project dates, policy dates, programme dates, and observation periods; add per-field fixtures.
3. Enforce public-group/sector parent pairing and either register Level 3 subsectors or explicitly define their governed free-text policy.
4. Inventory and validate every FK-bearing field, including all duplicate-review and supersession references; enforce primary ID uniqueness.
5. Add permanent positive coverage and missing negative coverage for identifiers, required fields, source role/type, financial numeric values, all relevant FKs, and end-to-end date fields. Replace or relabel NEG-13.
6. Make the document index derive from or match the filesystem: register all 43 documents, correct status counts, and reclassify v1.1 as SUPERSEDED.
7. Deprecate the old vocabulary explicitly and update every active reference to v1.1.1.
8. Remove or clearly retire operative Supabase/RLS text from active supporting documents.
9. State five classification dimensions consistently across the contract, status standard, logs, and matrix.
10. Add qualitative financial and beneficiary materiality triggers independent of numeric floors.
11. Replace the 90/90 summary with 90 individually identified, evidence-linked checks or report the actual 30-item scope and all open findings.
12. Rerun the same safe mutations and obtain nonzero exits before requesting closure again.

## Y. Final Mission 01 Decision

**A. No. Research Mission 01 may not receive final approval.**

The exact final verdict is **FAIL — RESEARCH CONTRACT REMAINS UNSAFE**.

## Z. Firebase Local Engineering Decision

**B. No. Codex may not begin the local Firebase SQL Connect / PostgreSQL engineering foundation against this contract.** A local-only foundation would still encode unresolved authority, classification, hierarchy, date, and referential rules.

## AA. Frontend V2 Decision

**C. No. Antigravity may not begin Frontend V2 transformation against Contract v1.1.1.** Unbound visual exploration is outside this authorization; contract-bound types, adapters, filters, or integration must wait.

## AB. Research Mission 02 Decision

**D. No. Research Mission 02 — Pilot Achievement Research — may not begin.** The pilot must not become the mechanism that discovers contract-level validator failures.

## AC. Firebase Cloud Provisioning Decision

**E. No. Firebase cloud provisioning may not begin.** No cloud resource was provisioned during this audit, and local engineering authorization would not itself authorize cloud provisioning.
