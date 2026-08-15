# Codex Mission 01 Firebase Architecture Recommendation

**Audit date:** 2026-08-15

**Baseline:** `research/mission-01-foundation` at `348a5a7`

**Decision status:** Architecture recommendation only; no Firebase or Google Cloud resources were created.

## Decision

Use **Firebase SQL Connect backed by Cloud SQL for PostgreSQL as the single system of record for the MVP**, with Firebase Authentication, Firebase Hosting, optional Cloud Storage for Firebase, and trusted server-side ingestion through the SQL Connect Admin SDK.

Do not use Cloud Firestore as the primary research/evidence database and do not introduce a SQL Connect + Firestore hybrid for the MVP. The evidence graph, joins, controlled vocabularies, review history, financial and beneficiary distinctions, uniqueness rules, and reporting queries are relational. Duplicating part of that model into Firestore would add synchronization and authorization surfaces without a demonstrated requirement.

Cloud Functions for Firebase or Cloud Run should be introduced only for privileged workflows that cannot safely run in a browser, such as batch ingestion, signed restricted-file access, custom exports, scheduled freshness work, and administrative role changes. They are not required for ordinary public reads through generated SQL Connect SDK operations.

## Option assessment

| Option | Relational integrity | Client integration | Authorization | Operational load | MVP verdict |
|---|---|---|---|---|---|
| A. Firebase SQL Connect | Native PostgreSQL foreign keys, unique constraints, indexes, joins and transactions | Generated type-safe web/React SDKs | Operation-level `@auth`, filters, CEL, `@check`, `@redact`; Admin SDK for privileged work | Cloud SQL sizing, backups, region and cost must be managed | **RECOMMENDED** |
| B. Cloud Firestore | No native relational foreign keys; denormalization required | Excellent Firebase client support | Mature document rules, but rules are not filters | Serverless and simple initially; evidence joins and reconciliation become application work | **REJECT for system of record** |
| C. SQL Connect + Firestore | SQL remains authoritative but Firestore creates a second data model | Two SDKs and synchronization logic | Two independent authorization systems | Highest consistency and debugging burden | **REJECT for MVP** |
| D. Direct Cloud SQL + custom backend | Full PostgreSQL flexibility | Custom API/types required | Entire API and authorization layer must be built and operated | Highest engineering and security burden | **DEFER unless SQL Connect limitations are proven** |

SQL Connect supports the capabilities that are material here: PostgreSQL tables, references and generated foreign keys, composite primary keys for join tables, unique constraints, B-tree/GIN indexes, transactions, aggregations, server-side full-text search, multiple connectors, generated SDKs, and local emulation. Its main architectural constraint is that the client API is a declared GraphQL connector surface, not unrestricted SQL.

## Public navigation versus research taxonomy

Retain the five umbrella groups strictly as public navigation:

- Economy
- Security
- Infrastructure
- Social Services
- Governance

Use a more granular database taxonomy underneath them. Agriculture, Education, Healthcare, Power and Energy, Digital Economy, Housing, Environment and Climate, Youth/Employment/Skills, Foreign Affairs, and Culture/Creative Economy should be canonical research sectors, not merely free-text subsectors. Each canonical sector has a `public_group_id`; deeper subject categories are children in the same hierarchical `sectors` table.

This separation keeps the current five-item navigation simple while preventing misleading research classification. Examples include environment being forced into infrastructure, foreign affairs into governance, and digital economy into economy even when a record is principally telecommunications infrastructure or digital government.

Recommended hierarchy:

```text
public_group (5 rows)
  -> canonical_sector (approximately 15 rows)
       -> configurable_subsector (as needed)
```

The hierarchy should be represented by `sectors.parent_sector_id` and `taxonomy_level`, not separate hard-coded frontend unions for every level.

## Supabase concept migration

| Existing assumption | Firebase/Google target | Equivalence | Audit note |
|---|---|---|---|
| Supabase PostgreSQL | SQL Connect + Cloud SQL for PostgreSQL | Close | PostgreSQL remains, but schema lifecycle is expressed through SQL Connect GraphQL and managed schema tooling. |
| Supabase Auth | Firebase Authentication | Partial | Identity providers map well; user tables, token claims and administration differ. |
| Supabase Storage | Cloud Storage for Firebase | Partial | Both store objects, but Supabase Storage authorization is based on Postgres RLS while Firebase Storage uses Storage Rules/IAM and cannot directly query SQL Connect role tables. |
| Supabase RLS | SQL Connect connector authorization | **Not one-to-one** | Rewrite access rules per query/mutation using `@auth`, filters, CEL, `@check` and `@redact`; use `NO_ACCESS` operations through Admin SDK for privileged work. Do not copy RLS SQL. |
| Supabase generated database types | SQL Connect generated SDKs and operation result/input types | Partial | SQL Connect generates types from declared connector operations rather than exposing a universal table-shaped client. |
| Supabase Edge Functions | Cloud Functions for Firebase 2nd gen or Cloud Run | Partial | Runtime, deployment unit, region and networking differ; add only for concrete privileged workloads. |
| Supabase REST/PostgREST table API | Declared SQL Connect GraphQL operations | No direct equivalent | The Firebase client surface is allowlisted by connector definitions. This is beneficial for least privilege but requires query design. |
| Supabase Auth schema foreign keys | Firebase UID stored in application tables | No direct equivalent | Firebase Authentication user storage is external to Cloud SQL; `firebase_uid` is an application-level unique key, not a database FK to an Auth schema. |
| Supabase Storage object-table joins | `source_files` metadata plus Storage object path/generation | Partial | Database metadata remains canonical; Storage Rules/IAM protect bytes. |
| Supabase migrations | SQL Connect schema/migration workflow | Partial | Review generated DDL; strict/compatible modes behave differently from ordinary SQL migration folders. |
| Supabase hosting assumption | Firebase Hosting | Close for the Vite SPA | Build `dist`, SPA rewrite, cache headers, preview channels and release rollback fit the app. |

