# Atomic Evidence Standards & Verification Statuses — Tinubu Achievement Tracker V2

This document defines the atomic claim structure and 8 claim verification statuses.

---

## 1. Atomic Claim Structure
Every factual assertion in the database is represented as an atomic claim containing:
- `claim_id`
- `entity_id`
- `claim_type` (Legal Status, Policy Action, Financial Value, Beneficiary Value, etc.)
- `claim_text`
- `structured_value` & `unit`
- `reporting_period`
- `data_classification`
- `geographic_scope`
- `source_id` & `evidence_location` (Page / Section)

---

## 2. The 8 Verification Statuses
1. `Source Confirmed`: Matches Level 1-2 primary document.
2. `Cross-Referenced`: Verified across 2+ independent sources.
3. `Independently Corroborated`: Government statement backed by Level 3 independent data.
4. `Government Reported`: Official MDA figure lacking independent confirmation.
5. `Provisional`: Preliminary statistic subject to NBS revision.
6. `Under Review`: Audit flagged due to conflicting figures.
7. `Corrected`: Publicly updated following revision log.
8. `Withdrawn`: Retracted due to policy revocation or source error.
