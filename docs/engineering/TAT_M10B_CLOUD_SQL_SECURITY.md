# TAT Mission 10B — Cloud SQL Security

**Certification date:** 2026-08-15  
**Environment:** staging only  
**Google Cloud/Firebase project:** `tinubu-achievement-stg`  
**Instance:** `tat-db-staging`  
**Database:** `tat_staging`

## Security result

The approved staging Cloud SQL instance was created without a stored credential, service-account key, public wildcard, or production-project mutation. Administrative access for initial DDL was restricted to the operator endpoint as a temporary single-address `/32`, protected by an independently generated in-memory password and TLS, and given a server-side 90-minute expiration. After the canonical DDL and catalog audit completed, the password was rotated to a new unknown value and discarded, and the authorized network was removed.

Final direct-network state: **zero authorized networks**.

## Final instance controls

| Control | Certified value |
|---|---|
| Project boundary | `tinubu-achievement-stg` only |
| Region | `us-central1` |
| PostgreSQL | `POSTGRES_17`; installed runtime `POSTGRES_17_10` |
| Edition/tier | Enterprise / `db-f1-micro` |
| Availability | Zonal; no HA and no replicas |
| Public IPv4 | Enabled for the Firebase SQL Connect existing-database workflow |
| Authorized networks | `0` after DDL/parity cleanup |
| TLS policy | `ENCRYPTED_ONLY` |
| IAM database authentication | `cloudsql.iam_authentication=on` |
| Built-in administrator password | Generated only in process memory, then rotated and discarded |
| Database credentials in repository | None |
| Service-account private keys in repository | None |
| Deletion protection | Enabled |
| Automated backup | Enabled, standard tier, 02:00 UTC, seven retained backups |
| Point-in-time recovery | Disabled for the approved low-cost staging baseline |
| Storage auto-resize | Disabled to keep the 10 GB cost boundary explicit |
| Retain/final backup on deletion | Disabled; prevents unplanned post-deletion storage charges |

## Controlled administrative DDL session

The repository tool `scripts/mission-10b/provision-cloud-sql-staging.mjs` enforces the following sequence:

1. refuse execution unless the explicit `--approved-cost` gate is present;
2. authenticate only to the fixed `tinubu-achievement-stg` project and re-check enabled billing;
3. reject an ambiguous replay if `tat-db-staging` already exists;
4. generate a high-entropy administrator password in memory;
5. authorize only the current external IPv4 address as `/32`, with a 90-minute server-side expiration;
6. require TLS and validate the server certificate against the CA returned by the authenticated Cloud SQL Admin API;
7. verify the exact approved instance configuration and PostgreSQL 17 runtime before DDL;
8. require an empty `tat_staging` public schema before applying `database/schema.sql`;
9. apply the full canonical DDL transaction and require 100% live catalog parity;
10. close the SQL connection, rotate the built-in password, remove the authorized network, and re-read the instance to prove cleanup.

No `0.0.0.0/0` rule existed at any point. No password, token, IP address, or private key is printed by the tool or written to disk.

## SQL Connect least-privilege boundary

The physical schema remains owned by the project’s canonical DDL workflow. PostgreSQL 17 represents the `public` schema owner as its built-in `pg_database_owner` role; Cloud SQL’s actual `tat_staging` database owner is `cloudsqlsuperuser`, and all 27 canonical tables are directly owned by `postgres`. During Firebase brownfield setup, SQL migration handling was explicitly declined. Firebase SQL Connect received the database privileges required to execute connector operations, but it did not receive schema-migration ownership.

The Google-managed SQL Connect service identity was not materialized automatically after the API was enabled. The official Service Usage `generateServiceIdentity` operation created the exact staging service agent, and only its documented `roles/firebasedataconnect.serviceAgent` project role was added. The brownfield setup then created:

- IAM database identities for the authenticated administrator and SQL Connect service agent;
- `firebasewriter_tat_staging_public` and `firebasereader_tat_staging_public`;
- table/function/schema privileges and default privileges for those execution roles.

It did **not** create `firebaseowner_tat_staging_public`. A post-setup IAM catalog audit proved that the SQL Connect service agent is a member of the writer role while all 27 tables remain owned by `postgres`.

The instance retains a public IPv4 address because Firebase’s documented existing-Cloud-SQL workflow checks connectivity and IAM database authentication. Direct internet connections are still denied by the empty authorized-network list. IAM database authentication is enabled so Google-managed services can use scoped identity rather than a committed static password.

Relevant official guidance:

- [Connect to Cloud SQL for PostgreSQL](https://cloud.google.com/sql/docs/postgres/connect-overview)
- [Configure public IP](https://cloud.google.com/sql/docs/postgres/configure-ip)
- [IAM database authentication](https://cloud.google.com/sql/docs/postgres/iam-authentication)
- [Firebase SQL Connect CLI reference](https://firebase.google.com/docs/sql-connect/cli-reference)
- [Google Cloud service agents](https://cloud.google.com/iam/docs/service-agents)
- [Generate a service identity](https://cloud.google.com/service-usage/docs/reference/rest/v1beta1/services/generateServiceIdentity)

## Residual staging trade-offs

- `db-f1-micro` is a shared-core staging tier and has no production SLA.
- Zonal availability and disabled PITR are deliberate cost decisions; they are not a production durability posture.
- Private IP was not added because it would require VPC/private-services infrastructure beyond this mission and is not necessary for the approved Firebase brownfield topology.
- A later production mission must perform a separate threat model, HA/backup/PITR decision, private-connectivity evaluation, IAM review, and cost approval. Mission 10B does not authorize production.

## Restart recovery verification — 2026-08-16

Read-only Cloud SQL Admin, Cloud Billing, Resource Manager, Firebase CLI, and IAM-database checks confirmed the security baseline remains unchanged:

- project `tinubu-achievement-stg` is active and billing-linked;
- instance `tat-db-staging` is `RUNNABLE` in `us-central1-c`;
- PostgreSQL runtime remains `POSTGRES_17_10` on Enterprise `db-f1-micro`;
- 10 GB SSD, zonal availability, no replicas, and storage auto-resize disabled;
- public IPv4 is present with zero authorized networks;
- `ENCRYPTED_ONLY`, IAM database authentication, deletion protection, standard backups, seven retained backups, and PITR disabled;
- the only relevant project-level binding found is the expected SQL Connect service agent on `roles/firebasedataconnect.serviceAgent`;
- IAM database connectivity succeeds without a repository credential;
- Firebase owner role remains absent and all 27 canonical tables remain owned by `postgres`.

No instance setting, network, IAM binding, role, user, password, or database object was changed during recovery.

## Verdict

**CLOUD SQL STAGING SECURITY BASELINE: PASS**
