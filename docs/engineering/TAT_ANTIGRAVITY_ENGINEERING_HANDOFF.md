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
     `TEST → COMMIT → PUSH → CONTINUE`.

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
