# M10D Firebase App Hosting Baseline

Verified against current official Firebase and Google Cloud documentation on 2026-08-16. This baseline applies only to Firebase project `tinubu-achievement-stg`; it grants no production authority.

## Deployment model

Firebase App Hosting is the supported full-stack Firebase hosting path for Next.js. A GitHub-connected backend builds a selected repository revision with Cloud Build, stores build artifacts in Artifact Registry, serves the application on Cloud Run behind Firebase's delivery layer, and retains rollout history. The M10D backend therefore uses the existing GitHub repository, the staging branch, and a manual rollout of an exact certified commit.

Automatic rollouts can be disabled in the backend deployment settings. A manual rollout can be created for a Git commit with `firebase apphosting:rollouts:create BACKEND_ID --git-commit SHA`; M10D must not use `--force`. A failed rollout is diagnosed through App Hosting and Cloud Build logs. A prior known commit can be manually rolled out again as the rollback mechanism.

## Backend and region

An App Hosting backend has an explicit primary region. `us-central1` is supported and is selected here because the approved Cloud SQL instance is already in `us-central1`. This avoids avoidable cross-region database traffic and latency. The database will not be moved.

The planned backend ID is `tat-staging`. Inventory before creation found no web apps and no App Hosting backends in the staging Firebase project, so this does not duplicate an existing backend.

## Runtime, configuration, and identity

`apphosting.yaml` is the source-controlled runtime configuration. Its `runConfig` bounds the backend at zero minimum and four maximum instances. `NEXT_PUBLIC_APP_ENV=staging` is available at build and runtime. Database settings are runtime-only, which prevents the Cloud Build phase from receiving or using Cloud SQL settings.

The backend runtime identity is explicitly set to:

`firebase-app-hosting-compute@tinubu-achievement-stg.iam.gserviceaccount.com`

The identity has only the prepared Google Cloud access needed for this design: App Hosting compute runner, Cloud SQL Client, and Cloud SQL Instance User. It has no user-managed key. PostgreSQL authenticates it as `firebase-app-hosting-compute@tinubu-achievement-stg.iam`, which is a member only of the restricted `tat_public_reader` database role. The application uses the Cloud SQL Node.js Connector with IAM authentication; no database password or service-account key is configured.

At the database boundary, the runtime has CONNECT and schema USAGE, SELECT on exactly four approved public views, no base-table SELECT, no writes, no schema/database CREATE, no relation ownership, no role administration, and no privileged predefined-role membership. `/api/health` rechecks this boundary from the deployed runtime and returns only a generic status.

## Build-time safety

The build command is only `next build`. It invokes no ingestion or database mutation script. `TAT_DATA_SOURCE` and all connection variables are marked `RUNTIME` only in `apphosting.yaml`. If the source is evaluated without `TAT_DATA_SOURCE`, the data adapter deliberately selects its synthetic build-safe mode and opens no database connection. Runtime pages remain dynamically rendered and obtain the public snapshot only after deployment.

## Logging and monitoring

App Hosting exposes rollout/build status and integrates application, Cloud Run, and build logs with Google Cloud Logging. M10D checks rollout health, live HTTP behavior, database connectivity, sanitized errors, and relevant build/runtime log entries. No exact cost claim will be made from short-lived metrics.

## Official sources

- [Firebase App Hosting overview](https://firebase.google.com/docs/app-hosting)
- [Configure App Hosting with apphosting.yaml](https://firebase.google.com/docs/app-hosting/configure)
- [Manage rollouts and manual rollouts](https://firebase.google.com/docs/app-hosting/rollouts)
- [Connect multiple environments](https://firebase.google.com/docs/app-hosting/multiple-environments)
- [Framework and build tooling](https://firebase.google.com/docs/app-hosting/frameworks-tooling)
- [App Hosting logging](https://firebase.google.com/docs/app-hosting/logging)
- [App Hosting troubleshooting](https://firebase.google.com/docs/app-hosting/troubleshooting)
- [Firebase CLI reference](https://firebase.google.com/docs/cli)
- [Firebase project locations](https://firebase.google.com/docs/projects/locations)
- [App Hosting REST API](https://firebase.google.com/docs/reference/apphosting/rest)

## Baseline verdict

The repository and prepared IAM/database architecture conform to the supported App Hosting model. Backend creation is safe only after the complete local predeployment suite passes and the certified commit is pushed.
