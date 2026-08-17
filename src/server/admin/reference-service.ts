import 'server-only';
import { getAdminDatabaseConnection } from '@/server/db/admin-pool';

export interface ReferenceSector {
  id: string;
  code: string;
  label: string;
  taxonomy_level: string;
  parent_sector_id: string | null;
}

export interface ReferenceInstitution {
  id: string;
  code: string;
  canonical_name: string;
  short_name: string | null;
  tier: string;
}

export interface ReferenceGeography {
  id: string;
  code: string;
  name: string;
  geography_type: string;
  parent_id: string | null;
}

export interface ReferenceDataResponse {
  sectors: ReferenceSector[];
  institutions: ReferenceInstitution[];
  geographies: ReferenceGeography[];
}

export async function getAdminReferenceData(): Promise<ReferenceDataResponse> {
  const db = await getAdminDatabaseConnection();

  const [sectorsResult, institutionsResult, geographiesResult] = await Promise.all([
    db.query<ReferenceSector>(`
      SELECT id, code, label, taxonomy_level, parent_sector_id
      FROM sectors
      WHERE active = true
      ORDER BY public_order NULLS LAST, label ASC
    `),
    db.query<ReferenceInstitution>(`
      SELECT id, code, canonical_name, short_name, tier
      FROM institutions
      ORDER BY canonical_name ASC
    `),
    db.query<ReferenceGeography>(`
      SELECT id, code, name, geography_type, parent_id
      FROM geographic_units
      WHERE sensitivity_class = 'public'
      ORDER BY geography_type ASC, name ASC
    `),
  ]);

  return {
    sectors: sectorsResult.rows,
    institutions: institutionsResult.rows,
    geographies: geographiesResult.rows,
  };
}
