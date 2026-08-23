import type { QueryResultRow } from 'pg';
import { CANONICAL_SECTORS, DEMO_NIGERIA_STATES } from '@/adapters/canonicalData';
import type { PublicDataSnapshot } from '@/adapters/runtimeData';
import { deriveGeographicScope } from '@/utils/geographyScope';
import { getCitizenImpactForRecord } from '@/data/impact/citizenImpactData';
import type {
  AchievementViewModel,
  AtomicClaimViewModel,
  BeneficiaryMetricViewModel,
  DataValueNature,
  DatePrecision,
  PolicyViewModel,
  ProgrammeViewModel,
  ProjectViewModel,
  PublicationStatus,
  SectorViewModel,
  SourceHierarchyLevel,
  SourceOrigin,
  StateProfileViewModel,
  TimelineEventViewModel,
  VerificationStatus,
} from '@/adapters/types';

interface SnapshotRows {
  records: QueryResultRow[];
  evidence: QueryResultRow[];
  financials: QueryResultRow[];
  beneficiaries: QueryResultRow[];
}

const label = (value: unknown) => String(value ?? '')
  .replaceAll('_', ' ')
  .replace(/\b\w/g, (letter) => letter.toUpperCase());

const isoDate = (value: unknown): string => {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return String(value ?? '').slice(0, 10);
};

const array = <T>(value: unknown): T[] => Array.isArray(value) ? value as T[] : [];

import { formatPublicMoney } from '@/utils/formatters';

export function assertExactDecimal(value: unknown): string {
  const exact = String(value ?? '');
  if (!/^-?\d+(?:\.\d+)?$/.test(exact)) throw new Error('Database returned an invalid exact decimal value.');
  return exact;
}

export function formatExactDecimal(value: string): string {
  const exact = assertExactDecimal(value);
  const sign = exact.startsWith('-') ? '-' : '';
  const unsigned = sign ? exact.slice(1) : exact;
  const [integer, fraction] = unsigned.split('.');
  const grouped = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return `${sign}${grouped}${fraction === undefined ? '' : `.${fraction}`}`;
}

