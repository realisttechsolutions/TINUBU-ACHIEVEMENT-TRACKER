# M10D Frontend Defect Register

Status values are current for the M10D-FINAL staging branch. The register covers defects identified during inherited-work recovery and scoped staging QA; it does not alter the research contract, schema, or production environment.

| ID | Route | Component | Description | Observation | Severity | Category | Root Cause | Status | Fix | Commit | Verification |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| M10D-001 | `/api/health` | Health route | Public response disclosed runtime, data source, database and boundary diagnostics. | A healthy response included environment and Cloud SQL/security fields; unhealthy responses disclosed database/boundary state. | P1 | Security | Diagnostic payload was exposed by a public endpoint. | Resolved | Return only `{ status: 'healthy' }` or `{ status: 'unhealthy' }`; retain the boundary assertion server-side. | Pending | Route unit tests assert exact public payloads. |
| M10D-002 | Site-wide | Frontend source literals | Mojibake in labels, metadata and static UI copy. | Initial audit found 63 sequences in 27 frontend files, including `â€`, `â€“`, `â€”`, `â€™`, `â€œ`, `Â`, `âŒ˜` and `ï¿½`. | P1 | Data correctness | UTF-8 source literals had been decoded or saved incorrectly. | Resolved | Restore the intended UTF-8 characters without changing canonical Cloud SQL data. | Pending | Focused source scan returns zero target sequences. |
| M10D-003 | 360–768px; 1280–1440px | Global header | Header could overflow when brand, navigation and all controls were visible together. | Constrained widths could not accommodate the complete desktop control set. | P2 | Responsive layout | Brand could not shrink and optional controls appeared too early. | Resolved | Permit the brand container to shrink; defer language and downloads until `2xl`; tighten large-header spacing. | Pending | Browser viewport QA at required breakpoints. |
| M10D-004 | `/policies/electricity-act-2023` | Policy detail page | Existing valid policy showed “Policy Record Not Found” in an obsolete client shell. | Server lookup passed, but the client used the legacy policy service. | P1 | Functional | Detail route rendered a client-only legacy view instead of the hydrated public adapter. | Resolved | Render the shared `PublicRecordDetail` against the Cloud SQL-hydrated public data adapter. | Pending | Route/unit build verification and post-rollout live QA. |
| M10D-005 | `/projects/[slug]` | Project detail page | No routed public project detail page was available. | Catalogue records lacked individual route targets. | P1 | Functional | Detail route was absent. | Resolved | Add server-validated project route and shared public detail view. | Pending | Build, sitemap and post-rollout live QA. |
| M10D-006 | `/programmes/[slug]` | Programme detail page | No routed public programme detail page was available. | Catalogue records lacked individual route targets. | P1 | Functional | Detail route was absent. | Resolved | Add server-validated programme route and shared public detail view. | Pending | Build, sitemap and post-rollout live QA. |
| M10D-007 | `/projects`, `/policies`, `/programmes` | Catalogue cards | Catalogue cards did not link to their public record pages. | Users could inspect catalogue summaries but not open their individual records. | P1 | Functional | Detail links had not been wired to the new route surface. | Resolved | Add explicit accessible “View … record” links. | Pending | Build and post-rollout route navigation QA. |
| M10D-008 | Global search | `dataAdapter.searchGlobal` | Search used obsolete project/policy hash links and omitted programme records. | Search results bypassed new public detail routes. | P1 | Functional | Legacy catalogue-hash URL mapping remained after the route design. | Resolved | Link project/policy results to detail routes and include programme search results. | Pending | Focused data adapter test and post-rollout search QA. |
| M10D-009 | `/sitemap.xml` | Sitemap route | Project and programme public record URLs were absent from the generated sitemap. | New detail routes would not be represented in discovery output. | P2 | SEO | Sitemap enumerated only the original record categories. | Resolved | Include Cloud SQL-backed project and programme entries. | Pending | Build and route-level output verification. |
| M10D-010 | `/` at 768px | Latest updates cards | The three-column update-card grid caused page-level horizontal overflow. | Each card became too narrow for its source badge and verification link. | P2 | Responsive layout | The grid changed to three columns at the `md` breakpoint. | Resolved | Defer the three-column layout to `lg`. | Pending | Browser viewport QA confirms no horizontal overflow. |

## Counts

- Total defects: 10
- P0: 0
- P1: 7
- P2: 3
- P3: 0
- Resolved in source: 10
- Remaining before rollout: 0 source defects; live verification remains pending for deployment-dependent paths.
