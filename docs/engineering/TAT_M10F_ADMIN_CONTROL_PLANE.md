# TAT Mission 10F-B: Dedicated Admin Control Plane Architecture

## 1. Overview & Core Security Guarantee

> [!IMPORTANT]
> **PUBLIC RUNTIME NEVER HAS DATABASE WRITE CREDENTIALS.**  
> The App Hosting compute environment runs strictly under `firebase-app-hosting-compute@tinubu-achievement-stg.iam` mapped to PostgreSQL role `tat_public_reader`. It has `SELECT` privileges ONLY on four public views and `ZERO` base-table access, `ZERO` DDL, and `ZERO` write permissions.

All administrative mutations are routed through an isolated, dedicated Cloud Run control plane service: `tat-admin-api-staging`.

```
[Browser Admin UI]
       │
       ▼ (HTTPS + Cookie: tat_admin_session + CSRF Header)
[Firebase App Hosting Gateway] (Read-Only Pool / Proxy Client)
       │
       ▼ (Google ID Token: Authorization: Bearer <ID_TOKEN> + Forwarded Session Cookie)
[Dedicated Cloud Run: tat-admin-api-staging]
  ├── Double Authorization Check (Google IAM Service-to-Service + Firebase Admin Session)
  ├── Independent Claims & Role Enforcement (super_admin / researcher ONLY)
  ├── Zod Payload Validation & Sanitization
  └── Dedicated Cloud SQL Writer Pool (tat-admin-api-staging@... -> tat_admin_writer_m10f)
       │
       ▼
[Cloud SQL PostgreSQL: tat-db-staging] (Mutable Tables: SELECT, INSERT, UPDATE ONLY)
```

---

## 2. Cloud Resources & Identities

| Resource | Value | Security Properties |
|---|---|---|
| **Service Name** | `tat-admin-api-staging` | Deployed in `us-central1` on `tinubu-achievement-stg`. |
| **Service URL** | `https://tat-admin-api-staging-jhekxvkq5q-uc.a.run.app` | HTTPS, strict IAM invocation policy. |
| **Invoker Policy** | `roles/run.invoker` | Granted ONLY to `firebase-app-hosting-compute@...` and operator. Anonymous access (`allUsers`) is **DENIED**. |
| **Service Identity** | `tat-admin-api-staging@tinubu-achievement-stg.iam.gserviceaccount.com` | Workload identity only; zero static keys/secrets. |
| **Cloud SQL IAM User** | `tat-admin-api-staging@tinubu-achievement-stg.iam` | Authenticates via Google IAM with Cloud SQL Connector. |
| **PostgreSQL Role** | `tat_admin_writer_m10f` | NOLOGIN, NOSUPERUSER, NOCREATEDB, NOCREATEROLE, NOREPLICATION, NOBYPASSRLS. Zero ownership. |

---

## 3. Double Authorization Protocol

1. **Layer 1: Network & Google Cloud IAM Identity**
   - Cloud Run verifies that incoming requests carry a valid Google ID token issued to `firebase-app-hosting-compute@tinubu-achievement-stg.iam.gserviceaccount.com` (or authorized operator).
   - Unauthenticated direct internet requests receive `HTTP 403 Forbidden` at the Cloud Run perimeter.

2. **Layer 2: Independent Firebase Session Verification**
   - The control plane extracts `tat_admin_session` and calls `admin.auth().verifySessionCookie(sessionCookie, true)`.
   - Claims enforced:
     - `email_verified === true`
     - `tat_staff === true`
     - `tat_role IN ('super_admin', 'researcher')` for mutations.
     - `reviewer` and `publisher` roles are rejected with `HTTP 403 Forbidden`.
