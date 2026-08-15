# Codex Mission 01 Data Ingestion Review

**Verdict:** Future ingestion should run as trusted Node.js server-side tooling through the Firebase SQL Connect Admin SDK, using the local emulator for development and explicit validate/dry-run/stage/commit modes. Browser/client connector mutations are not appropriate for research batch imports.

No importer, staging database or production data was created in this audit.

## Current contract assessment

The 18 CSV templates and paired Draft-07 schemas provide a useful research interchange format. They are not yet a complete database import contract:

- There are no canonical templates for institutions, hierarchical sectors, geographic units, record-sector/institution/geography links, record relationships, actor roles, or claim-source relationship rows.
- `claim_extraction` requires one `source_id`, contradicting the required many-to-many claim/source model.
- Several schemas accept unconstrained status, date and URL strings.
- Financial values have only five classes and beneficiary values omit eligible applicants, units, geography, period/cumulative basis and double-count protection.
- IDs mix bracketed examples, slugs and future UUIDs without a declared import identity strategy.
- The old validator did not validate rows against schemas; it has been repaired in this audit, but schema content still needs version 1.1 remediation.

## Recommended execution model

Use a privileged, non-browser Node.js command-line importer with application default credentials/service-account identity and SQL Connect Admin SDK operations marked `NO_ACCESS` for clients.

Why:

- Official SQL Connect guidance recommends the Admin SDK for production bulk operations.
- Generated admin operations and `insertMany`/`upsertMany` retain typed relational access and can use the emulator.
- IAM and service identity isolate import capability from ordinary researchers and public clients.
- The importer can enforce the research contract, write batch/review history and call transactional mutations.

Direct controlled PostgreSQL access is an exceptional fallback for very large loads/exports after schema stability and database-owner approval. Official guidance permits SQL tools for data changes but warns that direct schema changes can break the SQL Connect schema and connectors. Client connector mutations are suitable for small, interactive editorial changes—not bulk import.

## Required modes

| Mode | Database write | Required output |
|---|---:|---|
| `validate` | None | Schema version, input checksums, row errors, warning summary. |
| `dry-run` | None | Normalized rows, resolved keys, proposed inserts/updates/skips/conflicts, deterministic plan hash. |
| `stage` | Staging only | Batch ID, staged rows, unresolved FK/duplicate report, review-ready diff. |
| `commit` | Transactional production/staging target | Approved batch ID, counts, resulting IDs/versions, immutable audit event. |
| `rollback` | Controlled compensating transaction | Reversal plan tied to batch; never deletes unrelated later edits. |

`commit` must require the exact validated plan hash, input checksums, schema/taxonomy versions and approval token/decision. Revalidation is mandatory if any input or dependency changes.

## Pipeline

```text
discover files
  -> verify manifest/checksums/encoding
  -> strict RFC-style CSV parse
  -> Draft-07 schema validation
  -> normalize controlled values
  -> resolve natural/external keys
  -> duplicate and circular-source checks
  -> resolve all foreign keys
  -> semantic rules (stage/finance/beneficiary/date/evidence)
  -> deterministic dry-run plan + errors
  -> stage under research_batch_id
  -> human review/approval
  -> transactional commit
  -> post-commit counts and referential checks
  -> immutable summary/error artifacts
```

Do not partially commit a logical record. A record, subtype, taxonomies/links, claims, claim-source links and structured values should commit atomically or remain staged.

## Manifest and versioning

Every batch should include:

- `batch_external_id` and idempotency key
- creation timestamp and submitting actor
- contract/schema/taxonomy versions
- list of files with SHA-256, byte count, row count and encoding
- source system/tool version
- declared target environment and mode
- parent/correction batch when applicable
- approvals and plan hash

Never infer production mode from a filename. Require an explicit environment plus privileged credential.

## Identifier and duplicate strategy

