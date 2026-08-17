import 'server-only';
import { getDatabaseConnection } from '@/server/db/pool';
import { forwardToAdminControlPlane } from './admin-control-plane-client';
import type { StaffUser } from '@/lib/auth/types';
import type {
  CreateRecordInput,
  UpdateRecordOverviewInput,
  ClaimInput,
  SourceInput,
  FinancialRecordInput,
  BeneficiaryRecordInput,
  TimelineEventInput,
  ListAdminRecordsQuery,
} from './validation';

export interface AdminRecordSummary {
  id: string;
  record_type: string;
  title: string;
  slug: string;
  short_summary: string | null;
  implementation_status: string;
  publication_status: string;
  is_public: boolean;
  lead_sector_label: string | null;
  lead_institution_name: string | null;
  geographic_scope: string | null;
  updated_at: string;
  created_at: string;
}

export interface AdminRecordListResult {
  records: AdminRecordSummary[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AdminRecordDetail {
  record: {
    id: string;
    record_type: string;
    title: string;
    slug: string;
    short_summary: string | null;
    full_description: string | null;
    lead_sector_id: string | null;
    lead_institution_id: string | null;
    implementation_status: string;
    publication_status: string;
    is_public: boolean;
    provisional: boolean;
    announced_date: string | null;
    announced_date_precision: string | null;
    start_date: string | null;
    start_date_precision: string | null;
    completion_date: string | null;
    completion_date_precision: string | null;
    geographic_scope: string | null;
    created_at: string;
    updated_at: string;
  };
  profile: Record<string, unknown> | null;
  sectors: Array<{ id: string; code: string; label: string; role_code: string }>;
  institutions: Array<{ id: string; canonical_name: string; short_name: string | null; role_code: string }>;
  geographies: Array<{ id: string; name: string; code: string; geography_type: string; coverage_role: string }>;
  claims: Array<{
    id: string;
    claim_type: string;
    claim_text: string;
    value_numeric: string | null;
    value_text: string | null;
    unit_code: string | null;
    currency_code: string;
    reporting_period_label: string | null;
    data_value_nature: string;
    source_origin: string;
    verification_status: string;
    limitations: string | null;
    sources: Array<{ id: string; title: string; publisher_name: string; original_url: string }>;
  }>;
  sources: Array<{
    id: string;
    title: string;
    publisher_name: string;
    source_type: string;
    source_level: number;
    original_url: string;
    archival_url: string | null;
    publication_date: string | null;
    publication_date_precision: string | null;
    visibility_class: string;
  }>;
  financials: Array<{
    id: string;
    financial_type: string;
    amount: string;
    currency_code: string;
    reporting_period_label: string | null;
    period_start: string | null;
    period_end: string | null;
    nominal_or_real: string;
    methodology: string | null;
    limitations: string | null;
  }>;
  beneficiaries: Array<{
    id: string;
    beneficiary_type: string;
    beneficiary_stage: string;
    count_value: number;
    unit: string;
    count_basis: string | null;
    cumulative: boolean;
    reporting_period_label: string | null;
    period_start: string | null;
    period_end: string | null;
    limitations: string | null;
  }>;
  timeline: Array<{
    id: string;
    event_type: string;
    title: string;
    description: string | null;
    date_value: string | null;
    date_precision: string;
    period_start: string | null;
    period_end: string | null;
    reporting_period_label: string | null;
    provisional: boolean;
    is_public: boolean;
  }>;
  history: Array<{
    id: string;
    action: string;
    actor_email: string;
    details: string | null;
    created_at: string;
  }>;
}

// 1. List Admin Records (Read-Only via Public Catalog/Repo)
export async function listAdminRecords(query: ListAdminRecordsQuery): Promise<AdminRecordListResult> {
  const db = await getDatabaseConnection();
  const conditions: string[] = [];
  const params: unknown[] = [];
  let paramIndex = 1;

  if (query.q && query.q.trim()) {
    conditions.push(`(r.title ILIKE $${paramIndex} OR r.summary ILIKE $${paramIndex} OR r.slug ILIKE $${paramIndex})`);
    params.push(`%${query.q.trim()}%`);
    paramIndex++;
  }

  if (query.type) {
    conditions.push(`r.record_type = $${paramIndex}`);
    params.push(query.type);
    paramIndex++;
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const countResult = await db.query<{ count: string }>(
    `SELECT count(*) as count FROM public_record_catalog r ${whereClause}`,
    params,
  );
  const total = parseInt(countResult.rows[0]?.count || '0', 10);

  const offset = (query.page - 1) * query.limit;
  const recordsResult = await db.query<any>(
    `
    SELECT
      r.id,
      r.record_type,
      r.title,
      r.slug,
      r.summary as short_summary,
      r.implementation_status,
      r.publication_status,
      true as is_public,
      r.updated_at::text,
      r.published_at::text as created_at
    FROM public_record_catalog r
    ${whereClause}
    ORDER BY r.updated_at DESC
    LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `,
    [...params, query.limit, offset],
  );

  return {
    records: recordsResult.rows,
    total,
    page: query.page,
    limit: query.limit,
    totalPages: Math.ceil(total / query.limit) || 1,
  };
}

// 2. Get Admin Record Detail (Read-Only)
export async function getAdminRecordDetail(recordId: string): Promise<AdminRecordDetail | null> {
  const db = await getDatabaseConnection();

  const recordResult = await db.query<any>(
    `
    SELECT
      id,
      slug,
      record_type,
      title,
      summary as short_summary,
      public_description as full_description,
      implementation_status,
      publication_status,
      true as is_public,
      false as provisional,
      updated_at::text,
      published_at::text as created_at,
      type_details,
      sectors,
      institutions,
      geographies,
      timeline,
      indicators
    FROM public_record_catalog
    WHERE id = $1 OR slug = $1
    `,
    [recordId],
  );

  if (recordResult.rows.length === 0) {
    return null;
  }

  const r = recordResult.rows[0];

  // Fetch linked evidence claims
  const claimsRes = await db.query<any>(
    `
    SELECT
      claim_id as id,
      claim_type,
      claim_text,
      value_numeric::text,
      value_text,
      unit_code,
      currency_code,
      reporting_period_label,
      data_value_nature,
      source_origin,
      verification_status,
      limitations,
      source_id,
      source_title,
      publisher_name,
      original_url
    FROM public_claim_evidence
    WHERE record_id = $1
    `,
    [r.id],
  );

  const claimsMap: Record<string, any> = {};
  for (const row of claimsRes.rows) {
    if (!claimsMap[row.id]) {
      claimsMap[row.id] = {
        id: row.id,
        claim_type: row.claim_type,
        claim_text: row.claim_text,
        value_numeric: row.value_numeric,
        value_text: row.value_text,
        unit_code: row.unit_code,
        currency_code: row.currency_code,
        reporting_period_label: row.reporting_period_label,
        data_value_nature: row.data_value_nature,
        source_origin: row.source_origin,
        verification_status: row.verification_status,
        limitations: row.limitations,
        sources: [],
      };
    }
    if (row.source_id) {
      claimsMap[row.id].sources.push({
        id: row.source_id,
        title: row.source_title,
        publisher_name: row.publisher_name,
        original_url: row.original_url,
      });
    }
  }

  // Fetch financials & beneficiaries
  const [finRes, benRes] = await Promise.all([
    db.query<any>(`SELECT * FROM public_financial_records WHERE record_id = $1`, [r.id]),
    db.query<any>(`SELECT * FROM public_beneficiary_records WHERE record_id = $1`, [r.id]),
  ]);

  return {
    record: {
      id: r.id,
      record_type: r.record_type,
      title: r.title,
      slug: r.slug,
      short_summary: r.short_summary,
      full_description: r.full_description,
      lead_sector_id: null,
      lead_institution_id: null,
      implementation_status: r.implementation_status,
      publication_status: r.publication_status,
      is_public: true,
      provisional: false,
      announced_date: null,
      announced_date_precision: null,
      start_date: null,
      start_date_precision: null,
      completion_date: null,
      completion_date_precision: null,
      geographic_scope: 'national',
      created_at: r.created_at,
      updated_at: r.updated_at,
    },
    profile: r.type_details || {},
    sectors: r.sectors || [],
    institutions: r.institutions || [],
    geographies: r.geographies || [],
    claims: Object.values(claimsMap),
    sources: [],
    financials: finRes.rows.map((f: any) => ({
      id: f.id,
      financial_type: f.financial_type,
      amount: f.amount_exact,
      currency_code: f.currency_code,
      reporting_period_label: f.reporting_period_label,
      period_start: f.period_start,
      period_end: f.period_end,
      nominal_or_real: f.nominal_or_real,
      methodology: f.methodology,
      limitations: f.limitations,
    })),
    beneficiaries: benRes.rows.map((b: any) => ({
      id: b.id,
      beneficiary_type: b.beneficiary_type,
      beneficiary_stage: b.beneficiary_stage,
      count_value: parseInt(b.count_value, 10) || 0,
      unit: b.unit,
      count_basis: b.count_basis,
      cumulative: b.cumulative,
      reporting_period_label: b.reporting_period_label,
      period_start: b.period_start,
      period_end: b.period_end,
      limitations: b.limitations,
    })),
    timeline: (r.timeline || []).map((t: any) => ({
      id: t.id,
      event_type: t.eventType,
      title: t.title,
      description: t.description,
      date_value: t.dateValue,
      date_precision: t.datePrecision,
      period_start: t.periodStart,
      period_end: t.periodEnd,
      reporting_period_label: t.reportingPeriodLabel,
      provisional: t.provisional,
      is_public: true,
    })),
    history: [],
  };
}

// 3. Create Record (Proxied to Dedicated Admin Control Plane)
export async function createRecord(
  input: CreateRecordInput,
  staffUser: StaffUser,
): Promise<{ id: string; slug: string }> {
  const res = await forwardToAdminControlPlane('/api/records', {
    method: 'POST',
    body: input,
  });

  if (res.status >= 400) {
    throw new Error(res.data.error || 'Failed to create record via Admin Control Plane');
  }

  return res.data;
}

// 4. Update Record Overview (Proxied to Dedicated Admin Control Plane)
export async function updateRecordOverview(
  recordId: string,
  input: UpdateRecordOverviewInput,
  staffUser: StaffUser,
): Promise<{ success: boolean; updated_at: string }> {
  const res = await forwardToAdminControlPlane(`/api/records/${recordId}`, {
    method: 'PUT',
    body: input,
  });

  if (res.status >= 400) {
    if (res.status === 409) throw new Error('CONCURRENCY_CONFLICT');
    if (res.status === 404) throw new Error('RECORD_NOT_FOUND');
    throw new Error(res.data.error || 'Failed to update record via Admin Control Plane');
  }

  return res.data;
}

// 5. Manage Claims (Proxied to Dedicated Admin Control Plane)
export async function saveClaim(
  recordId: string,
  input: ClaimInput,
  staffUser: StaffUser,
): Promise<{ id: string }> {
  const res = await forwardToAdminControlPlane(`/api/records/${recordId}/claims`, {
    method: 'POST',
    body: input,
  });

  if (res.status >= 400) {
    throw new Error(res.data.error || 'Failed to save claim via Admin Control Plane');
  }

  return res.data;
}

// 6. Manage Sources (Proxied to Dedicated Admin Control Plane)
export async function saveSource(
  input: SourceInput,
  staffUser: StaffUser,
): Promise<{ id: string }> {
  const res = await forwardToAdminControlPlane(`/api/records/${input.id || 'new'}/sources`, {
    method: 'POST',
    body: input,
  });

  if (res.status >= 400) {
    throw new Error(res.data.error || 'Failed to save source via Admin Control Plane');
  }

  return res.data;
}

// 7. Manage Financials (Proxied to Dedicated Admin Control Plane)
export async function saveFinancialRecord(
  recordId: string,
  input: FinancialRecordInput,
  staffUser: StaffUser,
): Promise<{ id: string }> {
  const res = await forwardToAdminControlPlane(`/api/records/${recordId}/financials`, {
    method: 'POST',
    body: input,
  });

  if (res.status >= 400) {
    throw new Error(res.data.error || 'Failed to save financial record via Admin Control Plane');
  }

  return res.data;
}

// 8. Manage Beneficiaries (Proxied to Dedicated Admin Control Plane)
export async function saveBeneficiaryRecord(
  recordId: string,
  input: BeneficiaryRecordInput,
  staffUser: StaffUser,
): Promise<{ id: string }> {
  const res = await forwardToAdminControlPlane(`/api/records/${recordId}/beneficiaries`, {
    method: 'POST',
    body: input,
  });

  if (res.status >= 400) {
    throw new Error(res.data.error || 'Failed to save beneficiary record via Admin Control Plane');
  }

  return res.data;
}

// 9. Manage Timeline Events (Proxied to Dedicated Admin Control Plane)
export async function saveTimelineEvent(
  recordId: string,
  input: TimelineEventInput,
  staffUser: StaffUser,
): Promise<{ id: string }> {
  const res = await forwardToAdminControlPlane(`/api/records/${recordId}/timeline`, {
    method: 'POST',
    body: input,
  });

  if (res.status >= 400) {
    throw new Error(res.data.error || 'Failed to save timeline event via Admin Control Plane');
  }

  return res.data;
}

// 10. Dashboard Stats (Read-Only via Public Catalog)
export async function getAdminDashboardStats() {
  const db = await getDatabaseConnection();

  const [totalRes, byClassRes] = await Promise.all([
    db.query<{ count: string }>(`SELECT count(*) as count FROM public_record_catalog`),
    db.query<{ record_type: string; count: string }>(`
      SELECT record_type, count(*) as count
      FROM public_record_catalog
      GROUP BY record_type
      ORDER BY count DESC
    `),
  ]);

  const recentRes = await db.query<any>(`
    SELECT
      r.id,
      r.record_type,
      r.title,
      r.slug,
      r.summary as short_summary,
      r.implementation_status,
      r.publication_status,
      true as is_public,
      r.updated_at::text,
      r.published_at::text as created_at
    FROM public_record_catalog r
    ORDER BY r.updated_at DESC
    LIMIT 8
  `);

  return {
    totalRecords: parseInt(totalRes.rows[0]?.count || '0', 10),
    draftRecords: 0,
    byClass: byClassRes.rows.map((row: any) => ({
      recordType: row.record_type,
      count: parseInt(row.count, 10),
    })),
    recentRecords: recentRes.rows,
  };
}
