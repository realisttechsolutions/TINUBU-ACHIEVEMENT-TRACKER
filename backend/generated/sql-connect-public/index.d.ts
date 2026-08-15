import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, ExecuteQueryOptions } from 'firebase/data-connect';

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

export interface GetPublishedRecordData {
  records: ({
    id: UUIDString;
    slug: string;
    recordType: string;
    title: string;
    shortTitle?: string | null;
    summary: string;
    body?: string | null;
    implementationStatus: string;
    publicationStatus: string;
    verificationStatus: string;
    evidenceProfile: string;
    qualification?: string | null;
    publishedAt?: TimestampString | null;
  } & Record_Key)[];
}

export interface GetPublishedRecordVariables {
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

export interface ListPublishedRecordsData {
  records: ({
    id: UUIDString;
    slug: string;
    recordType: string;
    title: string;
    shortTitle?: string | null;
    summary: string;
    implementationStatus: string;
    verificationStatus: string;
    evidenceProfile: string;
    qualification?: string | null;
    publishedAt?: TimestampString | null;
  } & Record_Key)[];
}

export interface ListPublishedRecordsVariables {
  limit?: number | null;
  offset?: number | null;
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

export interface SearchPublishedRecordsData {
  records: ({
    id: UUIDString;
    slug: string;
    recordType: string;
    title: string;
    summary: string;
    implementationStatus: string;
    verificationStatus: string;
    publishedAt?: TimestampString | null;
  } & Record_Key)[];
}

export interface SearchPublishedRecordsVariables {
  term: string;
  limit?: number | null;
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

interface ListPublishedRecordsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars?: ListPublishedRecordsVariables): QueryRef<ListPublishedRecordsData, ListPublishedRecordsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars?: ListPublishedRecordsVariables): QueryRef<ListPublishedRecordsData, ListPublishedRecordsVariables>;
  operationName: string;
}
export const listPublishedRecordsRef: ListPublishedRecordsRef;

export function listPublishedRecords(vars?: ListPublishedRecordsVariables, options?: ExecuteQueryOptions): QueryPromise<ListPublishedRecordsData, ListPublishedRecordsVariables>;
export function listPublishedRecords(dc: DataConnect, vars?: ListPublishedRecordsVariables, options?: ExecuteQueryOptions): QueryPromise<ListPublishedRecordsData, ListPublishedRecordsVariables>;

interface GetPublishedRecordRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetPublishedRecordVariables): QueryRef<GetPublishedRecordData, GetPublishedRecordVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetPublishedRecordVariables): QueryRef<GetPublishedRecordData, GetPublishedRecordVariables>;
  operationName: string;
}
export const getPublishedRecordRef: GetPublishedRecordRef;

export function getPublishedRecord(vars: GetPublishedRecordVariables, options?: ExecuteQueryOptions): QueryPromise<GetPublishedRecordData, GetPublishedRecordVariables>;
export function getPublishedRecord(dc: DataConnect, vars: GetPublishedRecordVariables, options?: ExecuteQueryOptions): QueryPromise<GetPublishedRecordData, GetPublishedRecordVariables>;

interface SearchPublishedRecordsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: SearchPublishedRecordsVariables): QueryRef<SearchPublishedRecordsData, SearchPublishedRecordsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: SearchPublishedRecordsVariables): QueryRef<SearchPublishedRecordsData, SearchPublishedRecordsVariables>;
  operationName: string;
}
export const searchPublishedRecordsRef: SearchPublishedRecordsRef;

export function searchPublishedRecords(vars: SearchPublishedRecordsVariables, options?: ExecuteQueryOptions): QueryPromise<SearchPublishedRecordsData, SearchPublishedRecordsVariables>;
export function searchPublishedRecords(dc: DataConnect, vars: SearchPublishedRecordsVariables, options?: ExecuteQueryOptions): QueryPromise<SearchPublishedRecordsData, SearchPublishedRecordsVariables>;

