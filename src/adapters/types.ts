/**
 * Tinubu Achievement Tracker — Frontend V2 Data Adapter View Models
 * Aligned strictly with Research Contract v1.1.2
 */

export type PublicNavigationGroupId = 'economy' | 'security' | 'infrastructure' | 'social_services' | 'governance';

export type HierarchyLevel = 'LEVEL_1_GROUP' | 'LEVEL_2_SECTOR' | 'LEVEL_3_SUBSECTOR';

export type SourceHierarchyLevel = 'LEVEL_1' | 'LEVEL_2' | 'LEVEL_3' | 'LEVEL_4' | 'LEVEL_5' | 'LEVEL_6';

export type DataValueNature = 'actual' | 'provisional' | 'estimated' | 'projected' | 'target' | 'calculated' | 'modelled';

export type SourceOrigin = 'government_reported' | 'independently_reported' | 'mixed' | 'unknown';

export type VerificationStatus = 'source_confirmed' | 'cross_referenced' | 'independently_corroborated' | 'under_review' | 'unverified' | 'disputed' | 'corrected' | 'withdrawn';

export type PublicationStatus = 'unpublished' | 'under_review' | 'publishable' | 'publishable_with_qualification' | 'published' | 'corrected' | 'withdrawn' | 'archived';

export type DatePrecision = 'exact_day' | 'month' | 'quarter' | 'year' | 'fiscal_year' | 'range' | 'unknown';

export type GeopoliticalZone = 
  | 'North Central'
  | 'North East'
  | 'North West'
  | 'South East'
  | 'South South'
  | 'South West'
  | 'National';

export interface FinancialMetricViewModel {
  financialType: string;
  financialTypeLabel: string;
  /** Exact PostgreSQL numeric(24,4) text; never coerce to a JS number. */
  amount: string;
  currency: string;
  formattedAmount: string;
  reportingPeriod: string;
  aggregationBasis: 'period' | 'cumulative';
  nominalOrReal: 'nominal' | 'real';
  sourceInstitution: string;
}

export interface BeneficiaryMetricViewModel {
  stage: string;
  stageLabel: string;
  count: number;
  formattedCount: string;
  beneficiaryType: string;
  countBasis: 'cumulative_to_date' | 'period_specific' | 'target_capacity' | 'annual_average';
  reportingPeriod: string;
  doubleCountingNote?: string;
}

export interface SourceCitationViewModel {
  sourceId: string;
  title: string;
  displayTitle?: string;
  publisher: string;
  sourceLevel: SourceHierarchyLevel;
  sourceRole: string;
  sourceRoleLabel: string;
  sourceType: string;
  url?: string;
  documentNumber?: string;
  evidenceLocation?: string;
  publicationDate?: string;
  summary?: string;
}

export interface AtomicClaimViewModel {
  claimId: string;
  claimText: string;
  publicClaimSummary?: string;
  claimType: string;
  sources: SourceCitationViewModel[];
  dataValueNature: DataValueNature;
  sourceOrigin: SourceOrigin;
  verificationStatus: VerificationStatus;
}

export interface AchievementViewModel {
  id: string;
  slug: string;
  title: string;
  summary: string;
  description: string;
  publicNavigationGroup: PublicNavigationGroupId;
  publicNavigationGroupLabel: string;
  sectorId: string;
  sectorName: string;
  subsector?: string;
  recordType: string;
  recordTypeLabel: string;
  status: string;
  statusLabel: string;
  statusCategory: 'planning' | 'execution' | 'delivered' | 'outcome';
  date: string;
  datePrecision: DatePrecision;
  leadMda: string;
  statesCovered: string[];
  geographicScope: string;
  featured: boolean;

  // 4 Separated Classifications
  dataValueNature: DataValueNature;
  sourceOrigin: SourceOrigin;
  verificationStatus: VerificationStatus;
  publicationStatus: PublicationStatus;
  evidenceProfile: string;
  evidenceProfileLabel: string;

  // Quantified Facts
  financialMetrics?: FinancialMetricViewModel[];
  beneficiaryMetrics?: BeneficiaryMetricViewModel[];
  
  // Progress
  progressPercentage?: number;
  contractor?: string;

