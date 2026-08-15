# TAT Export Service Contract

Status: local contract and CSV/JSON proof of concept; no cloud export service exists.

## Principles

Exports are generated from public projections, never internal tables. The same publication, claim, relationship, source and geography predicates used by browser queries apply to downloads. Every artifact includes a deterministic order, generation time, contract/schema version, filter description and field dictionary when a server implementation is introduced.

## Operations

| Export | Filters | Rows / shape | Recommended formats |
|---|---|---|---|
| Full public dataset | none beyond public policy | Public record catalog plus stable relationship identifiers or documented companion files | CSV, JSON |
| Filtered dataset | all approved explorer filters | Same record projection restricted by filters | CSV, JSON |
| Sector dataset | canonical Level 2 sector; optional dates/status | Records plus sector/group codes | CSV, JSON |
| State dataset | public state geography code; optional filters | Records plus public coverage role | CSV, JSON |
| Timeline dataset | record/sector/geography/date/event type | Typed events with date precision and provisional state | CSV, JSON |
| Record report | record slug | Human-readable record, evidence and limitations | PDF, TXT, JSON |
| Evidence/source index | record/claim/source filters | Reviewed public claim-source edges and allowlisted source metadata | CSV, JSON |

## Request

An export request contains `kind`, `format`, normalized filters, sort, selected approved columns, locale/time zone for presentation only, and an optional client request ID. Browser callers cannot select internal columns. Limit is capped; large future exports become asynchronous jobs with expiry and authorization re-check at retrieval.

## Response

Synchronous local result: `{ contentType, fileName, rowCount, body }`. Future async result: `{ exportId, status, requestedAt, expiresAt, downloadUrl? }`. A manifest should include SHA-256, row count, filter digest, generated-at time, data freshness cutoff, schema version and column descriptions.

## Format rules

- UTF-8 CSV with a header, RFC-style double-quote escaping, CRLF row endings and ISO dates.
- JSON is an array or documented newline-delimited stream for large jobs; exact numeric values remain strings.
- TXT is a simple accessible record report, not a raw internal dump.
- PDF is a presentation artifact generated in a future trusted service or existing frontend report pipeline. It is not the canonical machine-readable dataset.
- Empty values are null in JSON and blank in CSV; zero is never converted to blank.

## Domain safety

Financial rows retain financial type, currency, aggregation basis, nominal/real basis and reporting period. No generic “money spent” column or cross-type grand total is permitted. Beneficiary rows retain type, stage, basis, cumulative flag, period and cohort semantics; applicant and recipient counts are never relabeled or blindly summed.

## Security and privacy

Excluded fields include internal notes, workflow/risk queues, reviewer/actor identities, restricted evidence, source-file storage URIs, ingestion reports and unpublished/withdrawn content. Spreadsheet-formula injection must be neutralized for user-entered cells before a production CSV response. Download URLs, if later used, must be short-lived and audited.

## E01 proof

`backend/local/export-service.mjs` executes `12-public-download.sql` and serializes the public projection to CSV or JSON. Tests prove two published/corrected synthetic rows export while the unpublished record and internal fields do not. PDF/TXT and cloud job orchestration remain explicitly deferred.
