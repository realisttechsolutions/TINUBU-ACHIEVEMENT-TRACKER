# Research Ingestion Protocol Specification

## 1. Pipeline Stages

1. **Manifest Integrity Gate (`manifest-verifier.mjs`)**:
   - Calculates SHA-256 hash for every file in `data/research-snapshots/<snapshot>/csv/` and `schemas/`.
   - Computes aggregate dataset hash.
   - Halts immediately if any hash does not match `manifest.json`.

2. **Schema & Taxonomy Validation Gate (`data-validator.mjs`)**:
   - Compares every CSV record against its Draft-07 JSON Schema.
   - Enforces canonical controlled vocabulary v1.1.2.
   - Validates Primary Key uniqueness across files.
   - Enforces 24 explicit foreign-key referential integrity links.

3. **Entity Transformation (`entity-transformer.mjs`)**:
   - Normalizes slugs, enums, dates, and precision codes.
   - Converts external string IDs to deterministic UUIDs.
   - Builds polymorphic `records` rows and subtype detail rows.

4. **Transactional Persistence (`importer.mjs`)**:
   - Checks batch idempotency against `research_batches`.
   - Executes inside a single atomic database transaction (`BEGIN` / `COMMIT`).
   - If any record or trigger fails, rolls back completely (`ROLLBACK`).

5. **Reconciliation & Certification (`reconciler.mjs`)**:
   - Counts all persisted entities against expected research targets.
   - Validates the 10 showcase benchmark records.