- Generate database UUIDs at commit.
- Require a stable `external_key` per input entity, namespaced by producer/template/version.
- Store source document numbers, canonical URLs and authoritative institution/geography codes as alternate unique keys where appropriate.
- Resolve record slug collisions separately from identity; slugs are public routing labels and may change.
- Idempotency: the same batch/checksum rerun produces skips and the same result, not duplicate rows.
- Conflicting content under the same external key becomes a proposed update/version requiring review.

Duplicate detection must combine exact keys with reviewed fuzzy candidates. A fuzzy score never auto-merges records.

## Foreign-key handling and order

Import/reference order:

1. Actors/roles and taxonomy/reference data (`sectors`, `institutions`, `geographic_units`).
2. Sources and approved source files.
3. Batch row.
4. Records and subtype/achievement extensions.
5. Record relationship/join tables.
6. Evidence claims.
7. Claim-source relationships.
8. Financial, beneficiary, indicator observation and timeline facts.
9. Review/version/correction events.

An unresolved reference error must include file, row, column, raw key, expected entity/table, suggestions and blocking severity. Do not create silent “unknown” institution/sector/geography rows during commit.

## Staging and rollback

Staging may be implemented as batch-scoped staging tables or a trusted import service's normalized plan artifacts plus database staging rows. It must not expose staged content to public connectors.

Rollback rules:

- Before commit, rollback means delete/expire the isolated staging batch.
- During commit, database transaction rollback handles failure.
- After commit, never restore by blind deletion. Generate compensating changes from `research_batch_id` and `record_versions`, refuse rollback where later approved edits depend on affected rows, and require human approval.
- Published corrections use the correction workflow, not import rollback that erases history.

## Structured error artifacts

Produce machine-readable JSON Lines plus a human summary. Each issue includes:

- batch/file/row/column
- entity external key
- error code and severity
- raw value (redacted when sensitive)
- normalized candidate where relevant
- expected rule/schema path
- remediation guidance

Separate errors from warnings. A non-zero process exit is mandatory for parser, schema, required-field, enum, date, URL, currency, numeric precision, pipe-array, unresolved-FK, duplicate-conflict or authorization failures.

## Security and observability

- Admin credentials never appear in the research CSV, browser bundle or GitHub logs.
- Use least-privilege import service identity and separate staging/production credentials.
- Validate content type and size before reading; cap rows/field lengths/batch sizes.
- Neutralize CSV formula injection in exported error/summary spreadsheets.
- Redact internal/restricted values in logs.
- Record actor, tool version, commit SHA, operation counts, duration and database target.
- Rate-limit batches and monitor SQL operation/Cloud SQL load.
- Require backups/restore readiness before the first production commit.

## Acceptance tests for the future importer

- Repeat identical batch: zero duplicates and deterministic result.
- One invalid enum/date/URL/currency/decimal/array: validate and dry-run fail without writes.
- Malformed quoted CSV and embedded newline cases.
- Unresolved and ambiguous foreign keys.
- Duplicate slug versus duplicate identity.
- Claim with supporting, contradictory and replacement sources.
- Allocation/release/expenditure separation.
- Applicant/eligible/disbursement/active count separation and cumulative overlap.
- Mid-transaction failure leaves no partial logical record.
- Unauthorized researcher cannot stage/commit to production.
- Approved rollback does not erase later edits.

## Recommendation

The next contract revision should add templates/schemas for reference entities and relationship rows, or define a manifest-backed JSON Lines format for the normalized relational package. Only after that contract passes local emulator tests should an importer be implemented.

Official references: [SQL Connect Admin SDK](https://firebase.google.com/docs/sql-connect/admin-sdk), [bulk data operations](https://firebase.google.com/docs/sql-connect/data-seeding-bulk-operations), [SQL Connect emulator/CLI](https://firebase.google.com/docs/sql-connect/cli-reference), and [Cloud SQL import/export guidance](https://cloud.google.com/sql/docs/postgres/import-export).
