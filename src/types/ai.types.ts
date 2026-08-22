export type QueryIntent =
  | 'ENTITY_LOOKUP'
  | 'GEOGRAPHIC_QUERY'
  | 'SECTOR_QUERY'
  | 'FINANCIAL_QUERY'
  | 'BENEFICIARY_QUERY'
  | 'TIMELINE_QUERY'
  | 'STATUS_QUERY'
  | 'COMPARISON_QUERY'
  | 'EVIDENCE_QUERY'
  | 'SOURCE_QUERY'
  | 'PROGRAMME_QUERY'
  | 'PROJECT_QUERY'
  | 'POLICY_QUERY'
  | 'ACHIEVEMENT_QUERY'
  | 'SUMMARY_QUERY'
  | 'MULTI_FILTER_QUERY';

export type AnswerabilityStatus =
  | 'ANSWERABLE'
  | 'PARTIALLY_ANSWERABLE'
  | 'INSUFFICIENT_EVIDENCE'
  | 'AMBIGUOUS_QUERY';

export type GeographicScopeLevel =
  | 'STATE_SPECIFIC'
  | 'FCT_SPECIFIC'
  | 'PROJECT_CORRIDOR'
  | 'MULTI_STATE'
  | 'REGIONAL_ZONAL'
  | 'NATIONWIDE';

export interface QueryConstraints {
  state?: string;
  stateCode?: string;
  isFCT?: boolean;
  sector?: string;
  sectorCode?: string;
  recordType?: 'achievement' | 'policy' | 'physical_project' | 'programme';
  year?: number;
  yearComparison?: number[];
  dateStart?: string;
  dateEnd?: string;
  statusConstraint?: 'completed' | 'operational' | 'in_progress' | 'enacted' | 'approved';
  entityName?: string;
  entityId?: string;
  financialType?: string;
  beneficiaryStage?: string;
  primaryOnly?: boolean;
  officialOnly?: boolean;
  comparisonTargets?: {
    type: 'state' | 'sector' | 'record_type' | 'year' | 'entity';
    first: string;
    second: string;
  };
  keywords?: string[];
}

export interface PTATAIRecord {
  id: string;
  externalId: string;
  slug: string;
  recordType: 'achievement' | 'policy' | 'physical_project' | 'programme';
  title: string;
  summary: string;
  implementationStatus: string;
  workflowStatus: string;
  publicationStatus: string;
  verificationStatus: string;
  evidenceProfile: string;
  riskLevel: string;
  isPublic: boolean;
  sectors: Array<{ code: string; label: string }>;
  institutions: Array<{ code: string; name: string }>;
  geographies: Array<{
    code: string;
    name: string;
    scope: GeographicScopeLevel;
    role?: string;
  }>;
  geographicScope: GeographicScopeLevel;
  publishedAt?: string;
  citizenImpactSummary?: string;
  route: string;
  rankScore?: number;
}

export interface PTATAISource {
  sourceId: string;
  title: string;
  displayTitle?: string;
  publisher: string;
  url?: string;
  publicationDate?: string;
  sourceLevel: 'LEVEL_1' | 'LEVEL_2' | 'LEVEL_3' | string;
  sourceType: string;
  isPrimaryOfficial: boolean;
  evidenceLocation?: string;
  evidenceSummary?: string;
}

export interface PTATAIClaim {
  claimId: string;
  recordId: string;
  recordExternalId: string;
  claimText: string;
  publicClaimSummary?: string;
  claimType: string;
  effectiveDate?: string;
  dataValueNature?: string;
  sourceOrigin?: string;
  verificationStatus?: string;
  sources: PTATAISource[];
}

export interface PTATAIFinancial {
  financialId: string;
  recordId: string;
  recordExternalId: string;
  claimId?: string;
  amountExact: string;
  formattedAmount: string;
  currencyCode: string;
  financialType: string;
  financialTypeLabel: string;
  reportingPeriod?: string;
  periodStart?: string;
  periodEnd?: string;
  aggregationBasis?: string;
  nominalOrReal?: string;
}

