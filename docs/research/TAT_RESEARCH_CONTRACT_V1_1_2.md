# Tinubu Achievement Tracker — Master Research Contract v1.1.2

**Contract Version:** 1.1.2 (Final Mission 01 Closure)
**Authority Status:** CANONICAL — SOLE ACTIVE MASTER RESEARCH CONTRACT
**Supersedes:** Research Contract v1.1 and v1.1.1
**Effective Date:** 2026-08-15
**Governing Authority:** Editorial Board, Data Governance Directorate & Research Verification Team
**Scope Window:** 29 May 2023 through August 2026
**Canonical Repository:** `https://github.com/realisttechsolutions/TINUBU-ACHIEVEMENT-TRACKER.git`
**Research Architecture:** Implementation-neutral; the current proposed engineering target is React / Vite plus Firebase SQL Connect / PostgreSQL and is not part of the immutable research ontology.

---

## 1. Executive Research Scope & Permanent Project Context

The **Tinubu Achievement Tracker (TAT)** is an evidence-first, achievements-focused public information platform documenting the demonstrable accomplishments, policy reforms, physical infrastructure projects, social interventions, and institutional advancements of the administration of President Bola Ahmed Tinubu.

### 1.1 Historical Research Window
The permanent research window is **29 May 2023 through August 2026**. Future research will systematically discover, verify, structure, and publish demonstrable positive achievements initiated, funded, accelerated, or completed during this administration.

### 1.2 Exhaustive Discovery Mandate
The research programme is designed for exhaustive positive coverage across all tiers of the Federal Government of Nigeria:
- Sector by sector (all 15 canonical sectors)
- Ministry by ministry, agency by agency, commission by commission
- Programme by programme, project by project
- State by state (all 36 States and the Federal Capital Territory)

Research will continue across these dimensions until marginal research produces predominantly duplicate or already-catalogued records rather than substantive new achievements.

---

## 2. Editorial Scope & The 18 Immutable Truth Safeguards

The platform maintains a deliberately positive, achievements-focused editorial scope. Future research prioritisation concentrates on records showing tangible delivery, measurable progress, institutional reform, capital investment, operational commissioning, and positive public outcomes.

> [!CRITICAL]
> **POSITIVE SELECTION MUST NEVER WEAKEN FACTUAL ACCURACY.**
> The editorial scope determines which achievements receive research attention; it does **not** alter the truth standard governing those achievements. Public wording may be confident, engaging, and positive, but it must **never exceed the underlying verifiable evidence**.

### The 18 Mandatory Truth Invariants
1. **Never Fabricate:** Do not create or invent achievements, milestones, or beneficiaries.
2. **Never Inflate Figures:** Report exact numbers as stated in primary official evidence. Never round upwards or exaggerate.
3. **Never Manipulate Reporting Periods:** Preserve the exact fiscal year, quarter, or date range specified in the source.
4. **Announcement ≠ Approval:** An executive announcement or public promise does not prove formal approval.
5. **Approval ≠ Funding:** Federal Executive Council (FEC) or ministerial approval does not prove statutory funding.
6. **Funding ≠ Funding Release:** Budget allocation or approved funding does not prove that cash/warrants were released to the MDA.
7. **Release ≠ Expenditure:** Funds released to a ministry or contractor do not prove actual audited expenditure.
8. **Commencement ≠ Completion:** Project ground-breaking or site mobilization does not prove project delivery.
9. **Completion ≠ Operation:** Civil completion of a facility does not prove it is commissioned, staffed, and operational.
10. **Target ≠ Result:** An administrative target, KPI, or delivery projection must never be presented as an actual outcome.
11. **Applicant ≠ Beneficiary:** Individuals registered on a portal or submitting forms are applicants, not recipients.
12. **Approved ≠ Paid:** Beneficiaries approved for a grant/loan are not disbursement recipients until payment is evidenced.
13. **Government Claim ≠ Independently Verified:** Government-reported statistics must be accurately labelled as government-reported unless genuine independent institutional corroboration exists.
14. **Material Qualifications & Limitations Must NOT Be Removed:** Contextual caveats, exclusions, sample boundaries, and audit reservations must never be stripped to make a claim appear broader or more complete than documented.
15. **Contradictions Must Be Preserved Internally:** Competing official figures must be recorded in contradiction logs and reconciled transparently rather than silently erased.
16. **Corrections Must Be Preserved in Audit Trail:** Any post-publication adjustment must be permanently logged with rationale, previous value, new value, and reviewer identity.
17. **Source Provenance Must Be Preserved:** Every factual claim must maintain exact locators (`page`, `table`, `section`, `paragraph`) and verifiable archive snapshots.
18. **Historical Versions Must Be Immutable:** Prior published states must be preserved in version history to ensure accountability.

