---
name: tat-security-audit
description: Security boundary, IAM, RBAC, authentication, and public/private trust boundary validation checklist for TAT.
---

# TAT Security Audit Skill

## Security Verification Checklist

### 1. Public Runtime Boundary
- [ ] Verify public database role (`tat_public_reader`) has access ONLY to the 4 approved public views (`public_record_catalog`, `public_claim_evidence`, `public_financial_records`, `public_beneficiary_records`).
- [ ] Confirm `tat_public_reader` has 0 access to base tables (`records`, `corrections`, `record_versions`, `review_decisions`, `evidence_claims`, etc.).
- [ ] Confirm public role cannot execute `INSERT`, `UPDATE`, `DELETE`, `TRUNCATE`, or `SET ROLE`.
- [ ] Confirm public catalog filters out draft, under-review, and rejected records.

### 2. Staff Authentication & RBAC Roles
- [ ] Verify staff session verification using Firebase Admin session cookies.
- [ ] Confirm staff role taxonomy: `super_admin`, `researcher`, `reviewer`, `publisher` (0 `viewer` staff role).
- [ ] Verify Gate 4 editorial approval is restricted to `reviewer` and `super_admin`.
- [ ] Verify Gate 5 live publication is restricted to `publisher` and `super_admin`.
- [ ] Confirm researchers cannot approve their own records or corrections.

### 3. Administrative Writer Least Privilege (`tat_admin_writer_m10f`)
- [ ] Confirm writer has `SELECT`, `INSERT`, `UPDATE` on base records (0 `DELETE`, 0 `TRUNCATE`).
- [ ] Confirm writer has `SELECT`, `INSERT` on history tables (`corrections`, `record_versions`, `review_decisions`).
- [ ] Confirm writer has 0 `UPDATE` and 0 `DELETE` on history tables.
- [ ] Confirm writer has `SELECT` only on `actor_profiles`.

### 4. Secret Isolation
- [ ] Audit logs and git diffs to ensure 0 credentials, private keys, or session secrets are exposed.
