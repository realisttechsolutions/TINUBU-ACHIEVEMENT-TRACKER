# Tinubu Achievement Tracker — Frontend V2 Component Inventory

**Inventory Version:** 2.0.0  
**Effective Date:** 2026-08-15  
**Governing Contract:** `docs/research/TAT_RESEARCH_CONTRACT_V1_1_2.md`  

---

## 1. Master Component Catalog

```text
+───────────────────────────────────────────────────────────────────────────────────────────────────+
|                                1. GLOBAL LAYOUT & SHELL COMPONENTS                                |
+──────────────────────────┬──────────────────────────────────────────┬─────────────────────────────+
| Component Name           | File Path                                | Responsibility              |
+──────────────────────────┼──────────────────────────────────────────┼─────────────────────────────+
| AppShell                 | src/components/layout/AppShell.tsx       | Root layout wrapper         |
| GlobalHeader             | src/components/layout/GlobalHeader.tsx   | Sticky 2026 navigation bar  |
| DesktopNavigation        | src/components/layout/DesktopNav.tsx     | 5-Group Mega-menu dropdowns |
| MobileNavigationDrawer   | src/components/layout/MobileDrawer.tsx   | Touch-optimized drawer      |
| GlobalSearch             | src/components/layout/GlobalSearch.tsx   | Cmd+K autosuggest modal     |
| BrandLockup              | src/components/layout/BrandLockup.tsx    | National emblem & logo      |
| GlobalFooter             | src/components/layout/GlobalFooter.tsx   | Sitemap, disclaimers, links |
+──────────────────────────┴──────────────────────────────────────────┴─────────────────────────────+

+───────────────────────────────────────────────────────────────────────────────────────────────────+
|                                2. EXPLORER & CARD PRESENTATION                                    |
+──────────────────────────┬──────────────────────────────────────────┬─────────────────────────────+
| AchievementCard          | src/components/achievements/Card.tsx     | 2026 achievement card       |
| AchievementFilterBar     | src/components/achievements/Filters.tsx  | Multi-faceted filter panel  |
| RecordViewToggle         | src/components/achievements/Toggle.tsx   | Grid / Compact List switch  |
| ProjectCard              | src/components/projects/ProjectCard.tsx  | Infrastructure project card |
| PolicyCard               | src/components/policies/PolicyCard.tsx   | Policy & Reform card        |
| ProgrammeCard            | src/components/programmes/Card.tsx       | Social programme card       |
| SectorExplorerCard       | src/components/home/SectorCard.tsx       | Sector showcase card        |
+──────────────────────────┴──────────────────────────────────────────┴─────────────────────────────+

+───────────────────────────────────────────────────────────────────────────────────────────────────+
|                                3. RECORD DETAIL & EVIDENCE SYSTEM                                 |
+──────────────────────────┬──────────────────────────────────────────┬─────────────────────────────+
| RecordDetailHero         | src/components/records/DetailHero.tsx    | Plain-language story header |
| KeyFactsGrid             | src/components/records/KeyFacts.tsx      | Lead MDA, dates, locations  |
| StatusProgressionBar     | src/components/records/StatusBar.tsx     | 21-stage lifecycle tracker  |
| QuantifiedMetricsPanel   | src/components/records/Metrics.tsx       | Financial & beneficiary data|
| AtomicEvidencePanel      | src/components/records/EvidencePanel.tsx | Claims, sources, locators   |
| SourceCitationCard       | src/components/records/SourceCard.tsx    | Level 1-5 citation details  |
| ContradictionAlertBox    | src/components/records/Contradictions.tsx| Reconciled competing figures|
| RecordShareExportBar     | src/components/records/ShareExport.tsx   | PDF summary, link copy, JSON|
+──────────────────────────┴──────────────────────────────────────────┴─────────────────────────────+

+───────────────────────────────────────────────────────────────────────────────────────────────────+
|                                4. GEOGRAPHIC & MAP EXPERIENCES                                    |
+──────────────────────────┬──────────────────────────────────────────┬─────────────────────────────+
| NigeriaImpactMap         | src/components/geography/NigeriaMap.tsx  | Interactive vector SVG map  |
| StateSelectionDrawer     | src/components/geography/StateDrawer.tsx | State profile quick sheet   |
| GeopoliticalZoneFilter   | src/components/geography/ZoneFilter.tsx  | 6-Zone quick filter tabs    |
| GeographicTableView      | src/components/geography/TableView.tsx   | Accessible data list view   |
+──────────────────────────┴──────────────────────────────────────────┴─────────────────────────────+

+───────────────────────────────────────────────────────────────────────────────────────────────────+
|                                5. TIMELINE & DATA STORYTELLING                                    |
+──────────────────────────┬──────────────────────────────────────────┬─────────────────────────────+
| TimelineStoryStream      | src/components/timeline/StoryStream.tsx  | Storytelling visual timeline|
| TimelineResearchTable    | src/components/timeline/ResearchTable.tsx| Compact tabular event log   |
| TimelineTimeScrubber     | src/components/timeline/Scrubber.tsx     | May 2023-Aug 2026 quarter bar|
+──────────────────────────┴──────────────────────────────────────────┴─────────────────────────────+

+───────────────────────────────────────────────────────────────────────────────────────────────────+
|                                6. DATA EXPLORER & DOWNLOAD CENTRE                                 |
+──────────────────────────┬──────────────────────────────────────────┬─────────────────────────────+
| DataQueryBuilder         | src/components/data/QueryBuilder.tsx     | Multi-criteria query filters|
| DataResultsTable         | src/components/data/ResultsTable.tsx     | Live tabular query preview  |
| DatasetDownloadCard      | src/components/downloads/DownloadCard.tsx| Format badges, counts, DL   |
+──────────────────────────┴──────────────────────────────────────────┴─────────────────────────────+

+───────────────────────────────────────────────────────────────────────────────────────────────────+
|                                7. COMMON PRIMITIVES & BADGES                                      |
+──────────────────────────┬──────────────────────────────────────────┬─────────────────────────────+
| StatusBadge              | src/components/common/StatusBadge.tsx    | 21-stage status badge       |
| SourceLevelBadge         | src/components/common/SourceBadge.tsx    | Level 1-6 source badge      |
| VerificationStatusBadge  | src/components/common/VerifyBadge.tsx    | Verification status pill    |
| ValueNatureBadge         | src/components/common/NatureBadge.tsx    | Actual/Estimated badge      |
| DemoWatermarkBadge       | src/components/common/DemoWatermark.tsx  | Synthetic data disclaimer   |
+──────────────────────────┴──────────────────────────────────────────┴─────────────────────────────+
```
