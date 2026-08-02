export type DatePrecision =
  | "exact-day"
  | "month"
  | "quarter"
  | "year"
  | "range";

export type PolicyAchievementRelationship =
  | "implements-policy"
  | "enabled-by-policy"
  | "delivery-milestone"
  | "reported-outcome"
  | "supporting-indicator"
  | "related-context";

export type PolicyType =
  | "executive-action"
  | "legislation"
  | "regulation"
  | "fiscal-reform"
  | "monetary-financial-reform"
  | "trade-investment-reform"
  | "administrative-reform"
  | "social-policy"
  | "security-policy"
  | "infrastructure-policy"
  | "national-strategy"
  | "programme-framework"
  | "other";

export type PolicyStatus =
  | "proposed"
  | "announced"
  | "approved"
  | "enacted"
  | "effective"
  | "implementation-planning"
  | "implementation-ongoing"
  | "partially-implemented"
  | "fully-implemented"
  | "outcome-reported"
  | "independently-assessed"
  | "suspended"
  | "superseded"
  | "repealed"
  | "under-review"
  | "archived";

export type PolicyPublicationStatus =
  | "draft"
  | "under-review"
  | "publishable"
  | "publishable-with-qualification"
  | "rejected"
  | "archived";

export type LegalAuthorityType =
  | "constitution"
  | "act"
  | "amendment-act"
  | "executive-order"
  | "regulation"
  | "gazette"
  | "budget"
  | "federal-executive-council"
  | "presidential-directive"
  | "ministerial-directive"
  | "agency-framework"
  | "other";

export interface PolicySource {
  name: string;
  url: string;
  publishedDate?: string;
  documentType?: string;
}

export interface PolicyMilestone {
  date: string;
  datePrecision?: DatePrecision;
  title: string;
  description: string;
  stage: "announcement" | "approval" | "appropriation" | "implementation" | "operational" | "impact";
}

export interface PolicyAchievementLink {
  achievementSlug: string;
  relationship: PolicyAchievementRelationship;
}

export interface PolicyRecord {
  id: string;
  slug: string;
  title: string;
  shortTitle: string;
  policyType: PolicyType;
  status: PolicyStatus;
  publicationStatus: PolicyPublicationStatus;
  legalAuthority: LegalAuthorityType;
  authorityReference?: string; // Gazette number or Act title
  sectorSlug: string;
  leadAgency: string;
  responsibleInstitutions: string[];
  summary: string;
  fullDescription: string;
  backgroundContext: string;
  keyObjectives: string[];
  effectiveDate: string;
  datePrecision?: DatePrecision;
  announcementDate?: string;
  approvalDate?: string;
  statesCovered?: string[];
  geopoliticalScope: string;
  milestones: PolicyMilestone[];
  relatedAchievementSlugs: string[];
  relatedAchievementLinks?: PolicyAchievementLink[];
  reportedOutcomes: string[];
  primarySources: PolicySource[];
}

export interface PolicyFilterOptions {
  type?: PolicyType | "all";
  status?: PolicyStatus | "all";
  sector?: string | "all";
  searchQuery?: string;
}
