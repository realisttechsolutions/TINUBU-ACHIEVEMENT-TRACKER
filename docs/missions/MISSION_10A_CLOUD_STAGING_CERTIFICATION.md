# Mission 10A: Firebase SQL Connect Cloud Staging Activation & Local–Cloud Parity Report

## Executive Summary

- **Mission Phase**: `MISSION 10A — CLOUD STAGING VALIDATION`
- **Worktree**: `TINUBU ACHIEVEMENTS TRACKER-M10A`
- **Branch**: `data/mission-10a-cloud-staging-certification`
- **Baseline Framework**: Next.js `15.5.21` / React `18.3.1` (Frozen under ADR-003)
- **Local Test Engine**: `@electric-sql/pglite` (`0.3.16`)
- **Cloud Database Target**: Firebase SQL Connect / Google Cloud SQL for PostgreSQL 17
- **Verification Status**: Local baseline 100% verified (38/38 tests passing, 0 TypeScript errors, 82 SSG pages compiled, 0 lint errors, 27/27 canonical tables audited). Cloud authentication gate active pending operator login.

---

## Technical Audit & Validation Baseline

1. **Official Documentation Checked (August 15, 2026)**:
   - Firebase CLI SQL Connect commands: `firebase deploy --only dataconnect`
   - Cloud SQL Engine: PostgreSQL 17 supported on Firebase SQL Connect
   - Recommended Staging Region: `us-central1` (co-located with Firebase App Hosting and Vertex AI)
   - Product Terminology: Certified under official product name **Firebase SQL Connect** (API: `firebasedataconnect.googleapis.com`).

2. **27-Table Canonical Schema Inventory**:
   - Total base tables: **27**
   - Total public views: **4** (`public_record_catalog`, `public_claim_evidence`, `public_financial_records`, `public_beneficiary_records`)
   - Immutability enforcement: PostgreSQL triggers block mutations on `corrections` and `review_decisions`.

3. **M02 Research Dataset Baseline**:
   - Manifest Hash: `c08a62fae06885c30fb527c4fd975f3a9de832b3aa864c1849ce505c23d8f3f6`
   - 19 CSV files, 276 research rows, 24 foreign key relationship types verified with 0 errors.
