# Tinubu Achievement Tracker — Research Contract Changelog (v1.0 → v1.1)

**Changelog Version:** 1.1  
**Release Date:** 2026-08-15  
**Governing Authority:** Data Architecture & Research Directorate  
**Scope:** Formal architectural and schema transition from Research Contract v1.0 to Research Contract v1.1  

---

## Summary of Major Architectural Transitions

```text
+──────────────────────────────────+──────────────────────────────────+──────────────────────────────────────+
| Dimension                        | Contract v1.0 Baseline           | Contract v1.1 Standard               |
+──────────────────────────────────+──────────────────────────────────+──────────────────────────────────────+
| Vocabulary Architecture          | Fragmented, manual enum lists    | Single machine-readable JSON registry|
| Claim-Source Architecture        | 1 source per claim (1:1 / 1:N)   | Normalized M:N join with roles       |
| Classification Dimensions        | Mixed 12-value overloaded enum   | 4 separated, clean namespaces        |
| Sector Model                     | 5 flat UI umbrella groups        | 3-level hierarchy (5 > 15 > subs)    |
| Financial Contract               | 5 ambiguous types, string floats | 11 exact types, NUMERIC(24,4), basis |
| Beneficiary Contract             | 5 stages, cross-stage ambiguity  | 6 strict stages, unit, cohort, rules |
| Date Modeling                    | Unconstrained strings            | Structured date + 7 precisions       |
| Quality Control Framework        | 5 informal gates                 | 6 macro gates / 10 testable controls |
| Research Roadmap                 | 5 collapsed phases               | 8 named expansion phases             |
| System of Record                 | Legacy Supabase DDL proposals    | Implementation-neutral / SQL Connect |
| Template & Schema Count          | 18 paired CSV / schemas          | 19 paired CSV / schemas + 1 JSON voc |
+──────────────────────────────────+──────────────────────────────────+──────────────────────────────────────+
```

---

## Detailed Architectural Changes

### 1. Canonical Machine-Readable Vocabulary (Codex Finding G-01)
- **Old Architecture (v1.0):** Conflicting string enums defined manually in multiple Markdown files, Draft-07 schemas, and TypeScript UI files.
- **New Architecture (v1.1):** Single authoritative machine-readable vocabulary published in `research/schemas/canonical-vocabulary.v1.1.json`.
- **Reason:** Prevent enum drift across AI research agents, human reviewers, CSV validators, PostgreSQL constraints, and frontend adapters.
- **Affected Artifacts:** `canonical-vocabulary.v1.1.json`, all schemas in `research/schemas/`, `scripts/validate-research-foundation.mjs`.
- **Database Implication:** Directly maps to PostgreSQL check constraints and SQL Connect enum types.
- **Frontend Implication:** Pure TypeScript mapping adapters convert canonical snake_case codes into localized UI display labels.

---

### 2. Many-to-Many Claim-Source Architecture (Codex Finding G-02 - BLOCKER)
- **Old Architecture (v1.0):** `claim_extraction.csv` required a single mandatory `source_id` foreign key per claim row.
- **New Architecture (v1.1):** Decoupled `claim_extraction` from direct source binding; created `claim_source_relationship.csv` and `claim_source_relationship.schema.json` supporting full many-to-many relationships with specific evidentiary roles (`primary`, `corroborating`, `contradictory`, `replacement`, `contextual`, etc.) and exact locators (`page`, `table`, `section`, `paragraph`).
- **Reason:** Enable multiple independent sources to corroborate a single claim and allow a single source document to support multiple claims in different roles.
- **Affected Artifacts:** `research/templates/claim_source_relationship.csv`, `research/schemas/claim_source_relationship.schema.json`, `research/templates/claim_extraction.csv`, `research/schemas/claim_extraction.schema.json`, `docs/research/TAT_EVIDENCE_STANDARD.md`, `docs/research/TAT_SOURCE_ROLE_STANDARD.md`.
- **Database Implication:** Implements `evidence_claims` and `claim_source_relationships` join table with real relational foreign keys and composite unique constraints.
- **Frontend Implication:** Record detail views project arrays of verified public citations without denormalizing raw full-text passages.

---

### 3. Hierarchical Sector Taxonomy (Codex Finding G-03)
- **Old Architecture (v1.0):** 5 broad public umbrella navigation groups (`economy`, `security`, `infrastructure`, `social-services`, `governance`) served as both public navigation and database canonical sectors.
- **New Architecture (v1.1):** 3-level taxonomy: Level 1 (5 Public Navigation Groups) -> Level 2 (15 Canonical Research Sectors) -> Level 3 (Configurable Subsectors).
- **Reason:** Enable granular domain attribution (e.g. distinguishing Agriculture from Power or Health from Education) while preserving clean, intuitive public navigation.
- **Affected Artifacts:** `docs/research/TAT_SECTOR_TAXONOMY.md`, `research/schemas/canonical-vocabulary.v1.1.json`, all entity schemas.
- **Database Implication:** Relational `sectors` table with `parent_sector_id` and `taxonomy_level` supporting hierarchical rollups.
- **Frontend Implication:** UI navigation displays 5 macro groups while filters, detail badges, and sector dashboards expose 15 canonical sectors.

