# TAT Execution Protocol: Operational Lifecycle & Engineering Discipline

**Authority:** Command Centre  
**Classification:** Standard Operating Procedure  
**Scope:** All Agent Workflows & Engineering Tasks

---

## 1. Standard Agent Execution Lifecycle

Every engineering mission must follow the strict seven-stage execution loop:

```
  [1. UNDERSTAND]  ---> Read mission objectives, authorized scope, and stop conditions.
        │
  [2. INSPECT]     ---> Perform read-only static, database, and cloud checks.
        │
  [3. PLAN]        ---> Formulate minimal diff implementation strategy.
        │
  [4. EXECUTE]     ---> Implement minimal code or configuration changes locally.
        │
  [5. VERIFY]      ---> Run automated local test suites, typechecks, and builds.
        │
  [6. COMMIT]      ---> Stage and commit minimal diff locally.
        │
  [7. GATE/STOP]   ---> STOP for Operator Push / Command Centre Escalation.
```

---

## 2. Cloud & Staging Deployment Execution Cycle

For missions involving staging deployments and live cloud certifications, the sequential gating protocol must be strictly observed:

```
  [1. LOCAL VERIFY]      ---> Execute unit/integration tests and static typechecks.
        │
  [2. LOCAL COMMIT]      ---> Create atomic Git commit on active worktree.
        │
  [3. OPERATOR PUSH]     ---> STOP and request operator push to remote origin.
        │
  [4. VERIFY REMOTE]     ---> Verify Git local SHA == Git remote SHA.
        │
  [5. DEPLOY CLOUD RUN]  ---> Trigger ONE deployment of tat-admin-api-staging.
        │
  [6. VERIFY CLOUD RUN]  ---> Confirm Revision READY, Image Digest, Source SHA, 100% Traffic.
        │
  [7. DEPLOY APP HOSTING]---> Trigger ONE rollout of tat-staging.
        │
  [8. VERIFY APP HOSTING]---> Confirm Build READY, Rollout SUCCEEDED, Source SHA, 100% Traffic.
        │
  [9. PROVENANCE PROOF]  ---> Prove 4-Way SHA Synchronization.
        │
  [10. LIVE TEST SUITE]  ---> Execute live end-to-end certification script against staging endpoints.
        │
  [11. FINAL DB AUDIT]   ---> Run bounded read-only audit of DB locks, sessions, and public exposure.
        │
  [12. REPORT CLOSURE]   ---> Emit standardized final certification report.
```

---

## 3. Strict Prohibitions During Execution

1. **No Parallel Gating Operations:** Never launch concurrent cloud deployments or dependent mutation scripts. All gating actions must run sequentially (`RUN -> WAIT -> VERIFY -> CONTINUE`).
2. **No Passive Monitoring / Background Assumptions:** Background task existence or process startup is NOT proof of completion. Every operation must be deterministically waited on and verified.
3. **No Iterative Deployment Debugging:** Cloud Run and App Hosting are deployment targets, not remote scratchpads. Debugging must be performed locally using unit and integration test harnesses before deploying.
4. **No Premature Continuation on Defect:** If any verification step fails, **STOP immediately**. Do not proceed to subsequent test steps.

---

## 4. Bounded Waiting & Asynchronous Task Rules

1. **Hard Query Timeouts:** All ad-hoc database queries and verification scripts must set a statement timeout (`SET statement_timeout = '15000'`).
2. **Connection Lifecycle Safety:** Every database connection must be closed inside a `finally` block:
   ```javascript
   let db;
   try {
     db = await createDatabaseClient();
     await db.query("SET statement_timeout = '15000'");
     // execute queries
   } finally {
     if (db) await db.close();
   }
   ```
3. **Deterministic Exit Codes:** Verification scripts must explicitly call `process.exit(0)` upon success and `process.exit(1)` upon failure.

---

## 5. Hung Process Recovery Protocol

When a local process, test runner, or cloud command fails to make progress within an expected timeframe:
1. **Identify the Task:** Inspect task ID, command string, PID, and elapsed time.
2. **Capture Last Known Output:** Review stdout/stderr logs.
3. **Perform Independent External Inspection:** Query Cloud SQL (`pg_stat_activity`), Cloud Build, or Cloud Run APIs via a fresh, short-lived connection to verify if the external operation completed or failed.
4. **Targeted Process Termination:** Kill **ONLY the specific hung child process**. Never terminate unrelated processes or database sessions without explicit justification.
5. **Resume Safely:** Resume execution from the last verified checkpoint.