export interface PTATAIBeneficiary {
  beneficiaryId: string;
  recordId: string;
  recordExternalId: string;
  claimId?: string;
  countValue: number;
  formattedCount: string;
  unit: string;
  beneficiaryType: string;
  beneficiaryStage: string;
  beneficiaryStageLabel: string;
  countBasis?: string;
  cumulative: boolean;
  reportingPeriod?: string;
}

export type PTATAIFinancialRecord = PTATAIFinancial;
export type PTATAIBeneficiaryRecord = PTATAIBeneficiary;

export interface PTATAITimelineEvent {
  eventId: string;
  recordId: string;
  recordExternalId: string;
  eventType: string;
  eventTitle: string;
  eventDate: string;
  provisional: boolean;
}

export interface PTATAIGeography {
  recordId: string;
  recordExternalId: string;
  stateName: string;
  stateCode: string;
  scope: GeographicScopeLevel;
  facilityOrSite?: string;
}

export interface PTATAICitation {
  citationId: string;
  claimId: string;
  claimText: string;
  sourceId: string;
  sourceTitle: string;
  publisher: string;
  url?: string;
  sourceLevel: string;
  recordExternalId: string;
  recordTitle: string;
  recordUrl: string;
}

export interface PTATAIRecordLink {
  externalId?: string;
  slug?: string;
  title: string;
  recordType: string;
  route: string;
  primaryState?: string;
  sectors?: string[];
  stateNames?: string[];
  implementationStatus?: string;
}

export interface PTATAIConfidence {
  overallScore: number; // 0.0 to 1.0
  entityMatchScore: number;
  constraintMatchScore: number;
  evidenceCoverageScore: number;
  sourceAuthenticityScore: number;
  geographicPrecisionScore: number;
  temporalPrecisionScore: number;
  confidenceTier: 'HIGH' | 'MEDIUM' | 'LOW' | 'NONE';
  explanation: string;
}

export interface PTATAIComparisonBundle {
  comparisonType: 'state' | 'sector' | 'record_type' | 'year' | 'entity';
  firstSubject: {
    name: string;
    matchedRecords: PTATAIRecord[];
    totalRecords: number;
    financialSummary: { totalAmountNGN: string; formattedTotal: string };
    beneficiarySummary: { totalBeneficiaries: number };
  };
  secondSubject: {
    name: string;
    matchedRecords: PTATAIRecord[];
    totalRecords: number;
    financialSummary: { totalAmountNGN: string; formattedTotal: string };
    beneficiarySummary: { totalBeneficiaries: number };
  };
  comparisonDimensions: string[];
}

export interface PTATAIContext {
  query: string;
  parsedIntent: QueryIntent;
  parsedConstraints: QueryConstraints;
  matchedEntities: string[];
  records: PTATAIRecord[];
  claims: PTATAIClaim[];
  sources: PTATAISource[];
  financialRecords: PTATAIFinancial[];
  beneficiaryRecords: PTATAIBeneficiary[];
  timelineEvents: PTATAITimelineEvent[];
  geographies: PTATAIGeography[];
  citationMap: PTATAICitation[];
  recordLinks: PTATAIRecordLink[];
  retrievalConfidence: PTATAIConfidence;
  answerability: AnswerabilityStatus;
  answerabilityReason: string;
  comparison?: PTATAIComparisonBundle;
  diagnostics: {
    retrievalLatencyMs: number;
    recordsScanned: number;
    claimsScanned: number;
    sourcesScanned: number;
    dataTimestamp: string;
  };
}

export interface RetrievalOptions {
  limitRecords?: number;
  includeNationwideWithState?: boolean;
  primarySourcesOnly?: boolean;
  minConfidenceThreshold?: number;
}

