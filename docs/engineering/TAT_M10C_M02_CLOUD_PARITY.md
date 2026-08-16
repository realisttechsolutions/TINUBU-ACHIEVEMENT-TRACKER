# TAT M10C — M02 Cloud Data Parity

**Certification date:** 2026-08-16

**Target:** `tinubu-achievement-stg:us-central1:tat-db-staging` / `tat_staging`

**Result:** PASS — transactional ingestion, idempotent replay, exact identity parity, and unchanged physical schema

## Pre-write gates

The frozen Mission 02 package was not researched or edited. Before cloud writes, the validator compiled all 19 schemas, validated all CSVs and configured foreign keys, ran the positive and 25 negative fixtures, verified the snapshot manifest and file checksums, and completed the ingestion dry run with:

- 0 validation errors;
- 0 orphan foreign keys;
- 0 unexpected duplicates;
- 0 dry-run warnings;
- `manifestVerified: true` and `dataValidated: true`.

The database began with schema only. The tracked idempotent `database/seeds/canonical-reference.sql` seed was applied to supply the importer-required system actors, 20 navigation sectors, and base geography identities. Its Rivers code was corrected from the inconsistent `NG-RV` to the repository-wide and M02 identity `NG-RI` for the same fixed UUID.

## Transaction and recovery evidence

The first write attempt stopped on the research-batch actor FK because the canonical reference seed had not yet been applied. The importer's transaction rolled back; there were no partial M02 rows. No database row was hand-patched.

The successful retry authenticated through the Cloud SQL Connector with IAM, activated `tat_ingestion_writer` using `SET ROLE`, wrote the package transactionally, and committed research batch `BATCH-2024-M02-001` (`80000000-0000-4000-8000-000000000002`). An immediate replay returned `idempotentSkip: true` with the same batch UUID and performed no duplicate writes.

## Exact counts

| Entity/relationship | Expected | Cloud SQL |
|---|---:|---:|
| Research batches | 1 | 1 |
| Records | 56 | 56 |
| Achievement profiles | 30 | 30 |
| Policy details | 10 | 10 |
| Project details | 8 | 8 |
| Programme details | 8 | 8 |
| Institutions | 73 | 73 |
| Geographic units | 18 | 18 |
| Sources | 35 | 35 |
| Evidence claims | 33 | 33 |
| Claim-source relationships | 36 | 36 |
| Financial records | 8 | 8 |
| Beneficiary records | 8 | 8 |
| Indicators | 3 | 3 |
| Indicator observations | 4 | 4 |
| Timeline events | 15 | 15 |
| Corrections | 2 | 2 |
| Review decisions | 30 | 30 |
| Record-sector relationships | 56 | 56 |
| Record-institution relationships | 94 | 94 |
| Record-geography relationships | 86 | 86 |
| Record relationships | 0 | 0 |

`record_relationships = 0` is an exact parity result: the approved M02 package contains no record-relationship fact file or identities. Nothing was inferred.

## Identity and relationship digests

The reconciler sorted canonical external identities or composite relationship keys and compared independent SHA-256 digests. All 21 expected/actual pairs matched, with no missing or unexpected identities.

| Set | Count | Matching SHA-256 |
|---|---:|---|
| records | 56 | `3a22d9fa2f4c33b1872da8a905a88a9d383f3abaf018df31d420a09de372267f` |
| achievements | 30 | `f161f7d130f708258017cec698798474c0502b0ed9cbdf28173d563f9c7c611d` |
| policies | 10 | `e7cb9edda9d9a29c42c8bee8bcf0ee63c1201b70d9863a3285233a424854368c` |
| projects | 8 | `f69efb09ad4a57936c4defe3e0299b7679af1b136aad9cb23cd3d31165881315c` |
| programmes | 8 | `583fa0a0efff5d49e97968187a1e5cd6f8fab2f278549d08bba75279facc3fd27` |
| institutions | 73 | `2541b0c737e4914f56d54f4cdda37f88786f9e9894285b6973aa23166e66ecb50` |
| geographic units | 18 | `1d33ccd6152f492c4b91c64d5d66d1ca72fc5204ae5f35a29e480fdaefba3183` |
| sources | 35 | `9b03e74e09d93ac65ca3269385dd65f09a1e462890716021e7c6ef32e873527a` |
| evidence claims | 33 | `ef38db5b9360c2ee556b168c7632275ed3cb8985bdd7bd45c31b6903edbb2d917` |
| claim-source relationships | 36 | `e2a7a58e52c2b4f24a56a575450ccf5d1d3750c4a3e035a2ad83e30f98bb24413` |
| financial records | 8 | `26e3318acdc668572143afe8c968c07d44c15569b6ba3ae04dca6240f62291276` |
| beneficiary records | 8 | `155e11a1634a1078a6c70297e043036d674d8713903f95cd243d14c35e9919ec6` |
| indicators | 3 | `14fd71f2da5dbd23167c8517350b0bc7b1e27ce2b416436b0a95c3a7d89925d46` |
| indicator observations | 4 | `8774bd7d76ef87ae3646ea3acac52ac8e639802166d202031cc6a3b7068866557` |
| timeline events | 15 | `ebc6a02811eb4f6fbdabbd3c908c5948c57c455ec62de2c694cd5385190010b8f` |
| corrections | 2 | `b6554c0d2f2da665affa9fd6cd116b00c2ea41d5231c3d95ec1a8f661188e114a` |
| review decisions | 30 | `d90ed263a4139f5a32ac2dd395bb26d488ed24e6e11d6c333b2873ce0ebb59e21` |
| record-sector relationships | 56 | `e07a4cf1ca14cca4dac83872bdca1c7e3706423feb90bb345dbff263f5bb31682` |
| record-institution relationships | 94 | `0dd769832584aa0589eb0fa901c00de6142334e7d03f7b908e15bb1a68552df0a` |
| record-geography relationships | 86 | `6c785d68977a9572bf91bebb7dd96d94a6e79a29208d736fe0793c11dc663ec87` |
| record relationships | 0 | `4f53cda18c2baa0c0354bb5f9a3ecbe5ed12ab4d8e11ba873c2f11161202b945` |

The 10 named showcase records were also found 10/10 with published status.

## Post-ingestion physical parity

The independent live catalog comparison remained at 27 tables, 372 columns, 27 primary keys, 65 foreign keys (53 RESTRICT and 12 CASCADE), 33 uniqueness rules, 128 checks, 91 indexes, 9 triggers, 8 functions, four views, and 149 PostgreSQL-only controls. Catalog differences: **0**. Ingestion did not change physical structure or ownership.
