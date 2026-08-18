# TAT Security Invariants: Authentication, Authorization & Trust Boundaries

**Authority:** Command Centre & Security Architecture  
**Classification:** Canonical Security Specification  
**Scope:** Public Layer, Staff Layer, Admin Control Plane, PostgreSQL RBAC

---

## 1. Public Runtime Trust Boundary

1. **Unauthenticated Public Access:** Public citizens access the platform without authentication or sessions.
2. **Strict View Isolation:** The public runtime client (`tat_public_reader`) connects to PostgreSQL with access limited strictly to 4 audited views:
   - `public_record_catalog`
   - `public_claim_evidence`
   - `public_financial_records`
   - `public_beneficiary_records`
3. **Public Prohibitions:**
   - 0 SELECT permissions on underlying base tables (`records`, `evidence_claims`, `sources`, `financial_records`, `beneficiary_records`, `corrections`, `record_versions`, `review_decisions`).
   - 0 `INSERT`, `UPDATE`, `DELETE`, or `TRUNCATE` permissions across the database.
   - 0 permissions to execute `SET ROLE` or alter PostgreSQL configurations.
   - 0 access to draft, under-review, or rejected records.

---

## 2. Staff Authentication & RBAC Governance

1. **Authoritative Staff Roles:**
   - `super_admin`: Full administrative oversight, staff management, system governance, emergency overrides.
   - `researcher`: Evidence ingestion, draft record authoring, correction proposals, draft revisions.
   - `reviewer`: Editorial review, Gate 4 human approval / rejection / revision request, correction review.
   - `publisher`: Gate 5 publication stewardship, live release, corrected revision publishing, unpublishing.
   - **Strict Invariant:** There is **NO `viewer` staff role** in the administrative taxonomy.
2. **Separation of Editorial Duties (Gates 0–5):**
   - **Self-Approval Prohibited:** A `researcher` cannot approve their own draft or correction.
   - **Self-Publication Prohibited:** A `reviewer` cannot publish an approved record to the live public catalog.
   - **Human-in-the-Loop:** Automated checks (Gates 1–3) escalate to human review; no record reaches public status without explicit Gate 4 editorial approval and Gate 5 publication stewardship.

---

## 3. Database Privilege Boundaries (`tat_admin_writer_m10f`)

The administrative backend connection operates under least-privilege constraints:
- **Base Tables (`records`, `evidence_claims`, `sources`, etc.):** `SELECT`, `INSERT`, `UPDATE` (0 `DELETE`, 0 `TRUNCATE`).
- **History Tables (`corrections`, `record_versions`, `review_decisions`):** `SELECT`, `INSERT` (0 `UPDATE`, 0 `DELETE`, 0 `TRUNCATE`).
- **Administrative Profiles (`actor_profiles`):** `SELECT` only (0 `INSERT`, 0 `UPDATE`, 0 `DELETE`).
- **Trigger-Enforced Immutability:** Any attempt to perform `UPDATE` or `DELETE` on history tables triggers a hard exception raised by `tat_block_history_mutation()`.

---

## 4. Secret & Credential Management

1. **Zero Log Disclosure:** Database passwords, service account private keys, session signing secrets, and Firebase auth tokens must never be logged, printed to console, or committed to Git.
2. **Environment Variable Isolation:** Secrets are injected exclusively via Secret Manager / Cloud Run environment bindings at runtime.
