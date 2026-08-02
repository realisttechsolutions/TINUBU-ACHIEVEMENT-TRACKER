# Achievement Record Specification — Tinubu Achievement Tracker V2

This document defines the publication eligibility criteria, schema fields, and source attribution rules for achievement records in the platform database.

---

## 1. Publication Eligibility Rules
An achievement record is eligible for public display in the catalogue when it satisfies:
1. **Title & Summary**: Clear factual title and unambiguous summary.
2. **Achievement Type**: Categorized as `physical-project`, `policy-reform`, `programme-intervention`, `institutional-improvement`, or `reported-outcome`.
3. **Sector & Scope**: Mapped to an active sector and geographic scope.
4. **Implementation Status**: Assigned a controlled status badge (`Operational`, `Implementation Ongoing`, `Completed`, `Outcome Recorded`, etc.).
5. **Level 1–5 Source**: Linked to at least one identifiable official record, gazette, NBS, CBN, or verified international dataset.
6. **Verification Date**: Explicit verification date recorded.

---

## 2. Typed Achievement Field Specification

```ts
export interface AchievementRecord {
  id: string;                         // Unique string identifier
  slug: string;                       // URL slug (e.g. lagos-calabar-coastal-highway)
  title: string;                      // Full descriptive title
  shortTitle?: string;                // Concise title for breadcrumbs/cards
  achievementType: AchievementType;   // Category
  sector: "economy" | "security" | "infrastructure" | "social-services" | "governance";
  summary: string;                    // 1-2 sentence concise summary
  fullDescription: string;            // In-depth narrative
  impactOutcome: string;              // Reported measurable result
  beneficiariesOrScope: string;      // Geographic or demographic coverage
  status: AchievementStatus;          // Controlled achievement status
  classification: DataClassification; // Actual | Provisional | Projected | Target
  publicationStatus: PublicationStatus; // publishable | publishable-with-qualification
  leadMinistryOrAgency: string;       // Responsible ministry/agency
  geopoliticalZone?: string;          // Regional zone
  statesCovered?: string[];           // List of states
  startDate?: string;                 // Implementation start
  completionOrCurrentDate?: string;   // Completion or target date
  verificationDate: string;           // Date of last evidence verification
  sources: AchievementSource[];       // Level 1-5 citations
  milestones?: AchievementMilestone[];// Implementation progression steps
  keyMetrics?: AchievementMetric[];   // Tabular numeric metrics
  featuredImage?: string;             // Asset image URL
  relatedAchievementSlugs?: string[];// Cross-referenced achievement slugs
}
```
