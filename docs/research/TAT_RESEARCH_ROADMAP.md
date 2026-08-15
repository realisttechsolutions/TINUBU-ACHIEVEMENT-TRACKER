# Tinubu Achievement Tracker — Eight-Stage Research Roadmap (v1.1)

**Standard Version:** 1.1  
**Effective Date:** 2026-08-15  
**Governing Contract:** Research Contract v1.1  
**Historical Scope:** 29 May 2023 through August 2026  

---

## 1. Roadmap Architecture: Eight Sequential Expansion Phases

The research program is organized into eight named phases designed to scale from foundational architecture to comprehensive, nationwide achievement discovery across all 15 canonical sectors:

```text
Phase 1: Foundation (Contract v1.1, Schemas, Vocabulary, Validator Engine)
   │
   ▼
[ Engineering Gate E01: Local Firebase SQL Connect Prototype & Adapters ]
   │
   ▼
Phase 2: Pilot Dataset (5-Record Multi-Sector Test & End-to-End Ingestion Run)
   │
   ▼
Phase 3: Core National Records (Federal Acts, Executive Orders, FEC Approvals)
   │
   ▼
Phase 4: Sector Expansion (Systematic Exhaustive Discovery Across All 15 Sectors)
   │
   ▼
Phase 5: Geographic Expansion (Sub-National 36 States & FCT Project Mapping)
   │
   ▼
Phase 6: Outcome & Evidence Deepening (Empirical Statistical Observations & Audits)
   │
   ▼
Phase 7: Historical Reconciliation (Cross-MDA Deduplication & Contradiction Resolution)
   │
   ▼
Phase 8: Continuous Monitoring (Freshness Velocity & Real-Time Gazette Tracking)
```

---

## 2. Detailed Phase Breakdown

### Phase 1: Foundation (Current Status: COMPLETED in Mission 01.1)
- **Deliverables:** Contract v1.1 consolidation, Codex audit resolutions, `canonical-vocabulary.v1.1.json`, 19 CSV templates, 19 Draft-07 schemas, extended AJV validator engine, frontend alignment requirements.
- **Exit Gate:** 100% PASS on `npm run validate:research`.

### Engineering Gate E01 (Prerequisite for Phase 2)
- **Deliverables:** Express 27-table logical schema in local Firebase SQL Connect emulator; generate TypeScript SDK operations; implement pure frontend mapping adapters; conduct public query parity tests. **No cloud provisioning or migrations.**

### Phase 2: Pilot Dataset (Research Mission 02)
- **Deliverables:** 5 representative, multi-sector, multi-tier pilot records (1 policy reform, 1 capital project, 1 social intervention, 1 institutional reform, 1 macro outcome) tested through end-to-end local emulator ingestion.
- **Exit Gate:** 100% dry-run and commit validation in local SQL Connect emulator.

### Phase 3: Core National Records
- **Deliverables:** Comprehensive capture of all major Federal Enactments (Acts of 10th National Assembly), signed Executive Orders, FEC Major Approvals, and national strategies from 29 May 2023 onward.
- **Exit Gate:** 100% coverage of official Federal Gazettes for the administration period.

### Phase 4: Sector Expansion
- **Deliverables:** Systematic, ministry-by-ministry discovery across all 15 canonical research sectors (Power, Transport, Agriculture, Education, Health, Housing, Creative Economy, etc.).
- **Exit Gate:** Sector completeness review confirming diminishing marginal returns on discovery.

### Phase 5: Geographic Expansion
- **Deliverables:** State-by-state discovery mapping physical projects, conditional cash disbursements, and housing estates across all 36 States and the FCT.
- **Exit Gate:** Every state has verified project coordinates and local implementation milestones.

### Phase 6: Outcome and Evidence Deepening
- **Deliverables:** Populating quantitative time series in `indicator_observations` from NBS statistical bulletins, CBN economic reports, DMO debt data, and multilateral partner audits (World Bank, AfDB).
- **Exit Gate:** Multi-period trendlines and verified macroeconomic outcomes published.

### Phase 7: Historical Reconciliation
- **Deliverables:** Cross-agency duplicate resolution, final adjudication of open tickets in `contradiction_log.csv`, and full source provenance audit.
- **Exit Gate:** Zero unresolved critical contradictions.

### Phase 8: Continuous Monitoring
- **Deliverables:** Automated RSS/gazette monitoring, scheduled freshness reviews (30-day high velocity to 365-day low velocity), and rapid-response correction workflows through August 2026.
- **Exit Gate:** Active production monitoring with continuous freshness compliance.