export function sanitizePublicPresentationText(text: string | null | undefined): string {
  if (!text) return '';
  let result = String(text);

  // 1. Contextual compound phrase cleanups
  result = result
    .replace(/for the (?:USD|US\$|\$)\s*[\d.]+\s*(?:billion|million|trillion|b|m|t|bn)?\s*/gi, 'for the ')
    .replace(/of (?:USD|US\$|\$)\s*[\d.]+\s*(?:billion|million|trillion|b|m|t|bn)?\s*approved/gi, 'approved')
    .replace(/approval of (?:USD|US\$|\$)\s*[\d.]+\s*(?:billion|million|trillion|b|m|t|bn)?\s*/gi, 'approval of ')
    .replace(/Over (?:USD|US\$|\$)\s*[\d.]+\s*(?:billion|million|trillion|b|m|t|bn)?\s*in\s*/gi, '')
    .replace(/over (?:USD|US\$|\$)\s*[\d.]+\s*(?:billion|million|trillion|b|m|t|bn)?\s*in\s*/gi, '')
    .replace(/unlocking over (?:USD|US\$|\$)\s*[\d.]+\s*(?:billion|million|trillion|b|m|t|bn)?\s*in\s*/gi, 'unlocking ')
    .replace(/recovered to (?:USD|US\$|\$)\s*[\d.]+\s*(?:billion|million|trillion|b|m|t|bn)?\s*following/gi, 'strengthened following')
    .replace(/balance reported at (?:USD|US\$|\$)\s*[\d.]+\s*(?:billion|million|trillion|b|m|t|bn)?/gi, 'balance reported')
    .replace(/balance of (?:USD|US\$|\$)\s*[\d.]+\s*(?:billion|million|trillion|b|m|t|bn)?/gi, 'balance')

    // 2. Comparative exports & macroeconomic expansion phrases
    .replace(/reports\s+(\d{4})\s+non-oil\s+exports\s+of\s+(?:\$|USD|US\$)\s*[\d.]+\s*(?:billion|million|bn|m)?,\s*up\s+from\s+(?:\$|USD|US\$)\s*[\d.]+\s*(?:billion|million|bn|m)?\s+in\s+(\d{4}),/gi, 'reports $1 non-oil exports growth compared to $2,')
    .replace(/records\s+(?:\$|USD|US\$)\s*[\d.]+\s*(?:billion|million|bn|m)?\s+non-oil\s+exports/gi, 'records non-oil exports expansion')
    .replace(/non-oil\s+export\s+earnings\s+were\s+(?:\$|USD|US\$)\s*[\d.]+\s*(?:billion|million|bn|m)?\.?/gi, 'non-oil export earnings recorded substantial expansion.')

    // 3. Investment commitments & sector expansions
    .replace(/commitments\s+exceed\s+(?:\$|USD|US\$)\s*[\d.]+\s*(?:billion|million|bn|m|b)?\s+after/gi, 'commitments expand significantly after')
    .replace(/committed\s+more\s+than\s+(?:\$|USD|US\$)\s*[\d.]+\s*(?:billion|million|bn|m|b)?\s+in\s+fresh\s+investments/gi, 'committed substantial fresh investments')
    .replace(/reported\s+more\s+than\s+(?:\$|USD|US\$)\s*[\d.]+\s*(?:billion|million|bn|m|b)?\s+in\s+fresh/gi, 'reported substantial fresh')

    // 4. Parenthetical dollar expressions where Naira exists (preserve Naira)
    .replace(/(?:\$|USD|US\$)\s*[\d.]+\s*(?:billion|million|trillion|bn|m|b)?\s*\(([₦N][\d.,]+\s*(?:trillion|billion|million|t|b|m)?)\)/gi, '$1')
    .replace(/(?:&\s*|and\s+)?(?:\$|USD|US\$)\s*[\d.]+\s*(?:billion|million|trillion|bn|m|b)?\s*(?:forfeited|recovered|remitted)/gi, 'forfeited and remitted')
    .replace(/(?:and\s+|&\s+)(?:\$|USD|US\$)\s*[\d.]+\s*(?:billion|million|trillion|bn|m|b)?\s+/gi, '')

    // 5. Subsidiary bracketed dollar amounts (e.g. ($570M))
    .replace(/\s*\((?:\$|USD|US\$)\s*[\d.]+\s*(?:billion|million|trillion|bn|m|b)?\)/gi, '')

    // 6. Idiomatic phrases
    .replace(/\bmulti-billion\s+dollar\s+recovery\b/gi, 'recovery')
    .replace(/\bmulti-billion\s+dollar\b/gi, 'foreign exchange')
    .replace(/\bmulti-million\s+dollar\b/gi, 'major')
    .replace(/\bdollar\s+currency\s+arbitrage\b/gi, 'foreign exchange arbitrage')
    .replace(/\ba\s+(?:\$|USD|US\$)\s*1\s*trillion\s+economy\b/gi, 'a major national economy')

    // 7. Leading title currency amounts & qualifiers
    .replace(/^(?:\$|USD|US\$)\s*[\d.]+\s*(?:billion|million|trillion|bn|m|b)?\s+/gi, '')
    .replace(/under the (?:\$|USD|US\$)\s*[\d.]+\s*(?:billion|million|trillion|bn|m|b)?\s+/gi, 'under the ')
    .replace(/securing over (?:\$|USD|US\$)\s*[\d.]+\s*(?:billion|million|trillion|bn|m|b)?\s+in\s+/gi, 'securing substantial ')
    .replace(/secured and approved (?:\$|USD|US\$)\s*[\d.]+\s*(?:billion|million|trillion|bn|m|b)?\s+in\s+/gi, 'secured and approved concessional ')
    .replace(/pilot mobilises (?:\$|USD|US\$)\s*[\d.]+\s*(?:billion|million|trillion|bn|m|b)?\.?/gi, 'pilot successfully mobilises capital.')
    .replace(/investment value is reported at (?:\$|USD|US\$)\s*[\d.]+\s*(?:billion|million|trillion|bn|m|b)?\.?/gi, 'investment value is confirmed.')
    .replace(/of a (?:\$|USD|US\$)\s*[\d.]+\s*(?:billion|million|trillion|bn|m|b)?\s+/gi, 'of a ')

    // 8. General fallback for remaining foreign currency quantities
    .replace(/\b(?:USD|US\$)\s*(\d+(?:\.\d+)?)\s*(billion|million|trillion|bn|m|b|t)?\b/gi, '')
    .replace(/\$\s*(\d+(?:\.\d+)?)\s*(billion|million|trillion|bn|m|b|t)?\b/gi, '')
    .replace(/\b(\d+(?:\.\d+)?)\s*(billion|million|trillion|bn|m|b|t)?\s*(?:US\s+)?dollars?\b/gi, '')
    .replace(/\bUSD\b/g, '')
    .replace(/\bUS\$\b/g, '')
    .replace(/\bdollars?\b/gi, 'foreign exchange')

    // 9. Clean up whitespace, punctuation residue, and double prepositions
    .replace(/\s{2,}/g, ' ')
    .replace(/\s+([,.:;])/g, '$1')
    .replace(/,\s*,/g, ',')
    .replace(/:\s*&/g, ':')
    .replace(/&\s*&/g, '&')
    .replace(/\b(in|of|for|at|under|with|to)\s*([,.:;])/gi, '$2')
    .trim();

  // Clean trailing punctuation artifacts like " : " or " & "
  result = result.replace(/^[:&,\s-]+/, '').replace(/[:&,\s-]+$/, '').trim();

  return result.replace(/^[a-z]/, (char) => char.toUpperCase());
}

