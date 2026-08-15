export type RecordType =
  | 'achievement' | 'policy' | 'reform' | 'executive_action' | 'legislation'
  | 'regulation' | 'programme' | 'intervention' | 'physical_project'
  | 'institutional_reform' | 'reported_outcome' | 'timeline_event' | 'milestone'
  | 'indicator' | 'indicator_observation' | 'source' | 'correction_revision'
  | 'report' | 'dataset' | 'methodology';

export type ImplementationStatus =
  | 'proposed' | 'announced' | 'approved' | 'enacted' | 'effective' | 'funded'
  | 'funding_released' | 'procurement' | 'implementation_planning'
  | 'implementation_ongoing' | 'partially_delivered' | 'completed' | 'operational'
  | 'outcome_reported' | 'independently_assessed' | 'suspended' | 'superseded'
  | 'repealed' | 'under_review' | 'archived' | 'withdrawn';

export type VerificationStatus =
  | 'source_confirmed' | 'cross_referenced' | 'independently_corroborated'
  | 'under_review' | 'unverified' | 'disputed' | 'corrected' | 'withdrawn';

export type EvidenceProfile =
  | 'direct_physical_delivery' | 'statutory_legal_enactment'
  | 'verified_administrative_disbursement' | 'statistical_indicator_movement'
  | 'official_policy_declaration' | 'third_party_independent_assessment'
  | 'multilateral_partner_evaluation' | 'institutional_reform_milestone';

export type PublicGroup = 'economy' | 'security' | 'infrastructure' | 'social_services' | 'governance';

export interface PageRequest {
  limit: number;
  offset: number;
}

export interface PublicRecordListItem {
  id: string;
  slug: string;
  recordType: RecordType;
  title: string;
  shortTitle: string | null;
  summary: string;
  implementationStatus: ImplementationStatus;
  verificationStatus: VerificationStatus;
  evidenceProfile: EvidenceProfile;
  qualification: string | null;
  publishedAt: string;
}

export interface PublicRecordDetail extends PublicRecordListItem {
  body: string | null;
  sectors: ReadonlyArray<{ code: string; label: string; role: 'primary' | 'secondary' }>;
  institutions: ReadonlyArray<{ name: string; shortName: string | null; role: string }>;
  geographies: ReadonlyArray<{ code: string; name: string; type: string; role: string }>;
}

export interface HomepageSummary {
  publishedRecords: number;
  deliveredOrOperational: number;
  independentlyCorroborated: number;
  latestPublishedAt: string | null;
}

export interface PublicSearchFilters extends PageRequest {
  term?: string;
  publicGroup?: PublicGroup;
  sector?: string;
  subsector?: string;
  recordType?: RecordType;
  implementationStatus?: ImplementationStatus;
  verificationStatus?: VerificationStatus;
  evidenceProfile?: EvidenceProfile;
  institution?: string;
  geography?: string;
  state?: string;
  year?: number;
  dateFrom?: string;
  dateTo?: string;
  sort?: 'latest' | 'oldest' | 'title';
}

export interface PublicDataPort {
  homepageSummary(): Promise<HomepageSummary>;
  search(filters: PublicSearchFilters): Promise<ReadonlyArray<PublicRecordListItem>>;
  getRecord(slug: string): Promise<PublicRecordDetail | null>;
}

// Intentionally absent: workflowStatus, riskLevel, internalNotes, reviewer identities,
// unpublished claims, restricted sources, batch manifests, and authorization roles.