---

### 4. Separation of Classification Namespaces (Codex Finding G-26)
- **Old Architecture (v1.0):** Single 12-value `data_classification` enum combining value nature (`actual`, `estimated`), origin (`government_reported`), and lifecycle status (`under_review`, `corrected`, `withdrawn`).
- **New Architecture (v1.1):** Separated into 4 clean dimensions:
  1. Data Value Nature (`actual`, `provisional`, `estimated`, `projected`, `target`, `calculated`, `modelled`)
  2. Source Origin (`government_reported`, `independently_reported`, `mixed`, `unknown`)
  3. Verification Status (`source_confirmed`, `cross_referenced`, `independently_corroborated`, `under_review`, `unverified`, `disputed`, `corrected`, `withdrawn`)
  4. Workflow / Publication Status (`draft`, `under_review`, `publishable`, `publishable_with_qualification`, `rejected`, `archived`)
- **Reason:** Eliminate conceptual collisions and semantic query ambiguity.
- **Affected Artifacts:** `docs/research/TAT_STATUS_AND_CLASSIFICATION_STANDARD.md`, all entity schemas.
- **Database Implication:** Distinct, strongly-typed columns with independent PostgreSQL check constraints.
- **Frontend Implication:** UI components render specific badge groups (e.g. Origin Badge vs Value Nature Badge).

---

### 5. Financial Record Structuring (Codex Finding G-08)
- **Old Architecture (v1.0):** 5 ambiguous financial types with unconstrained numeric strings.
- **New Architecture (v1.1):** 11 explicit financial types, exact ISO 4217 currency, structured reporting period, `aggregation_basis` (`period` vs `cumulative`), `nominal_or_real`, and supporting claim FK.
- **Reason:** Prevent invalid aggregation of unlike financial categories (e.g. summing an approved contract with actual expenditure).
- **Affected Artifacts:** `research/schemas/financial_record.schema.json`, `research/templates/financial_record.csv`, `docs/research/TAT_RESEARCH_CONTRACT_V1_1.md`.
- **Database Implication:** PostgreSQL `NUMERIC(24,4)` precision; aggregation queries strictly group by financial type and currency.
- **Frontend Implication:** Financial dashboards display distinct, non-aggregated metrics.

---

### 6. Beneficiary Record Structuring (Codex Finding G-09)
- **Old Architecture (v1.0):** 5 beneficiary stages omitting eligible applicants, units, geography, and double-counting controls.
- **New Architecture (v1.1):** 6 canonical stages (`applicant`, `registered_participant`, `eligible_applicant`, `approved_beneficiary`, `disbursement_recipient`, `active_beneficiary`), integer count validation, `count_basis`, `cohort_key`, and `double_counting_note`.
- **Reason:** Enforce strict separation between applicants, approved individuals, and actual payment recipients.
- **Affected Artifacts:** `research/schemas/beneficiary_record.schema.json`, `research/templates/beneficiary_record.csv`.
- **Database Implication:** Composite unique constraint across record, stage, type, period, geography, and cohort key.
- **Frontend Implication:** Clear UI separation between applicant totals and verified beneficiary payouts.

---

### 7. Structured Dates & Reporting Precision (Codex Finding G-07)
- **Old Architecture (v1.0):** Free-form string dates risking false-precision conversions.
- **New Architecture (v1.1):** Structured model with `date_value`, `date_precision` (7 enum values), `period_start`, `period_end`, `reporting_period_label`, and `period_is_provisional`.
- **Reason:** Preserve imprecise historical reporting periods (e.g. "Q2 2024", "FY2023/24") without converting them into artificial exact calendar days.
- **Affected Artifacts:** All entity schemas and CSV templates.
- **Database Implication:** Distinct date/period columns with cross-field validation rules.
- **Frontend Implication:** Date formatters render human-readable period labels according to precision metadata.

---

### 8. Quality Assurance & Operating Model (Codex Findings G-14, G-15, G-16)
- **Old Architecture (v1.0):** 5 informal gates, 5 collapsed roadmap phases, 5 generic risks.
- **New Architecture (v1.1):** 6 macro gates preserving all 10 explicit testable responsibilities; full 8-phase research roadmap (May 2023 - Aug 2026); expanded 28-risk operational register.
- **Reason:** Establish rigorous, verifiable quality controls and clear human/AI separation of duties before mass research begins.
- **Affected Artifacts:** `docs/research/TAT_QUALITY_CONTROL_GATES.md`, `docs/research/TAT_RESEARCH_ROADMAP.md`, `docs/research/TAT_RESEARCH_RISK_REGISTER.md`, `docs/research/TAT_RESEARCH_AGENT_OPERATING_MODEL.md`.
- **Database Implication:** Relational `review_decisions` table recording immutable gate sign-offs.
- **Frontend Implication:** Public verification badges backed by verifiable quality gate exit records.
