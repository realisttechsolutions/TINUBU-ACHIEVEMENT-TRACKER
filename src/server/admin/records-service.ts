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
  WorkflowTransitionInput,
  OpenCorrectionInput,
  UpdateCorrectionDraftInput,
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
    workflow_status: string;
    publication_status: string;
    is_public: boolean;
    current_revision?: number;
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

// 1. List Admin Records (Proxied to Dedicated Admin Control Plane)
export async function listAdminRecords(query: ListAdminRecordsQuery): Promise<AdminRecordListResult> {
  const searchParams = new URLSearchParams();
  if (query.q) searchParams.set('q', query.q);
  if (query.type) searchParams.set('type', query.type);
  if (query.sector) searchParams.set('sector', query.sector);
  if (query.status) searchParams.set('status', query.status);
  if (query.publication_status) searchParams.set('publication_status', query.publication_status);
  if (query.page) searchParams.set('page', String(query.page));
  if (query.limit) searchParams.set('limit', String(query.limit));

  const res = await forwardToAdminControlPlane(`/api/records?${searchParams.toString()}`, {
    method: 'GET',
  });

  if (res.status === 200 && res.data && Array.isArray(res.data.records)) {
    return res.data;
  }

  if (res.status === 401) {
    throw new Error('UNAUTHENTICATED');
  }

  if (res.status === 403) {
    throw new Error('FORBIDDEN');
  }

  throw new Error(`ADMIN_CONTROL_PLANE_UNAVAILABLE: ${res.data?.error || 'Failed to list administrative records'}`);
}

// 2. Get Admin Record Detail (Proxied to Dedicated Admin Control Plane)
export async function getAdminRecordDetail(recordId: string): Promise<AdminRecordDetail | null> {
  const res = await forwardToAdminControlPlane(`/api/records/${encodeURIComponent(recordId)}`, {
    method: 'GET',
  });

  if (res.status === 200 && res.data && res.data.record) {
    return res.data;
  }

  if (res.status === 404) {
    return null;
  }

  if (res.status === 401) {
    throw new Error('UNAUTHENTICATED');
  }

  if (res.status === 403) {
    throw new Error('FORBIDDEN');
  }

  throw new Error(`ADMIN_CONTROL_PLANE_UNAVAILABLE: ${res.data?.error || 'Failed to retrieve administrative record detail'}`);
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
  recordId?: string,
): Promise<{ id: string }> {
  const targetId = recordId || input.id || '00000000-0000-0000-0000-000000000000';
  const res = await forwardToAdminControlPlane(`/api/records/${targetId}/sources`, {
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

// 10. Execute Workflow Transition (Proxied to Admin Control Plane)
export async function executeWorkflowTransition(
  recordId: string,
  input: WorkflowTransitionInput,
  staffUser: StaffUser,
): Promise<{
  success: boolean;
  workflow_status: string;
  publication_status: string;
  is_public: boolean;
  updated_at: string;
  decision_id?: string;
}> {
  const res = await forwardToAdminControlPlane(`/api/records/${recordId}/workflow`, {
    method: 'POST',
    body: input,
  });

  if (res.status >= 400) {
    throw new Error(res.data.error || 'Failed to execute workflow transition via Admin Control Plane');
  }

  return res.data;
}

// 11. Get Review Queue (Proxied to Admin Control Plane)
export async function getReviewQueue(staffUser: StaffUser): Promise<any[]> {
  const res = await forwardToAdminControlPlane(`/api/records/review-queue`, {
    method: 'GET',
  });

  if (res.status >= 400) {
    throw new Error(res.data.error || 'Failed to fetch review queue');
  }

  return res.data.records || [];
}

// 12. Get Publish Queue (Proxied to Admin Control Plane)
export async function getPublishQueue(staffUser: StaffUser): Promise<any[]> {
  const res = await forwardToAdminControlPlane(`/api/records/publish-queue`, {
    method: 'GET',
  });

  if (res.status >= 400) {
    throw new Error(res.data.error || 'Failed to fetch publish queue');
  }

  return res.data.records || [];
}

// 13. Get Record Review History (Proxied to Admin Control Plane)
export async function getRecordReviewHistory(recordId: string, staffUser: StaffUser): Promise<any[]> {
  const res = await forwardToAdminControlPlane(`/api/records/${recordId}/history`, {
    method: 'GET',
  });

  if (res.status >= 400) {
    throw new Error(res.data.error || 'Failed to fetch record review history');
  }

  return res.data.history || [];
}

// 14. Get Unified Record Full History (Proxied to Admin Control Plane)
export async function getRecordFullHistory(recordId: string, staffUser: StaffUser): Promise<any> {
  const res = await forwardToAdminControlPlane(`/api/records/${recordId}/full-history`, {
    method: 'GET',
  });

  if (res.status >= 400) {
    throw new Error(res.data.error || 'Failed to fetch record full history');
  }

  return res.data;
}

// 15. Open Audited Correction (Proxied to Admin Control Plane)
export async function openCorrection(
  recordId: string,
  input: OpenCorrectionInput,
  staffUser: StaffUser,
): Promise<{ success: boolean; id: string; status: string; current_revision: number; target_revision: number }> {
  const res = await forwardToAdminControlPlane(`/api/records/${recordId}/corrections`, {
    method: 'POST',
    body: input,
  });

  if (res.status >= 400) {
    throw new Error(res.data.error || 'Failed to open correction');
  }

  return res.data;
}

// 16. Get Record Corrections (Proxied to Admin Control Plane)
export async function getRecordCorrections(
  recordId: string,
  staffUser: StaffUser,
): Promise<{ active: any | null; corrections: any[] }> {
  const res = await forwardToAdminControlPlane(`/api/records/${recordId}/corrections`, {
    method: 'GET',
  });

  if (res.status >= 400) {
    throw new Error(res.data.error || 'Failed to fetch record corrections');
  }

  return { active: res.data.active || null, corrections: res.data.corrections || [] };
}

// 17. Update Correction Draft Workspace (Proxied to Admin Control Plane)
export async function updateCorrectionDraft(
  recordId: string,
  input: UpdateCorrectionDraftInput,
  staffUser: StaffUser,
): Promise<{ success: boolean; id: string; status: string }> {
  const res = await forwardToAdminControlPlane(`/api/records/${recordId}/corrections/draft`, {
    method: 'PUT',
    body: input,
  });

  if (res.status >= 400) {
    throw new Error(res.data.error || 'Failed to update correction draft');
  }

  return res.data;
}


// 14. Dashboard Stats (Read-Only via Public Catalog)
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

