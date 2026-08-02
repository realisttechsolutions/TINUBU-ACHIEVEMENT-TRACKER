export type GeopoliticalZone =
  | "North-Central"
  | "North-East"
  | "North-West"
  | "South-East"
  | "South-South"
  | "South-West";

export type GeographicScopeType =
  | "national"
  | "multi-state"
  | "geopolitical-zone"
  | "state"
  | "point"
  | "corridor"
  | "international";

export type GeographicPrecision =
  | "country"
  | "zone"
  | "state"
  | "city"
  | "approximate-point"
  | "verified-point"
  | "linear-route";

export type GeographicConfidence =
  | "confirmed"
  | "source-reported"
  | "inferred-with-qualification"
  | "under-review";

export type GeographicSensitivity =
  | "public"
  | "generalised"
  | "restricted"
  | "not-for-map";

export type GeographicScope = GeographicScopeType | "zonal" | "state-specific" | "point-specific" | "linear-corridor";

export interface LocationReference {
  scope: GeographicScopeType;
  precision: GeographicPrecision;
  confidence: GeographicConfidence;
  sensitivity?: GeographicSensitivity;
  statesCovered?: string[];
  zone?: GeopoliticalZone;
  coordinates?: [number, number]; // [longitude, latitude]
  addressOrSite?: string;
  sourceQualification?: string;
}

export interface StateRecord {
  code: string; // ISO 3166-2:NG code, e.g. "NG-LA"
  slug: string; // e.g. "lagos"
  name: string; // e.g. "Lagos State"
  shortName: string; // e.g. "Lagos"
  capital: string; // e.g. "Ikeja"
  zone: GeopoliticalZone;
  governor?: string;
  officialPortal?: string;
  description: string;
  geoCenter?: [number, number]; // [longitude, latitude]
}

export interface ZoneRecord {
  id: string;
  name: GeopoliticalZone;
  shortName: string;
  states: string[]; // State codes
  color: string; // Tailwind color token or hex
  description: string;
  keyHighlight: string;
}

export interface StateImpactSummary {
  state: StateRecord;
  totalPublishedRecords: number;
  stateSpecificRecordsCount: number;
  multiStateRecordsCount: number;
  nationalRecordsCount: number;
  activeSectors: string[];
  leadMinistries: string[];
}
