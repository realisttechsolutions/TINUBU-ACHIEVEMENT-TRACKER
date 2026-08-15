# SQL Connect & Relational Access Security Matrix

## 1. Access Roles & Scopes

| Role Code | Scope Level | Target Tables / Views | Permitted Actions | Auth Level |
| :--- | :--- | :--- | :--- | :--- |
| `anonymous_public` | Public Views | `public_record_catalog`, `public_claim_evidence`, `public_financial_records`, `public_beneficiary_records`, `sources`, `indicators`, `timeline_events` | `SELECT` | `PUBLIC` |
| `data_editor` | Staging / Drafting | `records`, `sources`, `evidence_claims`, `claim_source_relationships`, `financial_records`, `beneficiary_records`, `indicators`, `indicator_observations`, `timeline_events` | `SELECT`, `INSERT`, `UPDATE` | `USER` |
| `evidence_reviewer`| Verification Gate | `evidence_claims`, `claim_source_relationships`, `review_decisions` | `SELECT`, `INSERT (review_decisions)` | `USER` |
| `compliance_officer`| Audit & Corrections | `corrections`, `record_versions`, `review_decisions` | `SELECT`, `INSERT (corrections)` | `USER` |
| `admin` | Global Management | All 27 Tables, `research_batches`, `dataset_manifests` | `SELECT`, `INSERT`, `UPDATE`, `ADMIN` | `USER` (Admin custom claim) |

## 2. Row & Table Security Policies
- Public views expose only rows where `publication_status IN ('published', 'publishable', 'publishable_with_qualification')` and `is_public = true`.
- Sensitive internal reviewer notes, draft workflow statuses, and actor profile internal metadata are excluded from public connector queries.
