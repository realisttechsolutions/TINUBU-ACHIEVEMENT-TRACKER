# PTAT Macro Observatory Engineering Handoff Specification
## Instruction & Implementation Protocol for Antigravity Frontend
### Target Route: `/dashboard` | Authoritative Worktree: `TINUBU ACHIEVEMENTS TRACKER-ANTIGRAVITY-M10JD2`
**Package Status: CANDIDATE RESEARCH AUTHORITY (Awaiting Command Centre Audit)**

---

## 1. Authoritative Data Package Manifest

The following machine-readable files located in `data/macro-research/` are the single source of truth:
1. `01_latest_macro_indicators.csv`: Headline indicators and provenance attributes.
2. `02_macro_time_series.csv`: Historical time-series points (May 2023 – August 2026).
3. `03_methodology_breaks.csv`: Explicit structural regime breaks.
4. `04_economic_engines.csv`: NBS Real GDP by sector composition and growth rates.
5. `05_administration_baselines.csv`: May/Q2 2023 inaugural baselines and computed deltas.
6. `06_reform_transmission.csv`: Reform channels and linked verified PTAT records.
7. `07_macro_briefing_packets.csv`: Structured domain evidence packets.
8. `08_macro_source_register.csv`: Statutory authority audit registry.
9. `09_freshness_policy.csv`: Cadence-driven freshness threshold rules.
10. `10_data_gaps.csv`: Documented data gaps and reporting lags.
11. `11_false_claim_audit.csv`: Rejected unverified values audit log.
12. `12_macro_observatory_master.csv`: Master consolidated observation table.
13. `13_macro_observatory_master.json`: Machine-readable JSON contract.

---

## 2. Headline Values to Render (No Interpolation or Guessing)

```typescript
export const HEADLINE_STATUTORY_OBSERVATIONS = {
  realGdpGrowth: {
    value: 3.89,
    unit: '%',
    period: 'Q1 2026',
    date: '2026-03-31',
    source: 'National Bureau of Statistics (NBS)',
    url: 'https://nigerianstat.gov.ng',
    freshness: 'CURRENT',
    baselineDelta: '+1.38% pts since Q2 2023 (2.51%)'
  },
  headlineCpi: {
    value: 15.43,
    unit: '%',
    period: 'July 2026',
    date: '2026-07-31',
    source: 'National Bureau of Statistics (NBS)',
    url: 'https://nigerianstat.gov.ng',
    freshness: 'CURRENT',
    methodologyNote: 'Rebased 2024=100 base year; within rebased series, down from 22.97% (May 2025)'
  },
  foodCpi: {
    value: 20.31,
    unit: '%',
    period: 'July 2026',
    date: '2026-07-31',
    source: 'National Bureau of Statistics (NBS)',
    url: 'https://nigerianstat.gov.ng',
    freshness: 'CURRENT',
    note: 'Accelerated for six consecutive months in 2026; MoM at 5.56%'
  },
  nafemFxRate: {
    value: 1350.41,
    unit: '₦/$1',
    period: 'August 2026 (Aug 19)',
    date: '2026-08-19',
    source: 'Central Bank of Nigeria (CBN) / FMDQ',
    url: 'https://www.cbn.gov.ng',
    freshness: 'CURRENT',
    note: 'Volume-weighted autonomous NFEM rate; closing at ₦1,351.00/$1'
  },
  grossReserves: {
    value: 52.66,
    unit: '$ Billion',
    period: 'August 2026 (Aug 23)',
    date: '2026-08-23',
    source: 'Central Bank of Nigeria (CBN)',
    url: 'https://www.cbn.gov.ng',
    freshness: 'CURRENT',
    baselineDelta: '+$17.56B (+50.03%) since May 2023 ($35.10B)'
  },
  monetaryPolicyRate: {
    value: 26.50,
    unit: '%',
    period: 'July 2026 (306th MPC)',
    date: '2026-07-21',
    source: 'Central Bank of Nigeria (CBN)',
    url: 'https://www.cbn.gov.ng',
    freshness: 'CURRENT',
    note: 'Retained at 26.50%; CRR held at 45.00%'
  },
  crudeOilProduction: {
    value: 1.505,
    unit: 'mbpd',
    period: 'July 2026',
    date: '2026-07-31',
    source: 'Nigerian Upstream Petroleum Regulatory Commission (NUPRC)',
    url: 'https://www.nuprc.gov.ng',
    freshness: 'CURRENT',
    note: 'Crude-only output (excl. 0.165 mbpd condensate; total liquids = 1.670 mbpd)'
  },
  totalPublicDebt: {
    value: 159.3516,
    unit: '₦ Trillion',
    displayValue: '₦159.35T ($114.95B)',
    period: 'Q1 2026 (March 31)',
    date: '2026-03-31',
    source: 'Debt Management Office (DMO)',
    url: 'https://www.dmo.gov.ng',
    freshness: 'CURRENT',
    note: 'USD debt grew by +$1.53B (+1.35%) from Q2 2023 ($113.42B); NGN debt increased due to FX rate at ₦1386.21/$'
  },
  faacDistributableRevenue: {
    value: 3.007,
    unit: '₦ Trillion',
    period: 'July 2026',
    date: '2026-07-31',
    source: 'Office of the Accountant General of the Federation (OAGF)',
    url: 'https://www.oagf.gov.ng',
    freshness: 'CURRENT',
    baselineDelta: '+₦2.221T (+282.57%) since May 2023 (₦786B)'
  }
};
```
