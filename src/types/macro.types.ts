/**
 * PTAT National Macro Intelligence Observatory Type Contracts
 * Authoritative types for macro indicators, time series, transmission channels,
 * and statutory provenance tracking.
 */

export type MacroFreshnessState = 'CURRENT' | 'RECENT' | 'STALE' | 'UNAVAILABLE';

export type MacroCategory =
  | 'growth'
  | 'prices'
  | 'monetary_fx'
  | 'external_sector'
  | 'fiscal_debt'
  | 'energy_real';

export type ReportingFrequency =
  | 'daily'
  | 'monthly'
  | 'quarterly'
  | 'bi_monthly_mpc'
  | 'annual';

export type InterpretationDirection =
  | 'higher_favorable'
  | 'lower_favorable'
  | 'contextual_neutral'
  | 'context_dependent';

export type TimeMode = 'latest' | 'baseline';

export interface MacroObservation {
  indicator_id: string;
  indicator_name: string;
  category: MacroCategory;
  value: number;
  formatted_value: string;
  unit: string;
  observation_period: string;
  observation_date: string;
  frequency: ReportingFrequency;
  previous_value: number;
  formatted_previous_value: string;
  previous_period: string;
  administration_baseline_value: number;
  formatted_baseline_value: string;
  baseline_period: string;
  source_institution: string;
  source_title: string;
  source_url: string;
  publication_date: string;
  retrieved_at: string;
  freshness_threshold_days: number;
  freshness_status: MacroFreshnessState;
  methodology_note: string;
  interpretation_rule: InterpretationDirection;
  series_break_note?: string;
}

export interface MacroTimeSeriesPoint {
  period: string;
  date: string;
  value: number;
  isBaseline?: boolean;
  note?: string;
}

export interface MacroIndicatorSeries {
  id: string;
  name: string;
  category: MacroCategory;
  unit: string;
  source: string;
  frequency: ReportingFrequency;
  data: MacroTimeSeriesPoint[];
  inaugurationBaselinePoint: MacroTimeSeriesPoint;
  peakPoint: MacroTimeSeriesPoint;
  troughPoint: MacroTimeSeriesPoint;
  yAxisFormatter: (value: number) => string;
  tooltipFormatter: (value: number) => string;
  domain?: [number | 'auto' | 'dataMin', number | 'auto' | 'dataMax'];
  description: string;
  sourceUrl: string;
  freshnessStatus: MacroFreshnessState;
  seriesBreakNote?: string;
}

export interface ReformTransmissionNode {
  id: string;
  reformTitle: string;
  mandate: string;
  authority: string;
  inauguratedDate: string;
  policyMechanism: string;
  transmissionChannel: string;
  relatedIndicatorIds: string[];
  statutoryObservation: string;
  ptatRecordSlug: string;
  ptatRecordTitle: string;
  ptatRecordType: 'policy' | 'programme' | 'achievement';
}

export interface SectorEngineData {
  sectorId: string;
  name: string;
  shareOfGDP: number; // percentage of real GDP
  yoyRealGrowth: number; // YoY real growth %
  precedingYoYGrowth: number;
  subsectors: string[];
  driverSummary: string;
  headwindSummary: string;
  policyInterventionSlug?: string;
  policyInterventionTitle?: string;
}

export interface FiscalDebtComposition {
  period: string;
  totalDebtNaira: number; // Trillions NGN
  totalDebtUSD: number; // Billions USD
  domesticDebtNaira: number;
  domesticDebtUSD: number;
  domesticSharePercent: number;
  externalDebtNaira: number;
  externalDebtUSD: number;
  externalSharePercent: number;
  fxTranslationNote: string;
  source: string;
  sourceUrl: string;
  publicationDate: string;
  freshnessStatus: MacroFreshnessState;
}

export interface FAACDistributionData {
  period: string;
  grossFederationRevenue: number; // Trillions NGN
  distributableAmount: number; // Trillions NGN
  federalShare: number; // Trillions NGN
  stateShare: number; // Trillions NGN
  lgaShare: number; // Trillions NGN
  derivation13Percent: number; // Trillions NGN
  statutoryNote: string;
  source: string;
  sourceUrl: string;
  freshnessStatus: MacroFreshnessState;
}

export interface ProvenanceSourceRecord {
  institutionCode: string;
  institutionName: string;
  legalMandate: string;
  monitoredDatasets: string[];
  publicationCycle: string;
  latestReleaseBulletin: string;
  releaseDate: string;
  officialUrl: string;
  freshnessStatus: MacroFreshnessState;
}
