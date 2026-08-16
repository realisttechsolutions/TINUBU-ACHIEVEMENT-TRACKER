# Antigravity Engineering Master Takeover & Governance Protocol

**Protocol ID:** `TAT-HANDOFF-01`  
**Effective Date:** 16 August 2026  
**Primary Engineering Executor:** **Antigravity (Google DeepMind)**  
**Architecture & Review Command Centre:** **ChatGPT**  

---

## 1. Operating Rules & Engineering Responsibilities

1. **Antigravity as Primary Engineering Executor**:
   - Owns end-to-end execution across Frontend (Next.js 15), Backend (Node.js/TypeScript), Database (PostgreSQL 17 on Google Cloud SQL), Hosting (Firebase App Hosting), Authentication (Firebase Auth), Testing, Browser QA, Deployment, and Git version control.
   - Codex is relieved from primary engineering to avoid usage bottleneck. Codex worktrees are permanently frozen.

2. **Worktree Isolation Invariant**:
   - Antigravity operates strictly in dedicated worktrees prefixed with `...-ANTIGRAVITY-*` (e.g. `TINUBU ACHIEVEMENTS TRACKER-ANTIGRAVITY-M10D`, `...-M10E`, `...-M10F`).
   - The primary repository root and other agent physical worktrees remain completely untouched.

3. **Frequent Checkpoint & Push Rule**:
   - Long periods of uncommitted/unpushed work are prohibited.
   - After each discrete, verified block of functionality:
     `TEST -> COMMIT -> PUSH -> CONTINUE`.

4. **Permanent Cloud Safety Gates**:
   - Explicit user/architect approval is required prior to:
     - Touching live production Firebase projects or Cloud SQL instances.
     - Destructive database schema migrations or dropping constraints/triggers.
     - Weakening IAM permissions or public security boundaries.
     - Changing the frozen Research Contract (v1.1.2) or research facts.
     - Introducing AI APIs or automated publishing workflows.

5. **Canonical Database Authority**:
   - `database/schema.sql` is the physical database authority for all 27 tables, constraints, triggers, and views.
   - No ORM or vendor-generated schema may override physical PostgreSQL controls.
   - Public runtime identity (`tat-staging-db-app@...` / `tat_public_reader`) has `SELECT` ONLY through four approved public views (`public_record_catalog`, `public_claim_evidence`, `public_financial_records`, `public_beneficiary_records`). Direct `SELECT` on base tables is DENIED. All writes are DENIED.

---

## 6. Mission 10E Execution & Completion Summary

- **Branch:** `antigravity/mission-10e-admin-auth`
- **Worktree:** `C:\Users\DELL\Documents\111 ANTI & CODEX\TINUBU ACHIEVEMENTS TRACKER-ANTIGRAVITY-M10E`
- **Scope Accomplished:**
  - Complete server-side staff authentication with 8-hour HTTP-only session cookies (`tat_admin_session`).
  - Recent authentication verification (`auth_time` age <= 5 minutes / 300s).
  - Four staff roles (`super_admin`, `researcher`, `reviewer`, `publisher`) enforced via custom claims.
  - Route matrix with server component guards (`requireStaffAuth`).
  - Anti-CSRF protection across all state-changing auth endpoints.
  - Security headers (`noindex`, `no-store`) on all administrative paths.
  - Public site zero-login immunity certified across 11 core routes.
  - Public database boundary certified (SELECT only on 4 public views; 0 base table access; 0 writes).
  - Out-of-band operator bootstrap scripts (`scripts/admin/bootstrap-staff.mjs`, `scripts/admin/set-staff-role.mjs`, `scripts/admin/disable-staff.mjs`) with strict email verification requirement.
  - 100% test pass rate across 26 test suites (99 passed, 2 skipped live Cloud SQL in local mock mode, 0 failed).
  - Next.js production build certified clean (68 static/dynamic routes).
- **First Super Admin Status:** `READY FOR FIRST SUPER ADMIN EMAIL: YES` (documented in `docs/engineering/TAT_M10E_SUPER_ADMIN_BOOTSTRAP.md`).