---

## 3. Canonical Record Taxonomy (20 Record Types)

Research Contract v1.1.2 defines 20 explicit conceptual record types. Every entity captured in the research pipeline must be classified under exactly one canonical record kind:

| # | Canonical Code | Public Label | Definition | Minimum Required Evidence |
|---|---|---|---|---|
| 1 | `achievement` | Achievement | High-impact positive milestone or outcome meeting publication criteria | Corroborated Level 1, 2, or 3 primary source citation |
| 2 | `policy` | Policy Framework | Guiding national policy, strategic roadmap, or structured government guideline | Official policy document, gazette, or FEC approval extract |
| 3 | `reform` | Structural Reform | Systemic economic, fiscal, trade, or institutional structural adjustment | Statutory circular, presidential directive, or executive order |
| 4 | `executive_action` | Executive Action | Direct presidential directive, executive order, or official committee determination | Signed Executive Order, Gazette, or State House official release |
| 5 | `legislation` | Legislation | Statute enacted by the National Assembly and assented to by the President | Enacted Act Number, National Assembly Gazette, or Assent Certificate |
| 6 | `regulation` | Regulation | Enforceable subsidiary statutory instrument issued by a regulatory agency | Official Regulatory Instrument Gazette or agency regulatory notice |
| 7 | `programme` | Programme | Structured multi-initiative government operational framework over time | Official programme charter, FEC approval, or budget allocation |
| 8 | `intervention` | Social Intervention | Targeted welfare, relief, credit, or palliative support initiative | Disbursement platform logs, statutory mandate, or agency report |
| 9 | `physical_project` | Physical Project | Tangible capital engineering, transport, energy, building, or civil asset | Contract award notice, site coordinates, or handover certificate |
| 10 | `institutional_reform` | Institutional Reform | Restructuring, digitization, or operational improvement of an MDA | Agency restructuring order, portal deployment, or audit report |
| 11 | `reported_outcome` | Reported Outcome | Measurable empirical result resulting from administration actions | NBS statistical bulletin, CBN economic report, or audited report |
| 12 | `timeline_event` | Timeline Event | Chronological milestone occurrence in a record's lifecycle | Dated primary source or official event transcript |
| 13 | `milestone` | Operational Milestone | Key progress stage within an ongoing capital project or multi-year reform | Contractor progress certificate or official inspection report |
| 14 | `indicator` | Macro Indicator | Statistical time-series definition tracking economic or social health | Official NBS, CBN, DMO, or multilateral indicator metadata |
| 15 | `indicator_observation` | Indicator Observation | Specific dated observation value for a defined indicator | Primary statistical bulletin citation with table/page locator |
| 16 | `source` | Evidence Source | Document, dataset, gazette, or publication establishing evidence | Source URL, document number, publishing body, access date |
| 17 | `correction_revision` | Correction / Revision | Audited post-publication adjustment, correction, or retraction of a claim | Audit log with previous value, new value, reason, and reviewer sign-off |
| 18 | `report` | Research Report | Synthesized thematic or periodic review publication | Versioned Markdown document with full citation bibliography |
| 19 | `dataset` | Public Dataset | Structured tabular data release published for open transparency | Validated export manifest with checksum and schema definition |
| 20 | `methodology` | Research Methodology | Formal research standard, verification protocol, or scoring framework | Approved versioned methodology document in `docs/research/` |

---

## 4. Separation of Classification Dimensions

