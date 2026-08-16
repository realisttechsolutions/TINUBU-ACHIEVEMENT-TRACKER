import type { QueryResultRow } from 'pg';
import type { QueryExecutor } from '@/server/db/pool';

export interface PublicRecordFilters {
  search?: string;
  sector?: string;
  status?: string;
  geography?: string;
  limit?: number;
  offset?: number;
}

export interface PublicRecordBundle {
  record: QueryResultRow | null;
  evidence: QueryResultRow[];
  financials: QueryResultRow[];
  beneficiaries: QueryResultRow[];
}

function pagination(limit = 100, offset = 0): [number, number] {
  if (!Number.isInteger(limit) || limit < 1 || limit > 500) throw new Error('limit must be between 1 and 500.');
  if (!Number.isInteger(offset) || offset < 0) throw new Error('offset must be a non-negative integer.');
  return [limit, offset];
}

export class PublicDataRepository {
  constructor(private readonly db: QueryExecutor) {}

  async getHomepageSummary() {
    const result = await this.db.query(`
      SELECT
        count(*)::int AS published_records,
        count(*) FILTER (WHERE implementation_status IN
          ('completed', 'operational', 'outcome_reported', 'independently_assessed'))::int
          AS delivered_or_operational,
        count(*) FILTER (WHERE verification_status = 'independently_corroborated')::int
          AS independently_corroborated,
        max(published_at) AS latest_published_at
      FROM public_record_catalog`);
    return result.rows[0] ?? null;
  }

  async listRecords(filters: PublicRecordFilters = {}) {
    const [limit, offset] = pagination(filters.limit, filters.offset);
    const clauses: string[] = [];
    const values: unknown[] = [];
    const bind = (value: unknown) => {
      values.push(value);
      return `$${values.length}`;
    };

    if (filters.search?.trim()) {
      const parameter = bind(filters.search.trim());
      clauses.push(`(
        to_tsvector('simple', title || ' ' || summary) @@ plainto_tsquery('simple', ${parameter})
        OR EXISTS (
          SELECT 1 FROM jsonb_array_elements(institutions) AS institution
          WHERE lower(institution->>'name') LIKE '%' || lower(${parameter}) || '%'
        )
        OR EXISTS (
          SELECT 1 FROM jsonb_array_elements(sectors) AS sector
          WHERE lower(sector->>'label') LIKE '%' || lower(${parameter}) || '%'
        )
      )`);
    }
    if (filters.sector) {
      const parameter = bind(filters.sector);
      clauses.push(`EXISTS (
        SELECT 1 FROM jsonb_array_elements(sectors) AS sector
        WHERE sector->>'code' = ${parameter} OR sector->>'publicGroupCode' = ${parameter}
      )`);
    }
    if (filters.status) clauses.push(`implementation_status = ${bind(filters.status)}`);
    if (filters.geography) {
      const parameter = bind(filters.geography);
      clauses.push(`EXISTS (
        SELECT 1 FROM jsonb_array_elements(geographies) AS geography
        WHERE geography->>'code' = ${parameter}
      )`);
    }

    values.push(limit, offset);
    const where = clauses.length ? `WHERE ${clauses.join('\n AND ')}` : '';
    const result = await this.db.query(
      `SELECT * FROM public_record_catalog
       ${where}
       ORDER BY published_at DESC NULLS LAST, id
       LIMIT $${values.length - 1} OFFSET $${values.length}`,
      values,
    );
    return result.rows;
  }

  async getRecordDetail(slug: string): Promise<PublicRecordBundle> {
    if (!slug.trim()) return { record: null, evidence: [], financials: [], beneficiaries: [] };
    const [record, evidence, financials, beneficiaries] = await Promise.all([
      this.db.query('SELECT * FROM public_record_catalog WHERE slug = $1', [slug]),
      this.db.query(`
        SELECT evidence.*
        FROM public_claim_evidence evidence
        JOIN public_record_catalog record ON record.id = evidence.record_id
        WHERE record.slug = $1
        ORDER BY evidence.claim_id, evidence.relationship_type, evidence.source_id`, [slug]),
      this.db.query(`
        SELECT financial.*
        FROM public_financial_records financial
        JOIN public_record_catalog record ON record.id = financial.record_id
        WHERE record.slug = $1
        ORDER BY financial.period_start, financial.id`, [slug]),
      this.db.query(`
        SELECT beneficiary.*
        FROM public_beneficiary_records beneficiary
        JOIN public_record_catalog record ON record.id = beneficiary.record_id
        WHERE record.slug = $1
        ORDER BY beneficiary.period_start, beneficiary.id`, [slug]),
    ]);
    return {
      record: record.rows[0] ?? null,
      evidence: evidence.rows,
      financials: financials.rows,
      beneficiaries: beneficiaries.rows,
    };
  }

