import { GeopoliticalZone } from "@/types/geography.types";

/**
 * Deterministic mapping entry connecting third-party geometry data
 * (geoBoundaries / Natural Earth / GRID3) to canonical PTAT state models.
 */
export interface StateMappingEntry {
  geometryName: string;         // Raw shapeName from source boundary dataset
  canonicalName: string;        // Official standardized name (e.g. "Abia", "FCT - Abuja")
  code: string;                 // ISO 3166-2:NG code (e.g. "NG-AB", "NG-FC")
  slug: string;                 // Canonical PTAT route slug (e.g. "abia", "fct-abuja")
  zone: GeopoliticalZone;       // One of the 6 official Nigerian Geopolitical Zones
}

/**
 * Canonical 37 Nigerian First-Level Administrative Units (36 States + FCT).
 * Hard invariant: Exactly 37 entries. 0 duplicates. 0 unmatched.
 */
export const NIGERIA_STATE_MAPPINGS: StateMappingEntry[] = [
  { geometryName: "Abia", canonicalName: "Abia", code: "NG-AB", slug: "abia", zone: "South-East" },
  { geometryName: "Adamawa", canonicalName: "Adamawa", code: "NG-AD", slug: "adamawa", zone: "North-East" },
  { geometryName: "Akwa Ibom", canonicalName: "Akwa Ibom", code: "NG-AK", slug: "akwa-ibom", zone: "South-South" },
  { geometryName: "Anambra", canonicalName: "Anambra", code: "NG-AN", slug: "anambra", zone: "South-East" },
  { geometryName: "Bauchi", canonicalName: "Bauchi", code: "NG-BA", slug: "bauchi", zone: "North-East" },
  { geometryName: "Bayelsa", canonicalName: "Bayelsa", code: "NG-BY", slug: "bayelsa", zone: "South-South" },
  { geometryName: "Benue", canonicalName: "Benue", code: "NG-BE", slug: "benue", zone: "North-Central" },
  { geometryName: "Borno", canonicalName: "Borno", code: "NG-BO", slug: "borno", zone: "North-East" },
  { geometryName: "Cross River", canonicalName: "Cross River", code: "NG-CR", slug: "cross-river", zone: "South-South" },
  { geometryName: "Delta", canonicalName: "Delta", code: "NG-DE", slug: "delta", zone: "South-South" },
  { geometryName: "Ebonyi", canonicalName: "Ebonyi", code: "NG-EB", slug: "ebonyi", zone: "South-East" },
  { geometryName: "Edo", canonicalName: "Edo", code: "NG-ED", slug: "edo", zone: "South-South" },
  { geometryName: "Ekiti", canonicalName: "Ekiti", code: "NG-EK", slug: "ekiti", zone: "South-West" },
  { geometryName: "Enugu", canonicalName: "Enugu", code: "NG-EN", slug: "enugu", zone: "South-East" },
  { geometryName: "Abuja Federal Capital Territory", canonicalName: "Federal Capital Territory (Abuja)", code: "NG-FC", slug: "fct-abuja", zone: "North-Central" },
  { geometryName: "Gombe", canonicalName: "Gombe", code: "NG-GO", slug: "gombe", zone: "North-East" },
  { geometryName: "Imo", canonicalName: "Imo", code: "NG-IM", slug: "imo", zone: "South-East" },
  { geometryName: "Jigawa", canonicalName: "Jigawa", code: "NG-JI", slug: "jigawa", zone: "North-West" },
  { geometryName: "Kaduna", canonicalName: "Kaduna", code: "NG-KD", slug: "kaduna", zone: "North-West" },
  { geometryName: "Kano", canonicalName: "Kano", code: "NG-KN", slug: "kano", zone: "North-West" },
  { geometryName: "Katsina", canonicalName: "Katsina", code: "NG-KT", slug: "katsina", zone: "North-West" },
  { geometryName: "Kebbi", canonicalName: "Kebbi", code: "NG-KB", slug: "kebbi", zone: "North-West" },
  { geometryName: "Kogi", canonicalName: "Kogi", code: "NG-KO", slug: "kogi", zone: "North-Central" },
  { geometryName: "Kwara", canonicalName: "Kwara", code: "NG-KW", slug: "kwara", zone: "North-Central" },
  { geometryName: "Lagos", canonicalName: "Lagos", code: "NG-LA", slug: "lagos", zone: "South-West" },
  { geometryName: "Nasarawa", canonicalName: "Nasarawa", code: "NG-NA", slug: "nasarawa", zone: "North-Central" },
  { geometryName: "Niger", canonicalName: "Niger", code: "NG-NI", slug: "niger", zone: "North-Central" },
  { geometryName: "Ogun", canonicalName: "Ogun", code: "NG-OG", slug: "ogun", zone: "South-West" },
  { geometryName: "Ondo", canonicalName: "Ondo", code: "NG-ON", slug: "ondo", zone: "South-West" },
  { geometryName: "Osun", canonicalName: "Osun", code: "NG-OS", slug: "osun", zone: "South-West" },
  { geometryName: "Oyo", canonicalName: "Oyo", code: "NG-OY", slug: "oyo", zone: "South-West" },
  { geometryName: "Plateau", canonicalName: "Plateau", code: "NG-PL", slug: "plateau", zone: "North-Central" },
  { geometryName: "Rivers", canonicalName: "Rivers", code: "NG-RI", slug: "rivers", zone: "South-South" },
  { geometryName: "Sokoto", canonicalName: "Sokoto", code: "NG-SO", slug: "sokoto", zone: "North-West" },
  { geometryName: "Taraba", canonicalName: "Taraba", code: "NG-TA", slug: "taraba", zone: "North-East" },
  { geometryName: "Yobe", canonicalName: "Yobe", code: "NG-YO", slug: "yobe", zone: "North-East" },
  { geometryName: "Zamfara", canonicalName: "Zamfara", code: "NG-ZA", slug: "zamfara", zone: "North-West" }
];

