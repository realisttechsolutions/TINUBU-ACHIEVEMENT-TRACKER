# Tinubu Achievement Tracker — Frontend V2 Audit Report

**Audit Date:** 2026-08-15  
**Mission:** Frontend V2 Transformation Mission (2026-Grade Public Experience Redesign)  
**Target Branch:** `frontend/v2-experience`  
**Base Commit:** `a8f37696dcba8d6afd044cb4d0d6011f24df13dd`  
**Governing Contract:** `docs/research/TAT_RESEARCH_CONTRACT_V1_1_2.md`  

---

## 1. Executive Summary

This audit evaluates the complete current frontend implementation of the Tinubu Achievement Tracker prior to V2 transformation. The audit classifies every route, page, layout, component, data structure, chart, and interaction pattern into one of five actionable disposition categories:

- **KEEP**: Reusable, well-structured, accessible elements to retain as-is or with minor touch-ups.
- **REFINE**: Valuable functionality that requires visual polishing, mobile optimization, or token alignment.
- **REDESIGN**: Core pages/features that need a substantial architectural or UX overhaul to meet 2026 standards.
- **REPLACE**: Legacy, tightly coupled, or non-contract-aligned implementations that must be swapped for modular adapters.
- **REMOVE**: Obsolete, hardcoded, or redundant files that do not align with Contract v1.1.2.

---

## 2. Route & Page Inventory Audit

| Route / Path | Component Name | Current Quality & UX State | Classification | Recommended Action in V2 |
|---|---|---|:---:|---|
| `/` | `Index.tsx` / `HomeHero.tsx` etc. | Functional 11-section narrative, but visual styling is static and lacks interactive live counters, sector tab previews, and Nigeria map teaser. | **REDESIGN** | Rebuild into an editorial 2026 national intelligence hero with live counters, 5-group sector tabs, embedded vector map preview, timeline teaser, and evidence trust rails. |
| `/achievements` | `AchievementsCatalogue.tsx` | Basic card grid with rudimentary filters. Lacks compact list view, shareable URL state, faceted search, and verification badges. | **REDESIGN** | Transform into rich Achievement Explorer with dual Grid/List views, 15-sector facets, status progression chips, search, and sort controls. |
| `/achievements/:slug` | `AchievementDetail.tsx` | Informative but layout is monolithic; lacks progressive complexity (simple story first, deep evidence underneath), status timeline, and downloadable briefs. | **REDESIGN** | Implement progressive disclosure architecture: plain summary & key metrics first, followed by visual status progress, atomic evidence drawer, and citation locators. |
| `/sectors` | `SectorsCatalogue.tsx` | Displays basic cards, but mixes legacy sector keys without grouping under the 5 canonical umbrella groups. | **REDESIGN** | Group all 15 canonical sectors under the 5 public navigation groups with progress indicators and key headline figures. |
| `/sectors/:slug` | `SectorDetail.tsx` | Detailed but contains hardcoded demo text without dynamic adapter mapping to projects, policies, and observations. | **REFINE** | Connect to Data Adapter; add status breakdown chart, projects/policies tabs, state distribution, and downloadable sector dataset. |
| `/projects` | New Route / Component | Currently grouped into general achievements without dedicated capital infrastructure tracking. | **NEW / REDESIGN** | Build dedicated Projects Catalogue with contractor, progress percentage, site coordinates, and delivery timeline. |
| `/policies` | `PoliciesCatalogue.tsx` | Separate page exists but lacks canonical policy types (`national_policy`, `executive_order`, etc.) and status alignment. | **REFINE** | Upgrade to dedicated Policies & Reforms Catalogue with gazette citations and statutory status tracking. |
| `/programmes` | New Route / Component | Currently absent as a dedicated view. | **NEW** | Build dedicated Programmes Catalogue tracking social investments, credit schemes, and target beneficiary cohorts. |
| `/timeline` | `TimelinePage.tsx` | Vertical timeline with basic filters; lacks storytelling mode, year-by-year navigation, and milestone event classification. | **REDESIGN** | Dual-mode Timeline: Visual Storytelling stream + Compact Research table with May 2023 - August 2026 quarter/year scrubbing. |
| `/impact-map` / `/map` | `ImpactMapPage.tsx` | Vector SVG map works, but lacks state profile panel, zone filtering, and mobile-optimized list view fallback. | **REDESIGN** | Upgrade to interactive Nigeria Impact Map with interactive states, geopolitical zone filters, live project count overlay, and table fallback. |
| `/states/:slug` | `StateDetail.tsx` | Basic state overview; lacks breakdown by sector, documented federal capital projects, and direct evidence links. | **REFINE** | Upgrade State Detail view with projects list, sector allocation, beneficiary counts, and evidence citations. |
| `/data` | New Route (`DataExplorer.tsx`) | Currently no dedicated query builder. | **NEW** | Build interactive Data Explorer with multi-dimensional filtering, live record count, preview table, and CSV/JSON/PDF export triggers. |
| `/downloads` | `Downloads.tsx` | Basic static document links without structured dataset exports. | **REDESIGN** | Centralized Download Centre offering full dataset, 15 sector datasets, 37 state datasets, timeline exports, and research briefs. |
| `/sources` / `/data-sources` | `DataSources.tsx` | Textual description of sources, but lacks 6-level hierarchy visualizer and publisher transparency index. | **REFINE** | Upgrade to full Source Hierarchy & Methodology portal with Level 1-6 badges and publisher directory. |
| `/dashboard` | `Dashboard.tsx` | Heavy charts; some risk aggregating incompatible financial metrics. | **REFINE** | Refactor charts with strict non-aggregation rules for financial types; add status progression and geographic spread. |
| Legacy Sector URLs | `LegacySectorRedirect.tsx` | Redirects legacy URLs (`/economic-reforms`, `/infrastructure`, etc.) to canonical routes. | **KEEP** | Retain for backwards compatibility and SEO URL preservation. |

