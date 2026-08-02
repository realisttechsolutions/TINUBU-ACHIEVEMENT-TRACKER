import { AchievementStatus } from "@/components/common/StatusBadge";
import { DataClassification } from "@/components/common/DataClassificationBadge";
import { SourceLevel } from "@/components/common/SourceBadge";

export type AchievementType =
  | "physical-project"
  | "policy-reform"
  | "programme-intervention"
  | "institutional-improvement"
  | "reported-outcome";

export type PublicationStatus =
  | "draft"
  | "under-review"
  | "publishable"
  | "publishable-with-qualification"
  | "rejected"
  | "archived";

export interface AchievementSource {
  name: string;
  url?: string;
  level: SourceLevel;
  publicationDate: string;
  documentTitle?: string;
}

export interface AchievementMilestone {
  date: string;
  title: string;
  status: AchievementStatus;
  description: string;
}

export interface AchievementMetric {
  label: string;
  value: string;
  unit?: string;
}

export interface AchievementRecord {
  id: string;
  slug: string;
  title: string;
  shortTitle?: string;
  achievementType: AchievementType;
  sector: "economy" | "security" | "infrastructure" | "social-services" | "governance";
  summary: string;
  fullDescription: string;
  impactOutcome: string;
  beneficiariesOrScope: string;
  status: AchievementStatus;
  classification: DataClassification;
  publicationStatus: PublicationStatus;
  leadMinistryOrAgency: string;
  geopoliticalZone?: string;
  statesCovered?: string[];
  startDate?: string;
  completionOrCurrentDate?: string;
  verificationDate: string;
  sources: AchievementSource[];
  milestones?: AchievementMilestone[];
  keyMetrics?: AchievementMetric[];
  featuredImage?: string;
  relatedAchievementSlugs?: string[];
}
