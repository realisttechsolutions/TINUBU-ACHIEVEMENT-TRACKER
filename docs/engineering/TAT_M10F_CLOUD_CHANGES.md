# TAT Mission 10F-B: Cloud Infrastructure Changes

## 1. Cloud Run
- **Service Name:** `tat-admin-api-staging`
- **Region:** `us-central1`
- **Project:** `tinubu-achievement-stg` (Project Number: `248050067355`)
- **Service URL:** `https://tat-admin-api-staging-jhekxvkq5q-uc.a.run.app`
- **Container Image:** `gcr.io/tinubu-achievement-stg/tat-admin-api-staging:...`
- **Invocation Policy:** Granted `roles/run.invoker` to `firebase-app-hosting-compute@tinubu-achievement-stg.iam.gserviceaccount.com` and operator. Anonymous access (`allUsers`) is **DENIED**.

## 2. Google Cloud IAM
- **Created Service Account:** `tat-admin-api-staging@tinubu-achievement-stg.iam.gserviceaccount.com`
  - Display Name: `TAT Admin API Staging Service Account`
  - Keys: **NONE** (Workload Identity only).
- **Granted Project Roles:**
  - `roles/cloudsql.client`
  - `roles/cloudsql.instanceUser`

## 3. Cloud SQL
- **Instance:** `tat-db-staging`
- **Database:** `tat_staging`
- **Created IAM Database User:** `tat-admin-api-staging@tinubu-achievement-stg.iam` (Type: `CLOUD_IAM_SERVICE_ACCOUNT`)
- **Created PostgreSQL Role:** `tat_admin_writer_m10f` (Granted membership to `tat-admin-api-staging@tinubu-achievement-stg.iam`).
