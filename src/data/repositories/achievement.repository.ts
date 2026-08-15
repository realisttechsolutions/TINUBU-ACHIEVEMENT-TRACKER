import { getDatabaseConnection } from '@/lib/firebase/sql-connect/server';
import { CanonicalRecord, PublicEvidenceClaim, PublicFinancialRecord, PublicBeneficiaryRecord } from './types';

export class AchievementRepository {
  static async getCatalog(limit = 100, offset = 0): Promise<CanonicalRecord[]> {
    const db = await getDatabaseConnection();
    const res = await db.query(
      `SELECT
        id, slug, record_type, title, short_title, summary,
        implementation_status, publication_status, verification_status,
        evidence_profile, risk_level, qualification, published_at
       FROM public_record_catalog
       ORDER BY published_at DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );
    return res.rows as CanonicalRecord[];
  }

  static async getBySlug(slug: string): Promise<CanonicalRecord | null> {
    const db = await getDatabaseConnection();
    const res = await db.query(
      `SELECT
        id, slug, record_type, title, short_title, summary,
        implementation_status, publication_status, verification_status,
        evidence_profile, risk_level, qualification, published_at
       FROM public_record_catalog
       WHERE slug = $1`,
      [slug]
    );
    return (res.rows[0] as CanonicalRecord) || null;
  }

  static async getEvidenceForRecord(recordId: string): Promise<PublicEvidenceClaim[]> {
    const db = await getDatabaseConnection();
    const res = await db.query(
      `SELECT * FROM public_claim_evidence WHERE record_id = $1`,
      [recordId]
    );
    return res.rows as PublicEvidenceClaim[];
  }

  static async getFinancialsForRecord(recordId: string): Promise<PublicFinancialRecord[]> {
    const db = await getDatabaseConnection();
    const res = await db.query(
      `SELECT * FROM public_financial_records WHERE record_id = $1`,
      [recordId]
    );
    return res.rows as PublicFinancialRecord[];
  }

  static async getBeneficiariesForRecord(recordId: string): Promise<PublicBeneficiaryRecord[]> {
    const db = await getDatabaseConnection();
    const res = await db.query(
      `SELECT * FROM public_beneficiary_records WHERE record_id = $1`,
      [recordId]
    );
    return res.rows as PublicBeneficiaryRecord[];
  }
}
