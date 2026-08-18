---
name: tat-hung-process-recovery
description: Bounded process monitoring, hung task diagnostics, external system inspection, targeted process termination, and safe recovery protocol for TAT.
---

# TAT Hung Process Recovery Skill

## Operational Recovery Protocol

### 1. Detection of Stalled Operations
A process or task is considered potentially hung if:
- No meaningful stdout/stderr output is received for a bounded duration (e.g., > 2 minutes).
- Asynchronous task monitors report "running" without log progression.

### 2. Diagnostic Procedure
1. **Identify the Task:**
   - Retrieve Task ID, command line string, start time, and elapsed duration.
2. **Review Output Logs:**
   - Check the tail of the task log for unhandled promise rejections, connection timeouts, or silent failures.
3. **Independently Check External State:**
   - Open a fresh, short-lived database connection with `statement_timeout = '15000'` to query `pg_stat_activity`.
   - Check whether queries are actually running on PostgreSQL or if the bottleneck is local.
   - For cloud builds, query the Cloud Build / App Hosting API to verify actual build state.

### 3. Targeted Termination
- Terminate **ONLY the specific hung child task/process** using task management tools (`manage_task` with action `kill`).
- Never terminate unrelated processes or active cloud backends.

### 4. Code & Script Safety Measures
To prevent hung processes in verification scripts:
- **Statement Timeout:** Always include `SET statement_timeout = '15000'`.
- **Pool Closure:** Always close connection pools inside a `finally` block (`try { ... } finally { if (db) await db.close(); }`).
- **Deterministic Exit:** Always call `process.exit(0)` on success and `process.exit(1)` on error. Never use open-ended event loops with empty catch blocks.

### 5. Safe Resumption
- Do NOT re-execute completed destructive operations.
- Resume testing or deployment from the last verified checkpoint.
