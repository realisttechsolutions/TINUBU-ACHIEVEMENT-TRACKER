# TAT Architecture Baseline: Frozen System Architecture & Invariants

**Authority:** Command Centre & Technical Architecture Board  
**Classification:** Canonical System Architecture  
**Scope:** Frontend, Backend, Database, Control Plane & Editorial Governance

---

## 1. High-Level System Architecture

```
                                  [ PUBLIC INTERNET ]
                                           │
                                           ▼
                            ┌──────────────────────────────┐
                            │  Firebase App Hosting        │
                            │  Next.js 15 App Router       │
                            │  (Frontend & SSR Public UI)  │
                            └──────────────┬───────────────┘
                                           │
                    ┌──────────────────────┴──────────────────────┐
                    │ (Public Reads: 4 Audited Views)             │ (Admin Proxy: Internal IAM)
                    ▼                                             ▼
     ┌─────────────────────────────┐               ┌──────────────────────────────┐
     │  Cloud SQL PostgreSQL       │               │  Google Cloud Run            │
     │  (Primary Data Authority)   │◄──────────────┤  Admin Control Plane API     │
     │  - Schema: database/schema  │ (tat_admin_   │  (tat-admin-api-staging)     │
     │  - Append-Only History      │  writer_m10f) └──────────────────────────────┘
     │  - Triggers & RBAC Views    │                              ▲
     └─────────────────────────────┘                              │ (Firebase Session Auth)
                                                   ┌──────────────┴──────────────┐
                                                   │  Admin Editorial Console    │
                                                   │  - Researcher / Reviewer    │
                                                   │  - Publisher / Super Admin  │
                                                   └─────────────────────────────┘
```

---

## 2. Core Subsystems

1. **Public Web Application:**
   - Framework: Next.js 15 App Router with Tailwind CSS.
   - Hosting: Firebase App Hosting (Google Cloud Run backend) on project `tinubu-achievement-stg`.
   - Data Access: Read-only access through 4 approved PostgreSQL views (`public_record_catalog`, `public_claim_evidence`, `public_financial_records`, `public_beneficiary_records`).
2. **Admin Control Plane API:**
   - Architecture: Dedicated Express/Node.js control plane hosted on Google Cloud Run (`tat-admin-api-staging`).
   - Authentication: Firebase Authentication session cookies with custom claims.
   - Database Connection: IAM DB authentication using service user `tat_admin_writer_m10f`.
3. **Database Layer:**
   - Database: Google Cloud SQL for PostgreSQL.
   - Schema Authority: Sole canonical physical schema in [`database/schema.sql`](file:///C:/Users/DELL/Documents/111%20ANTI%20&%20CODEX/TINUBU%20ACHIEVEMENTS%20TRACKER-GOVERNANCE/database/schema.sql).
   - History Model: Append-only event and version tables (`corrections`, `record_versions`, `review_decisions`) protected by `tat_block_history_mutation()`.

---

## 3. Editorial Lifecycle Governance (Gates 0–5)

```
  [Gate 0: Ingestion]  ---> Researcher creates draft record (status: draft).
          │
  [Gate 1: Validation] ---> Automated schema and contract verification.
          │
  [Gate 2: Evidence]   ---> Primary evidence citation and linkage verification.
          │
  [Gate 3: Readiness]  ---> Automated data readiness check; escalation to editorial lead.
          │
  [Gate 4: Approval]   ---> Human Editorial Review (Reviewer or Super Admin).
          │
  [Gate 5: Release]    ---> Publication Stewardship (Publisher or Super Admin).
          │
          ▼
   [LIVE PUBLISHED]    ---> Direct edits locked. Revisions require audited corrections.
```

---

## 4. History & Versioning Architecture

- **Capability:** `REVISION + EVENT HISTORY` with `PARTIAL` relational reconstruction.
- **Snapshot Storage:** `record_versions.snapshot_json` captures complete core record attributes, evidence claims, financials, beneficiaries, and timeline events at publication time.
- **Correction Lifecycle:** Proposed $\rightarrow$ Under Review $\rightarrow$ Approved $\rightarrow$ Published (or Returned / Rejected).
