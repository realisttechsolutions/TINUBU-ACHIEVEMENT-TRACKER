# TAT M10C — Firebase App Hosting Staging Readiness

**Readiness:** YES — ready for a separate deployment authorization

**Deployment performed:** NO

**Production authorized:** NO

## Runtime design

Firebase documents `firebase-app-hosting-compute@PROJECT_ID.iam.gserviceaccount.com` as the default App Hosting build/runtime identity. The exact staging identity now exists and has:

- `roles/firebaseapphosting.computeRunner`;
- `roles/cloudsql.client`;
- `roles/cloudsql.instanceUser`;
- membership in PostgreSQL `tat_public_reader`;
- zero user-managed service-account keys.

The Node.js Connector obtains authenticated TLS sockets with Application Default Credentials and automatic IAM database authentication. The browser receives only the mapped public snapshot. No database password, URL, private key, or secret is required for this connection.

## `apphosting.yaml`

The checked-in staging configuration sets runtime-only cloud database variables, `minInstances: 0`, `maxInstances: 4`, concurrency 40, one CPU, and 1024 MiB memory. The pool is capped at four connections per process, so the configured worst-case application bound is 16 connections. This is deliberately conservative for `db-f1-micro`.

`ALLOWED_CLOUD_SQL_PROJECT=tinubu-achievement-stg` makes a production-project connection fail configuration validation. `TAT_DATA_SOURCE=cloud-sql` is runtime-only, while the root server layout is force-dynamic and hydrates the Frontend V2 adapter from the bounded five-minute public snapshot cache.

## Build and compatibility proof

The Next.js 15.5.21 optimized production build completed successfully with type validation and route generation. Server database packages remain outside the browser graph. The live connector/repository/mapper/adapter test passed against PostgreSQL 17 staging and returned the full M02 public dataset.

Two pre-existing hook cleanup warnings and the repository's existing ESLint-plugin advisory remain non-blocking; scoped M10C lint produced zero findings.

## Region and network

The authorized App Hosting backend should be created in `us-central1`, matching Cloud SQL, to avoid cross-region latency and egress. The Connector uses the instance's public-IP endpoint through its authenticated encrypted tunnel; Cloud SQL retains zero authorized networks.

## Secret Manager

No Secret Manager value is needed for passwordless IAM database access. If later application features require actual secrets, they must use App Hosting Secret Manager references rather than literal `apphosting.yaml` values. Non-secret database coordinates and pool bounds are safe environment configuration.

## Authorization-time checklist

1. Obtain explicit App Hosting staging deployment authorization.
2. Create/select the backend in `tinubu-achievement-stg`, region `us-central1`, using the verified default compute identity.
3. Confirm the backend resource uses `firebase-app-hosting-compute@tinubu-achievement-stg.iam.gserviceaccount.com`.
4. Deploy the already-tested configuration without adding passwords or keys.
5. Verify `/api/health`, homepage, detail, filters, downloads, connector logs, pool pressure, and the public/base-table denial boundary.
6. Do not point the backend at or deploy into `tinubu-achievement-tracker` without a new explicit production authorization.

## Official references

- [Firebase App Hosting architecture and default runtime identity](https://firebase.google.com/docs/app-hosting/about-app-hosting)
- [Firebase App Hosting configuration and Secret Manager references](https://firebase.google.com/docs/app-hosting/configure)
- [Cloud SQL connections from Cloud Run](https://cloud.google.com/sql/docs/postgres/connect-run)
- [Cloud SQL IAM database logins](https://cloud.google.com/sql/docs/postgres/iam-logins)
- [Cloud SQL IAM roles](https://cloud.google.com/sql/docs/postgres/iam-roles)
