# TAT Mission 10A — SQL Connect Schema Reconciliation

**Audit date:** 2026-08-15

**Canonical physical model:** `database/schema.sql`

**SQL Connect application model:** `dataconnect/schema/schema.gql`

**Staging target:** `tinubu-achievement-stg` / `tat-staging` / `us-central1` / `tat-db-staging` / `tat_staging`

## Executive result

The SQL Connect application schema now declares all 27 canonical tables, all 372 canonical columns, their PostgreSQL names, types, nullability, defaults, primary keys, 33 uniqueness rules, and 65 foreign-key relationships. The four relationships raised by the original Firebase join-table heuristic have been modeled without changing the canonical data architecture.

The application model is reconciled, but a clean-database deployment is **not safe**. The SQL Connect compiler emits noncanonical delete actions for 53 of the 65 foreign keys: required references become `ON DELETE CASCADE` and optional references become `ON DELETE SET NULL`, while the authoritative DDL requires `ON DELETE RESTRICT` for those 53 relationships. The current `@ref` directive has no delete-action argument. The remaining 12 foreign keys, including the intended owned-detail and record join relationships, compile with the canonical cascade action.

The correct topology is therefore:

1. create the staging Cloud SQL database through an explicitly authorized infrastructure mission;
2. apply `database/schema.sql` as the authoritative DDL;
3. verify all canonical PostgreSQL-only objects;
4. run `dataconnect:sql:diff` again in `COMPATIBLE` mode;
5. deploy SQL Connect only if the diff is empty or strictly compatible.

No migration, provisioning, or deployment was executed in Mission 10A.

## 27-table reconciliation matrix

`FK action gaps` counts relations whose table/columns/reference/nullability are correct but whose delete action would differ if SQL Connect created a fresh database. All declared column semantics and uniqueness rules passed automated catalog comparison. SQL Connect materializes `@unique` rules as unique indexes in the emulator; they enforce the same column sets as the canonical unique constraints.

| Table | Columns | Canonical and GraphQL primary key | Unique rules | FKs | FK action gaps | Reconciliation |
|---|---:|---|---:|---:|---:|---|
| `achievement_profiles` | 7 | `record_id` | 0 | 1 | 0 | PASS |
| `actor_profiles` | 9 | `id` | 2 | 0 | 0 | PASS |
| `actor_roles` | 11 | `id` | 0 | 2 | 2 | Application model PASS; fresh-DDL blocker |
| `beneficiary_records` | 21 | `id` | 2 | 4 | 3 | Application model PASS; fresh-DDL blocker |
| `claim_source_relationships` | 16 | `id` | 2 | 5 | 4 | Edge identity and five-part unique preserved; fresh-DDL blocker |
| `corrections` | 17 | `id` | 1 | 6 | 6 | Application model PASS; fresh-DDL blocker |
| `evidence_claims` | 29 | `id` | 1 | 3 | 2 | Application model PASS; fresh-DDL blocker |
| `financial_records` | 19 | `id` | 2 | 4 | 3 | `numeric(24,4)` and `char(3)` preserved; fresh-DDL blocker |
| `geographic_units` | 13 | `id` | 2 | 1 | 1 | Application model PASS; fresh-DDL blocker |
| `indicator_observations` | 17 | `id` | 2 | 4 | 4 | `numeric(30,8)` preserved; fresh-DDL blocker |
| `indicators` | 15 | `id` | 2 | 3 | 3 | Application model PASS; fresh-DDL blocker |
| `institutions` | 12 | `id` | 2 | 1 | 1 | JSONB aliases preserved; fresh-DDL blocker |
| `policy_details` | 7 | `record_id` | 0 | 1 | 0 | PASS |
| `programme_details` | 7 | `record_id` | 0 | 1 | 0 | PASS |
| `project_details` | 8 | `record_id` | 0 | 1 | 0 | `numeric(5,2)` preserved; PASS |
| `record_geographies` | 7 | `record_id, geographic_unit_id, coverage_role` | 0 | 2 | 1 | Composite identity preserved; fresh-DDL blocker |
| `record_institutions` | 6 | `record_id, institution_id, role_code` | 0 | 2 | 1 | No synthetic `id`; fresh-DDL blocker |
| `record_relationships` | 9 | `id` | 2 | 3 | 3 | Edge identity and three-part unique preserved; fresh-DDL blocker |
| `record_sectors` | 4 | `record_id, sector_id, role_code` | 0 | 2 | 1 | No synthetic `id`; fresh-DDL blocker |
| `record_versions` | 9 | `id` | 1 | 3 | 3 | JSONB audit state preserved; fresh-DDL blocker |
| `records` | 23 | `id` | 2 | 1 | 1 | Public/private and audit fields preserved; fresh-DDL blocker |
| `research_batches` | 20 | `id` | 3 | 2 | 2 | JSONB reports and idempotency preserved; fresh-DDL blocker |
| `review_decisions` | 14 | `id` | 2 | 4 | 4 | Review subject relationships preserved; fresh-DDL blocker |
| `sectors` | 11 | `id` | 1 | 1 | 1 | Hierarchy mapping preserved; fresh-DDL blocker |
| `source_files` | 20 | `id` | 2 | 3 | 3 | Storage identity and supersession preserved; fresh-DDL blocker |
| `sources` | 24 | `id` | 1 | 2 | 2 | Source provenance fields preserved; fresh-DDL blocker |
| `timeline_events` | 17 | `id` | 1 | 3 | 2 | Record ownership cascade matches; other relations block fresh DDL |