  async getSectorSummaries() {
    const result = await this.db.query(`
      SELECT
        sector->>'publicGroupCode' AS public_group_code,
        sector->>'publicGroupLabel' AS public_group_label,
        sector->>'code' AS sector_code,
        sector->>'label' AS sector_label,
        count(DISTINCT record.id)::int AS record_count,
        count(DISTINCT record.id) FILTER
          (WHERE record.verification_status = 'independently_corroborated')::int
          AS independently_corroborated_count
      FROM public_record_catalog record
      CROSS JOIN LATERAL jsonb_array_elements(record.sectors) AS sector
      WHERE sector->>'role' = 'primary'
      GROUP BY 1, 2, 3, 4
      ORDER BY 1, 3`);
    return result.rows;
  }

  async getGeographySummaries() {
    const result = await this.db.query(`
      SELECT
        geography->>'code' AS geography_code,
        geography->>'name' AS geography_name,
        geography->>'type' AS geography_type,
        count(DISTINCT record.id)::int AS record_count
      FROM public_record_catalog record
      CROSS JOIN LATERAL jsonb_array_elements(record.geographies) AS geography
      GROUP BY 1, 2, 3
      ORDER BY 2`);
    return result.rows;
  }

  async getTimeline(slug?: string) {
    const values = slug ? [slug] : [];
    const where = slug ? 'WHERE record.slug = $1' : '';
    const result = await this.db.query(`
      SELECT record.id AS record_id, record.slug, record.title AS record_title,
             record.sectors, event.*
      FROM public_record_catalog record
      CROSS JOIN LATERAL jsonb_to_recordset(record.timeline) AS event(
        "id" uuid, "eventType" text, "title" text, "description" text,
        "dateValue" date, "datePrecision" text, "periodStart" date,
        "periodEnd" date, "reportingPeriodLabel" text, "provisional" boolean
      )
      ${where}
      ORDER BY COALESCE(event."dateValue", event."periodStart"), event."id"`, values);
    return result.rows;
  }

  async getIndicators() {
    const result = await this.db.query(`
      SELECT record.id AS record_id, record.slug AS record_slug, indicator.*
      FROM public_record_catalog record
      CROSS JOIN LATERAL jsonb_to_recordset(record.indicators) AS indicator(
        "id" uuid, "indicatorId" uuid, "slug" text, "name" text,
        "definition" text, "unit" text, "frequency" text, "methodology" text,
        "valueExact" text, "valueDisplay" text, "reportingPeriodLabel" text,
        "periodStart" date, "periodEnd" date, "dataValueNature" text,
        "sourceOrigin" text, "verificationStatus" text, "provisional" boolean
      )
      ORDER BY indicator."name", indicator."periodStart", indicator."id"`);
    return result.rows;
  }

  async getSafeFinancialAggregates() {
    const result = await this.db.query(`
      SELECT financial_type, currency_code, aggregation_basis, nominal_or_real,
             reporting_period_label, period_start, period_end,
             sum(amount_exact::numeric)::text AS amount_exact
      FROM public_financial_records
      GROUP BY financial_type, currency_code, aggregation_basis, nominal_or_real,
               reporting_period_label, period_start, period_end
      ORDER BY financial_type, currency_code, period_start`);
    return result.rows;
  }

  async getPublicDownload(sector: string | null, status: string | null, limit = 500, offset = 0) {
    const [safeLimit, safeOffset] = pagination(limit, offset);
    const result = await this.db.query(`
      SELECT slug, record_type, title, summary, implementation_status,
             verification_status, evidence_profile, qualification, sectors, published_at
      FROM public_record_catalog
      WHERE ($1::text IS NULL OR EXISTS (
        SELECT 1 FROM jsonb_array_elements(sectors) AS sector
        WHERE sector->>'code' = $1
      ))
        AND ($2::text IS NULL OR implementation_status = $2)
      ORDER BY published_at DESC NULLS LAST, slug
      LIMIT $3 OFFSET $4`, [sector, status, safeLimit, safeOffset]);
    return result.rows;
  }

  async getPublicSnapshotRows() {
    const [records, evidence, financials, beneficiaries] = await Promise.all([
      this.db.query('SELECT * FROM public_record_catalog ORDER BY published_at DESC NULLS LAST, id'),
      this.db.query('SELECT * FROM public_claim_evidence ORDER BY record_id, claim_id, source_id'),
      this.db.query('SELECT * FROM public_financial_records ORDER BY record_id, period_start, id'),
      this.db.query('SELECT * FROM public_beneficiary_records ORDER BY record_id, period_start, id'),
    ]);
    return { records: records.rows, evidence: evidence.rows, financials: financials.rows, beneficiaries: beneficiaries.rows };
  }
}