---

## 3. Component & Layout Audit

| Component | Directory | Current State & Assessment | Classification | Action |
|---|---|---|:---:|---|
| `AppShell.tsx` | `components/layout/` | Clean container with skip-link, header, main, footer. | **KEEP** | Retain structure; enhance background tokens. |
| `GlobalHeader.tsx` | `components/layout/` | Sticky header with brand, navigation, and search trigger. | **REFINE** | Add 5-group navigation mega-menus, live search shortcut (`Cmd+K`), and refined mobile drawer trigger. |
| `DesktopNavigation.tsx` | `components/layout/` | Dropdown menus are hardcoded with legacy categories. | **REDESIGN** | Refactor to 5 umbrella groups (`Economy`, `Security`, `Infrastructure`, `Social Services`, `Governance`) exposing 15 sectors. |
| `MobileNavigationDrawer.tsx` | `components/layout/` | Basic drawer list. | **REDESIGN** | Touch-friendly mobile drawer with quick sector pills, search, states list, and language/theme toggles. |
| `GlobalSearch.tsx` | `components/layout/` | Basic search dialog. | **REDESIGN** | Command palette with autosuggest, category grouping (`Achievements`, `Projects`, `Policies`, `Sectors`, `States`), and keyboard controls. |
| `GlobalFooter.tsx` | `components/layout/` | Comprehensive footer. | **REFINE** | Align navigation links to V2 routes; add Contract v1.1.2 attribution, data disclaimer, and download shortcuts. |
| `AchievementCard.tsx` | `components/achievements/` | Clean card, but lacks 4-dimension classification badges, evidence profile, and status progress bar. | **REFINE** | Upgrade to 2026 card design with status pill, evidence badge, sector tag, lead MDA, and quick preview drawer. |
| `NigeriaMapSvg.tsx` | `components/geography/` | Working SVG vector map with 36 states + FCT. | **KEEP / REFINE** | Optimize SVG paths, add accessible keyboard navigation, tooltips, and state hover highlights. |
| `StatusBadge.tsx` | `components/common/` | Displays status codes. | **REFINE** | Map all 21 canonical implementation statuses to human-readable labels with consistent color and icon tokens. |
| `DataClassificationBadge.tsx` | `components/common/` | Overloads classification concepts. | **REPLACE** | Replace with distinct badges for Data Value Nature (`actual`, `estimated`), Source Origin (`government_reported`), and Verification Status. |
| `SourceBadge.tsx` | `components/common/` | Displays source level. | **REFINE** | Update to 6-level hierarchy (`LEVEL_1` to `LEVEL_6`) with clear credibility indicators. |
| `AreaChart.tsx` & `BarChart.tsx` | `components/charts/` | Recharts wrappers. | **REFINE** | Ensure responsive containers, accessible color palettes, and tooltip formatting with tabular numbers. |

---

## 4. Data Layer & Taxonomy Alignment Audit

1. **Taxonomy Conflation Risk:** Previous components conflated public navigation groups with research sectors. V2 must clearly establish:
   - **5 Public Navigation Groups** for high-level exploration.
   - **15 Canonical Research Sectors** as the foundational classification.
   - **20 Record Types** mapped cleanly to dedicated or composite views.
2. **Synthetic Data Integrity:** Prototype data in `src/data/` contained mixed mock and realistic claims without clear watermarks. V2 creates `src/adapters/` with explicitly marked `[DEMO / SYNTHETIC]` records to guarantee that no unverified factual claims are published before Research Mission 02.
3. **Financial Metric Safety:** Prevent accidental summation of incompatible financial value types (`budget_allocation` vs `funding_released` vs `reported_expenditure`).

---

## 5. Performance & Mobile Readiness Audit

- **Bundle Size:** Main bundle was previously ~526 kB minified. V2 optimizes imports, applies lazy loading for heavy map and chart components, and keeps first-render CSS minimal.
- **Mobile Usability:** Large data tables and multi-column filter layouts must have responsive stacked or card fallbacks on mobile viewports (<640px).
