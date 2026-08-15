# Tinubu Achievement Tracker — Frontend V2 Data Adapter Contract

**Contract Version:** 2.0.0  
**Effective Date:** 2026-08-15  
**Governing Research Standard:** `docs/research/TAT_RESEARCH_CONTRACT_V1_1_2.md`  

---

## 1. Architectural Purpose

The Data Adapter Layer (`src/adapters/`) acts as the **decoupled abstraction barrier** between backend data services (e.g. future Firebase SQL Connect / PostgreSQL SDK queries) and UI presentation components.

```text
[ Research Contract v1.1.2 ]
             ↓
[ Future SQL Connect / PostgreSQL Database ]
             ↓
[ Frontend Data Adapter Layer (src/adapters/) ]
             ↓
[ Stable TypeScript View Models ]
             ↓
[ Frontend UI Components & Pages ]
```

---

## 2. Stable View Model Specifications

### 2.1 Achievement View Model (`AchievementViewModel`)
```typescript
export interface AchievementViewModel {
  id: string;
  slug: string;
  title: string;
  summary: string;
  description: string;
  publicNavigationGroup: 'economy' | 'security' | 'infrastructure' | 'social_services' | 'governance';
  sectorId: string;
  sectorName: string;
  subsector?: string;
  recordType: string;
  recordTypeLabel: string;
  status: string;
  statusLabel: string;
  statusCategory: 'planning' | 'execution' | 'delivered' | 'outcome';
  date: string;
  datePrecision: 'exact_day' | 'month' | 'quarter' | 'year' | 'fiscal_year' | 'range' | 'unknown';
  leadMda: string;
  statesCovered: string[];
  geographicScope: string;
  
  // Separated 4-Dimension Classifications
  dataValueNature: 'actual' | 'provisional' | 'estimated' | 'projected' | 'target' | 'calculated' | 'modelled';
  sourceOrigin: 'government_reported' | 'independently_reported' | 'mixed' | 'unknown';
  verificationStatus: 'source_confirmed' | 'cross_referenced' | 'independently_corroborated' | 'under_review' | 'unverified' | 'disputed' | 'corrected' | 'withdrawn';
  publicationStatus: 'unpublished' | 'under_review' | 'publishable' | 'publishable_with_qualification' | 'published' | 'corrected' | 'withdrawn' | 'archived';
  evidenceProfile: string;

  // Quantified Facts
  financialMetrics?: {
    type: string;
    typeLabel: string;
    amount: number;
    currency: string;
    formattedAmount: string;
    period: string;
    aggregationBasis: 'period' | 'cumulative';
  }[];
  
  beneficiaryMetrics?: {
    stage: string;
    stageLabel: string;
    count: number;
    formattedCount: string;
    type: string;
    period: string;
  }[];

  // Evidence Citations & Claims
  evidenceClaims: {
    claimId: string;
    claimText: string;
    claimType: string;
    sources: {
      sourceId: string;
      title: string;
      publisher: string;
      level: 'LEVEL_1' | 'LEVEL_2' | 'LEVEL_3' | 'LEVEL_4' | 'LEVEL_5' | 'LEVEL_6';
      role: string;
      url?: string;
      documentNumber?: string;
      evidenceLocation?: string;
    }[];
  }[];

  isDemo: boolean;
}
```

---

## 3. Mandatory Non-Aggregation Invariants

> [!CRITICAL]
> **FINANCIAL AGGREGATION RULE:**  
> The data adapter must NEVER aggregate incompatible financial value types.  
> It is strictly forbidden to sum `budget_allocation` with `approved_funding`, `funding_released`, or `reported_expenditure`. Financial totals must always declare their exact single financial category and nominal/real qualification.

---

## 4. Synthetic Demo Data Watermarking Policy

Until Research Mission 02 populates validated production data, all mock and demonstration records provided by the data adapter must contain the explicit boolean flag `isDemo: true` and display visual indicator badges:
`[DEMO / SYNTHETIC RECORD — NON-PRODUCTION]` to ensure absolute transparency and prevent fabrication of unverified political claims.
