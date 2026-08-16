import { getDatabaseConnection } from '@/server/db/pool';

export interface SourceRecord {
  id: string;
  external_id: string;
  title: string;
  publisher_name: string;
  source_type: string;
  source_level: string;
  original_url: string | null;
  archival_url: string | null;
  publication_date: string | null;
  source_status: string;
}

export class EvidenceRepository {
  static async getSources(limit = 100): Promise<SourceRecord[]> {
    const db = await getDatabaseConnection();
    const res = await db.query(
      `SELECT DISTINCT ON (source_id)
        source_id AS id, source_id::text AS external_id, source_title AS title,
        publisher_name, source_type, source_level, original_url, archival_url,
        publication_date, 'active'::text AS source_status
       FROM public_claim_evidence
       ORDER BY source_id, publication_date DESC NULLS LAST
       LIMIT $1`,
      [limit]
    );
    return res.rows as SourceRecord[];
  }

  static async getSourceById(id: string): Promise<SourceRecord | null> {
    const db = await getDatabaseConnection();
    const res = await db.query(
      `SELECT DISTINCT ON (source_id)
        source_id AS id, source_id::text AS external_id, source_title AS title,
        publisher_name, source_type, source_level, original_url, archival_url,
        publication_date, 'active'::text AS source_status
       FROM public_claim_evidence
       WHERE source_id = $1
       ORDER BY source_id, publication_date DESC NULLS LAST`,
      [id]
    );
    return (res.rows[0] as SourceRecord) || null;
  }
}
