import { SourceLevel } from "@/components/common/SourceBadge";
import { DataClassification } from "@/components/common/DataClassificationBadge";

export type SectorPublicationStatus =
  | "active"
  | "active-with-qualification"
  | "developing"
  | "internal"
  | "archived";

export type SectorEvidenceProfile =
  | "primarily-official"
  | "official-and-independent"
  | "limited-independent-evidence"
  | "under-review";

export interface SectorIndicator {
  id: string;
  name: string;
  value: string;
  unit?: string;
  previousValue?: string;
  change?: string;
  trend?: "up" | "down" | "neutral";
  classification: DataClassification;
  description?: string;
  sourceName: string;
  sourceUrl?: string;
  sourceLevel: SourceLevel;
  lastUpdated: string;
  chartData?: Array<{ name: string; value: number }>;
}

export interface SectorPolicy {
  id: string;
  title: string;
  description: string;
  status: "Completed" | "Implementation Ongoing" | "Approved" | "Under Review";
  effectiveDate: string;
  leadAgency: string;
  impactSummary: string;
}

export interface SectorProject {
  id: string;
  title: string;
  description: string;
  locationScope: string;
  status: "Completed" | "Implementation Ongoing" | "Planning Phase" | "Operational";
  progressPercentage?: number;
  budgetOrValue?: string;
  leadAgency: string;
}

export interface SectorUpdate {
  id: string;
  date: string;
  title: string;
  summary: string;
  category: string;
  sourceName: string;
  sourceUrl?: string;
}

export interface SectorInstitution {
  name: string;
  role: string;
  officialWebsite?: string;
}

export interface SectorSource {
  name: string;
  url?: string;
  level: SourceLevel;
  publicationDate: string;
  documentTitle?: string;
}

export interface SectorRecord {
  id?: string;
  name?: string;
  slug: string;
  title: string;
  shortTitle: string;
  publicationStatus: SectorPublicationStatus;
  evidenceProfile: SectorEvidenceProfile;
  summary: string;
  fullDescription: string;
  iconName: string;
  colorTheme: string; // Tailwind color token or hex
  heroImage?: string;
  leadMinistries: SectorInstitution[];
  indicators: SectorIndicator[];
  keyPolicies: SectorPolicy[];
  majorProjects: SectorProject[];
  updates: SectorUpdate[];
  sources: SectorSource[];
  qualificationNote?: string;
  relatedSectorSlugs?: string[];
  achievementFilterCategory?: string; // mapped sector in achievementsData
}
