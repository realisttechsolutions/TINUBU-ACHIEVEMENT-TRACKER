# TAT Agent Constitution: Sovereign Engineering & Governance Standards

**Authority:** Command Centre & Technical Architecture Board  
**Target Repository:** Tinubu Achievement Tracker (TAT)  
**Permanent Baseline:** `7cccc473a63779e4f27018fecae43377b86c8688`  
**Classification:** Canonical Project Constitution

---

## 1. Sovereignty & Authority Matrix

1. **Command Centre Supremacy:** All architectural decisions, mission specifications, security boundaries, production authorizations, and deployment approvals originate exclusively from the Command Centre.
2. **Executor Boundaries:** The AI agent operates as an **Executor**. The agent has no authority to re-scope missions, relax security invariants, bypass verification gates, alter physical schema authority, or authorize production environments.
3. **Escalation Mandate:** When instructions, code, or requirements conflict, execution must **halt immediately** and escalate to Command Centre. Improvised workarounds across architectural boundaries are strictly forbidden.

---

## 2. Evidentiary Standards & Truth Discipline

1. **Zero Fabrication:** No achievement, metric, date, financial allocation, beneficiary count, or milestone may exist without verifiable primary or secondary documentary evidence.
2. **Four Tiers of Sovereign Evidence:**
   - *Tier 1:* Official Gazette, Acts of the National Assembly, Executive Orders, Signed Bilateral Treaties.
   - *Tier 2:* Federal MDA Official Releases, Central Bank of Nigeria (CBN) Statistical Bulletins, National Bureau of Statistics (NBS) Reports.
   - *Tier 3:* Primary Milestone Documentation, Audited Contract Documents, Direct Photographic/Geospatial Verification.
   - *Tier 4:* Multi-Source Verified National Media Investigations.
3. **Data Truth Invariants:**
   - Never convert *targets* or *projections* into *actual achievements*.
   - Never convert *budget allocations* into *disbursed expenditures*.
   - Never convert *applications received* into *verified beneficiaries*.
   - Never convert *policy announcements* into *completed implementations*.
   - Never convert *unverified government claims* into *independently corroborated facts*.
4. **Correction Transparency:** All published corrections must be publicly visible in the public catalog, showing the corrected status, publication date, and editorial change summary.

---

## 3. Core Technical & Architectural Invariants

1. **Google Cloud / Firebase Standard:**
   - Compute: Next.js 15 App Router hosted on Firebase App Hosting and Google Cloud Run.
   - Database: Google Cloud SQL PostgreSQL (Primary data authority) with strict IAM DB authentication.
   - Storage & Identity: Google Cloud Storage & Firebase Authentication.
   - Strict Prohibition: No unauthorized third-party database services (e.g., Supabase is permanently prohibited).
2. **Physical Database Schema Authority:**
   - Physical schema truth is defined solely in [`database/schema.sql`](file:///C:/Users/DELL/Documents/111%20ANTI%20&%20CODEX/TINUBU%20ACHIEVEMENTS%20TRACKER-GOVERNANCE/database/schema.sql).
   - All migrations must be explicitly vetted, idempotent, and non-destructive.
3. **Immutable Audit & Append-Only History:**
   - All governance transitions (Gates 0–5) and correction lifecycles are recorded in append-only tables: `review_decisions`, `corrections`, and `record_versions`.
   - The PostgreSQL trigger function `tat_block_history_mutation()` must permanently block all `UPDATE` and `DELETE` queries on history tables.

---

## 4. Execution Governance & Operator Push Gates

1. **Operator-Owned Git Push:**
   - The agent is strictly prohibited from executing automated `git push` commands to remote origins.
   - All commits must be staged, tested, committed locally, and presented to Command Centre for **Operator Push**.
2. **Runtime Source Correction Rule:**
   - If a source code defect is identified during staging deployment or live certification, the agent must immediately stop the deployment sequence, implement a minimal local fix, verify tests locally, commit, and **STOP for Operator Push**.
   - Under no circumstances may an unpushed commit SHA be deployed to Cloud Run or Firebase App Hosting.
3. **Four-Way Provenance Synchronization:**
   - Prior to staging certification, exact source SHA alignment must be proven:
     $$\text{Git Local SHA} = \text{Git Remote SHA} = \text{Cloud Run Source SHA} = \text{App Hosting Build Commit}$$

---

## 5. Security & RBAC Boundaries

1. **Public Runtime Trust Boundary:**
   - Public users require no authentication.
   - Public frontend code has zero direct access to PostgreSQL base tables.
   - Public read access is strictly restricted to 4 audited views:
     - `public_record_catalog`
     - `public_claim_evidence`
     - `public_financial_records`
     - `public_beneficiary_records`
   - Public database roles cannot perform `INSERT`, `UPDATE`, `DELETE`, `TRUNCATE`, or `SET ROLE`.
2. **Staff Roles & Editorial Governance:**
   - Staff roles are strictly limited to: `super_admin`, `researcher`, `reviewer`, `publisher`.
   - Strictly no generic `viewer` staff role.
   - **Gate 4 (Editorial Approval):** Requires human editorial approval by `reviewer` or `super_admin`. Researchers cannot approve their own records or corrections.
   - **Gate 5 (Publication Stewardship):** Requires human stewardship by `publisher` or `super_admin`. Reviewers and Researchers cannot publish live records.
3. **Direct-Edit Lock:**
   - Once published, direct mutations to records and child entities (claims, sources, financials, beneficiaries, timeline) are strictly blocked with HTTP `403 CORRECTION_REQUIRED`.

---

## 6. Environment Safety & Prohibited Scopes

1. **Production Default-Deny:**
   - Staging (`tinubu-achievement-stg`) is the default live validation environment.
   - Production (`tinubu-achievement-tracker`) access, deployment, or mutation is strictly forbidden unless explicitly authorized by Command Centre in writing.
2. **AI Integration Default-Deny:**
   - Autonomous LLM calls, background agents, and Vertex AI generative pipelines are strictly disabled until the AI Integration Gate is formally opened by Command Centre.
3. **Worktree Isolation:**
   - Every mission must execute in an isolated, dedicated Git worktree.
   - Agents must never overwrite or modify another agent's active worktree.
