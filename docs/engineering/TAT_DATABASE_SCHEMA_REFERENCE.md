# TAT Database Schema Reference

This reference describes `database/schema.sql`, the complete local relational authority for E01. All controlled fields map to Research Contract v1.1.2 and `canonical-vocabulary.v1.1.2.json`; this mission does not amend either source.

## The 27 tables

| # | Table | Purpose and key invariants |
|---:|---|---|
| 1 | `actor_profiles` | UUID actor identity; optional future Firebase UID; human/service/AI kind kept outside research ontology. |
| 2 | `actor_roles` | Role plus global/sector/institution/geography scope; active assignment uniqueness; grant/revocation audit. |
| 3 | `sectors` | Three-level self hierarchy; exactly five public groups and exact 15 Level 2 canonical sectors; vocabulary version fixed to 1.1.2. |
| 4 | `institutions` | Canonical name, slug, aliases JSON, type, optional parent, official URL, active status. |
| 5 | `records` | Shared canonical record with explicit implementation, workflow, publication, verification, evidence, risk, public, revision, and timestamp state. |
| 6 | `policy_details` | One-to-one policy extension; type, legal instrument, authority, dates. |
| 7 | `project_details` | One-to-one project extension; project type, delivery dates, contractor/reference fields. |
| 8 | `programme_details` | One-to-one programme extension; programme type, target population and term. |
| 9 | `achievement_profiles` | One-to-one public outcome framing; data-value nature and source origin remain explicit. |
| 10 | `record_institutions` | Many-to-many record/institution relationship with lead, implementing, funding, regulatory, partner, or oversight role. |
| 11 | `record_sectors` | Many-to-many record/Level 2 sector relationship; one primary sector per record. |
| 12 | `geographic_units` | Expandable national-to-boundary self hierarchy; public/internal/restricted sensitivity; no fixture coordinates. |
| 13 | `record_geographies` | Record coverage join with primary/secondary/affected/implementation role and sensitivity. |
| 14 | `sources` | Normalized source metadata, source level/type/status, URLs, dates with precision, hash, metadata, and visibility. |
| 15 | `evidence_claims` | Many claims per record; structured value, unit, dates/period, origin, verification, profile, risk, workflow, limitations. |
| 16 | `claim_source_relationships` | Many-to-many claim/source evidence edge; role, canonical relationship type, location, summary, limitation, review and supersession. |
| 17 | `financial_records` | Exact `numeric(24,4)` value under one of 11 canonical categories; ISO currency and all aggregation compatibility dimensions. |
| 18 | `beneficiary_records` | Count tied to one of six canonical stages; type, basis, period, cohort, cumulative and double-counting semantics. |
| 19 | `indicators` | Stable indicator definition, unit, frequency, method, sector and source institution. |
| 20 | `indicator_observations` | Period/geography/value observation separated from definition and backed by a statistical-indicator claim. |
| 21 | `timeline_events` | Canonical event type, exact/partial/range date, provisional/public flags; event meaning is never collapsed. |
| 22 | `corrections` | Append-only correction lifecycle with original/corrected state, reason, evidence and reviewer/approver chain. |
| 23 | `review_decisions` | Append-only gate decision at record revision/subject scope, with reviewer, rationale, risk and time. |
| 24 | `record_relationships` | Enforced record-to-record relationship, direction and canonical role; no self-edge. |
| 25 | `source_files` | Source attachment metadata only: storage URI, file kind/type/size/hash and visibility; no copyrighted fixture content. |
| 26 | `record_versions` | Append-only snapshot/diff JSON per record revision, actor, reason and optional import batch. |
| 27 | `research_batches` | Ingestion control plane: mode/status, hashes, manifest, validation/FK/duplicate reports, summary and idempotency. |

## Key conventions

- Primary keys: UUID, never a public sequence.
- External identities: unique `external_id`; record/indicator/institution slugs where needed.
- Deletion: important references use `ON DELETE RESTRICT`; historical facts are retained.
- Timestamps: `timestamptz`, defaulting to `CURRENT_TIMESTAMP` where creation time is appropriate.
- Exact money: `numeric(24,4)` in PostgreSQL; public view serializes it as text to avoid JavaScript precision loss.
- JSON: limited to structured metadata, snapshots, manifests, and reports—not relational identities.

## Exact controlled models

Financial types are exactly: `budget_allocation`, `approved_funding`, `funding_released`, `reported_expenditure`, `contract_value`, `programme_envelope`, `public_investment`, `private_investment`, `revenue_generated`, `revenue_estimate`, and `savings_estimate`.

Beneficiary stages are exactly: `applicant`, `registered_participant`, `eligible_applicant`, `approved_beneficiary`, `disbursement_recipient`, and `active_beneficiary`.

Public groups are exactly `economy`, `security`, `infrastructure`, `social_services`, and `governance`. A trigger maps every canonical Level 2 sector to its approved group and rejects unknown or incorrectly parented canonical sectors.

## Evidence cardinality

```text
records 1 --- * evidence_claims
evidence_claims 1 --- * claim_source_relationships * --- 1 sources
```

The relationship—not the source—owns `source_role`, relationship type, evidence location, review state and supersession. Its uniqueness includes claim, source, role, type and location, allowing one source to play different evidenced roles without duplicate edges.

## Safe aggregates

Record counts can group by sector, geography, year, type, status, verification and evidence profile. Financial totals are valid only after grouping by at least financial type, currency, aggregation basis, nominal/real basis, reporting period and period bounds. Beneficiary counts require stage, type, count basis, period, cohort/cumulative semantics and geography review. `13-safe-financial-aggregates.sql` demonstrates the rule and intentionally exposes no grand total.

## Views

- `public_record_catalog`: only public `published`/`corrected` records and allowlisted content.
- `public_claim_evidence`: only publishable claims, reviewed relationships and public sources for public records.
- `public_financial_records`: safe public values with exact amount text.
- `public_beneficiary_records`: stage-explicit public counts.

These views are defense-in-depth. Future SQL Connect public operations must keep equivalent predicates and field allowlists.
