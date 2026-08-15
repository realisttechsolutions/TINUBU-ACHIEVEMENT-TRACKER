# Tinubu Achievement Tracker — Frontend V2 Information Architecture

**Architecture Version:** 2.0.0  
**Effective Date:** 2026-08-15  
**Governing Contract:** `docs/research/TAT_RESEARCH_CONTRACT_V1_1_2.md`  

---

## 1. Information Architecture Principles

1. **Dual Audience Harmony:** Satisfies the ordinary citizen seeking quick, relatable understanding of national progress, while empowering researchers, journalists, and policy analysts with deep evidentiary citations.
2. **Simple Story First, Deep Evidence Underneath:** Every record presents a clear plain-language headline and summary up-front, with progressive disclosure controls revealing atomic claims, source hierarchy levels, locators, and contradiction logs underneath.
3. **Strict Separation of Public Navigation vs Research Taxonomy:**
   - **Public Exploration Layer:** 5 intuitive umbrella groups (`Economy`, `Security`, `Infrastructure`, `Social Services`, `Governance`).
   - **Research Foundation Layer:** 15 canonical research sectors + 20 record types + 21 implementation statuses.

---

## 2. Master Sitemap & Route Hierarchy

```text
/ ── Homepage V2 (Executive Summary, 11-Stage Narrative Flow, National Counters)
├── /achievements ── Full Achievements Explorer (Faceted Search, Grid/List Views)
│   └── /achievements/:slug ── Record Detail View (Deep Progressive Evidence, Facts, Citations)
├── /sectors ── Sectors Catalogue (5 Public Groups -> 15 Canonical Research Sectors)
│   └── /sectors/:slug ── Sector Detail View (Overview, Metrics, Projects, Policies, State Spread)
├── /projects ── Capital Infrastructure Projects Catalogue (Transport, Power, Housing, Roads)
├── /policies ── Policy Frameworks & Structural Reforms Catalogue (Acts, Gazettes, Orders)
├── /programmes ── Social Investment & Credit Schemes Catalogue (NELFUND, CREDICORP, MSME)
├── /timeline ── National Administration Timeline (May 2023 - Aug 2026, Storytelling & Research Modes)
├── /map & /impact-map ── Nigeria Geographic Explorer (36 States + FCT, Zones, Corridor Mapping)
│   └── /states/:slug ── State Detail Profile (Capital, Zone, Documented Projects & Investments)
├── /data ── Interactive Data Explorer (Multi-Dimensional Query Builder, CSV/JSON/PDF Exports)
├── /sources ── Evidence Sources & 6-Level Source Hierarchy Directory
├── /downloads ── Centralized Download Centre (Full Datasets, Sector Packs, State Datasets)
└── /dashboard ── Macro Progress & Status Funnel Analytics Dashboard
```

---

## 3. The 5 Public Groups ↔ 15 Canonical Sectors Matrix

```text
+───────────────────────────────────┬───────────────────────────────────────────────────────────────+
| 5 Public Navigation Groups        | 15 Canonical Research Sectors (Contract v1.1.2)               |
+───────────────────────────────────┼───────────────────────────────────────────────────────────────+
| 1. ECONOMY & MACRO REFORMS        | 1. economy_fiscal_reforms                                     |
|                                   | 2. agriculture_food_security                                  |
|                                   | 3. power_energy_natural_resources                             |
|                                   | 4. digital_economy_science_innovation                         |
+───────────────────────────────────┼───────────────────────────────────────────────────────────────+
| 2. SECURITY & NATIONAL STABILITY  | 5. security_national_stability                                |
+───────────────────────────────────┼───────────────────────────────────────────────────────────────+
| 3. INFRASTRUCTURE & URBAN DELIVERY| 6. infrastructure_transportation                              |
|                                   | 7. housing_urban_development                                  |
+───────────────────────────────────┼───────────────────────────────────────────────────────────────+
| 4. SOCIAL INVESTMENT & CAPITAL    | 8. education_human_capital                                    |
|                                   | 9. healthcare_public_health                                   |
|                                   | 10. social_protection_human_development                       |
|                                   | 11. youth_employment_skills                                   |
|                                   | 12. environment_climate                                       |
|                                   | 13. culture_tourism_creative_economy                          |
+───────────────────────────────────┼───────────────────────────────────────────────────────────────+
| 5. GOVERNANCE & GLOBAL RELATIONS  | 14. governance_public_service                                 |
|                                   | 15. foreign_affairs_international_cooperation                 |
+───────────────────────────────────┴───────────────────────────────────────────────────────────────+
```

---

## 4. User Journey Frameworks

### Journey A: Ordinary Citizen via Mobile Link (WhatsApp / Social Media)
1. Arrives directly at `/achievements/:slug` (e.g. Student Loan Scheme).
2. Immediately reads 2-sentence plain-language summary and verified outcome metric (e.g. 50,000 students funded).
3. Sees clear status pill (`Operational`) and lead agency (`NELFUND`).
4. Taps "Share to WhatsApp" or explores related projects in their state.

### Journey B: Policy Journalist / Fact-Checker
1. Arrives at `/achievements` or `/data` on desktop.
2. Applies filter for `sector = power_energy_natural_resources` and `implementation_status = operational`.
3. Opens record detail and scrolls to **Atomic Evidence Panel**.
4. Inspects Level 1 Gazette citation, document number, page locator, and corroborating Level 2 NBS bulletin.
5. Clicks "Download Research Summary (PDF)" or copies verified permanent record URL.

### Journey C: Quantitative Researcher / Analyst
1. Enters `/data` (Data Explorer).
2. Selects multi-dimensional criteria (Sector, State, Reporting Period).
3. Reviews live query counter ("24 Records Match Selection").
4. Clicks "Download CSV" or "Download JSON" for offline analysis.