export interface PTATVertexConfig {
  project: string;
  location: string;
  model: string;
  temperature?: number;
  maxOutputTokens?: number;
  thinkingLevel?: 'MINIMAL' | 'LOW' | 'MEDIUM' | 'HIGH';
  thinkingBudget?: number;
  timeoutMs?: number;
  maxRetries?: number;
}

export interface PTATEvidencePacket {
  query: string;
  intent: QueryIntent;
  answerability: AnswerabilityStatus;
  entities: string[];
  records: Array<{
    recordId: string;
    slug: string;
    recordType: string;
    title: string;
    summary: string;
    implementationStatus: string;
    verificationStatus: string;
    geographicScope: string;
    geographies: Array<{ name: string; code: string; scope: string }>;
    sectors: Array<{ code: string; label: string }>;
    institutions: Array<{ code: string; name: string }>;
  }>;
  claims: Array<{
    claimId: string;
    recordId: string;
    recordSlug: string;
    claimText: string;
    claimType: string;
    dataValueNature?: string;
    verificationStatus?: string;
    sources: Array<{
      sourceId: string;
      title: string;
      publisher: string;
      url?: string;
      sourceLevel: string;
      isPrimaryOfficial: boolean;
      evidenceSummary?: string;
    }>;
  }>;
  financials: Array<{
    financialId: string;
    recordSlug: string;
    financialType: string;
    financialTypeLabel: string;
    amountExact: string;
    formattedAmount: string;
    currencyCode: string;
    reportingPeriod?: string;
  }>;
  beneficiaries: Array<{
    beneficiaryId: string;
    recordSlug: string;
    beneficiaryType: string;
    beneficiaryStage: string;
    beneficiaryStageLabel: string;
    countValue: number;
    formattedCount: string;
    unit: string;
    cumulative: boolean;
    reportingPeriod?: string;
  }>;
  comparison?: {
    firstSubjectName: string;
    firstSubjectRecords: string[];
    secondSubjectName: string;
    secondSubjectRecords: string[];
    dimensions: string[];
  };
}

export interface PTATModelCitation {
  claimId: string;
  sourceId: string;
  recordSlug: string;
  sourceTitle?: string;
  publisher?: string;
  url?: string;
  sourceLevel?: string;
  quoteOrSummary?: string;
  isValidated: boolean;
}

export interface PTATModelMetadata {
  model: string;
  location: string;
  apiVersion?: string;
  retrievalLatencyMs: number;
  modelLatencyMs: number;
  totalLatencyMs: number;
  inputTokens?: number;
  outputTokens?: number;
  totalTokens?: number;
  thoughtTokens?: number;
  retriesAttempted: number;
}

export interface CitationValidationResult {
  valid: boolean;
  totalCitations: number;
  validCitations: number;
  rejectedCitations: number;
  rejectionReasons: string[];
  validatedCitations: PTATModelCitation[];
}

export interface PTATGroundedAnswer {
  query: string;
  intent: QueryIntent;
  answerability: AnswerabilityStatus;
  answer: string;
  answerText?: string;
  summaryBulletPoints?: string[];
  citations: PTATModelCitation[];
  recordLinks: PTATAIRecordLink[];
  limitations: string[];
  confidence: PTATAIConfidence;
  retrievalConfidence?: PTATAIConfidence;
  comparisonSummary?: {
    firstSubject: string;
    secondSubject: string;
    keyDifferences: string[];
  };
  financialSummary?: PTATAIFinancial[];
  beneficiarySummary?: PTATAIBeneficiary[];
  constraints?: QueryConstraints;
  diagnostics?: {
    retrievalLatencyMs: number;
    recordsScanned: number;
    claimsScanned: number;
    sourcesScanned: number;
    dataTimestamp: string;
  };
  modelMetadata: PTATModelMetadata;
  citationValidation: CitationValidationResult;
  isGrounded: boolean;
}

