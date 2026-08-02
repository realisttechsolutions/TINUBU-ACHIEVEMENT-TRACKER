export type DatePrecision =
  | "exact-day"
  | "month"
  | "quarter"
  | "year"
  | "range";

export type InterventionStage =
  | "announcement"       // 1. Proclamation / Speech / Policy Announcement
  | "approval"           // 2. FEC Approval / Legislative Enactment / Executive Order
  | "appropriation"      // 3. Budget Appropriation / Fund Allocation / Counterpart Funding
  | "implementation"     // 4. Construction / Physical Work / Disbursement Ongoing
  | "operational"        // 5. Commissioned / Service Live / Operational
  | "impact";            // 6. Measured Economic / Social Outcome Verified

export type TimelineCategory =
  | "Economic Reform"
  | "Energy & Power"
  | "Infrastructure"
  | "Education"
  | "Healthcare"
  | "Security"
  | "Agriculture"
  | "Fiscal & Monetary"
  | "Governance";

export interface TimelineSource {
  name: string;
  url: string;
  publishedDate?: string;
  documentType?: string;
}

export interface TimelineEventRecord {
  id: string;
  slug: string;
  date: string; // YYYY-MM-DD or readable text e.g. "May 29, 2023"
  datePrecision?: DatePrecision;
  year: number;
  quarter: "Q1" | "Q2" | "Q3" | "Q4";
  title: string;
  stage: InterventionStage;
  category: TimelineCategory;
  sectorSlug: string;
  summary: string;
  details: string;
  expectedOrMeasuredImpact?: string;
  leadAgency: string;
  statesCovered?: string[];
  geopoliticalZone?: string;
  relatedAchievementSlug?: string;
  primarySources: TimelineSource[];
  verificationStatus: "Verified" | "Under Audit" | "Source Verified";
}

export interface TimelineStageSummary {
  stage: InterventionStage;
  label: string;
  count: number;
  color: string;
  description: string;
}

export interface TimelineFilterOptions {
  stage?: InterventionStage | "all";
  category?: TimelineCategory | "all";
  year?: number | "all";
  searchQuery?: string;
}