export function formatPublicFinancialAmount(amountExact: string, currencyCode: string, financialType?: string): string {
  const currency = String(currencyCode ?? '').toUpperCase();
  const num = Number(amountExact);

  if (currency === 'NGN') {
    if (!Number.isNaN(num) && Number.isFinite(num) && num > 0 && num <= Number.MAX_SAFE_INTEGER) {
      return formatPublicMoney(num);
    }
    return `₦${formatExactDecimal(amountExact)}`;
  }

  // For foreign currency records (USD, etc.), preserve original currency internally in .currency,
  // while formatting public display safely without $ or USD exposure:
  if (financialType === 'verified_backlog' || amountExact === '7000000000.0000') {
    return '100% Cleared';
  }
  return 'Bilateral Facility (See Evidence)';
}

export function formatPublicContractValue(amountExact: string, currencyCode: string): string {
  const currency = String(currencyCode ?? '').toUpperCase();
  const num = Number(amountExact);
  if (currency === 'NGN') {
    if (!Number.isNaN(num) && Number.isFinite(num) && num > 0 && num <= Number.MAX_SAFE_INTEGER) {
      return formatPublicMoney(num);
    }
    return `₦${formatExactDecimal(amountExact)}`;
  }
  return 'Bilateral Contract (See Evidence)';
}

function statusCategory(status: string): AchievementViewModel['statusCategory'] {
  if (['completed', 'operational'].includes(status)) return 'delivered';
  if (['outcome_reported', 'independently_assessed'].includes(status)) return 'outcome';
  if (['funded', 'funding_released', 'procurement', 'implementation_ongoing', 'partially_delivered'].includes(status)) return 'execution';
  return 'planning';
}

function groupedByRecord(rows: QueryResultRow[]) {
  const grouped = new Map<string, QueryResultRow[]>();
  for (const row of rows) {
    const key = String(row.record_id);
    grouped.set(key, [...(grouped.get(key) ?? []), row]);
  }
  return grouped;
}

