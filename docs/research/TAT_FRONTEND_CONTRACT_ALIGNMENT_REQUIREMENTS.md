# Tinubu Achievement Tracker — Frontend Contract Alignment Requirements

**Document Version:** 1.1  
**Effective Date:** 2026-08-15  
**Governing Contract:** Research Contract v1.1  
**Target Engineering Mission:** Engineering Mission E01 (Local Firebase SQL Connect Prototype & Adapters)  

---

## 1. Engineering Boundary & Scope Declaration

> [!IMPORTANT]
> **NO FRONTEND APPLICATION CODE WAS MODIFIED IN THIS RESEARCH MISSION.**  
> In accordance with strict mission boundaries, public frontend components (`src/**`) and prototype view models remain untouched. This document specifies the normative architectural rules and adapter requirements for future engineering implementation during **Engineering Mission E01**.

---

## 2. Decoupling Database Contracts from Frontend View Models

Frontend types in `src/types/*` are **presentation models** designed for user experience, component ergonomics, and route filtering. Database schemas and generated Firebase SQL Connect operation types are **relational data contracts** designed for relational integrity and strict typing.

The system will connect these two layers using **pure, strongly-typed mapping adapters**:

```text
+─────────────────────────────────────────────────────────────+
|               Firebase SQL Connect Schema                   |
+─────────────────────────────────────────────────────────────+
                              │
                              ▼
+─────────────────────────────────────────────────────────────+
|     Connector Operations & Generated SDK TypeScript Types   |
|         (Deterministic, Immutable, snake_case Codes)        |
+─────────────────────────────────────────────────────────────+
                              │
                              ▼
+─────────────────────────────────────────────────────────────+
|               Typed Pure Mapping Adapters                   |
|  - Maps canonical snake_case to UI labels & kebab routes    |
|  - Formats exact decimals & currency symbols                |
|  - Constructs human-readable dates from precision metadata  |
|  - Projects public claim citations from join arrays         |
+─────────────────────────────────────────────────────────────+
                              │
                              ▼
+─────────────────────────────────────────────────────────────+
|           Frontend UI View Models & React Components        |
|                   (`src/types/*`, `src/components/*`)       |
+─────────────────────────────────────────────────────────────+
```

---

## 3. Exhaustive Vocabulary Crosswalks & Adapter Rules

### 3.1 Implementation Status Adapter

| Canonical Database Code (`ImplementationStatusCode`) | Frontend UI Display Label | Badge Variant / Visual Styling | Allowed Transitions & Notes |
|---|---|---|---|
| `proposed` | Proposed | Outline / Neutral | Pre-announcement policy formulation |
| `announced` | Announced | Secondary / Info | Publicly announced by official spokesperson |
| `approved` | Approved | Primary / Blue | Formally approved by FEC or competent board |
| `enacted` | Enacted | Primary / Indigo | Legislation assented into law |
| `effective` | In Force | Success / Cyan | Legal instrument active/commenced |
| `funded` | Funded | Amber / Warning | Budget allocation statutorily committed |
| `funding_released` | Funding Released | Amber / Vibrant | Cash-backed release to implementing MDA |
| `procurement` | In Procurement | Neutral / Muted | Tendering or contract award stage |
| `implementation_planning` | Planning Phase | Neutral / Blue | Engineering or operational planning |
| `implementation_ongoing` | Ongoing Execution | Warning / Yellow | Active construction or execution |
| `partially_delivered` | Partially Delivered | Emerald / Light | Usable section or phase completed |
| `completed` | Completed | Success / Green | Physical completion delivered |
| `operational` | Operational | Success / Bright Green | Commissioned and serving the public |
| `outcome_reported` | Outcome Reported | Purple / Deep | Measurable empirical benefit reported |
| `independently_assessed` | Independently Assessed | Purple / Highlight | External multilateral/audit evaluation |
| `suspended` | Suspended | Destructive / Red | Temporarily halted by executive order |
| `superseded` | Superseded | Muted / Gray | Replaced by subsequent phase or law |
| `repealed` | Repealed | Destructive / Dark | Officially revoked or struck down |
| `under_review` | Under Review | Warning / Outline | Status under factual re-evaluation |
| `archived` | Archived | Muted / Gray | Historical record |
| `withdrawn` | Withdrawn | Destructive / Fill | Retracted from display |

```typescript
// Adapter implementation pattern for Engineering Mission E01:
export function adaptImplementationStatus(code: ImplementationStatusCode): string {
  const map: Record<ImplementationStatusCode, string> = {
    proposed: "Proposed",
    announced: "Announced",
    approved: "Approved",
    enacted: "Enacted",
    effective: "In Force",
    funded: "Funded",
    funding_released: "Funding Released",
    procurement: "In Procurement",
    implementation_planning: "Planning Phase",
    implementation_ongoing: "Ongoing",
    partially_delivered: "Partially Delivered",
    completed: "Completed",
    operational: "Operational",
    outcome_reported: "Outcome Reported",
    independently_assessed: "Independently Assessed",
    suspended: "Suspended",
    superseded: "Superseded",
    repealed: "Repealed",
    under_review: "Under Review",
    archived: "Archived",
    withdrawn: "Withdrawn",
  };
  return map[code] ?? code;
}
```

---

### 3.2 Sector Hierarchy Adapter (15 Canonical Sectors -> 5 Public Navigation Groups)

| Canonical Research Sector (`CanonicalSectorCode`) | Public Navigation Group (`PublicGroupSlug`) | Public Group Label | Icon / Theme |
|---|---|---|---|
| `economy_fiscal_reforms` | `economy` | Economy | TrendingUp / Slate |
| `power_energy_natural_resources` | `economy` | Economy | Zap / Amber |
| `agriculture_food_security` | `economy` | Economy | Wheat / Green |
| `digital_economy_science_innovation` | `economy` | Economy | Cpu / Violet |
| `security_national_stability` | `security` | Security | Shield / Red |
| `infrastructure_transportation` | `infrastructure` | Infrastructure | Building2 / Blue |
| `housing_urban_development` | `infrastructure` | Infrastructure | Home / Indigo |
| `education_human_capital` | `social_services` | Social Services | GraduationCap / Cyan |
| `healthcare_public_health` | `social_services` | Social Services | HeartPulse / Rose |
| `social_protection_human_development` | `social_services` | Social Services | Users / Emerald |
| `youth_employment_skills` | `social_services` | Social Services | Briefcase / Orange |
| `environment_climate` | `social_services` | Social Services | Leaf / Teal |
| `culture_tourism_creative_economy` | `social_services` | Social Services | Palette / Pink |
| `governance_public_service` | `governance` | Governance | Landmark / Slate |
| `foreign_affairs_international_cooperation` | `governance` | Governance | Globe / Sky |

---

### 3.3 Source Level Adapter

| Database `source_level` | Public Visibility | UI Source Tier Label |
|---|:---:|---|
| `LEVEL_1` | **PUBLIC** | Level 1: Primary Legal & Administrative Record |
| `LEVEL_2` | **PUBLIC** | Level 2: Official Statistical Bulletin |
| `LEVEL_3` | **PUBLIC** | Level 3: International & Independent Audit |
| `LEVEL_4` | **PUBLIC** | Level 4: Credible Mainstream Media |
| `LEVEL_5` | **PUBLIC** | Level 5: Official Ministerial Statement |
| `LEVEL_6` | **RESTRICTED (INTERNAL ONLY)** | *Omitted from public UI views; used for research discovery only* |

---

### 3.4 Structured Date Adapter

To prevent false precision, dates must be formatted according to their precision code:

```typescript
export function formatStructuredDate(
  dateValue: string | null,
  precision: DatePrecision,
  label?: string
): string {
  if (label && label.trim() !== "") return label;
  if (!dateValue) return "Date Pending";

  switch (precision) {
    case "exact_day":
      return new Date(dateValue).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    case "month":
      return new Date(dateValue).toLocaleDateString("en-GB", {
        month: "long",
        year: "numeric",
      });
    case "quarter":
    case "fiscal_year":
    case "range":
    case "unknown":
    default:
      return label || dateValue;
  }
}
```

---

## 4. Prototype Static Data Cutover Strategy

Files located in `src/data/**` (such as static lists of achievements or mock metrics) are **non-authoritative UI prototypes**.

### Cutover Plan for Engineering Mission E01:
1. **No Direct Seeding:** Static prototype data in `src/data/**` will **not** be seeded into the database as production records.
2. **Component Abstraction:** React query hooks (e.g. `useAchievements`, `useSectorDashboard`) will be updated to query generated SQL Connect connectors.
3. **Parity Testing:** Before removing static fallback fixtures, UI components will be validated against local SQL Connect emulator results to guarantee zero visual regressions.
4. **Final Deletion:** Once live query hooks are confirmed in E01, mock files in `src/data/**` will be safely deprecated and removed.
