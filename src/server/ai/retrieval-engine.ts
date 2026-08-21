import type { QueryExecutor } from '../db/pool';
import type {
  GeographicScopeLevel,
  PTATAIBeneficiary,
  PTATAIClaim,
  PTATAIFinancial,
  PTATAIGeography,
  PTATAIRecord,
  PTATAISource,
  PTATAITimelineEvent,
  QueryConstraints,
  RetrievalOptions,
} from '../../types/ai.types';
import { sanitizePublicPresentationText, formatPublicFinancialAmount } from './formatters';

export function buildGenericAcronymRegex(token: string, mode: 'postgres' | 'js' = 'postgres'): string | null {
  const clean = token.trim().toLowerCase();
  if (clean.length < 2 || clean.length > 8) return null;
  const letters = clean.split('');
  if (!letters.every((c) => /[a-z0-9]/.test(c))) return null;

  const boundary = mode === 'postgres' ? '\\m' : '\\b';
  const stopWordsPattern = '(?:\\s+(?:of|and|in|the|for|to|on|at|by|with)\\s+|\\s+|[-_])';
  const parts = letters.map((l) => `${boundary}${l}[a-z0-9]*`);
  return parts.join(stopWordsPattern);
}

export interface RawRetrievalResults {
  records: PTATAIRecord[];
  claims: PTATAIClaim[];
  sources: PTATAISource[];
  financials: PTATAIFinancial[];
  beneficiaries: PTATAIBeneficiary[];
  timelines: PTATAITimelineEvent[];
  geographies: PTATAIGeography[];
  stats: {
    recordsScanned: number;
    claimsScanned: number;
    sourcesScanned: number;
    latencyMs: number;
  };
}

function mapGeographicScope(scopeStr: string | null | undefined): GeographicScopeLevel {
  const s = String(scopeStr || '').toUpperCase();
  if (s === 'STATE_SPECIFIC' || s === 'STATE') return 'STATE_SPECIFIC';
  if (s === 'FCT_SPECIFIC' || s === 'FCT') return 'FCT_SPECIFIC';
  if (s === 'PROJECT_CORRIDOR') return 'PROJECT_CORRIDOR';
  if (s === 'MULTI_STATE') return 'MULTI_STATE';
  if (s === 'REGIONAL_ZONAL') return 'REGIONAL_ZONAL';
  return 'NATIONWIDE';
}

function getGeographicPriority(scope: GeographicScopeLevel): number {
  switch (scope) {
    case 'STATE_SPECIFIC':
      return 1;
    case 'FCT_SPECIFIC':
      return 2;
    case 'PROJECT_CORRIDOR':
      return 3;
    case 'MULTI_STATE':
      return 4;
    case 'REGIONAL_ZONAL':
      return 5;
    case 'NATIONWIDE':
      return 6;
    default:
      return 7;
  }
}

export class PTATAIRetrievalEngine {
  private readonly db: QueryExecutor;

  constructor(db: QueryExecutor) {
    this.db = db;
  }

