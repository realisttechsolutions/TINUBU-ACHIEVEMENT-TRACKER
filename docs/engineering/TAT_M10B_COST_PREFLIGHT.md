# TAT Mission 10B — Cloud SQL Cost Preflight

**Estimate date:** 2026-08-15
**Currency:** USD list price before tax and currency conversion
**Billing month:** 30 days / 720 running hours
**Status:** HARD GATE — billing is not enabled and no instance may be created without operator approval

## Proposed staging configuration

| Setting | Proposed value |
|---|---|
| Project | `tinubu-achievement-stg` |
| Instance | `tat-db-staging` |
| Database | `tat_staging` |
| Region | `us-central1` |
| Version | PostgreSQL 17 |
| Edition | Cloud SQL Enterprise |
| Tier | `db-f1-micro` shared-core, no SLA |
| Availability | Zonal / single-zone |
| Storage | 10 GiB SSD |
| HA / replicas | None |
| Networking | Public IPv4 only if required by SQL Connect brownfield compatibility; no `0.0.0.0/0` |
| Authentication | IAM database authentication plus encrypted connections |
| Backups | Standard automated backups, seven-day retention, charged on actual used GiB |
| Storage auto-increase | Disabled initially for cost control; reassess if capacity requires it |

PostgreSQL 17 and `db-f1-micro` are supported together on Enterprise edition. PostgreSQL 16 and later otherwise default to Enterprise Plus, so the edition must be explicit.

## List-rate calculation

Current official Iowa (`us-central1`) list rates used:

- `db-f1-micro`: USD 0.0105/hour
- SSD storage: USD 0.000465753/GiB-hour
- standard backup storage used: USD 0.000109589/GiB-hour
- SQL Connect: first 250,000 operations/month no-cost, then USD 0.90/million
- SQL Connect egress: first 10 GiB/month no-cost, then Premium Tier internet transfer pricing

| Component | Hourly calculation | 30-day estimate |
|---|---:|---:|
| Compute | `0.0105` | USD 7.56 |
| 10 GiB SSD | `10 × 0.000465753 = 0.00465753` | USD 3.35 |
| Baseline infrastructure | `0.01515753` | **USD 10.91** |
| 1 GiB used backup assumption | `0.000109589` | USD 0.08 |
| Expected low-volume total | `0.015267119` | **USD 10.99 (~11.00)** |

## Required cost-gate answers

**A. Hourly estimate:** USD 0.01516/hour before used-backup and variable service charges. With 1 GiB of used backup storage, approximately USD 0.01527/hour.

**B. 30-day monthly estimate:** USD 10.91 baseline; approximately USD 10.99 with 1 GiB of used backups.

**C. Best-case estimate:** USD 10.91/month after creation, assuming no chargeable backup usage, fewer than 250,000 SQL Connect operations, and no more than 10 GiB egress.

**D. Expected estimate:** Approximately USD 11.00/month for a continuously running, low-volume staging database with about 1 GiB of used backup data.

**E. Possible upper estimate:** Approximately USD 13.60/month under this bounded staging scenario: 10 GiB used backups (USD 0.79), 1,000,000 total SQL Connect operations (USD 0.675 above the free allowance), and 10 GiB of chargeable internet egress at an illustrative USD 0.12/GiB (USD 1.20). This is not a hard ceiling; traffic, destination-specific egress pricing, backup growth, storage growth, or a larger tier can increase it. A practical budget-alert planning value is USD 20/month.

**F. What changes the price:** Running hours, tier/edition, HA, replicas, provisioned storage, storage auto-growth, actual backup bytes and retention, public-IP state while deactivated, client operation count, internet egress volume/destination, currency conversion, and tax.

**G. Is `db-f1-micro` supported?** Yes. Current Cloud SQL documentation and examples support PostgreSQL 17 on Enterprise `db-f1-micro`. It is shared-core and has no Cloud SQL SLA.

**H. Alternative if unavailable:** Enterprise `db-g1-small` at USD 0.035/hour, producing approximately USD 28.55/month for compute plus 10 GiB SSD before backups and variable usage. A dedicated custom Enterprise configuration would cost more and is not recommended for this staging mission.

**I. Does a free trial apply?** The project is currently Spark/no billing. A Firebase SQL Connect trial may be available in principle, but its database constraints are incompatible with Mission 10B. Trial eligibility is also limited per project and billing account and has not been consumed or assumed here.

**J. Would the trial require PostgreSQL 15 and violate the target?** Yes. Official SQL Connect documentation says Spark and Blaze free trials do not support PostgreSQL versions other than 15.x. Mission 10B requires PostgreSQL 17, so the trial must not be used.

**K. Recommended staging configuration:** PostgreSQL 17, Enterprise edition, `db-f1-micro`, zonal, 10 GiB SSD, no HA, no replicas, same-region `us-central1`, IAM database authentication, encrypted connections, narrowly controlled public-IP compatibility, seven-day standard backups, and a USD 20/month billing budget alert after operator authorization.

## Billing gate result

The Cloud Billing API returned:

- billing enabled: **false**
- billing account linked: **false**

The operator must upgrade only `tinubu-achievement-stg` to Blaze and attach the intended billing account. Do not attach billing to `tinubu-achievement-tracker`.

No Cloud SQL instance, database, service, migration, or deployment has been created.

## Official pricing sources

- [Firebase SQL Connect pricing](https://firebase.google.com/docs/sql-connect/pricing)
- [Manage SQL Connect services and databases](https://firebase.google.com/docs/sql-connect/manage-services-and-databases)
- [Cloud SQL pricing](https://cloud.google.com/sql/pricing)
- [Create Cloud SQL for PostgreSQL instances](https://cloud.google.com/sql/docs/postgres/create-instance)
- [Cloud SQL backup options](https://cloud.google.com/sql/docs/postgres/backup-recovery/backup-options)
