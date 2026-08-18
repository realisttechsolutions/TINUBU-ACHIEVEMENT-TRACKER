# TAT Database Protocol: PostgreSQL Standards, Schema Authority & History Truth

**Authority:** Command Centre & Data Architecture  
**Classification:** Canonical Database Specification  
**Scope:** PostgreSQL Cloud SQL, Migrations, History Models, & Connection Hygiene

---

## 1. Canonical Schema Authority

1. **Physical Schema Truth:** [`database/schema.sql`](file:///C:/Users/DELL/Documents/111%20ANTI%20&%20CODEX/TINUBU%20ACHIEVEMENTS%20TRACKER-GOVERNANCE/database/schema.sql) is the sole authoritative definition of tables, views, constraints, indexes, and triggers.
2. **Schema Invariants:**
   - All primary keys are UUIDs (`id UUID PRIMARY KEY`).
   - All entity tables maintain `created_at TIMESTAMPTZ` and `updated_at TIMESTAMPTZ`.
   - Foreign key integrity with `ON DELETE RESTRICT` or `ON DELETE CASCADE` where explicitly modeled.
3. **Migration Discipline:**
   - No direct unversioned DDL execution against staging or production.
   - All migrations must be idempotent, backwards-compatible, and explicitly tested locally before application.

---

## 2. History & Audit Classification Truth

Pursuant to Mission 10H certified baseline:

### Authoritative Classification
- **History Capability:** `REVISION + EVENT HISTORY`
- **Relational Reconstruction:** `PARTIAL`

### Domain Snapshot Matrix (`record_versions.snapshot_json`)
| Domain Entity | Captured in Snapshot | Historical Reconstruction Status |
| :--- | :---: | :--- |
| **Core Record Attributes** | **YES (FULL)** | Preserved point-in-time |
| **Evidence Claims** | **YES (FULL)** | Preserved point-in-time |
| **Financial Records** | **YES (FULL)** | Preserved point-in-time |
| **Beneficiary Records** | **YES (FULL)** | Preserved point-in-time |
| **Timeline Events** | **YES (FULL)** | Preserved point-in-time |
| **Claim-Source Relationships** | **NO (NONE)** | Relies on live relational state |
| **Source Records** | **NO (NONE)** | Relies on live relational state |
| **Geography Relationships** | **NO (NONE)** | Relies on live relational state |
| **Institution Relationships**| **NO (NONE)** | Relies on live relational state |

> **Mandatory Rule:** Agents must NOT state that the system provides "complete entity graph snapshots" or "full relational reconstruction." The correct, verified description is `REVISION + EVENT HISTORY with PARTIAL relational reconstruction`.

---

## 3. Append-Only Trigger & Immutability Rules

1. **Guarded Tables:** `corrections`, `record_versions`, and `review_decisions`.
2. **Trigger Definition:**
   ```sql
   CREATE OR REPLACE FUNCTION tat_block_history_mutation()
   RETURNS TRIGGER AS $$
   BEGIN
     RAISE EXCEPTION 'CANNOT_MUTATE_HISTORY_RECORD: Table % is strictly append-only. UPDATE and DELETE operations are forbidden.', TG_TABLE_NAME;
   END;
   $$ LANGUAGE plpgsql;
   ```
3. **Audit Immutability:** Any administrative or system operation requiring revision must append a new row rather than modifying existing history.

---

## 4. Query Execution & Connection Pool Discipline

1. **Mandatory Statement Timeouts:** Every verification script or ad-hoc query must issue:
   ```sql
   SET statement_timeout = '15000'; -- 15 seconds
   ```
2. **Deterministic Cleanup & Pool Closure:**
   ```javascript
   let db;
   try {
     db = await createDatabasePool();
     await db.query("SET statement_timeout = '15000'");
     // ... execute queries
   } catch (err) {
     console.error('Database query error:', err);
     process.exit(1);
   } finally {
     if (db) {
       await db.close();
     }
   }
   ```
3. **Lock & Concurrency Health Checks:**
   - Blocked locks must be `0` (`SELECT count(*) FROM pg_locks WHERE NOT granted`).
   - Idle transactions must be `0` (`SELECT count(*) FROM pg_stat_activity WHERE state = 'idle in transaction'`).

---

## 5. Synthetic QA Data Lifecycle Protocol

1. **Non-Destructive Erasure:** Synthetic test records created during live certification must be unpublished via the canonical lifecycle (`is_public = false`, `publication_status = 'unpublished'`).
2. **Zero Public Exposure:** After test completion, queries against all 4 public views must return `0` rows matching test prefixes.
3. **Audit History Preservation:** Database history rows (`review_decisions`, `corrections`, `record_versions`) created during testing remain immutably preserved in staging for audit trace completeness.
