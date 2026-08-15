import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, ExecuteQueryOptions, MutationRef, MutationPromise } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface AchievementProfile_Key {
  recordId: UUIDString;
  __typename?: 'AchievementProfile_Key';
}

export interface ActorProfile_Key {
  id: UUIDString;
  __typename?: 'ActorProfile_Key';
}

export interface ActorRole_Key {
  id: UUIDString;
  __typename?: 'ActorRole_Key';
}

export interface BeneficiaryRecord_Key {
  id: UUIDString;
  __typename?: 'BeneficiaryRecord_Key';
}

export interface ClaimSourceRelationship_Key {
  id: UUIDString;
  __typename?: 'ClaimSourceRelationship_Key';
}

export interface Correction_Key {
  id: UUIDString;
  __typename?: 'Correction_Key';
}

export interface EvidenceClaim_Key {
  id: UUIDString;
  __typename?: 'EvidenceClaim_Key';
}

export interface FinancialRecord_Key {
  id: UUIDString;
  __typename?: 'FinancialRecord_Key';
}

export interface GeographicUnit_Key {
  id: UUIDString;
  __typename?: 'GeographicUnit_Key';
}

export interface GetInternalReviewQueueData {
  records: ({
    id: UUIDString;
    externalId: string;
    title: string;
    workflowStatus: string;
    publicationStatus: string;
    verificationStatus: string;
    riskLevel: string;
    internalNotes?: string | null;
    currentRevision: number;
    updatedAt: TimestampString;
  } & Record_Key)[];
}

export interface GetInternalReviewQueueVariables {
  limit?: number | null;
}

export interface GetResearchBatchData {
  researchBatch?: {
    id: UUIDString;
    externalId: string;
    idempotencyKey: string;
    packageChecksum: string;
    contractVersion: string;
    mode: string;
    status: string;
    planHash?: string | null;
    startedAt: TimestampString;
    completedAt?: TimestampString | null;
  } & ResearchBatch_Key;
}

export interface GetResearchBatchVariables {
  id: UUIDString;
}

export interface IndicatorObservation_Key {
  id: UUIDString;
  __typename?: 'IndicatorObservation_Key';
}

export interface Indicator_Key {
  id: UUIDString;
  __typename?: 'Indicator_Key';
}

export interface Institution_Key {
  id: UUIDString;
  __typename?: 'Institution_Key';
}

export interface PolicyDetail_Key {
  recordId: UUIDString;
  __typename?: 'PolicyDetail_Key';
}

export interface ProgrammeDetail_Key {
  recordId: UUIDString;
  __typename?: 'ProgrammeDetail_Key';
}

export interface ProjectDetail_Key {
  recordId: UUIDString;
  __typename?: 'ProjectDetail_Key';
}

export interface RecordGeography_Key {
  recordId: UUIDString;
  geographicUnitId: UUIDString;
  coverageRole: string;
  __typename?: 'RecordGeography_Key';
}

export interface RecordInstitution_Key {
  recordId: UUIDString;
  institutionId: UUIDString;
  roleCode: string;
  __typename?: 'RecordInstitution_Key';
}

export interface RecordRelationship_Key {
  id: UUIDString;
  __typename?: 'RecordRelationship_Key';
}

export interface RecordSector_Key {
  recordId: UUIDString;
  sectorId: UUIDString;
  roleCode: string;
  __typename?: 'RecordSector_Key';
}

export interface RecordVersion_Key {
  id: UUIDString;
  __typename?: 'RecordVersion_Key';
}

export interface Record_Key {
  id: UUIDString;
  __typename?: 'Record_Key';
}

export interface ResearchBatch_Key {
  id: UUIDString;
  __typename?: 'ResearchBatch_Key';
}

export interface ReviewDecision_Key {
  id: UUIDString;
  __typename?: 'ReviewDecision_Key';
}

export interface Sector_Key {
  id: UUIDString;
  __typename?: 'Sector_Key';
}

export interface SourceFile_Key {
  id: UUIDString;
  __typename?: 'SourceFile_Key';
}

export interface Source_Key {
  id: UUIDString;
  __typename?: 'Source_Key';
}

export interface TimelineEvent_Key {
  id: UUIDString;
  __typename?: 'TimelineEvent_Key';
}

export interface UpdateInternalWorkflowData {
  record_update?: Record_Key | null;
}

export interface UpdateInternalWorkflowVariables {
  id: UUIDString;
  workflowStatus: string;
  currentRevision: number;
}

interface UpdateInternalWorkflowRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateInternalWorkflowVariables): MutationRef<UpdateInternalWorkflowData, UpdateInternalWorkflowVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateInternalWorkflowVariables): MutationRef<UpdateInternalWorkflowData, UpdateInternalWorkflowVariables>;
  operationName: string;
}
export const updateInternalWorkflowRef: UpdateInternalWorkflowRef;

export function updateInternalWorkflow(vars: UpdateInternalWorkflowVariables): MutationPromise<UpdateInternalWorkflowData, UpdateInternalWorkflowVariables>;
export function updateInternalWorkflow(dc: DataConnect, vars: UpdateInternalWorkflowVariables): MutationPromise<UpdateInternalWorkflowData, UpdateInternalWorkflowVariables>;

interface GetInternalReviewQueueRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars?: GetInternalReviewQueueVariables): QueryRef<GetInternalReviewQueueData, GetInternalReviewQueueVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars?: GetInternalReviewQueueVariables): QueryRef<GetInternalReviewQueueData, GetInternalReviewQueueVariables>;
  operationName: string;
}
export const getInternalReviewQueueRef: GetInternalReviewQueueRef;

export function getInternalReviewQueue(vars?: GetInternalReviewQueueVariables, options?: ExecuteQueryOptions): QueryPromise<GetInternalReviewQueueData, GetInternalReviewQueueVariables>;
export function getInternalReviewQueue(dc: DataConnect, vars?: GetInternalReviewQueueVariables, options?: ExecuteQueryOptions): QueryPromise<GetInternalReviewQueueData, GetInternalReviewQueueVariables>;

interface GetResearchBatchRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetResearchBatchVariables): QueryRef<GetResearchBatchData, GetResearchBatchVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetResearchBatchVariables): QueryRef<GetResearchBatchData, GetResearchBatchVariables>;
  operationName: string;
}
export const getResearchBatchRef: GetResearchBatchRef;

export function getResearchBatch(vars: GetResearchBatchVariables, options?: ExecuteQueryOptions): QueryPromise<GetResearchBatchData, GetResearchBatchVariables>;
export function getResearchBatch(dc: DataConnect, vars: GetResearchBatchVariables, options?: ExecuteQueryOptions): QueryPromise<GetResearchBatchData, GetResearchBatchVariables>;

