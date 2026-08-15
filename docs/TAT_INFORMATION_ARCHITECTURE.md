# Tinubu Achievement Tracker V2: Information Architecture
## Next.js App Router Navigation Structure & Content Taxonomies

**Status:** CANONICAL  

---

## 1. Primary Navigation Structure

- **Executive & National Overview:**
  - `/` — Public Homepage (Hero, national counters, featured reforms, sector grid)
  - `/dashboard` — Executive Macroeconomic & Fiscal Dashboard (GDP, inflation, FX, reserves)
  - `/impact-map` — Geographic Impact Map (36 states + FCT geo-spatial breakdown)
  - `/timeline` — Chronological Policy & Executive Intervention Timeline (2023–2026)

- **Evidence & Catalogues:**
  - `/achievements` — Canonical Achievements Catalogue (Search, sector filters, evidence drawer)
  - `/achievements/[slug]` — Individual Achievement Evidentiary Record (Full citations, impact metrics, audit log)
  - `/sectors` — 15 Canonical Research Sectors Directory
  - `/sectors/[slug]` — Sector Deep Dive (Linked achievements, key projects, active policies)
  - `/states` — 36 States + FCT Subnational Directory
  - `/states/[slug]` — Subnational State Profile (State-specific projects, federal interventions)
  - `/policies` — Statutory Policy & Reform Intelligence Directory (Acts, Executive Orders, FEC approvals)
  - `/policies/[slug]` — Policy Detail & Legal Authority Analysis
  - `/projects` — Major Capital Infrastructure Projects
  - `/programmes` — National Social Investment & Enterprise Programmes

- **Transparency & Open Data:**
  - `/data-sources` — Evidentiary Methodology, Tiers of Evidence, & Primary Gazette Index
  - `/sources` — Canonical Source Records Directory
  - `/sources/[slug]` — Source Profile & Published Claim Manifest
  - `/corrections` — Audited Public Corrections Register
  - `/data` — Interactive Data Explorer & Query Tool
  - `/downloads` — Open Data Downloads (CSV, JSON, PDF Research Briefs)