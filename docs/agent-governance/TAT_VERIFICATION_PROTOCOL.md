# TAT Verification Protocol: Evidence Hierarchy & Quality Gates

**Authority:** Command Centre & Quality Assurance  
**Classification:** Canonical Verification Specification  
**Scope:** Automated Testing, Build Validation, Database Audits, & Live Certifications

---

## 1. Six-Tier Verification Evidence Hierarchy

Mission completion claims must be categorized and proven according to the following 6 levels:

```
  ┌────────────────────────────────────────────────────────┐
  │ Level 6: Production Live Verification                 │  <-- ONLY WHEN EXPLICITLY AUTHORIZED
  ├────────────────────────────────────────────────────────┤
  │ Level 5: Live Staging Cloud Certification             │  <-- Cloud Run & App Hosting live endpoints
  ├────────────────────────────────────────────────────────┤
  │ Level 4: Database & Security Boundary Audit          │  <-- PostgreSQL Triggers, Grants, Views
  ├────────────────────────────────────────────────────────┤
  │ Level 3: Build & Type Validation                      │  <-- tsc --noEmit, next build
  ├────────────────────────────────────────────────────────┤
  │ Level 2: Automated Local Regression Tests             │  <-- vitest run
  ├────────────────────────────────────────────────────────┤
  │ Level 1: Static Code Inspection & Review              │  <-- git diff, AST inspection
  └────────────────────────────────────────────────────────┘
```

---

## 2. Evidence Tier Requirements

### Level 1: Static Code Inspection
- Clean whitespace and format compliance (`git diff --check`).
- Explicit code review confirming zero unintended side effects.

### Level 2: Automated Local Tests
- Vitest suite execution (`node ./node_modules/vitest/vitest.mjs run`).
- 100% test pass rate across all domain test files.

### Level 3: Build & Compilation Validation
- TypeScript typecheck (`node ./node_modules/typescript/bin/tsc --noEmit`) with 0 errors.
- Next.js production build (`node ./node_modules/next/dist/bin/next build`) compiling all static and dynamic routes.

### Level 4: Database & Security Audit
- Privilege audit proving `tat_public_reader` and `tat_admin_writer` adhere strictly to least-privilege matrix.
- Append-only trigger verification proving `tat_block_history_mutation()` blocks `UPDATE` and `DELETE`.
- Concurrency audit proving 0 blocked locks and 0 idle-in-transaction sessions.

### Level 5: Live Staging Cloud Certification
- End-to-end live testing against deployed staging endpoints (`tat-staging` and `tat-admin-api-staging`).
- Proof of 4-way source provenance synchronization.
- Proof of 0 public exposure of test records across all 4 public views.

### Level 6: Production Live Verification
- **Strict Requirement:** May ONLY be executed when Command Centre explicitly provides written production authorization.

---

## 3. Strict Reporting Rules

1. **No Inflated "PASS" Language:** Never state that a feature is "PASS" or "CERTIFIED" if only Level 1 or Level 2 evidence was collected.
2. **Explicit Verification Level Declaration:** Every final mission report must explicitly state the highest verification level achieved.