// Naming alias lookup table to normalize third-party variations
const GEOMETRY_NAME_ALIASES: Record<string, string> = {
  "abuja": "Abuja Federal Capital Territory",
  "fct": "Abuja Federal Capital Territory",
  "federal capital territory": "Abuja Federal Capital Territory",
  "fct abuja": "Abuja Federal Capital Territory",
  "abuja fct": "Abuja Federal Capital Territory",
  "federal capital territory (abuja)": "Abuja Federal Capital Territory",
  "fct (abuja)": "Abuja Federal Capital Territory",
  "nassarawa": "Nasarawa"
};

/**
 * Normalizes any incoming state/geometry string into a canonical StateMappingEntry.
 */
export function resolveStateMapping(input: string): StateMappingEntry | undefined {
  if (!input) return undefined;
  const cleanInput = input.trim().toLowerCase();

  // 1. Direct code match (e.g. "NG-LA" or "ng-la")
  const byCode = NIGERIA_STATE_MAPPINGS.find(m => m.code.toLowerCase() === cleanInput);
  if (byCode) return byCode;

  // 2. Direct slug match (e.g. "lagos", "fct-abuja")
  const bySlug = NIGERIA_STATE_MAPPINGS.find(m => m.slug.toLowerCase() === cleanInput);
  if (bySlug) return bySlug;

  // 3. Alias check
  const aliasedName = GEOMETRY_NAME_ALIASES[cleanInput];
  if (aliasedName) {
    return NIGERIA_STATE_MAPPINGS.find(m => m.geometryName === aliasedName);
  }

  // 4. Geometry name or canonical name match
  return NIGERIA_STATE_MAPPINGS.find(
    m => m.geometryName.toLowerCase() === cleanInput || m.canonicalName.toLowerCase() === cleanInput
  );
}

/**
 * Resolves a state code from an arbitrary input string.
 */
export function getStateCode(input: string): string | undefined {
  return resolveStateMapping(input)?.code;
}

/**
 * Resolves a canonical PTAT route slug from an arbitrary input string.
 */
export function getStateSlug(input: string): string | undefined {
  return resolveStateMapping(input)?.slug;
}
