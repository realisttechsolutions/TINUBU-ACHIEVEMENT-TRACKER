# Canonical Taxonomies & Controlled Vocabularies — Tinubu Achievement Tracker V2

> [!WARNING]
> **STATUS: SUPERSEDED BY RESEARCH CONTRACT V1.1**  
> This legacy document has been formally superseded by [`TAT_RESEARCH_CONTRACT_V1_1.md`](./TAT_RESEARCH_CONTRACT_V1_1.md) and [`canonical-vocabulary.v1.1.json`](../../research/schemas/canonical-vocabulary.v1.1.json). It is retained for historical audit context only. Do not consume this document for active schema validation or database design.

This document defines the historical pre-consolidation classification schemes across the research pipeline.

---

## 1. Sectors Taxonomy

The platform categorizes all government activities, achievements, policies, and indicators into 5 primary sectors:

| Sector Slug | Display Name | Scope & Description | Lead MDAs |
| :--- | :--- | :--- | :--- |
| `economy` | Economic Reforms | Macroeconomic stabilization, fiscal policy, monetary policy, revenue mobilization, trade, investment, tax reform, digital economy. | Ministry of Finance, Central Bank of Nigeria (CBN), Ministry of Budget & Economic Planning, FIRS, Ministry of Industry, Trade & Investment |
| `security` | Security Progress | National security, defense operations, counter-insurgency, maritime security (Deep Blue), police reform, border management, intelligence integration. | Ministry of Defence, Defence Headquarters, Nigeria Police Force, Office of the National Security Adviser (ONSA), Nigeria Customs Service |
| `infrastructure` | Infrastructure & Physical Assets | Roads, bridges, railways, ports, airports, power grid, renewable energy, housing, water resources, digital infrastructure. | Ministry of Works, Ministry of Transportation, Ministry of Power, Ministry of Housing & Urban Development, Ministry of Aviation, ICRC |
| `social-services` | Social Services & Human Capital | Healthcare, education, student loans, social investment, poverty alleviation, youth empowerment, sports, humanitarian affairs. | Ministry of Health & Social Welfare, Ministry of Education, NELFUND, Ministry of Humanitarian Affairs, Ministry of Youth Development |
| `governance` | Governance & Institutional Reform | Civil service reform, anti-corruption, judicial reforms, electoral integrity, intergovernmental relations, public transparency, ease of doing business. | Office of the Secretary to the Government of the Federation (OSGF), Ministry of Justice, EFCC, ICPC, PEBEC, Bureau of Public Service Reforms |

---

## 2. Achievement Types Taxonomy

Every achievement record must be categorized into exactly one of five structural types:

| Type Slug | Display Name | Definition | Canonical Example |
| :--- | :--- | :--- | :--- |
| `physical-project` | Physical Capital Project | A tangible, built infrastructure asset, facility, road, bridge, or energy plant. | 700km Lagos-Calabar Coastal Highway |
| `policy-reform` | Policy & Legal Reform | An executive order, legislative enactment, tax regulation, or structural policy directive. | Fuel Subsidy Removal & FX Market Unification |
| `programme-intervention` | Programme & Social Intervention | A structured government scheme, fund, credit facility, or empowerment initiative. | NELFUND Student Loan Scheme |
| `institutional-improvement` | Institutional & Service Reform | Internal agency restructuring, digitisation of public services, operational efficiency gain, or anti-corruption system. | Mining Cadastre Office Digital Portal Overhaul |
| `reported-outcome` | Verified Outcome Milestone | A statistically measured national benchmark or empirical metric result. | Inflation Rate Deceleration / Revenue Goal Attainment |

---

## 3. Implementation & Publication Statuses

### 3.1 Implementation Status (Public Display Badges)
Controlled values representing execution progress:

- `Operational`: Asset or policy is fully live, commissioned, and functioning.
- `Completed`: Work finished according to contract specifications.
- `Implementation Ongoing`: Active construction, rollout, or implementation in progress.
- `Outcome Recorded`: Measured result verified by empirical dataset.
- `Approved`: Formal approval granted (e.g., FEC approval) awaiting execution.
- `Planning Phase`: Pre-procurement, feasibility study, or design phase.
- `Under Review`: Status under verification or active research review.

### 3.2 Publication Status (Workflow Lifecycle)

```
[ draft ] ──> [ under-review ] ──┬──> [ publishable ]
                                 ├──> [ publishable-with-qualification ]
                                 ├──> [ rejected ]
                                 └──> [ archived ]
```

- **`draft`**: Raw record created by researcher; incomplete evidence or missing fields.
- **`under-review`**: Submitted for senior researcher/editor verification and source check.
- **`publishable`**: Fully verified; meets Level 1-3 source requirements; clean data.
- **`publishable-with-qualification`**: Verified facts but carries contextual caveats, caveats on timelines, or minor source discrepancies.
- **`rejected`**: Fails verification standards, unverified claims, or duplicate.
- **`archived`**: Superseded by newer data, revoked policy, or historical record.

---

## 4. Data Classification Taxonomy

Distinguishes verified empirical reality from targets or estimates:

| Classification | Meaning | Public Badge Rules |
| :--- | :--- | :--- |
| `Actual` | Verified historical event, physical completion, or measured empirical data point. | Displayed with solid green verification indicator. |
| `Provisional` | Official preliminary statistical report subject to routine revision (e.g., NBS preliminary GDP). | Displayed with qualified warning note. |
| `Projected` | Forward-looking estimate derived from economic models or engineering schedules. | Labeled explicitly as "Projected". |
| `Target` | Explicit policy goal set by Presidential directive or National Development Plan. | Labeled explicitly as "Policy Target". |

---

## 5. Source Evidence Hierarchy (Levels 1–5)

To maintain presidential trust, every data point requires source attribution adhering to this strict 5-tier model:

| Level | Level Name | Acceptable Primary Sources | Weight / Trust Rating |
| :--- | :--- | :--- | :--- |
| **Level 1** | Primary Gazette & Executive Orders | Official Gazette of the Federal Republic of Nigeria, Signed Acts of National Assembly, Presidential Executive Orders, FEC Official Press Statements. | Highest (Authoritative Statutory) |
| **Level 2** | Institutional & Statutory MDA Data | National Bureau of Statistics (NBS) Bulletins, Central Bank of Nigeria (CBN) Reports, Debt Management Office (DMO), Budget Office, Ministry Annual Reports. | High (Empirical Statutory) |
| **Level 3** | Multilateral & International Organizations | World Bank Group, International Monetary Fund (IMF), African Development Bank (AfDB), OPEC, United Nations (UNCTAD, UNDP). | High (Verified External) |
| **Level 4** | Verified Independent Media & Investigations | Premium Times, Channels TV, Arise News, Reuters, Bloomberg, Financial Times, Daily Trust, Punch. | Medium (Secondary Empirical) |
| **Level 5** | Think Tanks & Academic Research | Nigerian Economic Summit Group (NESG), Centre for the Study of Economies of Africa (CSEA), Lagos Chamber of Commerce (LCCI), Academic Journals. | Supporting Contextual |

---

## 6. Geographic Taxonomies

### 6.1 Geopolitical Zones
- `North-Central` (Benue, Kogi, Kwara, Nasarawa, Niger, Plateau, FCT)
- `North-East` (Adamawa, Bauchi, Borno, Gombe, Taraba, Yobe)
- `North-West` (Jigawa, Kaduna, Kano, Katsina, Kebbi, Sokoto, Zamfara)
- `South-East` (Abia, Anambra, Ebonyi, Enugu, Imo)
- `South-South` (Akwa Ibom, Bayelsa, Cross River, Delta, Edo, Rivers)
- `South-West` (Ekiti, Lagos, Ogun, Ondo, Osun, Oyo)

