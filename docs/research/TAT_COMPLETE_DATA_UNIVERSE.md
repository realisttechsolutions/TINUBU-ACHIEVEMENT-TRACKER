# Complete Data Universe — Tinubu Achievement Tracker V2

This document defines the complete universe of 35 entities managed within the platform database, grouped across 9 entity categories.

---

## 1. Core Content Entities
1. `Achievement`: Central verified achievement record.
2. `Policy`: Executive action, legislation, or policy reform.
3. `Physical Project`: Capital infrastructure asset.
4. `Programme`: Non-physical social intervention or credit scheme.
5. `Institutional Reform`: Civil service or agency structural reform.
6. `Reported Outcome`: Verified statistical outcome milestone.
7. `Timeline Event`: Dated implementation milestone.
8. `Milestone`: Step-by-step progress event.
9. `Indicator`: Defined performance metric definition.
10. `Indicator Observation`: Dated numeric observation for an indicator.
11. `Report`: Downloadable executive PDF brief.
12. `Dataset`: Structured downloadable CSV/JSON export.
13. `Correction`: Documented figure revision log.
14. `Methodology`: Data calculation & classification specification.

---

## 2. Organisational Entities
15. `Institution`: Canonical MDA, international body, or media organisation.
16. `Institution Alias`: Former or alternate names for MDAs.

---

## 3. Taxonomy & Geographic Entities
17. `Sector`: 5 primary umbrella sectors (`economy`, `security`, `infrastructure`, `social-services`, `governance`).
18. `Subsector`: Granular subsector classifications.
19. `Geographic Unit`: States, FCT, geopolitical zones, sites, corridors.
20. `Geographic Coverage`: Many-to-many record-location mapping.

---

## 4. Evidence, Measurement & Financial Entities
21. `Source`: Cited primary, statutory, or media document.
22. `Source File`: Stored PDF or scan.
23. `Source Snapshot`: Wayback / archived web snapshot link.
24. `Source Relationship`: Claim-level source attribution role.
25. `Evidence Claim`: Atomic factual claim extracted from text.
26. `Financial Record`: Explicit financial tracking (approval, funding release, expenditure).
27. `Beneficiary Record`: Explicit beneficiary stage tracking (applicants vs disbursement recipients).

---

## 5. Workflow & Governance Entities
28. `Research Actor`: Human researcher or AI agent identity.
29. `Research Batch`: Batch identifier for bulk ingestion.
30. `Review Decision`: Senior editor approval log.
31. `Data Gap`: Identified research priority.
32. `Freshness Review`: Scheduled velocity audit timestamp.
33. `Correction Record`: Public correction log.
34. `Record Version`: Historical version snapshot.
35. `User Profile`: Authentication & role assignment.
