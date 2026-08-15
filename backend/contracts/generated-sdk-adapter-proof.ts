import type {
  EvidenceProfile, ImplementationStatus, PublicRecordListItem, RecordType, VerificationStatus,
} from './public-api';

// Structural boundary: generated SQL Connect result types may satisfy this shape without
// leaking generated modules into React components.
export interface GeneratedPublishedRecordRow {
  id: string;
  slug: string;
  recordType: string;
  title: string;
  shortTitle?: string | null;
  summary: string;
  implementationStatus: string;
  verificationStatus: string;
  evidenceProfile: string;
  qualification?: string | null;
  publishedAt?: string | Date | null;
}

function requirePublishedAt(value: string | Date | null | undefined): string {
  if (!value) throw new Error('Public record is missing publishedAt');
  return value instanceof Date ? value.toISOString() : value;
}

export function adaptPublishedRecord(row: GeneratedPublishedRecordRow): PublicRecordListItem {
  return {
    id: row.id,
    slug: row.slug,
    recordType: row.recordType as RecordType,
    title: row.title,
    shortTitle: row.shortTitle ?? null,
    summary: row.summary,
    implementationStatus: row.implementationStatus as ImplementationStatus,
    verificationStatus: row.verificationStatus as VerificationStatus,
    evidenceProfile: row.evidenceProfile as EvidenceProfile,
    qualification: row.qualification ?? null,
    publishedAt: requirePublishedAt(row.publishedAt),
  };
}
