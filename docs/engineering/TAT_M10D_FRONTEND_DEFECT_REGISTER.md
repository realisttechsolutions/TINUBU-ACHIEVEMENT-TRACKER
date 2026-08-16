# M10D Frontend Defect Register — Live Certified

Status values are verified and certified on the live Firebase App Hosting staging environment (`https://tat-staging--tinubu-achievement-stg.us-central1.hosted.app`) after rollout of commit `dc5830f3281fb3fdd7303d1dc8bc704742354f4e`.

| ID | Route | Component | Description | Observation | Severity | Category | Root Cause | Status | Fix | Commit | Verification |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| M10D-001 | `/api/health` | Health route | Public response disclosed runtime, data source, database and boundary diagnostics. | A healthy response included environment and Cloud SQL/security fields. | P1 | Security | Diagnostic payload was exposed by a public endpoint. | Resolved | Return minimal `{"status":"healthy"}`; retain boundary assertions server-side. | dc5830f | **LIVE CERTIFIED (PASS)**: Returns `{"status":"healthy"}` (20 bytes). |
| M10D-002 | Site-wide | Frontend source literals | Mojibake in labels, metadata and static UI copy. | Initial audit found 63 sequences in 27 files. | P1 | Data correctness | Corrupted UTF-8 source literals. | Resolved | Restored intended UTF-8 characters without changing canonical Cloud SQL data. | dc5830f | **LIVE CERTIFIED (PASS)**: 0 mojibake characters across 28 live routes. |
| M10D-003 | 360–768px; 1280–1440px | Global header | Header could overflow when brand, navigation and controls were visible. | Constrained widths could not accommodate complete desktop control set. | P2 | Responsive layout | Brand could not shrink; optional controls appeared too early. | Resolved | Permit brand container to shrink; defer language/downloads to `2xl`. | dc5830f | **LIVE CERTIFIED (PASS)**: Clean header layout at 360, 390, 430, 768, 1024, 1280, 1440, 1600px. |
| M10D-004 | `/policies/electricity-act-2023` | Policy detail page | Valid policy showed 'Policy Record Not Found'. | Server lookup passed, but client used legacy policy service. | P1 | Functional | Detail route rendered client-only legacy view. | Resolved | Render `PublicRecordDetail` against Cloud SQL-hydrated public data adapter. | dc5830f | **LIVE CERTIFIED (PASS)**: Renders Electricity Act 2023 policy details cleanly. |
| M10D-005 | `/projects/[slug]` | Project detail page | No routed public project detail page was available. | Catalogue records lacked individual route targets. | P1 | Functional | Detail route was absent. | Resolved | Add server-validated project route and shared public detail view. | dc5830f | **LIVE CERTIFIED (PASS)**: `/projects/lagos-calabar-coastal-highway-section-1` renders. |
| M10D-006 | `/programmes/[slug]` | Programme detail page | No routed public programme detail page was available. | Catalogue records lacked individual route targets. | P1 | Functional | Detail route was absent. | Resolved | Add server-validated programme route and shared public detail view. | dc5830f | **LIVE CERTIFIED (PASS)**: `/programmes/presidential-conditional-grant-scheme` renders. |
| M10D-007 | `/projects`, `/policies`, `/programmes` | Catalogue cards | Catalogue cards did not link to their public record pages. | Users could not open individual detail records. | P1 | Functional | Detail links had not been wired to the route surface. | Resolved | Added explicit accessible detail navigation links. | dc5830f | **LIVE CERTIFIED (PASS)**: Cards navigate cleanly to individual detail routes. |
| M10D-008 | Global search | `dataAdapter.searchGlobal` | Search used obsolete hash links and omitted programmes. | Search results bypassed new public detail routes. | P1 | Functional | Legacy catalogue-hash URL mapping remained. | Resolved | Link project/policy results to detail routes; include programmes. | dc5830f | **LIVE CERTIFIED (PASS)**: Live search returns matching policies, projects, and programmes. |
| M10D-009 | `/sitemap.xml` | Sitemap route | Project and programme public record URLs were absent from sitemap. | New detail routes were not represented in discovery output. | P2 | SEO | Sitemap enumerated only original record categories. | Resolved | Included Cloud SQL-backed project and programme entries. | dc5830f | **LIVE CERTIFIED (PASS)**: `/sitemap.xml` outputs all canonical entity URLs. |
| M10D-010 | `/` at 768px | Latest updates cards | 3-column update-card grid caused page-level horizontal overflow. | Cards became too narrow for source badges. | P2 | Responsive layout | Grid changed to 3 columns at `md` breakpoint. | Resolved | Defer 3-column layout to `lg`. | dc5830f | **LIVE CERTIFIED (PASS)**: 2-column layout at 768px with zero overflow. |

## Defect Summary
- Total Defects: 10
- P0: 0
- P1: 7 (All 7 Resolved & Live Certified)
- P2: 3 (All 3 Resolved & Live Certified)
- P3: 0
- Remaining Open Defects: **0**
