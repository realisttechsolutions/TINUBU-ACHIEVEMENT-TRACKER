# TAT Research Ingestion Pipeline

Status: trusted local E01 proof of concept for Contract v1.1.2 packages. It imports no production research and does not start Research Mission 02.

## State machine

```text
VALIDATE -> DRY RUN -> RESOLVE REFERENCES -> DUPLICATE CHECK -> STAGING -> COMMIT
                                                                  |
                                                             COMPENSATE
```

`validate` and `dry_run` never write. `stage` persists only an immutable-control-plan batch. `commit` requires a distinct approver identity and advances the same idempotent batch. In E01, domain row insertion is intentionally zero: the control plane is proven while the Contract-template-to-27-table transformation mapping remains a Mission 02 implementation/review concern.

## Accepted package

- Exactly 19 CSV files with names matching `research/templates/`.
- Exact header order matching the 19 Draft-07 schemas.
- At least one row per file in the synthetic proof.
- Every row contains `[SYNTHETIC DEMO NON-PRODUCTION]`.
- Required cells are nonblank and every row passes its JSON Schema.
- All primary identifiers are unique locally and globally.
- All 24 configured FK fields resolve, including optional supersession/evidence links.
- Claim-source five-part relationship keys are unique.

Unexpected or missing files, malformed CSV quoting, column count/header changes, schema violations, duplicate IDs and unresolved FKs produce structured errors and make the plan invalid.

## Manifest and determinism

For every file the loader records file name, byte length, row count and SHA-256. `packageChecksum` hashes the ordered file manifest. `planHash` hashes contract version, manifest and total planned row count. Identical bytes therefore produce the same plan; any byte change produces a new identity.

`research_batches` records batch/external ID, idempotency key, package checksum, Contract/schema/taxonomy versions, mode/status, submitter/approver, plan hash, manifest, validation report, unresolved-FK report, duplicate report, summary and timestamps.

## Idempotency and duplicates

- Replaying an already committed `{idempotency key, package checksum}` returns the existing batch and writes nothing.
- Staging the same pair twice returns the existing staged batch.
- A key reused for different bytes, or identical bytes presented under a conflicting key, is rejected as an idempotency collision.
- Duplicate primary IDs or duplicate claim/source relationship composites fail validation before staging.
- A future Mission 02 domain duplicate detector must apply `TAT_DUPLICATE_DETECTION_STANDARD.md` and distinguish exact, probable and human-review matches.

## Transactions and compensation

Stage/commit control mutations run inside explicit PostgreSQL transactions and roll back on error. Domain insertion, when authorized later, must use one batch transaction or deterministic per-phase savepoints. Because corrections, versions and decisions are append-only, compensation creates an auditable reversing/correction batch; it must not delete published history.

## Deterministic import order

1. Actor identities and role grants required for attribution.
2. Public groups, canonical sectors and subsectors.
3. Institutions.
4. Geographic units from parents to children.
5. Canonical records.
6. Typed policy/project/programme/achievement extensions.
7. Record-sector, record-institution and record-geography joins.
8. Record relationships after every referenced record exists.
9. Sources, then source-file metadata.
10. Evidence claims.
11. Claim-source relationships; add supersession links in a second pass to break self-reference cycles.
12. Financial and beneficiary records.
13. Indicator definitions, then observations.
14. Timeline events.
15. Corrections, review decisions and versions.
16. Final aggregate/constraint verification and batch commit.

Circular/self references are deferred to a second validated update phase. No constraint is disabled to “make import work.”

## Proof files

- `backend/local/ingestion.mjs`: parser, package builder, validator, hashing, reports and batch transaction.
- `scripts/run-local-ingestion-proof.mjs`: synthetic 19-file dry run.
- `scripts/test-local-database.mjs`: no-write dry run, bad-FK rejection, duplicate rejection, stage/commit transition and replay idempotency.

The synthetic package is created in an OS temporary directory from frozen canonical templates with IDs and markers rewritten as synthetic. It is deleted after each proof.
