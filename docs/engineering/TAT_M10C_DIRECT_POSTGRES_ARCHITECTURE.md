# TAT M10C — Direct PostgreSQL Architecture

**Mission:** M10C

**Environment:** `tinubu-achievement-stg` only

**Decision:** accepted for staging; App Hosting deployment remains operator-gated

## Decision

The canonical application path is:

```text
Next.js server runtime
  -> typed public repository
  -> bounded node-postgres pool
  -> Cloud SQL Node.js Connector
  -> automatic IAM database authentication
  -> tat-db-staging / tat_staging / PostgreSQL 17
```

`database/schema.sql` remains the only schema authority. No ORM, ORM migration, password connection string, generated DDL authority, or browser database client was introduced. Firebase SQL Connect artifacts remain preserved, but full CRUD is blocked because the M10B compatibility diff is destructive. SQL Connect is an optional future read-only experiment only if it can produce a zero-destructive diff.

## Runtime modules

| Concern | Implementation |
|---|---|
| Configuration | `src/server/db/config.ts` |
| Connector and pool | `src/server/db/pool.ts` |
| Parameterized public queries | `src/server/repositories/public-data.repository.ts` |
| Exact mapping to Frontend V2 | `src/server/repositories/public-data.mapper.ts` |
| Five-minute public cache | `src/server/data/public-snapshot.ts` |
| Existing adapter hydration | `src/app/layout.tsx`, `src/app/providers.tsx`, `src/adapters/dataAdapter.ts` |
| Local authenticated proof harness | `scripts/mission-10c/firebase-iam-pg.mjs` |

Every production database import is below `src/server/` or a server route. The connector module imports Node/PostgreSQL-only packages and is reached only from server components and route handlers. The browser receives a serializable public snapshot, never a socket, IAM token, database user, connection name, or query facility.

## Connector and IAM authentication

The implementation uses `@google-cloud/cloud-sql-connector` `1.11.3`, `pg` `8.23.0`, `Connector.getOptions`, `AuthTypes.IAM`, and the public-IP connector path. The public IP does not imply an authorized network: the connector establishes the authenticated TLS channel while the instance retains zero authorized networks.

The PostgreSQL username for a service account omits `.gserviceaccount.com`, as required by Cloud SQL PostgreSQL IAM authentication. Application Default Credentials supply runtime identity. No password is accepted by the configuration schema.

Required server-only variables:

| Variable | Staging value/purpose |
|---|---|
| `TAT_DATA_SOURCE` | `cloud-sql`; `synthetic` is the explicit local fallback mode |
| `INSTANCE_CONNECTION_NAME` | `tinubu-achievement-stg:us-central1:tat-db-staging` |
| `DB_NAME` | `tat_staging` |
| `IAM_DB_USER` | `firebase-app-hosting-compute@tinubu-achievement-stg.iam` |
| `ALLOWED_CLOUD_SQL_PROJECT` | hard runtime boundary: `tinubu-achievement-stg` |
| `DB_IP_TYPE` | `PUBLIC` |
| `DB_POOL_MAX` | `4` |
| timeout variables | 10s connect, 10s idle, 15s statement |

An invalid or mismatched cloud configuration fails closed. Cloud mode never silently substitutes synthetic data after a database failure.

## Pooling and lifecycle

The pool is lazy and process-global so Next.js hot reloads and repeated server renders do not create a pool per query. It has `min: 0`, `max: 4`, bounded connection/idle/statement timeouts, and `allowExitOnIdle`. `closeDatabaseConnection` drains the pool and closes the connector for controlled shutdown and tests. Unexpected idle errors are logged without configuration or credential values.

App Hosting is capped at four instances, so the configured upper application pool bound is 16 database connections. This deliberately stays small for the staging `db-f1-micro` instance. The public snapshot uses four parallel, fixed-count queries rather than record-by-record queries.

## Query and numeric rules

- All user inputs use PostgreSQL positional parameters.
- Pagination is range-validated before query execution.
- The public repository reads only the four canonical public views.
- PostgreSQL `numeric` (OID 1700) and `bigint` (OID 20) parsers return strings.
- `numeric(24,4)` financial values remain exact strings through repository, mapper, hydration, JSON, CSV, and UI formatting.
- Financial aggregation groups every compatibility dimension and never mixes financial types, currencies, period/cumulative bases, nominal/real bases, or periods.

## Conservative cache

Only the public snapshot is cached, with a 300-second revalidation bound. Internal tables and trusted-ingestion results are not cached through the public application. Detail metadata and the sitemap use the same public snapshot cache. Database health is force-dynamic and is never cached.

## Local authentication

The proof and ingestion tools use the operator's existing Firebase CLI login to construct the same Cloud SQL Connector IAM channel. They do not create an ADC file, database password, service-account key, token artifact, or authorized network. The staging writer and reader roles are activated with temporary `SET ROLE` proof membership, then that temporary membership is revoked.

## Current official documentation verified

- [Cloud SQL language connectors and Node.js](https://cloud.google.com/sql/docs/postgres/connect-connectors)
- [Cloud SQL IAM database authentication](https://cloud.google.com/sql/docs/postgres/iam-authentication)
- [Log in with IAM database authentication](https://cloud.google.com/sql/docs/postgres/iam-logins)
- [Connect Cloud Run to Cloud SQL](https://cloud.google.com/sql/docs/postgres/connect-run)
- [Cloud SQL connection management](https://cloud.google.com/sql/docs/postgres/manage-connections)
- [Firebase App Hosting architecture](https://firebase.google.com/docs/app-hosting/about-app-hosting)
- [Firebase App Hosting configuration and secrets](https://firebase.google.com/docs/app-hosting/configure)
- [Cloud SQL IAM roles and permissions](https://cloud.google.com/sql/docs/postgres/iam-roles)

## Production boundary

Production was not inspected, changed, provisioned, connected, or authorized. The staging allowlist prevents accidental use of a different project with the checked-in App Hosting configuration.
