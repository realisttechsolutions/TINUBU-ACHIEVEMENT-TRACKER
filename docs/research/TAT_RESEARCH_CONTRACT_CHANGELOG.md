# Tinubu Achievement Tracker — Research Contract Changelog (v1.0 → v1.1 → v1.1.1)

**Changelog Version:** 1.1.1  
**Release Date:** 2026-08-15  
**Governing Authority:** Data Architecture & Research Verification Directorate  
**Scope:** Architectural and schema transition across Research Contract v1.0, v1.1, and v1.1.1  

---

## Summary of Architectural Transitions

```text
+──────────────────────────────────+──────────────────────────────+──────────────────────────────────────+
| Dimension                        | Contract v1.1 Consolidation  | Contract v1.1.1 Final Closure        |
+──────────────────────────────────+──────────────────────────────+──────────────────────────────────────+
| Machine-Readable Vocabulary      | Incomplete JSON lists        | Complete 35+ namespace registry v1.1.1|
| Vocabulary Enforcement           | Length checks only           | Bidirectional schema ↔ vocab checks  |
| Cross-File Referential Integrity | None (syntax only)           | Full existence checks for FKs        |
| Relationship Uniqueness          | None                         | Composite key uniqueness enforced    |
| Sector Registry                  | Documented only              | 15 canonical sectors in vocabulary   |
| Classification Dimensions        | Overloaded fields retained   | Distinct fields in all schemas/CSVs  |
| Workflow vs Publication          | Conflicting lists            | Clean, separated namespaces          |
| Source Level Enforcement         | Optional, numeric accepted   | Required, only LEVEL_1 to LEVEL_6    |
| Timeline Event Vocabulary        | Unregistered spelling        | Dedicated 14-code event namespace    |
| Relationship Types               | Schema-local only            | Canonical registry in vocabulary     |
| Truth Safeguards                 | 13 numbered rules            | 18 immutable mandatory safeguards    |
| Human Review Escalation          | Raw numeric thresholds       | Governed qualitative + floor policy  |
| Non-Production Example Marker    | Any 'EXAMPLE' string         | Exact approved marker string match   |
| Permanent Test Fixtures          | Single embedded test         | 13 negative + positive test suite    |
| Governance Architecture          | Leaked Firebase/RLS terms    | Pure implementation-neutral contract |
| Document Inventory Validation    | 36 documents checked         | All 42 indexed documents checked     |
+──────────────────────────────────+──────────────────────────────+──────────────────────────────────────+
```

---

## Detailed Version 1.1.1 Corrections

### 1. Canonical Vocabulary Completion & Bidirectional Enforcement (Blocker B-01 Closed)
- **Problem:** `canonical-vocabulary.v1.1.json` omitted sectors, relationship types, event types, and subtype codes. The validator did not compare schema enums against vocabulary arrays.
- **Resolution:** Published `canonical-vocabulary.v1.1.1.json` containing all 35+ controlled domains. Extended `validate-research-foundation.mjs` to bidirectionally verify that every schema enum property exactly matches a registered vocabulary namespace. Unregistered codes trigger automated validation errors.

### 2. Cross-File Referential Integrity & Composite Uniqueness (Blocker B-02 Closed)
- **Problem:** Relationship rows referencing nonexistent `claim_id` or `source_id` passed validation with exit 0. Duplicate relationship rows were not prevented.
- **Resolution:** Implemented multi-file relational verification in `validate-research-foundation.mjs`. All `claim_id`, `source_id`, `record_id`, and `indicator_id` foreign keys are verified to exist in their respective template files. Composite uniqueness (`claim_id + source_id + source_role + relationship_type + evidence_location`) is strictly enforced.

### 3. Removal of Deprecated Aliases
- **Problem:** Active schemas accepted `physical-project`, `social-services`, `exact-day`, and numeric source levels `1-6`.
- **Resolution:** Purged all deprecated aliases from active acceptance. Only canonical snake_case codes (`physical_project`, `social_services`, `exact_day`, `LEVEL_1` to `LEVEL_6`) are valid.

### 4. Classification-Dimension Separation across All Entity Schemas
- **Problem:** `achievement_record.schema.json` and `indicator_observation.schema.json` retained overloaded `classification` / `data_classification` fields.
- **Resolution:** Removed overloaded fields; replaced with distinct properties: `data_value_nature`, `source_origin`, `verification_status`, and `publication_status`.

### 5. Implementation-Neutral Governance & Security Boundaries
- **Problem:** Canonical research documents prescribed Firebase connector directives, custom claims, and Supabase RLS.
- **Resolution:** Removed all implementation-specific mechanisms from canonical research documents. Rewrote `TAT_INTERNAL_PUBLIC_DATA_BOUNDARY.md` to define implementation-neutral access control and projection requirements. Engineering implementation recommendations are isolated in `docs/engineering/`.

### 6. Restoration of All 18 Truth Safeguards
- **Problem:** The explicit prohibition against removing material qualifications was weakened.
- **Resolution:** Restored all 18 mandatory invariants in `TAT_RESEARCH_CONTRACT_V1_1_1.md` Section 2, including the explicit rule: "Material qualifications and limitations must not be silently removed."

### 7. Governed Human-Review Escalation Policy
- **Problem:** Numeric thresholds (₦100B, 500k) lacked governance context and risked under-escalating small but sensitive claims.
- **Resolution:** Defined risk tier, defense/security sensitivity, uncertainty, contradictions, legal exposure, and contextual materiality as primary escalation triggers in `TAT_RESEARCH_AGENT_OPERATING_MODEL.md`. Configured numeric values as governed escalation floors.

### 8. Permanent Fixture Suite & Exact Marker Enforcement
- **Problem:** Validator lacked permanent negative test coverage and accepted loose example strings.
- **Resolution:** Built `scripts/test-research-fixtures.mjs` testing 13 distinct negative failure scenarios and 1 positive scenario. Enforced exact string match `[EXAMPLE ONLY - NOT A PRODUCTION RECORD]` across all 19 CSV templates.
