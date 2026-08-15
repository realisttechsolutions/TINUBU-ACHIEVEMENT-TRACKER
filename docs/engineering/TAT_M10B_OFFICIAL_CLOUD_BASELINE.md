# TAT Mission 10B — Official Cloud Baseline

**Verification date:** 2026-08-15
**Target project:** `tinubu-achievement-stg` only
**Target region:** `us-central1`
**Target database:** Cloud SQL for PostgreSQL 17 / `tat-db-staging` / `tat_staging`

## Decision baseline

Mission 10B must use a brownfield SQL Connect activation. `database/schema.sql` remains the physical-schema authority. SQL Connect may receive read/write access through connectors, but it must not own or migrate the PostgreSQL schema.

`schemaValidation: "COMPATIBLE"` remains required. Official Firebase documentation defines compatible validation as requiring the database resources used by the application schema while leaving additional database elements in place. `STRICT` can remove database elements not represented by the application schema and is unsuitable for the canonical schema's checks, indexes, triggers, functions, and views.

## Verified August 2026 behavior

| Question | Verified result | Mission 10B decision |
|---|---|---|
| Existing Cloud SQL link requires Blaze | Yes. Official SQL Connect service/database guidance labels linking an existing instance as a Blaze-plan workflow. | Billing must be enabled before brownfield activation. |
| PostgreSQL 17 support | Yes. Cloud SQL supports PostgreSQL 17.10, with regular support through 2030-02-01. | Preserve `POSTGRES_17`. |
| `us-central1` support | Yes. It is a supported Cloud SQL region and the default region in current create-instance guidance. SQL Connect and Cloud SQL must be colocated. | Use `us-central1` for both. |
| PostgreSQL 17 with `db-f1-micro` | Yes, as Cloud SQL Enterprise shared-core. Official current examples include `POSTGRES_17`, `edition = "ENTERPRISE"`, and `tier = "db-f1-micro"`. Shared-core has no Cloud SQL SLA. | Explicitly choose Enterprise; do not accept the PostgreSQL 16+ Enterprise Plus default. |
| PostgreSQL 17 default edition | Enterprise Plus unless Enterprise is explicitly selected. | Creation must specify `--edition=ENTERPRISE` and verify the resulting tier. |
| Firebase SQL Connect free trial | Spark and Blaze trial instances are fixed to PostgreSQL 15.x, `db-f1-micro`, 10 GB, single-zone, with no automatic backups or storage auto-increase. | The trial violates the PostgreSQL 17 target and must not be used. |
| Existing-instance compatibility checks | Firebase checks settings including IAM database authentication and public IP compatibility. | Enable only the settings required by the supported brownfield flow; never authorize `0.0.0.0/0`. |
| Brownfield permissions workflow | Run `firebase dataconnect:sql:setup` and decline SQL Connect handling SQL migrations. The documented result is table read/write access without schema ownership. | Decline migration ownership. Stop if the CLI prompt differs materially. |
| Compatible validation | Additional database elements remain; required application resources must exist. | Apply canonical DDL first, then validate/diff. Do not run a migration that changes canonical objects. |
| SQL Connect operations | Blaze includes 250,000 operations/month; excess operations cost USD 0.90/million. | Expected staging operation cost is USD 0 at low volume. |
| SQL Connect egress | First 10 GiB/month is no-cost; additional egress follows Google Cloud Premium Tier internet transfer pricing. | Keep staging traffic low and monitor egress. |
| Cloud SQL public IPv4 | PostgreSQL instances receive a static public IPv4 when public IP is enabled. Official documentation describes a small IP charge when the instance is deactivated. | Treat public IP as a compatibility requirement only; use IAM/SSL/Auth Proxy and no broad authorized network. |
| Backup pricing | Standard backup storage is usage-based; current Iowa list rate is USD 0.000109589/GiB-hour. | Include actual used backup storage in recurring-cost monitoring. |

## Brownfield control sequence

1. Confirm Blaze billing on `tinubu-achievement-stg`.
2. Obtain explicit operator cost approval.
3. Create `tat-db-staging` as PostgreSQL 17, Enterprise, `db-f1-micro`, zonal, 10 GB SSD in `us-central1`.
4. Create `tat_staging` and apply `database/schema.sql` through a secure administrative connection.
5. Independently certify 100% physical parity.
6. Link the existing instance and run `dataconnect:sql:setup` while declining SQL Connect migrations.
7. Run validation/diff in `COMPATIBLE` mode and reject any canonical physical change.
8. Deploy only after a non-destructive compatibility result.

## Observed staging state

Read-only checks on 2026-08-15 returned:

- Firebase project: active (`tinubu-achievement-stg`)
- Billing enabled: **false**
- Billing account linked: **false**
- SQL Connect services: **0**
- Cloud SQL instances: **0**

No resource was created, linked, migrated, or deployed during this preflight.

## Official sources

- [Firebase SQL Connect CLI reference](https://firebase.google.com/docs/sql-connect/cli-reference)
- [Firebase SQL Connect configuration reference](https://firebase.google.com/docs/sql-connect/configuration-reference)
- [Manage SQL Connect schemas and connectors](https://firebase.google.com/docs/sql-connect/manage-schemas-and-connectors)
- [Manage SQL Connect services and databases](https://firebase.google.com/docs/sql-connect/manage-services-and-databases)
- [Firebase SQL Connect pricing](https://firebase.google.com/docs/sql-connect/pricing)
- [Cloud SQL PostgreSQL versions](https://cloud.google.com/sql/docs/postgres/db-versions)
- [Create Cloud SQL for PostgreSQL instances](https://cloud.google.com/sql/docs/postgres/create-instance)
- [Cloud SQL pricing](https://cloud.google.com/sql/pricing)
- [Cloud SQL IAM database authentication](https://cloud.google.com/sql/docs/postgres/iam-authentication)
- [Cloud SQL public IP configuration](https://cloud.google.com/sql/docs/postgres/configure-ip)
- [Cloud SQL connection options](https://cloud.google.com/sql/docs/postgres/connect-overview)
- [Cloud SQL backup options](https://cloud.google.com/sql/docs/postgres/backup-recovery/backup-options)
