import { getDatabaseConnection } from '@/lib/firebase/sql-connect/server';

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
      `SELECT
        id, external_id, title, publisher_name, source_type, source_level,
        original_url, archival_url, publication_date, source_status
       FROM sources
       WHERE visibility_class = 'public'
       ORDER BY publication_date DESC NULLS LAST
       LIMIT $1`,
      [limit]
    );
    return res.rows as SourceRecord[];
  }

  static async getSourceById(id: string): Promise<SourceRecord | null> {
    const db = await getDatabaseConnection();
    const res = await db.query(
      `SELECT
        id, external_id, title, publisher_name, source_type, source_level,
        original_url, archival_url, publication_date, source_status
       FROM sources
       WHERE id = $1 AND visibility_class = 'public'`,
      [id]
    );
    return (res.rows[0] as SourceRecord) || null;
  }
}