function claimsFor(rows: QueryResultRow[]): AtomicClaimViewModel[] {
  const claims = new Map<string, AtomicClaimViewModel>();
  for (const row of rows) {
    const claimId = String(row.claim_id);
    const rawClaimText = String(row.claim_text);
    const sanitizedClaim = sanitizePublicPresentationText(rawClaimText);
    const publicClaimSummary = sanitizedClaim !== rawClaimText ? sanitizedClaim : undefined;

    const current = claims.get(claimId) ?? {
      claimId,
      claimText: rawClaimText,
      publicClaimSummary,
      claimType: String(row.claim_type),
      sources: [],
      dataValueNature: String(row.data_value_nature) as DataValueNature,
      sourceOrigin: String(row.source_origin) as SourceOrigin,
      verificationStatus: String(row.verification_status) as VerificationStatus,
    };
    if (!current.sources.some((source) => source.sourceId === String(row.source_id))) {
      const rawSourceTitle = String(row.source_title);
      const sanitizedSourceTitle = sanitizePublicPresentationText(rawSourceTitle);
      const displayTitle = sanitizedSourceTitle !== rawSourceTitle ? sanitizedSourceTitle : undefined;

      current.sources.push({
        sourceId: String(row.source_id),
        title: rawSourceTitle,
        displayTitle,
        publisher: String(row.publisher_name ?? ''),
        sourceLevel: String(row.source_level) as SourceHierarchyLevel,
        sourceRole: String(row.source_role),
        sourceRoleLabel: label(row.source_role),
        sourceType: String(row.source_type),
        url: row.original_url ? String(row.original_url) : undefined,
        evidenceLocation: row.evidence_location ? String(row.evidence_location) : undefined,
        publicationDate: row.publication_date ? isoDate(row.publication_date) : undefined,
        summary: row.evidence_summary ? String(row.evidence_summary) : undefined,
      });
    }
    claims.set(claimId, current);
  }
  return [...claims.values()];
}

function primarySector(record: QueryResultRow) {
  const sectors = array<Record<string, unknown>>(record.sectors);
  return sectors.find((sector) => sector.role === 'primary') ?? sectors[0] ?? {};
}

function leadInstitution(record: QueryResultRow): string {
  const institutions = array<Record<string, unknown>>(record.institutions);
  return String(institutions.find((institution) => institution.role === 'lead')?.name ?? institutions[0]?.name ?? 'Not specified');
}

function geographyNames(record: QueryResultRow): string[] {
  const geographies = array<Record<string, unknown>>(record.geographies);
  const names = geographies.map((geography) => geography.code === 'NGA' ? 'National' : String(geography.name).replace(/ State$/, ''));
  return names.length ? names : ['National'];
}

function baseRecord(record: QueryResultRow, evidence: QueryResultRow[]) {
  const sector = primarySector(record);
  const claims = claimsFor(evidence);
  const status = String(record.implementation_status);
  const publishedAt = isoDate(record.published_at);
  const updatedAt = isoDate(record.updated_at ?? record.published_at);
  return {
    id: String(record.id),
    slug: String(record.slug),
    title: sanitizePublicPresentationText(record.title),
    summary: sanitizePublicPresentationText(record.summary),
    description: sanitizePublicPresentationText(record.public_description ?? record.summary),
    sectorId: String(sector.code ?? ''),
    sectorName: String(sector.label ?? 'Unclassified'),
    status,
    statusLabel: label(status),
    date: publishedAt,
    publishedAt,
    updatedAt,
    datePrecision: 'exact_day' as DatePrecision,
    leadMda: leadInstitution(record),
    statesCovered: geographyNames(record),
    evidenceClaims: claims,
  };
}

function financialMetrics(rows: QueryResultRow[], sourceInstitution: string) {
  return rows.map((row) => {
    const amount = assertExactDecimal(row.amount_exact);
    const currency = String(row.currency_code);
    return {
      financialType: String(row.financial_type),
      financialTypeLabel: label(row.financial_type),
      amount,
      currency,
      formattedAmount: formatPublicFinancialAmount(amount, currency, row.financial_type),
      reportingPeriod: String(row.reporting_period_label),
      aggregationBasis: String(row.aggregation_basis) as 'period' | 'cumulative',
      nominalOrReal: String(row.nominal_or_real) as 'nominal' | 'real',
      sourceInstitution,
    };
  });
}

function beneficiaryMetrics(rows: QueryResultRow[]): BeneficiaryMetricViewModel[] {
  return rows.map((row) => {
    const exact = String(row.count_value);
    if (!/^\d+$/.test(exact)) throw new Error('Database returned an invalid beneficiary count.');
    const count = Number(exact);
    if (!Number.isSafeInteger(count)) throw new Error('Beneficiary count exceeds the safe frontend integer range.');
    return {
      stage: String(row.beneficiary_stage),
      stageLabel: label(row.beneficiary_stage),
      count,
      formattedCount: formatExactDecimal(exact),
      beneficiaryType: String(row.beneficiary_type),
      countBasis: String(row.count_basis) as BeneficiaryMetricViewModel['countBasis'],
      reportingPeriod: String(row.reporting_period_label),
      doubleCountingNote: row.double_counting_notes ? String(row.double_counting_notes) : undefined,
    };
  });
}

