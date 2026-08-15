# Firebase SQL Connect Cloud Staging Certification Specification

## 1. Cloud Architecture & Service Specification

| Layer | Technology | Service Configuration | Environment |
| :--- | :--- | :--- | :--- |
| **Product Surface** | Firebase SQL Connect | `dataconnect/dataconnect.yaml` | Staging (`us-central1`) |
| **Relational Database** | Google Cloud SQL | PostgreSQL 17 (`db-custom-2-7680` or `db-f1-micro`) | Staging |
| **Local Test Engine** | ElectricSQL PGlite | PostgreSQL 17 in-process WebAssembly | Local / CI / Test Runner |
| **Public Connector** | Data Connect Public | Read-only GraphQL queries (`@auth(level: PUBLIC)`) | Public Facing |
| **Staff Connector** | Data Connect Staff | Privileged mutations & queries (`@auth(level: USER)`) | Administrative |

## 2. Deployment Protocol

```bash
# 1. Login to Firebase CLI
firebase login

# 2. Select Staging Project
firebase use <staging-project-id>

# 3. Deploy SQL Connect Services & Schema
firebase deploy --only dataconnect

# 4. Execute M02 Research Import
node scripts/ingestion/import-m02.mjs
```
