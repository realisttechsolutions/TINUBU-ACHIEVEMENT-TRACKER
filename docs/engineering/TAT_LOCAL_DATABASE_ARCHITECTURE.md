# TAT Local Database Architecture

Status: Engineering Mission E01 local foundation

Research authority: `docs/research/TAT_RESEARCH_CONTRACT_V1_1_2.md`

Vocabulary authority: `research/schemas/canonical-vocabulary.v1.1.2.json`
Cloud provisioning: **NOT AUTHORIZED IN E01**

## Outcome

E01 implements the approved 27-table relational architecture without a conceptual table change. It provides two complementary, local-only execution paths:

1. `database/schema.sql` runs against PostgreSQL-compatible PGlite for fast deterministic engineering tests. It is the complete relational definition, including check constraints, partial and GIN indexes, public views, semantic triggers, and append-only audit protections.
2. `dataconnect/` is a genuine Firebase SQL Connect schema and two-connector surface. Firebase CLI 15.27.0 compiles it, starts the official local SQL Connect emulator with embedded PGlite/PostgreSQL, and generates JavaScript SDKs.

No Firebase project was linked, no billing was enabled, and no remote service or database was created.

## Architecture

```text
Frontend V2 (separate branch; unchanged)
        |
PublicDataPort / frontend adapter contract
        |
generated public SQL Connect SDK
        |
PUBLIC connector (explicit publication predicates)
        |
Firebase SQL Connect local emulator
        |
local embedded PostgreSQL/PGlite
        |
27-table relational model + canonical research mappings

Trusted ingestion CLI -> validation/dry-run/stage/commit control plane
Staff SDK/connector -> NO_ACCESS throughout E01
```

## Local commands

```text
npm run validate:research
npm run db:test
npm run db:proofs
npm run db:ingest:dry-run
npm run sqlconnect:generate
npm run sqlconnect:emulator
# while the emulator is running:
npm run sqlconnect:check
```

The repository path contains an ampersand, which breaks the Windows `.cmd` launcher produced for some npm binaries. SQL Connect scripts therefore call the Firebase CLI JavaScript entry point directly. This changes only process invocation, not Firebase behavior.

## Relational domains

- Identity and authorization mapping: `actor_profiles`, `actor_roles`.
- Taxonomy and reference data: `sectors`, `institutions`, `geographic_units`.
- Canonical records and typed extensions: `records`, `policy_details`, `project_details`, `programme_details`, `achievement_profiles`.
- Record joins: `record_institutions`, `record_sectors`, `record_geographies`, `record_relationships`.
- Evidence: `sources`, `source_files`, `evidence_claims`, `claim_source_relationships`.
- Structured values: `financial_records`, `beneficiary_records`, `indicators`, `indicator_observations`, `timeline_events`.
- Governance and audit: `corrections`, `review_decisions`, `record_versions`, `research_batches`.

## Identity strategy

Every table has a UUID identity, supplied by the caller in the complete SQL DDL and defaulted with `uuidV4()` in SQL Connect. UUIDs provide stable, globally unique, non-sequential identifiers suitable for imports and generated SDKs. Human/source identifiers remain separate `external_id` values and public records have unique slugs. The complete DDL intentionally does not require `pgcrypto`; this keeps the local runner portable and makes trusted import identity generation explicit.

## Integrity strategy

PostgreSQL enforces:

- foreign keys instead of uncontrolled `entity_type/entity_id` references;
- unique slugs, external IDs, relationship composites, versions, and active role assignments;
- exact canonical financial types, beneficiary stages, date precisions, workflow states, and other controlled values;
- the five-group/15-sector parent mapping and Level 2-only record sector assignments;
- claim/record consistency for finance, beneficiaries, indicator observations, and timeline links;
- publication-state prerequisites;
- append-only corrections, review decisions, and record versions.

The SQL Connect schema represents tables, keys, relations, connector fields, and generated types. The complete SQL DDL adds constraints and database objects that SQL Connect GraphQL cannot express. Future cloud migration must reconcile both under `STRICT` schema validation before provisioning.

## Dates and periods

Exact values use PostgreSQL `date`; instants use `timestamptz`. Precision is always carried separately as one of `exact_day`, `month`, `quarter`, `year`, `fiscal_year`, `range`, or `unknown`. Ranges use `period_start` and `period_end`; source labels preserve fiscal or human reporting periods. Constraints prevent invented exact dates for unknown/range values.

## Search, filtering, and indexing

MVP search uses PostgreSQL `to_tsvector`/`plainto_tsquery` for record text and indexed normalized lookups for institution and source metadata. Expected catalog filters have composite indexes on publication, implementation, type, verification, workflow, risk, sector, geography, and dates. At larger scale, weighted generated `tsvector` columns and trigram indexes can be added before considering an external search service.

## Public/internal boundary

`public_record_catalog`, `public_claim_evidence`, `public_financial_records`, and `public_beneficiary_records` are allowlisted projections. They require publishable record/source/relationship state and exclude workflow queues, internal notes, actor roles, reviewer identities, restricted sources, file locations, batch manifests, and unpublished claims. The browser must query a public connector/projection; visual hiding is not an authorization boundary.

## Local versus cloud

Real in E01: PostgreSQL execution, relational constraints, Firebase SQL Connect schema compilation, official emulator startup, embedded PostgreSQL table generation, connector compilation, and SDK generation.

Not performed in E01: Firebase project linkage, Cloud SQL provisioning, deployed SQL Connect, production Auth, Hosting, Storage, Functions/Run, backup/PITR, or production data import.

## Architecture refinements

There is no change from the approved 27-table model. Small implementation refinements are column/constraint level only: caller-supplied UUIDs in portable DDL, explicit visibility classes, deterministic import hashes, safe public views, semantic claim-link triggers, and append-only governance triggers. Migration impact is additive DDL; frontend impact is confined to stable adapter shapes.
