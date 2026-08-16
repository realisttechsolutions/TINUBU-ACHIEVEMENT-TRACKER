# TAT Mission 10B — Billing and Cost Controls

**Date:** 2026-08-15
**Billing scope:** `tinubu-achievement-stg` only
**Billable resource:** `tat-db-staging`

## Actual provisioned configuration

| Component | Actual value |
|---|---|
| Billing/Blaze | Enabled and linked before creation |
| PostgreSQL | 17.10 |
| Region | `us-central1` |
| Edition/tier | Enterprise / `db-f1-micro` |
| Availability | Zonal |
| Storage | 10 GB SSD, auto-resize disabled |
| Backups | Standard automated backup, seven retained |
| PITR | Disabled |
| HA/read replicas | None |
| Public IPv4 | Enabled; zero authorized networks |
| SQL Connect service | Empty parent exists; no deployed schema/connectors and no operations traffic |

## Recurring estimate

The approved preflight remains the applicable baseline:

- estimated hourly baseline: **$0.01515753**;
- 30-day baseline: **$10.91**;
- best case: approximately **$10.91/month** before variable backup/egress usage;
- expected planning value: approximately **$11/month**;
- bounded planning upper estimate: approximately **$13.60/month** under modest staging backup/egress use.

The estimate combines the documented `db-f1-micro` compute rate and 10 GB SSD rate. Backup storage is billed on bytes actually used, so the empty database begins near the baseline. SQL Connect currently has no connector traffic; its operations charges therefore have not begun.

Official pricing references:

- [Cloud SQL pricing](https://cloud.google.com/sql/pricing)
- [Firebase SQL Connect pricing](https://firebase.google.com/docs/sql-connect/pricing)

## Estimated cost versus accrued cost

| Category | Status |
|---|---|
| Estimated recurring cost | Approximately $11/month expected |
| Actual accrued cost | Not asserted; same-day Cloud Billing data can lag and no billing export/invoice was supplied |
| Trial credit | None assumed or used |
| SQL Connect free operations allowance | Available under current pricing, but no deployed connectors are generating traffic |
| Future recurring cost | Cloud SQL compute/storage continues while the instance is running, even though SQL Connect deployment is blocked |

The Firebase SQL Connect Cloud SQL trial is not applicable because it is limited to PostgreSQL 15.x and would violate the required PostgreSQL 17 target.

## Cost safeguards implemented

- single approved staging instance only;
- smallest supported shared-core tier;
- Enterprise rather than Enterprise Plus;
- zonal rather than HA;
- no replicas;
- fixed 10 GB SSD with auto-resize disabled;
- standard seven-backup retention;
- PITR disabled;
- no private-network/VPC infrastructure;
- no App Hosting deployment;
- no production resources;
- deletion protection enabled against accidental instance removal;
- final/retained backups after deletion disabled to avoid unexpected residual storage charges.

## Price-change triggers

The recurring amount will rise if any of these change:

- machine tier, edition, or uptime;
- HA or replicas;
- disk size or storage auto-resize;
- backup bytes/retention or PITR logs;
- network egress;
- SQL Connect operation volume after connectors deploy;
- additional staging services or App Hosting in a later mission.

## Recommended budget alert

Create a **$20 monthly budget** scoped only to `tinubu-achievement-stg`, with notifications at 50%, 80%, and 100%. This is a recommendation, not a spending cap: Google Cloud budgets alert but do not automatically stop services.

No budget or arbitrary spending limit was created in Mission 10B because the operator approved the disclosed instance estimate, not a separate billing-policy mutation. The operator should explicitly authorize that IAM/Billing action in a later step if desired.

## Operational note after controlled stop

Cloud SQL is healthy and billable even though SQL Connect application deployment is blocked. If development pauses for an extended period, the operator should make an explicit retain/stop/delete decision; Mission 10B does not infer permission to remove the approved instance. Deletion protection prevents an accidental delete.

## Restart recovery verification — 2026-08-16

A read-only Cloud Billing project lookup confirmed that `tinubu-achievement-stg` remains billing-enabled and linked. The billing account identifier was deliberately not copied into repository documentation. The instance configuration that drives the approved estimate remains unchanged.

## Verdict

**BILLING PREFLIGHT AND CONFIGURATION CONTROL: PASS**
**REAL-TIME ACCRUED-COST CERTIFICATION: NOT AVAILABLE**
