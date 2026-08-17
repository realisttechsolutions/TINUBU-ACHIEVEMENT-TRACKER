# TAT Engineering Handoff Document

## Mission 10F-B Certified Baseline

- **Branch:** `antigravity/mission-10f-admin-crud`
- **Control Plane Service:** `tat-admin-api-staging` (`https://tat-admin-api-staging-jhekxvkq5q-uc.a.run.app`)
- **Control Plane Service Account:** `tat-admin-api-staging@tinubu-achievement-stg.iam.gserviceaccount.com`
- **Cloud SQL IAM User:** `tat-admin-api-staging@tinubu-achievement-stg.iam`
- **PostgreSQL Admin Role:** `tat_admin_writer_m10f`
- **App Hosting Public Role:** `tat_public_reader` (SELECT ONLY on 4 views: `public_record_catalog`, `public_claim_evidence`, `public_financial_records`, `public_beneficiary_records`)

> [!IMPORTANT]
> **CRITICAL INVARIANT:**
> App Hosting runtime contains ZERO database writer credentials and ZERO direct writer pools. All editorial mutations pass through the dedicated admin control plane with double authorization.
