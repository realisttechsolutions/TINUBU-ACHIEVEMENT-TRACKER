import 'server-only';
import { getDatabaseConnection } from '@/server/db/pool';

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
  const db = await getDatabaseConnection();

  // In public reader mode, sectors and institutions can be extracted from public_record_catalog or reference queries
  const catalogRes = await db.query<any>(`
    SELECT sectors, institutions, geographies
    FROM public_record_catalog
    LIMIT 100
  `);

  const sectorsMap = new Map<string, ReferenceSector>();
  const institutionsMap = new Map<string, ReferenceInstitution>();
  const geographiesMap = new Map<string, ReferenceGeography>();

  for (const row of catalogRes.rows) {
    if (Array.isArray(row.sectors)) {
      for (const s of row.sectors) {
        if (s && s.id && !sectorsMap.has(s.id)) {
          sectorsMap.set(s.id, {
            id: s.id,
            code: s.code || '',
            label: s.label || '',
            taxonomy_level: 'subsector',
            parent_sector_id: null,
          });
        }
      }
    }
    if (Array.isArray(row.institutions)) {
      for (const i of row.institutions) {
        if (i && i.id && !institutionsMap.has(i.id)) {
          institutionsMap.set(i.id, {
            id: i.id,
            code: i.code || '',
            canonical_name: i.name || '',
            short_name: i.shortName || null,
            tier: 'federal_ministry',
          });
        }
      }
    }
    if (Array.isArray(row.geographies)) {
      for (const g of row.geographies) {
        if (g && g.id && !geographiesMap.has(g.id)) {
          geographiesMap.set(g.id, {
            id: g.id,
            code: g.code || '',
            name: g.name || '',
            geography_type: g.type || 'state',
            parent_id: null,
          });
        }
      }
    }
  }

  return {
    sectors: Array.from(sectorsMap.values()),
    institutions: Array.from(institutionsMap.values()),
    geographies: Array.from(geographiesMap.values()),
  };
}
