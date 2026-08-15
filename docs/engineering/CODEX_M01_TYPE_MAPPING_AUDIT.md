# Codex Mission 01 Frontend Type Mapping Audit

**Verdict:** The frontend types are usable presentation models but are not a database contract. They materially diverge from Mission 01 schemas and must be adapted from generated SQL Connect operation types rather than merged with them.

No frontend component or type file was modified in this audit.

## Cross-file findings

| File | Finding | Severity | Recommendation |
|---|---|---|---|
| `src/types/achievement.ts` | Publication statuses use kebab-case while schemas use snake_case; status and classification types are imported presentation labels; sources are embedded record objects rather than claim links. | HIGH | Keep as a public view model; map generated public-detail query results through a typed adapter. |
| `src/types/sector.ts` | Defines a presentation dashboard aggregate with a separate publication/evidence vocabulary and hard-coded nested policies/projects/indicators. It is not normalized. | HIGH | Populate from purpose-built sector dashboard query; do not generate a table matching this shape. |
| `src/types/policy.types.ts` | Kebab-case values differ from schema underscores. `partially-implemented`, `fully-implemented` and `outcome-reported` conflict with canonical `partially_delivered`, `completed`, `outcome_reported`. | BLOCKER | Approve canonical codes, then map to labels. Do not import both vocabularies. |
| `src/types/timeline.types.ts` | Dates allow readable text; schema expects structured fields but does not enforce them. Categories are a hard-coded list distinct from canonical sector taxonomy. | HIGH | Query normalized event dates/precision and sector IDs; format labels at the view boundary. |
| `src/types/geography.types.ts` | Strongest alignment, but multiple overlapping scope unions and client coordinates have no database identity/sensitivity enforcement. | MEDIUM | Generate geographic DTOs from canonical units and keep map-only types in UI code. |

## Exact vocabulary drift

### Implementation status

The canonical research document defines 21 snake_case codes. `AchievementStatus` exposes 12 title-case display strings. It omits or renames proposed, enacted, effective, funding released, planning, independently assessed, suspended, superseded, repealed and withdrawn states. `PolicyStatus` uses kebab-case and introduces `partially-implemented` and `fully-implemented` rather than the canonical delivery states.

Use one canonical code in database/generated types. Define display metadata separately:

```ts
type ImplementationStatusCode =
  | "proposed"
  | "announced"
  | "approved"
  // ...approved canonical codes
  | "withdrawn";

const statusPresentation: Record<ImplementationStatusCode, { label: string }> = {
  // UI labels only
};
```

### Data classification

`DataClassificationBadge` has six title-case values. Schemas have 12 snake_case values. More importantly, the 12 values mix three dimensions:

- Value nature: actual, provisional, estimated, projected, government target, calculated, modelled.
- Reporting origin: government reported, independently reported.
- Lifecycle/review: under review, corrected, withdrawn.

The database should split those dimensions. The public view model can combine them into badges intentionally.

### Publication status

Frontend: `under-review`, `publishable-with-qualification`.

Schema: `under_review`, `publishable_with_qualification`.

Legacy docs contain both forms.

Choose snake_case canonical database values and map to human labels/kebab route/filter values only at an explicit boundary.

### Policy/legal types

Frontend uses kebab-case (`executive-action`, `executive-order`); schemas use underscores (`executive_action`, `executive_order`). The same mismatch applies to fiscal/monetary/administrative types. This is a deterministic adapter concern after one side is declared canonical, but it currently blocks direct imports.

### Source levels and evidence profiles

`SourceLevel` allows only 1-5. The canonical source hierarchy has Level 6 discovery leads. Level 6 should remain internal and never appear in public result types, but ingestion/internal generated types must support it.

`SectorEvidenceProfile` contains four slugs that do not map one-to-one to the eight record evidence profiles. Evidence profile is record/claim-derived data, not a static sector property unless the query explicitly aggregates it.

## Field and relationship gaps

Frontend records currently embed:

- `sources[]`
- `milestones[]`
- `keyMetrics[]`
- institution names
- sector slugs
- state names

The database needs IDs and relationship tables. Generated SQL Connect public queries should return nested projections, but frontend code should not assume those arrays are stored as JSON or table columns.

Missing from the principal frontend types:

- claim IDs, verification, limitations and source relationship roles
- contradiction/replacement evidence
- financial type/period/currency basis
- beneficiary stage/period/geography/count basis
- publication/review revision
- date precision/ranges/fiscal periods for most entities
- internal/public/restricted boundary markers
- correction/version metadata

Internal fields such as researcher IDs, raw evidence URLs, rejection rationale, private notes, ingestion details and restricted object paths must not be added to public view models.

## Nullability issues

- Schema-required values and frontend optional values differ (`short_title`, description/details and dates vary by record type).
- Empty string in CSV is not the same as database null.
- Unknown date is not an empty date string; use nullable structured fields plus precision/label.
- Optional nested arrays should normally return `[]`, not `undefined`, from query adapters unless absence has distinct meaning.
- A generated SDK nullable field must be handled explicitly before assigning to a stricter view model.

The database schema should express truth; adapters may supply public-safe defaults only where semantics are preserved.

## Generated SDK integration

Recommended layers:

```text
SQL Connect schema
  -> connector operations/fragments
     -> generated operation input/result types (do not hand-edit)
        -> repository/query functions
           -> pure mapping adapters
              -> existing public UI view models/components
```

Rules:

1. Commit generated SDK code or generate deterministically in CI according to the approved Firebase workflow.
2. Do not re-declare generated row/operation types by hand.
3. Do not expose a generic database client to components.
4. Create narrow public queries that never select internal/restricted fields.
5. Map canonical snake_case codes to existing display labels in one tested module.
6. Add exhaustive compile-time mappings so a new backend enum/state breaks the build until the UI handles it.
7. Use exact-money/large-integer serialization without JavaScript precision loss.
8. Replace hard-coded static data incrementally only after public query/result parity tests pass; do not retain divergent “fallback truth” indefinitely.

## Recommended operation DTOs

- `ListPublishedRecords`: card fields, primary sector/group, status label inputs, public geography summary.
- `GetPublishedRecordBySlug`: public record/subtype/profile, claims, public claim-source citations, structured values, timeline and public corrections.
- `ListSectorDashboard`: aggregated counts/indicators and recent records for a canonical sector/public group.
- `ListTimelineEvents`: structured dates and filters.
- `ListPublishedPolicies`: policy details and public evidence projection.
- Staff operations: separate packages/types, never imported by the public app bundle where avoidable.

## Hard-coded data

The current `src/data/**` files contain public-looking claims, values and dates. They are not production database rows and were outside Research Mission 01 imports, but they create a future dual-source-of-truth risk. Treat them as static prototype content until a reviewed cutover. Do not silently ingest them as verified research data.

## Approval condition

Type integration is a **FAIL for direct database use** and a **CONDITIONAL PASS as a presentation layer**. Resolve the canonical code registry, generate local SQL Connect operation types, and implement/test adapters before replacing static frontend services.