The Supabase documents remain useful as conceptual inputs, but none is an implementation contract for Firebase.

## Environment model

Use two Firebase projects, plus local emulation:

| Environment | Firebase project | Database | Purpose |
|---|---|---|---|
| Local | None | SQL Connect emulator/PGlite snapshot | Schema, connector, authorization, importer and UI development. |
| Staging | Dedicated non-production project | Dedicated staging Cloud SQL database/instance | Integration testing, preview backend, controlled synthetic/pilot data. |
| Production | Dedicated production project | Dedicated production Cloud SQL database/instance | Approved published and internal research data. |

Do not share a Cloud SQL database between staging and production. Pull requests may use Firebase Hosting preview channels, but previews must be configured to use staging—not production—backend settings. The official Hosting GitHub integration warns that preview URLs otherwise interact with the real backend resources configured for that project.

Recommended branch flow: feature/audit branches -> pull request preview -> `main` to staging after review -> explicit tagged/manual production promotion. Database schema promotion must be a separate reviewed job from static Hosting deployment.

## Deployment shape

```text
React 18 + Vite SPA
        |
        +-- Firebase Hosting (static dist, CDN, preview channels)
        |
        +-- Firebase Authentication + App Check
        |
        +-- Generated SQL Connect web SDK
                    |
                    +-- public connector: published projections only
                    +-- editorial connector: authenticated, role-scoped operations
                    +-- admin connector: NO_ACCESS from clients
                                  |
                                  +-- trusted importer / admin tooling
                                  |
                                  +-- Cloud SQL for PostgreSQL

Cloud Storage for Firebase (only if source files or managed images are approved)
        +-- public-assets bucket
        +-- evidence-private bucket
```

## Billing and operating expectations

- SQL Connect has a service-operation component and a continuously provisioned Cloud SQL component. Current official pricing states Cloud SQL starts around USD 9.37/month, with configuration, region, storage, backups, replicas and egress affecting cost. Trial behavior is temporary and must not be treated as an operating budget.
- Hosting has no-cost quotas for storage and transfer; overages require Blaze. Configure cache headers and a budget alert.
- Standard Firebase Authentication methods have generous/no-cost allowances; Identity Platform, phone/SMS, SAML/OIDC and higher usage can incur charges.
- Cloud Storage for Firebase requires the Blaze plan as of 2026-02-03, even where no-cost Cloud Storage usage applies.
- Functions and Cloud Run are usage billed. Avoid always-on minimum instances for the MVP unless latency justifies them.
- Cloud SQL backups, point-in-time recovery, high availability, replicas and exports add storage/compute/egress considerations. Budgets alert; they do not cap spend.

Before any provisioned implementation, assign an owner for budgets, backup restore tests, point-in-time recovery, region selection, incident response, access review and data export.

## Implementation gates

Firebase implementation is not approved directly from the Mission 01 contract. The following must happen first:

1. Consolidate the canonical vocabularies and resolve snake_case/kebab-case/display-label drift.
2. Approve the 27-table MVP logical design and the `records` + subtype-extension model.
3. Repair the JSON schemas/templates for claim-source many-to-many links, date precision, financial classes, beneficiary stages and lookup imports.
4. Prototype the schema, connector operations and authorization entirely in the local emulator.
5. Test public-field projections and least-privilege editorial mutations.
6. Approve costs, projects/regions, backups and deployment ownership before provisioning.

## Official references checked

- [Firebase SQL Connect overview](https://firebase.google.com/docs/sql-connect)
- [SQL Connect schema design](https://firebase.google.com/docs/sql-connect/schemas-guide)
- [SQL Connect queries and aggregation](https://firebase.google.com/docs/sql-connect/queries-guide)
- [SQL Connect authorization and security](https://firebase.google.com/docs/sql-connect/authorization-and-security)
- [SQL Connect Admin SDK](https://firebase.google.com/docs/sql-connect/admin-sdk)
- [SQL Connect bulk data operations](https://firebase.google.com/docs/sql-connect/data-seeding-bulk-operations)
- [SQL Connect CLI and emulator](https://firebase.google.com/docs/sql-connect/cli-reference)
- [SQL Connect pricing](https://firebase.google.com/docs/sql-connect/pricing)
- [Cloud Firestore data model](https://firebase.google.com/docs/firestore/data-model)
- [Supabase RLS](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [Supabase generated types](https://supabase.com/docs/guides/api/rest/generating-types)