Research Contract v1.1.2 strictly separates classification into **five independent, non-overlapping namespaces**. Implementation status is a separate delivery-lifecycle field and is not one of these five classification dimensions:

```text
+───────────────────────────────────────────────────────────────────────────────────────────────────+
|                               FIVE INDEPENDENT CLASSIFICATION DIMENSIONS                          |
+─────────────────────────────────┬─────────────────────────────────┬───────────────────────────────+
| 1. DATA VALUE NATURE            | 2. SOURCE ORIGIN                | 3. VERIFICATION STATUS        |
| - actual                        | - government_reported           | - source_confirmed            |
| - provisional                   | - independently_reported        | - cross_referenced            |
| - estimated                     | - mixed                         | - independently_corroborated  |
| - projected                     | - unknown                       | - under_review                |
| - target                        |                                 | - unverified                  |
| - calculated                    |                                 | - disputed                    |
| - modelled                      |                                 | - corrected                   |
|                                 |                                 | - withdrawn                   |
+─────────────────────────────────┴─────────────────────────────────┴───────────────────────────────+
| 4. INTERNAL WORKFLOW STATUS                      │ 5. EXTERNAL PUBLICATION STATUS                 |
| - draft                                          │ - unpublished                                  |
| - research_review                                │ - under_review                                 |
| - evidence_review                                │ - publishable                                  |
| - editorial_review                               │ - publishable_with_qualification               |
| - human_approval                                 │ - published                                    |
| - ready_for_publication                          │ - corrected                                    |
| - rejected                                       │ - withdrawn                                    |
| - archived                                       │ - archived                                     |
+──────────────────────────────────────────────────┴────────────────────────────────────────────────+
```

---

## 5. 21-Stage Implementation Status System

Every record advances through a rigorously defined 21-stage implementation status system:

```text
[proposed] ──> [announced] ──> [approved] ──> [enacted / effective] ──> [funded] ──> [funding_released]
                                                                                            │
[partially_delivered] <── [implementation_ongoing] <── [implementation_planning] <── [procurement]
        │
        └──> [completed] ──> [operational] ──> [outcome_reported] ──> [independently_assessed]
```

---

## 6. Six-Tier Source Hierarchy & Relationship-Bound Source Roles

### 6.1 Six-Tier Source Hierarchy
- **Level 1:** Primary Legal and Administrative Records (Acts, Gazettes, Executive Orders, FEC Approvals).
- **Level 2:** Official Statistical and Administrative Data (NBS Bulletins, CBN Reports, DMO Debt Reports).
- **Level 3:** International & Independent Institutional Evidence (World Bank, IMF, AfDB, UN, NEITI Audits).
- **Level 4:** Credible Mainstream and Specialist Media (Reputable national press, verified investigative reports).
- **Level 5:** Official Statements and Contextual Material (Ministerial briefings, State House press releases).
- **Level 6:** Discovery Leads (**STRICTLY INTERNAL RESEARCH ONLY — NEVER PRIMARY PUBLIC PROOF**).

### 6.2 Relationship-Bound Source Roles
Source roles belong to the **Claim ↔ Source relationship**, not to the source document itself:
`primary`, `official_statistical`, `direct_implementation`, `independent_assessment`, `corroborating`, `supporting`, `contextual`, `contradictory`, `replacement`, `archived`, `discovery_lead`.

### 6.3 Claim-Source Relationship Types
`supports`, `contradicts`, `replaces`, `contextualises`, `discovery_only`.

---

## 7. Hierarchical Sector Taxonomy (3-Level Model)

- **Level 1 (5 Public Navigation Groups):** `economy`, `security`, `infrastructure`, `social_services`, `governance`.
- **Level 2 (15 Canonical Research Sectors):** `economy_fiscal_reforms`, `security_national_stability`, `infrastructure_transportation`, `agriculture_food_security`, `education_human_capital`, `healthcare_public_health`, `social_protection_human_development`, `youth_employment_skills`, `power_energy_natural_resources`, `digital_economy_science_innovation`, `housing_urban_development`, `environment_climate`, `governance_public_service`, `foreign_affairs_international_cooperation`, `culture_tourism_creative_economy`.
- **Level 3:** Granular operational subsectors.

---

