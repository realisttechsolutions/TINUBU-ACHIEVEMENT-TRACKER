# TAT Mission 10F — Administrative Data Management & Editorial CRUD Architecture

## 1. Executive Summary
Mission 10F establishes the authenticated administrative write and editorial management subsystem of the Tinubu Achievement Tracker (TAT) V2 platform. It enables authorized editorial operators (Super Admin and Researchers) to create, edit, and maintain canonical records across all four model classes (Achievement, Policy, Project, Programme), attach factual evidence claims, link source citations, track financial allocations, record beneficiary numbers, and maintain milestone timelines—all while preserving strict database least-privilege boundaries and complete publication isolation.

---

## 2. Security Invariants & Privilege Separation

### 2.1 Public Reader Boundary (Preserved)
- The public web tier connects using the `tat_public_reader` role.
- Permissions: `SELECT` ONLY on four approved views:
  - `public_record_catalog`
  - `public_claim_evidence`
  - `public_financial_records`
  - `public_beneficiary_records`
- Direct `SELECT` on canonical base tables is **DENIED**.
- All mutation operations (`INSERT`, `UPDATE`, `DELETE`, `TRUNCATE`, `ALTER`) are **DENIED**.

### 2.2 Admin Writer Boundary (Least Privilege)
- Administrative mutations execute through `src/server/db/admin-pool.ts`.
- Database role: `tat_admin_writer` / `tat_ingestion_writer`.
- Permissions: `SELECT, INSERT, UPDATE` on mutable tables:
  `institutions`, `geographic_units`, `research_batches`, `records`, `achievement_profiles`, `policy_details`, `project_details`, `programme_details`, `record_institutions`, `record_sectors`, `record_geographies`, `sources`, `evidence_claims`, `claim_source_relationships`, `financial_records`, `beneficiary_records`, `indicators`, `indicator_observations`, `timeline_events`, `corrections`, `review_decisions`.
- `tat_admin_writer` has **ZERO DDL, ZERO TRUNCATE, ZERO SUPERUSER, ZERO DATABASE OWNERSHIP** privileges.

---

## 3. Publication Isolation Guarantee

In `database/schema.sql`:
```sql
CREATE VIEW public_record_catalog AS
SELECT ...
FROM records r
...
WHERE r.is_public = true
  AND r.publication_status IN ('published', 'corrected');
```

All other public views (`public_claim_evidence`, `public_financial_records`, `public_beneficiary_records`) execute an `INNER JOIN` on `public_record_catalog`.

Because newly created administrative draft records have:
- `records.is_public = false`
- `records.publication_status = 'draft'`

They and all their associated child entities are **100% mathematically excluded** from public database queries.

---

## 4. Role Authorization Matrix

| Staff Role | Browse Records (`/admin/records`) | Create Drafts (`/admin/records/new`) | Edit Records (`/admin/records/[id]`) | Manage Claims / Sources / Financials | Final Publication Authority (M10G) |
|---|---|---|---|---|---|
| **`super_admin`** | ALLOWED | ALLOWED | ALLOWED | ALLOWED | Planned for M10G |
| **`researcher`** | ALLOWED | ALLOWED | ALLOWED | ALLOWED | DENIED |
| **`reviewer`** | ALLOWED (Read-Only) | DENIED (403) | DENIED (403) | DENIED (403) | DENIED |
| **`publisher`** | ALLOWED (Read-Only) | DENIED (403) | DENIED (403) | DENIED (403) | Planned for M10G |
| **Anonymous / Public** | DENIED (401) | DENIED (401) | DENIED (401) | DENIED (401) | DENIED |

---

## 5. Concurrency Control & Audit Integrity
1. **Optimistic Locking:** Record overview updates require `expected_updated_at`. Stale writes are rejected with HTTP 409 Conflict.
2. **Explicit PostgreSQL Transactions:** Multi-table creation (`records` + profile + sectors + institutions + geographies) runs in atomic `withTransaction()`. Partial failures trigger automatic rollback.
3. **Numeric Precision Preservation:** Monetary figures and large beneficiary counts are handled as exact strings at the application boundary to avoid floating-point loss.
