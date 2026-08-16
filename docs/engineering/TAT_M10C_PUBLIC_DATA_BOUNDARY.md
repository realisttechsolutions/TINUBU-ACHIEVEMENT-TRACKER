# TAT M10C — Public Data Boundary

**Boundary result:** implemented; live certification is recorded separately

**Browser database access:** prohibited

**Public database role:** `tat_public_reader`

## Allowed database surface

The public runtime receives `USAGE` on schema `public`, `CONNECT` on `tat_staging`, and `SELECT` on exactly these views:

| View | Public content |
|---|---|
| `public_record_catalog` | published/corrected public records plus public-safe sector, institution, geography, type-detail, timeline, and indicator projections |
| `public_claim_evidence` | publication-ready, non-withdrawn claims joined only to public sources and reviewed relationships |
| `public_financial_records` | financial rows belonging to the public catalog; amount exposed as exact text |
| `public_beneficiary_records` | beneficiary rows belonging to the public catalog |

The existing catalog view was extended because the old version forced sector, geography, timeline, indicator, and type-detail queries to access base tables. That was a genuine public-boundary defect. The change adds safe projections to the existing view, preserves the required four-view topology, and does not add tables, migrations, constraints, indexes, triggers, or functions.

## Explicitly denied surface

The public runtime has no base-table privilege. In particular it cannot select or mutate:

- `records.internal_notes`, record workflow queues, or unpublished records;
- internal/restricted sources or source files;
- unapproved, unverified, or withdrawn claims;
- private actor/staff profiles and roles;
- review decisions, corrections control data, or record versions;
- research batches, manifests, validation reports, duplicate reports, or import summaries;
- internal/restricted geography relationships;
- any table through `INSERT`, `UPDATE`, `DELETE`, `TRUNCATE`, DDL, ownership, or role administration.

The public role audit asserts view reads are true while direct reads of `records`, `sources`, and `research_batches` are false. Repository source tests additionally reject direct `FROM`/`JOIN` references to sensitive base tables.

## Query audit

| Feature | Boundary-safe source |
|---|---|
| Homepage summary | aggregate of `public_record_catalog` |
| Explorer and filters | `public_record_catalog`; JSON public projections for sector/geography |
| Global search | public title/summary plus projected public institution/sector labels |
| Record detail | all four public views, parameterized by slug |
| Claim/evidence | `public_claim_evidence` |
| Timeline | projected `timeline` array containing only `is_public = true` rows |
| Indicators | projected active observations whose claims pass public workflow/verification gates |
| Financial values | `public_financial_records.amount_exact` string |
| Beneficiaries | `public_beneficiary_records` |
| Sector/geography summaries | public catalog projections |
| Downloads | public catalog only |

## Trusted ingestion writer

`tat_ingestion_writer` is a separate `NOLOGIN`, non-administrative role. It has the `SELECT`/`INSERT`/`UPDATE` set required by the existing idempotent importer on its explicit target tables, plus read-only actor, sector, and record-relationship references required by FK resolution and parity checks. It has no `DELETE`, `TRUNCATE`, DDL, role-management, ownership, source-file, actor-role, or record-version privilege.

The IAM service identity `tat-ingestion-writer@tinubu-achievement-stg.iam.gserviceaccount.com` is a role member and has only Cloud SQL Client and Cloud SQL Instance User at project level. No key exists.

## Internal/admin access

No new application admin surface was created. The authenticated staging operator remains an out-of-band Cloud SQL administrator for controlled infrastructure work. That identity is not exposed to the Next.js application or browser.

## Public serialization

The server maps only approved fields into Frontend V2 view models. The serialized snapshot contains public records, public evidence, safe exact financial strings, beneficiary values, public timeline/indicator projections, summaries, and public download rows. It contains no database configuration or identity material.