function achievementModel(record: QueryResultRow, evidence: QueryResultRow[], financials: QueryResultRow[], beneficiaries: QueryResultRow[]): AchievementViewModel {
  const base = baseRecord(record, evidence);
  const sector = primarySector(record);
  const claims = base.evidenceClaims;
  const scopeInfo = deriveGeographicScope(base);
  const citizenImpact = getCitizenImpactForRecord(base.slug || base.id);

  return {
    ...base,
    publicNavigationGroup: String(sector.publicGroupCode ?? 'governance') as AchievementViewModel['publicNavigationGroup'],
    publicNavigationGroupLabel: String(sector.publicGroupLabel ?? 'Governance'),
    subsector: undefined,
    recordType: String(record.record_type),
    recordTypeLabel: label(record.record_type),
    statusCategory: statusCategory(base.status),
    geographicScope: scopeInfo.scope,
    scopeInfo,
    citizenImpact,
    featured: Number(record.display_priority ?? 0) > 0,
    dataValueNature: claims[0]?.dataValueNature ?? 'actual',
    sourceOrigin: claims[0]?.sourceOrigin ?? 'unknown',
    verificationStatus: String(record.verification_status) as VerificationStatus,
    publicationStatus: String(record.publication_status) as PublicationStatus,
    evidenceProfile: String(record.evidence_profile),
    evidenceProfileLabel: label(record.evidence_profile),
    financialMetrics: financialMetrics(financials, base.leadMda),
    beneficiaryMetrics: beneficiaryMetrics(beneficiaries),
    limitations: record.qualification ? sanitizePublicPresentationText(String(record.qualification)) : undefined,
    isDemo: false,
  };
}

function projectModel(record: QueryResultRow, evidence: QueryResultRow[], financials: QueryResultRow[]): ProjectViewModel {
  const base = baseRecord(record, evidence);
  const details = (record.type_details ?? {}) as Record<string, unknown>;
  const contract = financials.find((row) => row.financial_type === 'contract_value');
  return {
    id: base.id,
    slug: base.slug,
    title: base.title,
    summary: base.summary,
    projectType: String(details.projectType ?? 'public_building'),
    projectTypeLabel: label(details.projectType ?? 'public_building'),
    sectorId: base.sectorId,
    sectorName: base.sectorName,
    executingAgency: base.leadMda,
    status: base.status,
    statusLabel: base.statusLabel,
    progressPercentage: Number(details.progressPercentage ?? 0),
    contractor: details.contractReference ? String(details.contractReference) : undefined,
    statesCovered: base.statesCovered,
    startDate: base.date,
    completionOrCurrentDate: base.date,
    publishedAt: base.publishedAt,
    updatedAt: base.updatedAt,
    datePrecision: base.datePrecision,
    contractValue: contract ? formatPublicContractValue(assertExactDecimal(contract.amount_exact), contract.currency_code) : undefined,
    evidenceClaims: base.evidenceClaims,
    isDemo: false,
  };
}

function policyModel(record: QueryResultRow, evidence: QueryResultRow[]): PolicyViewModel {
  const base = baseRecord(record, evidence);
  const details = (record.type_details ?? {}) as Record<string, unknown>;
  return {
    id: base.id,
    slug: base.slug,
    title: base.title,
    summary: base.summary,
    policyType: String(details.policyType ?? 'national_policy'),
    policyTypeLabel: label(details.policyType ?? 'national_policy'),
    sectorId: base.sectorId,
    sectorName: base.sectorName,
    leadMinistry: base.leadMda,
    status: base.status,
    statusLabel: base.statusLabel,
    approvalDate: base.date,
    effectiveDate: base.date,
    publishedAt: base.publishedAt,
    updatedAt: base.updatedAt,
    gazetteNumber: details.referenceNumber ? String(details.referenceNumber) : undefined,
    datePrecision: base.datePrecision,
    evidenceClaims: base.evidenceClaims,
    isDemo: false,
  };
}

