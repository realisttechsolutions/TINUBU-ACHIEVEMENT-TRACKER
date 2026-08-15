# Mission 10 Admin & Research Operations Handoff Specification

## 1. Research Operations CLI Tooling

Research staff and data administrators operate through standard Node.js automation commands:
- **Snapshot Verification**: `node scripts/ingestion/verify-snapshot.mjs [snapshot_dir]`
  - Calculates SHA-256 hashes and compares against `manifest.json`.
- **Dataset Validation**: `node scripts/ingestion/validate-dataset.mjs [snapshot_dir]`
  - Validates all 19 CSV schemas, canonical vocabulary, PKs, and FKs.
- **Batch Ingestion**: `node scripts/ingestion/import-m02.mjs [--dry-run]`
  - Executes dry-run validation or commits live data transactionally into the relational database.
- **Batch Rollback**: `node scripts/ingestion/rollback-batch.mjs [batch_id]`
  - Transitions batch entities to `withdrawn`/`retracted` and marks batch `compensated` without breaking immutable audit logs.