  // Citations & Claims
  evidenceClaims: AtomicClaimViewModel[];
  contradictionNotes?: string;
  limitations?: string;
  relatedProjectSlugs?: string[];
  relatedPolicySlugs?: string[];

  // Non-production watermark
  isDemo: boolean;
}

export interface SectorViewModel {
  id: string;
  sectorId: string;
  name: string;
  publicLabel: string;
  slug: string;
  parentPublicGroup: PublicNavigationGroupId;
  parentPublicGroupLabel: string;
  hierarchyLevel: HierarchyLevel;
  iconName: string;
  summary: string;
  description: string;
  keyObjectives: string[];
  leadInstitutions: string[];
  achievementCount: number;
  projectCount: number;
  policyCount: number;
  highlightStat: {
    label: string;
    value: string;
    subtext: string;
  };
  featuredAchievementSlug?: string;
  isDemo: boolean;
}

export interface ProjectViewModel {
  id: string;
  slug: string;
  title: string;
  summary: string;
  projectType: string;
  projectTypeLabel: string;
  sectorId: string;
  sectorName: string;
  executingAgency: string;
  status: string;
  statusLabel: string;
  progressPercentage: number;
  contractor?: string;
  statesCovered: string[];
  startDate: string;
  completionOrCurrentDate: string;
  datePrecision: DatePrecision;
  contractValue?: string;
  disbursedValue?: string;
  evidenceClaims: AtomicClaimViewModel[];
  isDemo: boolean;
}

export interface PolicyViewModel {
  id: string;
  slug: string;
  title: string;
  summary: string;
  policyType: string;
  policyTypeLabel: string;
  sectorId: string;
  sectorName: string;
  leadMinistry: string;
  status: string;
  statusLabel: string;
  approvalDate: string;
  effectiveDate?: string;
  gazetteNumber?: string;
  datePrecision: DatePrecision;
  evidenceClaims: AtomicClaimViewModel[];
  isDemo: boolean;
}

export interface ProgrammeViewModel {
  id: string;
  slug: string;
  title: string;
  summary: string;
  programmeType: string;
  programmeTypeLabel: string;
  sectorId: string;
  sectorName: string;
  coordinatingAgency: string;
  status: string;
  statusLabel: string;
  launchDate: string;
  datePrecision: DatePrecision;
  targetBeneficiaryType: string;
  targetBeneficiaryTypeLabel: string;
  beneficiaryCountFormatted?: string;
  statesCovered: string[];
  evidenceClaims: AtomicClaimViewModel[];
  isDemo: boolean;
}

export interface TimelineEventViewModel {
  id: string;
  recordId: string;
  title: string;
  summary: string;
  eventType: string;
  eventTypeLabel: string;
  eventDate: string;
  datePrecision: DatePrecision;
  sectorId: string;
  sectorName: string;
  leadActor: string;
  sourceCitation?: SourceCitationViewModel;
  isDemo: boolean;
}

export interface StateProfileViewModel {
  slug: string;
  name: string;
  code: string;
  capital: string;
  geopoliticalZone: GeopoliticalZone;
  projectCount: number;
  programmeCount: number;
  achievementCount: number;
  highlightProject: string;
  sectorsActive: string[];
  totalFederalInvestmentFormatted?: string;
  isDemo: boolean;
}

export interface DatasetResourceViewModel {
  id: string;
  title: string;
  description: string;
  category: 'core' | 'sector' | 'state' | 'timeline' | 'evidence' | 'report';
  recordCount: number;
  periodCovered: string;
  lastUpdated: string;
  fileFormats: ('CSV' | 'JSON' | 'PDF' | 'TXT')[];
  downloadUrlCsv?: string;
  downloadUrlJson?: string;
  downloadUrlPdf?: string;
  isDemo: boolean;
}

export interface GlobalSearchResultItem {
  id: string;
  title: string;
  subtitle: string;
  category: 'Achievements' | 'Projects' | 'Policies' | 'Programmes' | 'Sectors' | 'States' | 'Timeline' | 'Sources';
  url: string;
  badgeText?: string;
  badgeVariant?: 'emerald' | 'gold' | 'navy' | 'slate';
}