## 8. Structured Date & Period Contract

- `date_value`: Nullable ISO calendar date (`YYYY-MM-DD`).
- `date_precision`: Exactly one of `exact_day`, `month`, `quarter`, `year`, `fiscal_year`, `range`, `unknown`.
- `period_start` / `period_end`: Machine-verifiable date bounds (`period_start <= period_end`).

---

## 9. Financial Contract (11 Financial-Value Types)

1. `budget_allocation`
2. `approved_funding`
3. `funding_released`
4. `reported_expenditure`
5. `contract_value`
6. `programme_envelope`
7. `public_investment`
8. `private_investment`
9. `revenue_generated`
10. `revenue_estimate`
11. `savings_estimate`

> [!WARNING]
> **AGGREGATION RESTRICTION:** Aggregating unlike financial categories (e.g. summing approved contracts with actual expenditures) is strictly prohibited.

---

## 10. Beneficiary Contract (6 Beneficiary Stages)

1. `applicant`
2. `registered_participant`
3. `eligible_applicant`
4. `approved_beneficiary`
5. `disbursement_recipient`
6. `active_beneficiary`

---

## 11. Quality Control Framework (6 Macro Gates / 10 Testable Responsibilities)

- **Gate 0 (Task Authorization):** R1 (Task Approval).
- **Gate 1 (Capture):** R2 (Source Identity), R3 (Claim Extraction).
- **Gate 2 (Resolution & Evidence):** R4 (Entity & Taxonomy), R5 (Evidence & Contradictions).
- **Gate 3 (Data Readiness):** R6 (Schema Validation), R9 (Database Readiness).
- **Gate 4 (Editorial & Sign-off):** R7 (Editorial Review), R8 (Human Approval).
- **Gate 5 (Stewardship):** R10 (Post-Publication Review & Freshness).

---

## 12. Human & AI Operating Model & Escalation Policy

### 12.1 Strict Separation of Duties
No single AI agent or researcher may discover, extract, approve, and publish a record. Responsibilities are divided across 11 discrete roles.

### 12.2 Governed Human-Review Escalation Policy
Primary escalation triggers for mandatory human sign-off are:
- **Research Risk Tier:** Any claim rated High or Critical.
- **Sensitivity & Security:** Defense operations, counter-terrorism metrics, intelligence data, and strategic geospatial coordinates.
- **Factual Uncertainty & Contradictions:** Unresolved competing figures or conflicting official reports.
- **Legal & Reputational Exposure:** Active litigations, constitutional questions, or contested statutory authorities.
- **Contextual Materiality:** Politically sensitive causal claims attributing macroeconomic shifts solely to executive action.
- **Financial Materiality Below Numeric Floors:** Human review remains mandatory where a smaller figure is significant because of public importance, programme scale, unusual change, uncertainty, contradiction, reputational risk, legal sensitivity, political sensitivity, or statistical significance.
- **Beneficiary Materiality Below Numeric Floors:** Human review remains mandatory where a smaller beneficiary count is significant for the same qualitative reasons, including vulnerable cohorts or disproportionate programme impact.

**Configurable Escalation Floors:**
Numeric values (e.g. financial allocations >₦100B or beneficiary totals >500k) serve only as automated additional escalation floors. They are owned by the Data Governance Directorate, reviewed semi-annually, and cannot be used to bypass human review for smaller but materially significant or sensitive claims.

---

## 13. Eight-Stage Research Roadmap

```text
Phase 1: Foundation (Contract v1.1.2, Schemas, Vocabulary, Validator Engine)
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

## 14. Implementation-Neutral Architecture Boundary

> [!NOTE]
> **GOVERNANCE BOUNDARY:**
> This research contract defines **WHAT** data must be collected, verified, governed, and protected. Engineering determines **HOW** technologies implement it.
>
> *Current non-canonical engineering target:* React / Vite SPA + Firebase SQL Connect / Cloud SQL PostgreSQL. This target may evolve without altering the core research truth contract. Specific implementation mechanisms (connector queries, custom claims, SDK methods, Cloud SQL infrastructure sizing) are documented in [`docs/engineering/`](../engineering/).