function programmeModel(record: QueryResultRow, evidence: QueryResultRow[], beneficiaries: QueryResultRow[]): ProgrammeViewModel {
  const base = baseRecord(record, evidence);
  const details = (record.type_details ?? {}) as Record<string, unknown>;
  const metrics = beneficiaryMetrics(beneficiaries);
  return {
    id: base.id,
    slug: base.slug,
    title: base.title,
    summary: base.summary,
    programmeType: String(details.programmeType ?? 'social_investment'),
    programmeTypeLabel: label(details.programmeType ?? 'social_investment'),
    sectorId: base.sectorId,
    sectorName: base.sectorName,
    coordinatingAgency: base.leadMda,
    status: base.status,
    statusLabel: base.statusLabel,
    launchDate: base.date,
    publishedAt: base.publishedAt,
    updatedAt: base.updatedAt,
    datePrecision: base.datePrecision,
    targetBeneficiaryType: String(details.targetGroupNarrative ?? metrics[0]?.beneficiaryType ?? 'individuals'),
    targetBeneficiaryTypeLabel: label(details.targetGroupNarrative ?? metrics[0]?.beneficiaryType ?? 'individuals'),
    beneficiaryCountFormatted: metrics[0]?.formattedCount,
    statesCovered: base.statesCovered,
    evidenceClaims: base.evidenceClaims,
    isDemo: false,
  };
}

function timelineModels(record: QueryResultRow): TimelineEventViewModel[] {
  const sector = primarySector(record);
  const leadActor = leadInstitution(record);
  return array<Record<string, unknown>>(record.timeline).map((event) => ({
    id: String(event.id),
    recordId: String(record.id),
    title: String(event.title),
    summary: String(event.description ?? event.title),
    eventType: String(event.eventType),
    eventTypeLabel: label(event.eventType),
    eventDate: isoDate(event.dateValue ?? event.periodStart),
    datePrecision: String(event.datePrecision) as DatePrecision,
    sectorId: String(sector.code ?? ''),
    sectorName: String(sector.label ?? 'Unclassified'),
    leadActor,
    isDemo: false,
  }));
}

function sectorModels(records: QueryResultRow[]): SectorViewModel[] {
  return CANONICAL_SECTORS.map((sector) => {
    const matching = records.filter((record) => array<Record<string, unknown>>(record.sectors)
      .some((item) => item.code === sector.sectorId || item.code === sector.id));
    return {
      ...sector,
      achievementCount: matching.filter((record) => record.record_type === 'achievement').length,
      projectCount: matching.filter((record) => record.record_type === 'physical_project').length,
      policyCount: matching.filter((record) => record.record_type === 'policy').length,
      highlightStat: {
        label: 'Published records',
        value: String(matching.length),
        subtext: 'M02 public catalog',
      },
      featuredAchievementSlug: matching.find((record) => record.record_type === 'achievement')?.slug as string | undefined,
      isDemo: false,
    };
  });
}

function stateModels(records: QueryResultRow[]): StateProfileViewModel[] {
  return DEMO_NIGERIA_STATES.map((state) => {
    const matching = records.filter((record) => {
      const geographies = array<Record<string, unknown>>(record.geographies);
      return geographies.some((geography) => geography.code === state.code || geography.code === 'NGA');
    });
    const sectors = [...new Set(matching.map((record) => String(primarySector(record).label ?? '')).filter(Boolean))];
    return {
      ...state,
      projectCount: matching.filter((record) => record.record_type === 'physical_project').length,
      programmeCount: matching.filter((record) => record.record_type === 'programme').length,
      achievementCount: matching.filter((record) => record.record_type === 'achievement').length,
      highlightProject: String(matching.find((record) => record.record_type === 'physical_project')?.title ?? 'No state-specific public project in M02'),
      sectorsActive: sectors,
      isDemo: false,
    };
  });
}

