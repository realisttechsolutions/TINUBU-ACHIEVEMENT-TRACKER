# TAT Frontend/Backend Integration Contract

Version: E01 local foundation

Consumer: Frontend V2 through an adapter layer
Rule: React components never import raw generated database models.

## Boundary

The stable frontend port is defined in `backend/contracts/public-api.ts`. Generated SQL Connect operation results are translated by adapter functions such as `adaptPublishedRecord`. Generated SDK packages can change independently so long as the adapter preserves this contract.

Every public list uses `{ limit, offset }` for E01. Default limit is 25, maximum public/export values are service-controlled, and every order has a stable `id` or `slug` tiebreaker. A future cursor can be added behind the adapter without changing view models.

## Shared public result shapes

`PublicRecordListItem` contains only: `id`, `slug`, `recordType`, `title`, `shortTitle`, `summary`, `implementationStatus`, `verificationStatus`, `evidenceProfile`, `qualification`, and `publishedAt`.

`PublicRecordDetail` adds public `body`, sectors, institutions and non-sensitive geographies. Evidence rows add claim content, structured value, period/origin/verification/limitations and allowlisted source metadata. Money is transported as an exact decimal string, never an IEEE-754 total.

Excluded everywhere: workflow status, internal/risk notes, actor/role records, reviewer identity, restricted source/file metadata, unresolved contradictions/issues, unpublished claims, manifests, validation reports and batch control data.

## Operations

| Operation | Purpose | Filters / sort / pagination | Public result | Adapter mapping |
|---|---|---|---|---|
| `homepageSummary` | Headline counts and latest publication time. | No filters; singleton. | Published record count, delivered/operational count, independently corroborated count, latest timestamp. | snake_case aggregate aliases to `HomepageSummary`. |
| `searchRecords` | Site search across title, summary, institution, sector and later source metadata. | `term` plus standard filters; relevance/latest/title; page. | `PublicRecordListItem[]`. | Generated row to list item; adapter validates enums/dates. |
| `achievementExplorer` | Main filterable public catalog. | group, sector, subsector, record type, implementation, verification, profile, institution, geography/state, year/range; latest/oldest/title; page. | Items plus total/facet metadata when implemented. | Normalizes filter DTO and maps rows. |
| `recordDetail` | One public record and its relationships. | `slug`; no pagination for root; child collections have bounded limits. | `PublicRecordDetail`; typed detail appropriate to record type. | Combines root, sectors, institutions and public geographies. |
| `sectorDetail` | Sector landing page and catalog slice. | canonical sector; latest/title; page. | sector label/group, counts and items. | Keeps Level 1 navigation group distinct from Level 2 research sector. |
| `geographyDetail` | State/geography landing page. | geography code/type; standard catalog filters; latest/title; page. | public geography metadata, safe counts and items. | Never forwards restricted coordinates or boundaries. |
| `recordTimeline` | Ordered, semantically typed milestones. | record slug; event type/date range; chronological; page if large. | event ID/type/title/description/date precision/range/label/provisional. | Produces a display date model without inventing a day. |
| `mapAggregates` | Public record counts for visible areas. | geography type and catalog filters; count-desc/name; bounded. | geography code/name/type and distinct record count. | Converts only safe geographic identifiers; no sensitive points. |
| `claimEvidence` | Evidence/source panel. | record slug, claim type, verification; claim/source order; bounded. | Public claims and reviewed public source relationships. | Groups edge rows by claim; does not infer source role from source. |
| `dataExplorer` | Structured public table experience. | domain, canonical filters, date range; explicit domain-safe sort; page. | records, indicators, finance or beneficiary rows with domain labels. | Money remains string; beneficiary stage always retained. |
| `publicDownload` | Dataset backing local/server export. | same approved filters; deterministic slug order; page/chunk. | Allowlisted flat public rows. | Supplies export service, not direct internal table dump. |
| `latestVerifiedRecords` | Recently published records meeting a verification threshold. | verification allowlist, optional sector/type; published-desc; page. | `PublicRecordListItem[]`. | Adapter applies product threshold policy explicitly. |

## Filter semantics

- `publicGroup` is Level 1 navigation; `sector` is the canonical Level 2 research sector; `subsector` is Level 3.
- `state` is a convenience alias resolved to a `geographic_units.code`, not unvalidated display text.
- Year/date filters apply to documented record/timeline period semantics; they do not manufacture exact dates.
- Omitting a filter means no restriction. Empty strings are rejected/normalized by the adapter.
- Multi-value filters are OR within one dimension and AND across dimensions.

## Publication guarantee

A public operation must require `is_public = true` and `publication_status IN ('published','corrected')`. Claims additionally require acceptable verification/workflow state, relationships require public review state, and sources require `visibility_class = 'public'`. The current `GetPublishedRecord` operation uses a filtered singleton list instead of an unguarded key lookup so those publication predicates remain server-side.

## Errors and freshness

Adapters expose typed `not_found`, `invalid_filter`, `temporarily_unavailable`, and `unexpected` outcomes. No internal database error is sent to the browser. Responses should later include contract/schema version and generated-at metadata. Cache policy belongs to the service/adapter and must never let withdrawn records remain indefinitely public.
