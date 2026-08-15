# TAT Firebase Cloud Readiness Plan

Cloud provisioning status: **NOT AUTHORIZED IN E01**.

This is a future review plan, not an instruction to create resources.

## Environment strategy

| Environment | Firebase/GCP ownership | Data | Purpose |
|---|---|---|---|
| LOCAL | Reserved `demo-tat-e01` project ID; emulators/PGlite only | Obvious synthetic non-production data | Development, schema, SDK and ingestion proofs |
| STAGING | Future isolated Firebase/GCP project and isolated Cloud SQL | Approved synthetic or sanitized test data | Integration, migration, Auth and release validation |
| PRODUCTION | Future separate Firebase/GCP project and Cloud SQL | Approved published/research data under governance | Public service and controlled operations |

Never share databases, service accounts, buckets, secrets or Auth user pools between staging and production. Use explicit aliases and protected CI environments; production promotion consumes reviewed immutable artifacts.

## Readiness sequence

1. Governance approves cloud work, data classification, owners and budget.
2. Select Firebase/GCP projects and organization/folder policy; link billing only after approval.
3. Decide region using user latency, Cloud SQL/SQL Connect compatibility, residency, backup and disaster-recovery requirements. The local `us-central1` value is a required emulator/config placeholder, not a decision.
4. Create a staging SQL Connect service and Cloud SQL PostgreSQL instance through reviewed IaC/console procedure.
5. Reconcile `database/schema.sql` and `dataconnect/schema/schema.gql` against a disposable staging database under strict schema validation. Resolve exact numeric, JSON, checks, views, indexes and triggers explicitly.
6. Apply least-privilege database/service identities and secret management; prohibit public database exposure.
7. Configure Firebase Authentication and the actor/role mapping, then test the authorization matrix and separation of duties.
8. Add App Check, abuse controls, audit-log retention and alerting where applicable.
9. Decide Hosting configuration, security headers, preview channels and rollback. Do not deploy until frontend/release review.
10. Decide Storage buckets only for approved source/export artifacts; configure object lifecycle, malware/content handling, signed access and visibility separation.
11. Configure automated backups, tested restore, point-in-time recovery, retention, encryption expectations and documented RPO/RTO.
12. Configure budgets, billing alerts, Cloud SQL sizing/connection monitoring, query latency/error dashboards and cost ownership.
13. Build CI/CD gates: research validator, typecheck, unit/integration/database tests, SDK diff, migration plan, security scan, staging smoke test, approval and production promotion.
14. Load only governance-approved data through the trusted, auditable ingestion path.

## Required reviews

- Architecture: schema parity, migration rollback, connection limits and pooling.
- Research governance: Contract mapping, publication/correction lifecycle and source handling.
- Security/privacy: threat model, IAM, Auth claims, role scopes, secret/bucket policy and dependency posture.
- Operations: ownership, on-call, backup/restore drill, monitoring, incident response and cost limits.
- Product/frontend: adapter contract, withdrawn-content cache behavior, download rules and accessibility.

## Staging gates

Staging must prove generated SDK installation, public negative-access tests, staff role/scope tests, high-risk approval rules, ingestion compensation, migration/rollback, backup restore, load/connection behavior and audit completeness. Only an explicit post-E01 authorization may create staging.

## Production gates

Production requires all staging evidence, named approvers, change window, tested rollback, capacity/cost limit, data import sign-off and a go-live checklist. Firebase Hosting, SQL Connect, Cloud SQL, Auth, Storage, Functions/Run and DNS remain unprovisioned by E01.
