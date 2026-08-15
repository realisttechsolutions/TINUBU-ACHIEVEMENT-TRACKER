# Tinubu Achievement Tracker — Research Output Templates Specification (v1.1)

**Standard Version:** 1.1  
**Effective Date:** 2026-08-15  
**Governing Contract:** Research Contract v1.1  
**Location:** `research/templates/`  
**Paired Schemas:** `research/schemas/`  

---

## The 19 Canonical CSV Templates & Schemas

| # | Template File (`research/templates/`) | Draft-07 Schema (`research/schemas/`) | Purpose & Interchange Role |
|---:|---|---|---|
| 1 | `source_capture.csv` | `source_capture.schema.json` | Captures primary source metadata, URLs, document numbers, and archive links. |
| 2 | `entity_discovery.csv` | `entity_discovery.schema.json` | Captures raw entity leads and initial candidate achievements prior to extraction. |
| 3 | `claim_extraction.csv` | `claim_extraction.schema.json` | Captures discrete atomic factual claims with values, units, and dates. |
| 4 | `claim_source_relationship.csv` | `claim_source_relationship.schema.json` | Many-to-many relationship join mapping claims to sources with exact locators and roles. |
| 5 | `achievement_record.csv` | `achievement_record.schema.json` | High-impact positive administration milestone or outcome presentation record. |
| 6 | `policy_record.csv` | `policy_record.schema.json` | Comprehensive policy, legislative, and regulatory reform record. |
| 7 | `project_record.csv` | `project_record.schema.json` | Physical capital infrastructure project record with progress tracking. |
| 8 | `programme_record.csv` | `programme_record.schema.json` | Social intervention, financial scheme, or programmatic intervention framework. |
| 9 | `indicator_record.csv` | `indicator_record.schema.json` | Macro or sector time-series indicator definition and methodology metadata. |
| 10 | `indicator_observation.csv` | `indicator_observation.schema.json` | Dated quantitative observation value for an indicator linked to an evidence claim. |
| 11 | `timeline_event.csv` | `timeline_event.schema.json` | Chronological milestone occurrence across administration lifecycle. |
| 12 | `financial_record.csv` | `financial_record.schema.json` | Precise financial value separating statutory allocation, approval, release, and spend. |
| 13 | `beneficiary_record.csv` | `beneficiary_record.schema.json` | Enumerated beneficiary count separating applicants from actual payment recipients. |
| 14 | `contradiction_log.csv` | `contradiction_log.schema.json` | Internal log preserving and tracking resolution of conflicting official figures. |
| 15 | `duplicate_review.csv` | `duplicate_review.schema.json` | Deduplication adjudication log for merging duplicate records. |
| 16 | `data_gap.csv` | `data_gap.schema.json` | Research backlog prioritizing missing information for future missions. |
| 17 | `correction_record.csv` | `correction_record.schema.json` | Audited historical correction and revision log for published figures. |
| 18 | `freshness_review.csv` | `freshness_review.schema.json` | Velocity-based data freshness review and schedule tracking. |
| 19 | `publication_review.csv` | `publication_review.schema.json` | Editorial sign-off, quality gate audit, and 13 Truth Rules compliance record. |