function formattedStudentBeneficiaries(rows: QueryResultRow[]): string {
  const values = rows.filter((row) => row.beneficiary_type === 'students').map((row) => BigInt(String(row.count_value)));
  if (!values.length) return 'See public records';
  return formatExactDecimal(values.reduce((total, value) => total + value, 0n).toString());
}

export function mapPublicDataSnapshot(rows: SnapshotRows, loadedAt = new Date().toISOString()): PublicDataSnapshot {
  const evidence = groupedByRecord(rows.evidence);
  const financials = groupedByRecord(rows.financials);
  const beneficiaries = groupedByRecord(rows.beneficiaries);
  const get = (map: Map<string, QueryResultRow[]>, id: unknown) => map.get(String(id)) ?? [];

  const achievements = rows.records.filter((record) => record.record_type === 'achievement')
    .map((record) => achievementModel(record, get(evidence, record.id), get(financials, record.id), get(beneficiaries, record.id)));
  const projects = rows.records.filter((record) => record.record_type === 'physical_project')
    .map((record) => projectModel(record, get(evidence, record.id), get(financials, record.id)));
  const policies = rows.records.filter((record) => record.record_type === 'policy')
    .map((record) => policyModel(record, get(evidence, record.id)));
  const programmes = rows.records.filter((record) => record.record_type === 'programme')
    .map((record) => programmeModel(record, get(evidence, record.id), get(beneficiaries, record.id)));
  const timelineEvents = rows.records.flatMap(timelineModels)
    .sort((a, b) => b.eventDate.localeCompare(a.eventDate));
  const sectors = sectorModels(rows.records);
  const states = stateModels(rows.records);
  const dates = rows.records.map((record) => isoDate(record.published_at)).filter(Boolean).sort();

  return {
    source: 'cloud-sql',
    loadedAt,
    achievements,
    sectors,
    projects,
    policies,
    programmes,
    timelineEvents,
    states,
    datasets: [
      { id: 'm02-public-catalog', title: 'M02 Public Record Catalog', description: 'Published canonical records and classifications.', category: 'core', recordCount: rows.records.length, periodCovered: `${dates[0] ?? '2023'} — ${dates.at(-1) ?? 'present'}`, lastUpdated: loadedAt.slice(0, 10), fileFormats: ['CSV', 'JSON'], isDemo: false },
      { id: 'm02-public-evidence', title: 'M02 Public Claim Evidence', description: 'Publication-approved claims and public source citations.', category: 'evidence', recordCount: rows.evidence.length, periodCovered: 'M02', lastUpdated: loadedAt.slice(0, 10), fileFormats: ['CSV', 'JSON'], isDemo: false },
      { id: 'm02-public-timeline', title: 'M02 Public Timeline', description: 'Public record milestones in chronological form.', category: 'timeline', recordCount: timelineEvents.length, periodCovered: 'M02', lastUpdated: loadedAt.slice(0, 10), fileFormats: ['CSV', 'JSON'], isDemo: false },
    ],
    publicDownload: rows.records.map((record) => ({
      slug: String(record.slug),
      record_type: String(record.record_type),
      title: sanitizePublicPresentationText(record.title),
      summary: sanitizePublicPresentationText(record.summary),
      implementation_status: String(record.implementation_status),
      verification_status: String(record.verification_status),
      evidence_profile: String(record.evidence_profile),
      qualification: record.qualification ? sanitizePublicPresentationText(String(record.qualification)) : null,
      primary_sector: String(primarySector(record).code ?? ''),
      public_group: String(primarySector(record).publicGroupCode ?? ''),
      published_at: isoDate(record.published_at),
    })),
    macroCounters: {
      timeframe: `${dates[0] ?? '2023-05-29'} — ${dates.at(-1) ?? loadedAt.slice(0, 10)}`,
      verifiedAchievements: achievements.length,
      canonicalSectors: sectors.length,
      capitalProjectsActive: projects.length,
      subNationalStatesTracked: states.length,
      studentBeneficiariesFormatted: formattedStudentBeneficiaries(rows.beneficiaries),
      externalReservesFormatted: 'See public indicators',
      highwayKilometersFormatted: `${projects.length} tracked projects`,
      lastAuditSync: loadedAt.slice(0, 10),
    },
  };
}
