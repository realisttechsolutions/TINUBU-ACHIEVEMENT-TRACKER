# TAT Mission 10F-B: Security Test & Verification Report

## 1. Automated Test Execution

- **Vitest Suite:** 29 test files passed, 130 tests passed, 0 failures.
- **TypeScript Typecheck (`tsc --noEmit`):** 0 errors.
- **Next.js Production Build (`next build`):** 70 static & dynamic routes compiled with 0 errors.

---

## 2. Live Cloud Security & Negative Proofs

1. **Unauthenticated Invocation against Cloud Run:**
   - Request: `POST https://tat-admin-api-staging-jhekxvkq5q-uc.a.run.app/api/records`
   - Result: `HTTP 403 Forbidden` (Blocked at Google Cloud IAM perimeter).

2. **Public Database Identity Privilege Escalation:**
   - Identity: `firebase-app-hosting-compute@tinubu-achievement-stg.iam` / `tat_public_reader`
   - Action: `SET ROLE tat_admin_writer_m10f`
   - Result: `ERROR: 42501 permission denied to set role "tat_admin_writer_m10f"`.
   - Action: `SET ROLE tat_ingestion_writer`
   - Result: `ERROR: 42501 permission denied to set role "tat_ingestion_writer"`.

3. **Transaction Smoke Test with Rollback:**
   - Operations executed inside transaction:
     - `INSERT INTO records ... (draft)` -> Succeeded
     - `UPDATE records ...` -> Succeeded
     - `INSERT INTO evidence_claims ...` -> Succeeded
     - `ROLLBACK` -> Succeeded
   - Result: Baseline staging records count before = 56, after = 56. Exactly 0 persistent rows added.

4. **Public Reader Four-View Boundary:**
   - Base table direct `SELECT` on all 20 tested tables -> `false` (100% blocked).
   - Draft records (`is_public = false`, `publication_status = 'draft'`) -> 100% excluded from `public_record_catalog`, `public_claim_evidence`, `public_financial_records`, `public_beneficiary_records`.