  async retrieve(constraints: QueryConstraints, options: RetrievalOptions = {}): Promise<RawRetrievalResults> {
    const startTime = Date.now();
    const limit = options.limitRecords || 25;

    // 1. Build Parameterized Query against public_record_catalog ONLY
    const clauses: string[] = [];
    const values: unknown[] = [];
    const bind = (val: unknown) => {
      values.push(val);
      return `$${values.length}`;
    };

    // State / Geography Filter (parsed purely from public_record_catalog.geographies JSONB)
    if (constraints.stateCode || constraints.state) {
      const codeParam = constraints.stateCode ? bind(constraints.stateCode) : null;
      const nameParam = constraints.state ? bind(`%${constraints.state.toLowerCase()}%`) : null;
      clauses.push(`EXISTS (
        SELECT 1 FROM jsonb_array_elements(geographies) AS g
        WHERE ${codeParam ? `g->>'code' = ${codeParam}` : 'false'}
           OR ${nameParam ? `lower(g->>'name') LIKE ${nameParam}` : 'false'}
      )`);
    }

    // Sector Filter (parsed purely from public_record_catalog.sectors JSONB or fulltext fallback)
    if (constraints.sectorCode || constraints.sector) {
      const secCode = constraints.sectorCode ? bind(constraints.sectorCode) : null;
      const secLabel = constraints.sector ? bind(`%${constraints.sector.toLowerCase()}%`) : null;
      clauses.push(`(
        EXISTS (
          SELECT 1 FROM jsonb_array_elements(sectors) AS s
          WHERE ${secCode ? `s->>'code' = ${secCode} OR s->>'publicGroupCode' = ${secCode}` : 'false'}
             OR ${secLabel ? `lower(s->>'label') LIKE ${secLabel} OR lower(s->>'code') LIKE ${secLabel}` : 'false'}
        )
        OR to_tsvector('english', title || ' ' || summary) @@ plainto_tsquery('english', ${secCode || secLabel})
      )`);
    }

    // Record Type Filter (hard filter when no specific entity/keyword is searched)
    if (constraints.recordType && (!constraints.keywords || constraints.keywords.length === 0)) {
      clauses.push(`record_type = ${bind(constraints.recordType)}`);
    }

    // Status Filter
    if (constraints.statusConstraint) {
      if (constraints.statusConstraint === 'completed') {
        clauses.push(`implementation_status IN ('completed', 'operational', 'outcome_reported')`);
      } else if (constraints.statusConstraint === 'operational') {
        clauses.push(`implementation_status = 'operational'`);
      } else if (constraints.statusConstraint === 'enacted') {
        clauses.push(`implementation_status IN ('enacted', 'legislated', 'policy_enacted')`);
      } else {
        clauses.push(`implementation_status = ${bind(constraints.statusConstraint)}`);
      }
    }

    // Year / Date Filter
    if (constraints.dateStart) {
      clauses.push(`published_at >= ${bind(constraints.dateStart)}::timestamptz`);
    } else if (constraints.year) {
      clauses.push(`EXTRACT(YEAR FROM published_at) = ${bind(constraints.year)}`);
    }

    // Entity / Keyword Filter (Data-driven ranked search across title, summary, slug, institutions, acronyms)
    let rankExpr = '0';
    if (constraints.entityId) {
      const entIdParam = bind(constraints.entityId);
      clauses.push(`(slug = ${entIdParam} OR id::text = ${entIdParam})`);
    } else if (constraints.entityName || (constraints.keywords && constraints.keywords.length > 0)) {
      const searchPhrase = constraints.entityName || constraints.keywords!.join(' ');
      const rawTokens = (constraints.keywords || searchPhrase.split(/\s+/)).map((t) => t.toLowerCase().trim()).filter(Boolean);

      const allSearchTerms = new Set<string>();
      if (searchPhrase.trim()) allSearchTerms.add(searchPhrase.trim());
      for (const t of rawTokens) allSearchTerms.add(t);

      const textConditions: string[] = [];
      const rankScores: string[] = [];

      for (const term of allSearchTerms) {
        const isPhrase = term.includes(' ');
        const weight = isPhrase ? 15 : 10;
        const p = bind(term);

        if (isPhrase) {
          textConditions.push(`title ILIKE ('%' || ${p} || '%')`);
          textConditions.push(`summary ILIKE ('%' || ${p} || '%')`);
          textConditions.push(`slug ILIKE ('%' || ${p} || '%')`);
          textConditions.push(`to_tsvector('english', title || ' ' || summary) @@ phraseto_tsquery('english', ${p})`);
          textConditions.push(`EXISTS (
            SELECT 1 FROM jsonb_array_elements(institutions) AS inst
            WHERE inst->>'name' ILIKE ('%' || ${p} || '%')
          )`);

          rankScores.push(`CASE WHEN title ILIKE ('%' || ${p} || '%') THEN ${weight * 4} ELSE 0 END`);
          rankScores.push(`CASE WHEN slug ILIKE ('%' || ${p} || '%') THEN ${weight * 3} ELSE 0 END`);
          rankScores.push(`CASE WHEN summary ILIKE ('%' || ${p} || '%') THEN ${weight * 2} ELSE 0 END`);
        } else {
          textConditions.push(`title ~* ('\\m' || ${p} || '\\M')`);
          textConditions.push(`summary ~* ('\\m' || ${p} || '\\M')`);
          textConditions.push(`slug ~* ('\\m' || ${p} || '\\M')`);
          textConditions.push(`to_tsvector('english', title || ' ' || summary) @@ plainto_tsquery('english', ${p})`);
          textConditions.push(`EXISTS (
            SELECT 1 FROM jsonb_array_elements(institutions) AS inst
            WHERE lower(inst->>'code') = lower(${p}) OR inst->>'name' ~* ('\\m' || ${p} || '\\M')
          )`);

          rankScores.push(`CASE WHEN title ~* ('\\m' || ${p} || '\\M') THEN ${weight * 4} ELSE 0 END`);
          rankScores.push(`CASE WHEN slug ~* ('\\m' || ${p} || '\\M') THEN ${weight * 3} ELSE 0 END`);
          rankScores.push(`CASE WHEN summary ~* ('\\m' || ${p} || '\\M') THEN ${weight * 2} ELSE 0 END`);
        }

        // Generic Data-Driven Acronym Matching
        const acrRegex = buildGenericAcronymRegex(term);
        if (acrRegex) {
          const acrParam = bind(acrRegex);
          textConditions.push(`title ~* ${acrParam}`);
          textConditions.push(`slug ~* ${acrParam}`);
          textConditions.push(`EXISTS (
            SELECT 1 FROM jsonb_array_elements(institutions) AS inst
            WHERE inst->>'name' ~* ${acrParam} OR lower(inst->>'code') = lower(${p})
          )`);

          rankScores.push(`CASE WHEN title ~* ${acrParam} THEN 35 ELSE 0 END`);
          rankScores.push(`CASE WHEN slug ~* ${acrParam} THEN 25 ELSE 0 END`);
        }
      }

      if (textConditions.length > 0) {
        clauses.push(`(${textConditions.join(' OR ')})`);
      }
      if (rankScores.length > 0) {
        rankExpr = `(${rankScores.join(' + ')})`;
      }
    }

    const where = clauses.length > 0 ? `WHERE ${clauses.join('\n AND ')}` : '';
    const recordsSql = `
      SELECT
        id, slug, record_type, title, summary, implementation_status,
        publication_status, verification_status, evidence_profile,
        published_at, public_description, sectors, institutions,
        geographies, timeline, type_details, ${rankExpr} as rank_score
      FROM public_record_catalog
      ${where}
      ORDER BY rank_score DESC, published_at DESC NULLS LAST, id
      LIMIT ${bind(limit)};
    `;

    const recordsRes = await this.db.query(recordsSql, values);
    const rawRecords = recordsRes.rows;

    const timelines: PTATAITimelineEvent[] = [];
    const allGeographies: PTATAIGeography[] = [];

    const records: PTATAIRecord[] = rawRecords.map((r) => {
      const sectors = Array.isArray(r.sectors) ? r.sectors : [];
      const institutions = Array.isArray(r.institutions) ? r.institutions : [];
      const geos = Array.isArray(r.geographies) ? r.geographies : [];
      const timelineArr = Array.isArray(r.timeline) ? r.timeline : [];

      let scope: GeographicScopeLevel = 'NATIONWIDE';
      if (geos.length === 1 && (geos[0].code === 'NG-FC' || geos[0].name?.toLowerCase().includes('federal capital'))) {
        scope = 'FCT_SPECIFIC';
      } else if (geos.length === 1 && geos[0].code?.startsWith('NG-')) {
        scope = 'STATE_SPECIFIC';
      } else if (geos.length > 1 && geos.length <= 6) {
        scope = 'MULTI_STATE';
      }

      // Collect Geographies from public_record_catalog JSONB
      for (const g of geos) {
        allGeographies.push({
          recordId: String(r.id),
          recordExternalId: String(r.slug),
          stateName: String(g.name || 'Nigeria'),
          stateCode: String(g.code || 'NGA'),
          scope: mapGeographicScope(g.type || g.scope),
          facilityOrSite: g.role ? String(g.role) : undefined,
        });
      }

      // Collect Timeline Events from public_record_catalog JSONB
      for (const t of timelineArr) {
        timelines.push({
          eventId: String(t.id || `${r.id}-evt`),
          recordId: String(r.id),
          recordExternalId: String(r.slug),
          eventType: String(t.eventType || 'milestone'),
          eventTitle: String(t.title || r.title),
          eventDate: t.dateValue ? String(t.dateValue).slice(0, 10) : '',
          provisional: Boolean(t.provisional),
        });
      }

      const rawTitle = String(r.title);
      const sanitizedTitle = sanitizePublicPresentationText(rawTitle);

      const rawSummary = String(r.summary);
      const sanitizedSummary = sanitizePublicPresentationText(rawSummary);

      return {
        id: String(r.id),
        externalId: String(r.slug),
        slug: String(r.slug),
        recordType: String(r.record_type) as PTATAIRecord['recordType'],
        title: sanitizedTitle || rawTitle,
        summary: sanitizedSummary || rawSummary,
        implementationStatus: String(r.implementation_status),
        workflowStatus: 'ready_for_publication',
        publicationStatus: String(r.publication_status),
        verificationStatus: String(r.verification_status),
        evidenceProfile: String(r.evidence_profile),
        riskLevel: 'low',
        isPublic: true,
        sectors: sectors.map((s: any) => ({ code: String(s.code), label: String(s.label) })),
        institutions: institutions.map((i: any) => ({ code: String(i.code), name: String(i.name) })),
        geographies: geos.map((g: any) => ({
          code: String(g.code),
          name: String(g.name),
          scope: mapGeographicScope(g.type || g.scope),
          role: g.role ? String(g.role) : undefined,
        })),
        geographicScope: scope,
        publishedAt: r.published_at ? new Date(r.published_at).toISOString() : undefined,
        citizenImpactSummary: r.public_description ? sanitizePublicPresentationText(String(r.public_description)) : undefined,
        route: `/records/${r.slug}`,
        rankScore: Number(r.rank_score || 0),
      };
    });

    records.sort((a, b) => getGeographicPriority(a.geographicScope) - getGeographicPriority(b.geographicScope));

    if (records.length === 0) {
      return {
        records: [],
        claims: [],
        sources: [],
        financials: [],
        beneficiaries: [],
        timelines: [],
        geographies: [],
        stats: {
          recordsScanned: 0,
          claimsScanned: 0,
          sourcesScanned: 0,
          latencyMs: Date.now() - startTime,
        },
      };
    }

    const recordUuids = records.map((r) => r.id);
    const uuidPlaceholders = recordUuids.map((_, idx) => `$${idx + 1}`).join(',');

    // 2. Retrieve Claims and Linked Sources from public_claim_evidence ONLY
    const claimsSql = `
      SELECT
        claim_id,
        record_id,
        claim_type,
        claim_text,
        value_numeric,
        value_text,
        unit_code,
        currency_code,
        reporting_period_label,
        data_value_nature,
        source_origin,
        verification_status,
        limitations,
        relationship_type,
        source_role,
        evidence_location,
        evidence_summary,
        source_id,
        source_title,
        publisher_name,
        source_type,
        source_level,
        original_url,
        archival_url,
        publication_date,
        publication_date_precision
      FROM public_claim_evidence
      WHERE record_id IN (${uuidPlaceholders})
      ORDER BY claim_id;
    `;

    const claimsRes = await this.db.query(claimsSql, recordUuids);
    const claimMap = new Map<string, PTATAIClaim>();
    const sourceMap = new Map<string, PTATAISource>();

    for (const row of claimsRes.rows) {
      const claimId = String(row.claim_id);
      const parentRecord = records.find((r) => r.id === row.record_id);
      const recordExternalId = parentRecord ? parentRecord.slug : String(row.record_id);
      const rawClaimText = String(row.claim_text);
      const sanitizedClaim = sanitizePublicPresentationText(rawClaimText);

      let claimObj = claimMap.get(claimId);
      if (!claimObj) {
        claimObj = {
          claimId,
          recordId: String(row.record_id),
          recordExternalId,
          claimText: rawClaimText,
          publicClaimSummary: sanitizedClaim !== rawClaimText ? sanitizedClaim : undefined,
          claimType: String(row.claim_type),
          effectiveDate: row.publication_date ? new Date(row.publication_date).toISOString().slice(0, 10) : undefined,
          dataValueNature: String(row.data_value_nature),
          sourceOrigin: String(row.source_origin),
          verificationStatus: String(row.verification_status),
          sources: [],
        };
        claimMap.set(claimId, claimObj);
      }

      if (row.source_id) {
        const sourceId = String(row.source_id);
        const rawSourceTitle = String(row.source_title);
        const sanitizedSourceTitle = sanitizePublicPresentationText(rawSourceTitle);
        const isOfficial = String(row.source_level) === 'LEVEL_1' || String(row.publisher_name).toLowerCase().includes('ministry') || String(row.publisher_name).toLowerCase().includes('state house') || String(row.publisher_name).toLowerCase().includes('presidency') || String(row.publisher_name).toLowerCase().includes('cbn') || String(row.publisher_name).toLowerCase().includes('nsia');

        const sourceObj: PTATAISource = {
          sourceId,
          title: rawSourceTitle,
          displayTitle: sanitizedSourceTitle !== rawSourceTitle ? sanitizedSourceTitle : undefined,
          publisher: String(row.publisher_name || 'Federal Government Agency'),
          url: row.original_url ? String(row.original_url) : undefined,
          publicationDate: row.publication_date ? new Date(row.publication_date).toISOString().slice(0, 10) : undefined,
          sourceLevel: String(row.source_level || 'LEVEL_1'),
          sourceType: String(row.source_type || 'agency_portal'),
          isPrimaryOfficial: isOfficial,
          evidenceLocation: row.evidence_location ? String(row.evidence_location) : undefined,
          evidenceSummary: row.evidence_summary ? String(row.evidence_summary) : undefined,
        };

        if (!options.primarySourcesOnly && !constraints.primaryOnly) {
          if (!claimObj.sources.some((s) => s.sourceId === sourceId)) {
            claimObj.sources.push(sourceObj);
          }
          sourceMap.set(sourceId, sourceObj);
        } else if (sourceObj.isPrimaryOfficial || sourceObj.sourceLevel === 'LEVEL_1') {
          if (!claimObj.sources.some((s) => s.sourceId === sourceId)) {
            claimObj.sources.push(sourceObj);
          }
          sourceMap.set(sourceId, sourceObj);
        }
      }
    }

    // 3. Retrieve Financial Records from public_financial_records ONLY
    const finSql = `
      SELECT
        id as financial_id,
        record_id,
        financial_type,
        amount_exact,
        currency_code,
        reporting_period_label,
        period_start,
        period_end,
        aggregation_basis,
        nominal_or_real
      FROM public_financial_records
      WHERE record_id IN (${uuidPlaceholders})
      ORDER BY id;
    `;
    const finRes = await this.db.query(finSql, recordUuids);
    const financials: PTATAIFinancial[] = finRes.rows.map((f) => {
      const parentRecord = records.find((r) => r.id === f.record_id);
      const amountStr = String(f.amount_exact);
      const currency = String(f.currency_code || 'NGN');
      const finType = String(f.financial_type);
      return {
        financialId: String(f.financial_id),
        recordId: String(f.record_id),
        recordExternalId: parentRecord ? parentRecord.slug : String(f.record_id),
        amountExact: amountStr,
        formattedAmount: formatPublicFinancialAmount(amountStr, currency, finType),
        currencyCode: currency,
        financialType: finType,
        financialTypeLabel: finType.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
        reportingPeriod: f.reporting_period_label ? String(f.reporting_period_label) : undefined,
        periodStart: f.period_start ? new Date(f.period_start).toISOString().slice(0, 10) : undefined,
        periodEnd: f.period_end ? new Date(f.period_end).toISOString().slice(0, 10) : undefined,
        aggregationBasis: f.aggregation_basis ? String(f.aggregation_basis) : undefined,
        nominalOrReal: f.nominal_or_real ? String(f.nominal_or_real) : undefined,
      };
    });

    // 4. Retrieve Beneficiary Records from public_beneficiary_records ONLY
    const benSql = `
      SELECT
        id as beneficiary_id,
        record_id,
        beneficiary_type,
        beneficiary_stage,
        count_value,
        unit,
        count_basis,
        cumulative,
        reporting_period_label,
        cohort_key
      FROM public_beneficiary_records
      WHERE record_id IN (${uuidPlaceholders})
      ORDER BY id;
    `;
    const benRes = await this.db.query(benSql, recordUuids);
    const beneficiaries: PTATAIBeneficiary[] = benRes.rows.map((b) => {
      const parentRecord = records.find((r) => r.id === b.record_id);
      const stage = String(b.beneficiary_stage);
      const count = Number(b.count_value || 0);
      return {
        beneficiaryId: String(b.beneficiary_id),
        recordId: String(b.record_id),
        recordExternalId: parentRecord ? parentRecord.slug : String(b.record_id),
        countValue: count,
        formattedCount: count.toLocaleString(),
        unit: String(b.unit || 'people'),
        beneficiaryType: String(b.beneficiary_type),
        beneficiaryStage: stage,
        beneficiaryStageLabel: stage.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
        countBasis: b.count_basis ? String(b.count_basis) : undefined,
        cumulative: Boolean(b.cumulative),
        reportingPeriod: b.reporting_period_label ? String(b.reporting_period_label) : undefined,
      };
    });

    return {
      records,
      claims: Array.from(claimMap.values()),
      sources: Array.from(sourceMap.values()),
      financials,
      beneficiaries,
      timelines,
      geographies: allGeographies,
      stats: {
        recordsScanned: records.length,
        claimsScanned: claimMap.size,
        sourcesScanned: sourceMap.size,
        latencyMs: Date.now() - startTime,
      },
    };
  }
}