### 6.2 Geographic Scope Types
- `national`: Applies to all 36 states + FCT.
- `multi-state`: Covers specified list of 2+ states.
- `geopolitical-zone`: Regionally bounded to one or more zones.
- `state`: Targeted to a single state.
- `point`: Specific physical site or coordinate location.
- `corridor`: Linear infrastructure route spanning coordinates or cities.
- `international`: Bilateral or international scope.

---

## 7. Policy Types & Legal Authorities

### 7.1 Policy Types
`executive-action`, `legislation`, `regulation`, `fiscal-reform`, `monetary-financial-reform`, `trade-investment-reform`, `administrative-reform`, `social-policy`, `security-policy`, `infrastructure-policy`, `national-strategy`, `programme-framework`.

### 7.2 Legal Authorities
`constitution`, `act`, `amendment-act`, `executive-order`, `regulation`, `gazette`, `budget`, `federal-executive-council`, `presidential-directive`, `ministerial-directive`, `agency-framework`.

---

## 8. Policy & Achievement Implementation Stages

1. `announcement`: Proclamation / Presidential Speech / Policy Announcement.
2. `approval`: FEC Approval / Legislative Enactment / Executive Order signed.
3. `appropriation`: Budget Appropriation / Fund Allocation / Counterpart Funding.
4. `implementation`: Construction / Physical Work / Disbursement Ongoing.
5. `operational`: Commissioned / Service Live / Operational.
6. `impact`: Measured Economic / Social Outcome Verified.

---

## 9. Editorial Mandate, Prioritisation & Public Disclosure Standards

### 9.1 Platform Purpose & Positive Editorial Scope
The **Tinubu Achievement Tracker (TAT)** has an explicitly positive editorial scope. Its purpose is to identify, organise, verify, document, and communicate positive policies, reforms, programmes, projects, milestones, and measurable outcomes associated with the Tinubu administration.

Research prioritisation must concentrate on records demonstrating:
- Positive government action and physical delivery.
- Policy reform progress and implementation milestones.
- Measurable economic, social, or security benefits.
- Institutional improvement, anti-corruption, or service digitisation gains.
- Independently recognised statistical advancement.

### 9.2 Mandatory Factual & Truth Standards (The 12 Inviolable Rules)
Positive editorial selection determines *which subjects receive research attention*. It does **NOT** weaken the standard of truth required for published claims. All research workflows must enforce these 12 rules:

1. **Zero Fabrication**: Do not fabricate, inflate, or manipulate any claim or statistical metric.
2. **Stage Boundary Enforcement**: Do not present a policy announcement or speech as completed delivery.
3. **Financial Separation**: Do not present approval as funding, funding as release, or release as expenditure.
4. **Classification Discipline**: Do not present a target, estimate, or projection as an actual outcome.
5. **Beneficiary Precision**: Do not present applicants, registrations, or approvals as active beneficiaries or disbursement recipients.
6. **Context Preservation**: Do not remove dates, reporting periods, baselines, definitions, or limitations when their removal would materially change the meaning of a claim.
7. **Independent Verification Integrity**: Do not describe government-reported outcomes as independently verified unless genuinely independent evidence exists (Level 3-4 sources).
8. **Single-Source Circularity Check**: Do not count repeated media reproductions of one official statement as multiple independent confirmations.
9. **Internal Reconciliation**: Preserve contradictions, corrections, and revised figures internally, even when they are not headline content.
10. **Traceable Evidence Chain**: Every published achievement must retain a traceable path to its supporting evidence (Level 1–5 source hierarchy).
11. **Proportional Public Language**: Public language should be confident, accessible, and achievement-focused, but never broader than the supporting evidence.
12. **Transparent Institutional Disclosure**: The platform must transparently disclose its achievements-focused editorial purpose and must never falsely present itself as an independent audit organisation.
