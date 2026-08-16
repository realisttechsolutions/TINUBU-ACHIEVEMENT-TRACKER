# TAT Mission 10B — SQL Connect Brownfield Activation

**Date:** 2026-08-15
**Firebase project:** `tinubu-achievement-stg`
**Service:** `tat-staging` / `us-central1`
**Datasource target:** `tat-db-staging` / `tat_staging` / `public`
**Local validation mode:** `COMPATIBLE`

## Executive result

The Cloud SQL database was successfully prepared in Firebase’s supported **brownfield** permission mode. SQL migration handling was explicitly declined at the CLI ownership-transfer prompt, the canonical tables retained their existing owners, and the forbidden Firebase owner role was not created.

The subsequent official `COMPATIBLE` SQL diff was **unsafe**. It proposed dropping canonical constraints and indexes and rewriting every one of the 53 known `ON DELETE RESTRICT` relationships. Under Mission 10B’s hard stop, no SQL migration, application schema deployment, or connector deployment was accepted.

Brownfield database permission setup: **PASS**.
SQL Connect application activation/deployment: **FAIL — blocked by destructive compatibility diff**.

## Service identity recovery

The first `dataconnect:sql:setup` attempt stopped before permissions because the required Google-managed service agent did not yet exist:

```text
Invalid request: Provided CLOUD_IAM_SERVICE_ACCOUNT ... does not exist.
```

The current official Google Cloud guidance says service agents may be created after API activation/use, and provides `services.generateServiceIdentity` to materialize one explicitly. The operation was run only for:

```text
projects/248050067355/services/firebasedataconnect.googleapis.com
```

Because explicitly generated service agents do not receive their default role automatically, the exact documented service-agent principal received only:

```text
roles/firebasedataconnect.serviceAgent
```

The project was `tinubu-achievement-stg`; production was not queried or changed.

References:

- [Google Cloud service agents](https://cloud.google.com/iam/docs/service-agents)
- [Create and grant roles to service agents](https://cloud.google.com/iam/docs/create-service-agents)
- [Service Usage: generateServiceIdentity](https://cloud.google.com/service-usage/docs/reference/rest/v1beta1/services/generateServiceIdentity)

## Brownfield prompt and answer

Command:

```text
firebase dataconnect:sql:setup --service tat-staging --location us-central1 --project staging --interactive
```

Prompt:

```text
Would you like FDC to handle SQL migrations for you moving forward?
This means we will transfer schema and tables ownership to
firebaseowner_tat_staging_public
Note: your existing migration tools/roles may lose access. (y/N)
```

Answer: **No**.

The CLI confirmed:

```text
Setting up database in brownfield mode.
Note: SQL migrations can't be done through firebase dataconnect:sql:migrate in this mode.
Brownfield database setup complete.
```

## Certified permission result

| Check | Result |
|---|---|
| `firebasewriter_tat_staging_public` exists | PASS |
| `firebasereader_tat_staging_public` exists | PASS |
| `firebaseowner_tat_staging_public` exists | **NO — required result** |
| SQL Connect service agent is writer member | PASS |
| Service agent schema `USAGE` | PASS |
| Service agent SELECT/INSERT/UPDATE/DELETE on canonical tables | PASS |
| `tat_staging` database owner | `cloudsqlsuperuser` |
| `public` schema owner | `pg_database_owner` |
| Canonical table owners | 27/27 `postgres` |
| Physical parity after setup | 100%, 0 catalog differences |

## Control-plane state

The empty SQL Connect service parent `projects/tinubu-achievement-stg/locations/us-central1/services/tat-staging` exists. It has no deployed application schema and no connectors. The service-only parent was created through the same `firebase-tools` Data Connect client operation used by the normal deployment workflow; no schema or connector payload was released.

The installed CLI could not persist its empty link placeholder because the SQL Connect API rejects an empty source, so `services:list` correctly shows no datasource metadata and `getSchema` returns no deployed `main` schema. This does not affect the completed PostgreSQL brownfield roles, but it means full SQL Connect activation is incomplete.

## Official compatibility diff

Command:

```text
firebase dataconnect:sql:diff --service tat-staging --location us-central1 --project staging
```

The CLI logged `Generating SQL schema migrations to be compatible`, proving it read local `schemaValidation: "COMPATIBLE"`. Its process exit code was zero because the command successfully generated a plan; that is not a safety pass. The plan itself reported:

```text
PostgreSQL schema is incompatible with the SQL Connect Schema.
Those SQL statements will migrate it to be compatible:
```

Automated in-memory classification of the complete plan:

| Unsafe proposal | Count |
|---|---:|
| Destructive migration blocks | 129 |
| `DROP CONSTRAINT` clauses | 214 |
| `DROP INDEX` statements | 4 |
| Replacement FK `ADD CONSTRAINT` clauses | 53 |
| Proposed `ON DELETE CASCADE`/`SET NULL` rewrites | 53 |
| Extension installs (`uuid-ossp`) | 1 |

Examples included dropping explicit checks, replacing canonical UNIQUE constraints with SQL Connect-named unique indexes, dropping partial indexes such as `actor_roles_active_assignment_uidx` and `record_sectors_one_primary_uidx`, and replacing the 53 canonical `RESTRICT` relationships with `CASCADE` or `SET NULL`.

The restart recovery reproduced and exhaustively classified this plan in `TAT_M10B_SQL_CONNECT_DESTRUCTIVE_DIFF_ANALYSIS.md`. Exact recovered totals are 128 check drops, 33 unique-constraint replacements, 53 FK rewrites (30 `CASCADE`, 23 `SET NULL`), four predicate unique-index drops, 33 replacement unique indexes, 65 additive relation indexes, and one additive extension. No PK, column, trigger, function, or view changes were proposed.

## Viability after recovery analysis

The full 27-table SQL Connect model is not viable without weakening canonical PostgreSQL semantics. SQL Connect's documented `@ref` behavior derives `CASCADE` or `SET NULL` from field nullability and exposes no delete-action override; it also cannot represent the physical checks or predicate unique indexes.

A separately authorized read-only experiment remains technically possible by mapping only the four canonical public PostgreSQL views with `@view(name:)`. It would exclude base-table CRUD, staff operations, and ingestion and must pass a future zero-destructive `COMPATIBLE` diff before any deployment.

**SQL CONNECT VIABILITY: RESTRICTED.** Brownfield permission setup remains valid; the current application schema and connectors remain blocked.

## Stop decision

The result matches every prohibited unsafe condition in Mission 10B. Therefore:

- `dataconnect:sql:migrate` was not run;
- `firebase deploy --only dataconnect` was not run;
- `--force` was not used;
- no migration prompt was accepted;
- no application schema was deployed;
- no public or staff connector was deployed;
- no canonical check, key, FK action, index, trigger, function, or view changed;
- M02 cloud ingestion did not start.

`STRICT`, `NONE`, weakening the PostgreSQL DDL, and ownership transfer are not acceptable workarounds. Resolution requires a separately authorized application-schema/vendor-compatibility design that can express or tolerate the canonical FK actions and physical controls without destructive migration.

## Verdict

**FIREBASE SQL CONNECT BROWNFIELD ACTIVATION: FAIL (permission foundation PASS; safe application deployment blocked)**
