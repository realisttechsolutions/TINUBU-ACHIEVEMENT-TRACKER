---
name: tat-database-change
description: Standards for SQL migrations, append-only triggers, bounded statement timeouts, and connection pool safety for TAT PostgreSQL databases.
---

# TAT Database Change Skill

## Database Mutation & Audit Checklist

### 1. Schema Authority & Migration Safety
- [ ] Confirm physical schema change is recorded in `database/schema.sql`.
- [ ] Verify migration is non-destructive (no `DROP TABLE`, `DROP COLUMN`, or data truncation).
- [ ] Test migration locally before considering staging execution.
- [ ] Ensure all primary keys are UUIDs and timestamp fields are `TIMESTAMPTZ`.

### 2. Append-Only History Triggers
- [ ] Verify `tat_block_history_mutation()` trigger function is active on `corrections`, `record_versions`, and `review_decisions`.
- [ ] Confirm that `UPDATE` and `DELETE` queries on history tables fail with `CANNOT_MUTATE_HISTORY_RECORD`.

### 3. Connection & Timeout Hygiene
- [ ] Ensure all verification scripts execute `SET statement_timeout = '15000'` (15s limit).
- [ ] Ensure database client/pool is closed in a `finally` block (`try { ... } finally { if (db) await db.close(); }`).
- [ ] Ensure scripts call `process.exit(0)` on success and `process.exit(1)` on error.

### 4. Database Concurrency Health Audit
- [ ] Verify 0 blocked locks:
  ```sql
  SELECT count(*) FROM pg_locks WHERE NOT granted;
  ```
- [ ] Verify 0 idle-in-transaction sessions:
  ```sql
  SELECT count(*) FROM pg_stat_activity WHERE state = 'idle in transaction';
  ```
