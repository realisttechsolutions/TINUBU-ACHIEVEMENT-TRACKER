# Firebase SQL Connect Cloud Staging Certification Specification

## 1. Cloud Architecture & Service Specification

| Layer | Technology | Service Configuration | Environment |
| :--- | :--- | :--- | :--- |
| **Product Surface** | Firebase SQL Connect | `dataconnect/dataconnect.yaml` | Staging (`us-central1`) |
| **Relational Database** | Google Cloud SQL | PostgreSQL 17 (`db-custom-2-7680` or `db-f1-micro`) | Staging |
| **Local Test Engine** | ElectricSQL PGlite | PostgreSQL 17 in-process WebAssembly | Local / CI / Test Runner |
| **Public Connector** | Data Connect Public | Read-only GraphQL queries (`@auth(level: PUBLIC)`) | Public Facing |
| **Staff Connector** | Data Connect Staff | Privileged mutations & queries (`@auth(level: USER)`) | Administrative |

## 2. Certification status

**BLOCKED — do not deploy from a fresh SQL Connect-generated database.**

The 2026-08-15 reconciliation proved that the `tat-staging` service and Cloud SQL link do not exist and that fresh compiler DDL would replace 53 canonical `ON DELETE RESTRICT` actions with `CASCADE` or `SET NULL`. The staging database must first be created and loaded from the authoritative `database/schema.sql` under a separately authorized infrastructure mission. See `docs/engineering/TAT_M10A_SQL_CONNECT_SCHEMA_RECONCILIATION.md`.

## 3. Future deployment protocol after the blocker is closed

```bash
# 1. Login to Firebase CLI
firebase login

# 2. Select Staging Project
firebase use <staging-project-id>

# 3. Confirm that canonical DDL is already present and that the diff is safe
firebase dataconnect:sql:diff --service tat-staging --location us-central1 --project staging

# 4. Only after an empty/approved compatible diff, deploy without --force
firebase deploy --only dataconnect --project staging
```

Research ingestion remains a separate, explicitly approved operation and is not part of the schema deployment command sequence.