## Corrections made

### Primary keys

- `record_institutions` now uses `@table(key: ["record", "institution", "roleCode"])`, physically `(record_id, institution_id, role_code)`, with no synthetic `id`.
- `record_sectors` now uses `@table(key: ["record", "sector", "roleCode"])`, physically `(record_id, sector_id, role_code)`, with no synthetic `id`.
- `record_geographies` now uses its canonical three-column key.
- `policy_details`, `project_details`, `programme_details`, and `achievement_profiles` use `record_id` as their primary key.
- `claim_source_relationships` and `record_relationships` retain UUID `id` primary keys. They are edge entities, not two-FK join tables.

### Foreign keys and relationship semantics

- Every canonical FK scalar is declared explicitly with its exact `@col(name: ...)`, then bound to its relation with `@ref(fields: [...])`.
- Audit relationships such as `created_by`, `reviewed_by`, `approved_by`, `submitted_by`, `changed_by`, and `captured_by` no longer depend on inferred alternative names.
- `claim_source_relationships.supersedes_relationship_id` maps exactly through `supersedesRelationshipId` and `supersedesRelationship`.
- All 65 FK column/reference pairs match. Twelve generated delete actions match the canonical cascades; 53 canonical `RESTRICT` actions are not expressible in the current application-schema directive surface.

### Uniqueness

- All 33 canonical uniqueness rules are declared, including the five-part claim/source edge, the three-part record edge, structured financial/beneficiary/indicator identities, record versions, review gates, source objects, slugs, external IDs, and batch idempotency fields.
- The partial one-primary-sector rule remains only in canonical PostgreSQL as `record_sectors_one_primary_uidx`.

### Nullability, columns, types, and defaults

- All 372 canonical columns have matching GraphQL nullability and requiredness.
- `evidence_location` and `evidence_summary` are non-null as required.
- GraphQL-only synthetic IDs and obsolete fields were removed; canonical source-file, research-batch, review, correction, audit, structured-record, public/private, and evidence fields were added.
- `Any @col(dataType: "jsonb")`, `Int64`/`bigint`, exact `numeric(p,s)`, `char(3)`, `date`, and `timestamptz` mappings now match the DDL.
- Caller-supplied canonical UUIDs no longer receive SQL Connect `uuidV4()` defaults.
- Canonical constants and `CURRENT_TIMESTAMP` defaults are declared explicitly.
- The compiler reorders 303 non-key columns. Column order has no row-integrity semantics and was excluded from the parity verdict; names and all column properties match.

## PostgreSQL-only controls and validation mode

The canonical DDL contains 149 catalog objects outside the reconciled table/key/ref surface:

- 128 explicit `CHECK` constraints, including controlled vocabulary, date, amount, status, and semantic rules;
- 8 partial, expression, or GIN/full-text indexes;
- 9 application triggers, including append-only and structured-claim guards;
- 4 public projection views.

`schemaValidation: "COMPATIBLE"` is the final staging mode. Firebase defines compatible validation as requiring the SQL resources used by the application schema while allowing additional database elements to remain. This is necessary to retain the checks, partial indexes, triggers, and views above. It is not a substitute for applying the canonical DDL first, and it does not make a compiler-created fresh database equivalent.

References:

- [Firebase: deploy and manage SQL Connect schemas](https://firebase.google.com/docs/sql-connect/manage-schemas-and-connectors)
- [Firebase SQL Connect directive reference](https://firebase.google.com/docs/reference/sql-connect/gql/directive)
- [Firebase SQL Connect CLI reference](https://firebase.google.com/docs/sql-connect/cli-reference)

## Verification record

| Gate | Command | Result |
|---|---|---|
| Emulator/schema compilation | `firebase emulators:exec --only dataconnect --project staging ...` | PASS: 27 tables compiled; no missing/extra columns, keys, unique rules, or relations. Certification audit correctly exits nonzero for 53 delete-action differences. |
| SDK generation | `npm run sqlconnect:sdk:generate` | PASS: public and staff JavaScript SDKs regenerated. |
| Database tests | `npm run db:test` | PASS: 27-table integrity, query, export, boundary, and ingestion suite. |
| Query proofs | `npm run db:proofs` | PASS: 13/13 query proofs returned expected rows. |
| Ingestion proof | `npm run db:ingestion:proof` | PASS: M02 dry-run; manifest and data valid; 286 entities classified; no writes. |
| Typecheck | `npm run typecheck` | PASS. |
| Unit/integration tests | `npm run test:run` | PASS: 11 files, 38 tests. |
| Research validator | `npm run validate:research` | PASS: 0 errors; frozen research files unchanged. |
| Production build | `npm run build` | PASS: 82 static pages; two pre-existing hook warnings outside Mission 10A. |

## Cloud diff and stop decision

Command used (the supported Firebase CLI 15.27.0 syntax):

```text
firebase dataconnect:sql:diff --service tat-staging --location us-central1 --project staging --debug
```

The CLI authenticated to `tinubu-achievement-stg`, found no deployed `tat-staging` schema, reported that it was not linked to Cloud SQL, and sent a schema request with `allowMissing=true&validateOnly=true`. The API returned `404 NOT_FOUND` because the parent `tat-staging` service does not exist. A separate read-only `dataconnect:services:list --project staging --json` returned an empty service list.

Consequences:

- no Cloud SQL migration plan could be produced;
- no service, instance, database, schema, connector, or table was created;
- retrying `firebase deploy --only dataconnect --project staging` would be first-time provisioning, not a verified compatible attachment;
- first-time generated DDL is not physically equivalent because of the 53 delete-action differences and the absent 149 canonical PostgreSQL-only controls;
- `dataconnect:sql:migrate`, `firebase deploy`, and `--force` were not run.

## Original warning classification

| Warning | Classification | Resolution |
|---|---|---|
| `RecordInstitution` | A — genuine omission in the prior application schema | Correct canonical composite key is now explicit; no synthetic UUID. |
| `RecordSector` | A — genuine omission in the prior application schema | Correct canonical composite key is now explicit; one-primary-sector remains a partial PostgreSQL index. |
| `ClaimSourceRelationship` | B/C — intentional edge entity and join-table heuristic false positive | UUID identity plus five-part uniqueness and all evidence semantics are explicit. |
| `RecordRelationship` | B/C — intentional edge entity and join-table heuristic false positive | UUID identity plus three-part edge uniqueness and audit/validity fields are explicit. |

The local compiler no longer emits these warnings. The remaining deployment blocker is physical FK delete behavior plus the absent canonical Cloud SQL foundation, not join-table identity.

## Certification verdict

1. SQL CONNECT SCHEMA RECONCILIATION: PASS
2. CANONICAL POSTGRESQL PARITY: FAIL
3. SAFE TO RETRY STAGING DEPLOYMENT: NO
