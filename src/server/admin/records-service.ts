import 'server-only';
import { randomUUID } from 'node:crypto';
import { getAdminDatabaseConnection } from '@/server/db/admin-pool';
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

// 1. List Admin Records
export async function listAdminRecords(query: ListAdminRecordsQuery): Promise<AdminRecordListResult> {
  const db = await getAdminDatabaseConnection();
  const conditions: string[] = [];
  const params: unknown[] = [];
  let paramIndex = 1;

  if (query.q && query.q.trim()) {
    conditions.push(`(r.title ILIKE $${paramIndex} OR r.short_summary ILIKE $${paramIndex} OR r.slug ILIKE $${paramIndex})`);
    params.push(`%${query.q.trim()}%`);
    paramIndex++;
  }

  if (query.type) {
    conditions.push(`r.record_type = $${paramIndex}`);
    params.push(query.type);
    paramIndex++;
  }

  if (query.sector) {
    conditions.push(`r.lead_sector_id = $${paramIndex}`);
    params.push(query.sector);
    paramIndex++;
  }

  if (query.status) {
    conditions.push(`r.implementation_status = $${paramIndex}`);
    params.push(query.status);
    paramIndex++;
  }

  if (query.publication_status) {
    conditions.push(`r.publication_status = $${paramIndex}`);
    params.push(query.publication_status);
    paramIndex++;
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  // Count total
  const countResult = await db.query<{ count: string }>(
    `SELECT count(*) as count FROM records r ${whereClause}`,
    params,
  );
  const total = parseInt(countResult.rows[0]?.count || '0', 10);

  const offset = (query.page - 1) * query.limit;
  const recordsResult = await db.query<AdminRecordSummary>(
    `
    SELECT
      r.id,
      r.record_type,
      r.title,
      r.slug,
      r.short_summary,
      r.implementation_status,
      r.publication_status,
      r.is_public,
      s.label AS lead_sector_label,
      i.canonical_name AS lead_institution_name,
      r.geographic_scope,
      r.updated_at::text,
      r.created_at::text
    FROM records r
    LEFT JOIN sectors s ON s.id = r.lead_sector_id
    LEFT JOIN institutions i ON i.id = r.lead_institution_id
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

// 2. Get Admin Record Detail
export async function getAdminRecordDetail(recordId: string): Promise<AdminRecordDetail | null> {
  const db = await getAdminDatabaseConnection();

  const recordResult = await db.query<AdminRecordDetail['record']>(
    `
    SELECT
      id,
      record_type,
      title,
      slug,
      short_summary,
      full_description,
      lead_sector_id,
      lead_institution_id,
      implementation_status,
      publication_status,
      is_public,
      provisional,
      announced_date::text,
      announced_date_precision,
      start_date::text,
      start_date_precision,
      completion_date::text,
      completion_date_precision,
      geographic_scope,
      created_at::text,
      updated_at::text
    FROM records
    WHERE id = $1
    `,
    [recordId],
  );

  if (recordResult.rows.length === 0) {
    return null;
  }

  const record = recordResult.rows[0];

  // Fetch Class Profile
  let profile: Record<string, unknown> | null = null;
  if (record.record_type === 'achievement') {
    const p = await db.query(`SELECT * FROM achievement_profiles WHERE record_id = $1`, [recordId]);
    profile = p.rows[0] || null;
  } else if (record.record_type === 'policy') {
    const p = await db.query(`SELECT * FROM policy_details WHERE record_id = $1`, [recordId]);
    profile = p.rows[0] || null;
  } else if (record.record_type === 'project') {
    const p = await db.query(`SELECT * FROM project_details WHERE record_id = $1`, [recordId]);
    profile = p.rows[0] || null;
  } else if (record.record_type === 'programme') {
    const p = await db.query(`SELECT * FROM programme_details WHERE record_id = $1`, [recordId]);
    profile = p.rows[0] || null;
  }

  // Fetch Sectors, Institutions, Geographies
  const [sectorsRes, institutionsRes, geographiesRes] = await Promise.all([
    db.query(`
      SELECT s.id, s.code, s.label, rs.role_code
      FROM record_sectors rs
      JOIN sectors s ON s.id = rs.sector_id
      WHERE rs.record_id = $1
      ORDER BY rs.role_code, s.label
    `, [recordId]),
    db.query(`
      SELECT i.id, i.canonical_name, i.short_name, ri.role_code
      FROM record_institutions ri
      JOIN institutions i ON i.id = ri.institution_id
      WHERE ri.record_id = $1
      ORDER BY ri.role_code, i.canonical_name
    `, [recordId]),
    db.query(`
      SELECT g.id, g.name, g.code, g.geography_type, rg.coverage_role
      FROM record_geographies rg
      JOIN geographic_units g ON g.id = rg.geographic_unit_id
      WHERE rg.record_id = $1
      ORDER BY g.name
    `, [recordId]),
  ]);

  // Fetch Claims and linked Sources
  const claimsRes = await db.query(`
    SELECT
      id,
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
      limitations
    FROM evidence_claims
    WHERE record_id = $1
    ORDER BY created_at ASC
  `, [recordId]);

  const claimsWithSources = await Promise.all(
    claimsRes.rows.map(async (claim: any) => {
      const sourcesForClaim = await db.query(`
        SELECT s.id, s.title, s.publisher_name, s.original_url
        FROM claim_source_relationships rel
        JOIN sources s ON s.id = rel.source_id
        WHERE rel.claim_id = $1
      `, [claim.id]);
      return {
        ...claim,
        sources: sourcesForClaim.rows,
      };
    }),
  );

  // Fetch Sources associated with record claims
  const sourcesRes = await db.query(`
    SELECT DISTINCT
      s.id,
      s.title,
      s.publisher_name,
      s.source_type,
      s.source_level,
      s.original_url,
      s.archival_url,
      s.publication_date::text,
      s.publication_date_precision,
      s.visibility_class
    FROM sources s
    WHERE s.id IN (
      SELECT rel.source_id
      FROM claim_source_relationships rel
      JOIN evidence_claims c ON c.id = rel.claim_id
      WHERE c.record_id = $1
    )
    ORDER BY s.title
  `, [recordId]);

  // Fetch Financials, Beneficiaries, Timeline
  const [financialsRes, beneficiariesRes, timelineRes] = await Promise.all([
    db.query(`
      SELECT
        id,
        financial_type,
        amount::text,
        currency_code,
        reporting_period_label,
        period_start::text,
        period_end::text,
        nominal_or_real,
        methodology,
        limitations
      FROM financial_records
      WHERE record_id = $1
      ORDER BY period_start ASC, created_at ASC
    `, [recordId]),
    db.query(`
      SELECT
        id,
        beneficiary_type,
        beneficiary_stage,
        count_value,
        unit,
        count_basis,
        cumulative,
        reporting_period_label,
        period_start::text,
        period_end::text,
        limitations
      FROM beneficiary_records
      WHERE record_id = $1
      ORDER BY period_start ASC, created_at ASC
    `, [recordId]),
    db.query(`
      SELECT
        id,
        event_type,
        title,
        description,
        date_value::text,
        date_precision,
        period_start::text,
        period_end::text,
        reporting_period_label,
        provisional,
        is_public
      FROM timeline_events
      WHERE record_id = $1
      ORDER BY COALESCE(date_value, period_start) ASC, created_at ASC
    `, [recordId]),
  ]);

  return {
    record: record as any,
    profile: profile as any,
    sectors: sectorsRes.rows as any,
    institutions: institutionsRes.rows as any,
    geographies: geographiesRes.rows as any,
    claims: claimsWithSources as any,
    sources: sourcesRes.rows as any,
    financials: financialsRes.rows as any,
    beneficiaries: beneficiariesRes.rows as any,
    timeline: timelineRes.rows as any,
    history: [],
  };
}

// 3. Create Record (Transaction)
export async function createRecord(
  input: CreateRecordInput,
  staffUser: StaffUser,
): Promise<{ id: string; slug: string }> {
  const db = await getAdminDatabaseConnection();

  return db.withTransaction(async (tx) => {
    const recordId = randomUUID();

    // 1. Insert into records table as DRAFT (is_public = false)
    await tx.query(
      `
      INSERT INTO records (
        id,
        record_type,
        title,
        slug,
        short_summary,
        full_description,
        lead_sector_id,
        lead_institution_id,
        implementation_status,
        publication_status,
        is_public,
        provisional,
        announced_date,
        announced_date_precision,
        start_date,
        start_date_precision,
        completion_date,
        completion_date_precision,
        geographic_scope,
        created_at,
        updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, 'draft', false, false,
        $10, $11, $12, $13, $14, $15, $16, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
      )
      `,
      [
        recordId,
        input.record_type,
        input.title,
        input.slug,
        input.short_summary || null,
        input.full_description || null,
        input.lead_sector_id || null,
        input.lead_institution_id || null,
        input.implementation_status,
        input.announced_date || null,
        input.announced_date_precision,
        input.start_date || null,
        input.start_date_precision,
        input.completion_date || null,
        input.completion_date_precision,
        input.geographic_scope,
      ],
    );

    // 2. Insert Profile
    if (input.record_type === 'achievement' && input.achievement_profile) {
      await tx.query(
        `
        INSERT INTO achievement_profiles (
          record_id, milestone_type, verified_impact_summary, flagship_tier
        ) VALUES ($1, $2, $3, $4)
        `,
        [
          recordId,
          input.achievement_profile.milestone_type || null,
          input.achievement_profile.verified_impact_summary || null,
          input.achievement_profile.flagship_tier || null,
        ],
      );
    } else if (input.record_type === 'policy' && input.policy_details) {
      await tx.query(
        `
        INSERT INTO policy_details (
          record_id, policy_type, legal_instrument_type, gazette_or_order_number, policy_scope
        ) VALUES ($1, $2, $3, $4, $5)
        `,
        [
          recordId,
          input.policy_details.policy_type || null,
          input.policy_details.legal_instrument_type || null,
          input.policy_details.gazette_or_order_number || null,
          input.policy_details.policy_scope || null,
        ],
      );
    } else if (input.record_type === 'project' && input.project_details) {
      await tx.query(
        `
        INSERT INTO project_details (
          record_id, project_type, target_completion_year, physical_asset_type, infrastructure_subsector
        ) VALUES ($1, $2, $3, $4, $5)
        `,
        [
          recordId,
          input.project_details.project_type || null,
          input.project_details.target_completion_year || null,
          input.project_details.physical_asset_type || null,
          input.project_details.infrastructure_subsector || null,
        ],
      );
    } else if (input.record_type === 'programme' && input.programme_details) {
      await tx.query(
        `
        INSERT INTO programme_details (
          record_id, programme_type, target_beneficiary_group, recurring_or_fixed
        ) VALUES ($1, $2, $3, $4)
        `,
        [
          recordId,
          input.programme_details.programme_type || null,
          input.programme_details.target_beneficiary_group || null,
          input.programme_details.recurring_or_fixed || null,
        ],
      );
    }

    // 3. Link Sectors
    if (input.lead_sector_id) {
      await tx.query(
        `INSERT INTO record_sectors (record_id, sector_id, role_code) VALUES ($1, $2, 'primary') ON CONFLICT DO NOTHING`,
        [recordId, input.lead_sector_id],
      );
    }
    for (const secId of input.sector_ids) {
      if (secId !== input.lead_sector_id) {
        await tx.query(
          `INSERT INTO record_sectors (record_id, sector_id, role_code) VALUES ($1, $2, 'secondary') ON CONFLICT DO NOTHING`,
          [recordId, secId],
        );
      }
    }

    // 4. Link Institutions
    if (input.lead_institution_id) {
      await tx.query(
        `INSERT INTO record_institutions (record_id, institution_id, role_code) VALUES ($1, $2, 'lead') ON CONFLICT DO NOTHING`,
        [recordId, input.lead_institution_id],
      );
    }
    for (const instId of input.institution_ids) {
      if (instId !== input.lead_institution_id) {
        await tx.query(
          `INSERT INTO record_institutions (record_id, institution_id, role_code) VALUES ($1, $2, 'implementing') ON CONFLICT DO NOTHING`,
          [recordId, instId],
        );
      }
    }

    // 5. Link Geographies
    for (const geoId of input.geographic_unit_ids) {
      await tx.query(
        `INSERT INTO record_geographies (record_id, geographic_unit_id, coverage_role, sensitivity_class) VALUES ($1, $2, 'primary_location', 'public') ON CONFLICT DO NOTHING`,
        [recordId, geoId],
      );
    }

    return { id: recordId, slug: input.slug };
  });
}

// 4. Update Record Overview (Optimistic Concurrency Protection)
export async function updateRecordOverview(
  recordId: string,
  input: UpdateRecordOverviewInput,
  staffUser: StaffUser,
): Promise<{ success: boolean; updated_at: string }> {
  const db = await getAdminDatabaseConnection();

  return db.withTransaction(async (tx) => {
    // Check concurrency
    const checkRes = await tx.query<{ updated_at: string }>(
      `SELECT updated_at::text FROM records WHERE id = $1`,
      [recordId],
    );

    if (checkRes.rows.length === 0) {
      throw new Error('RECORD_NOT_FOUND');
    }

    const currentUpdatedAt = checkRes.rows[0].updated_at;
    if (input.expected_updated_at && currentUpdatedAt !== input.expected_updated_at) {
      throw new Error('CONCURRENCY_CONFLICT');
    }

    // Update records overview
    const updateRes = await tx.query<{ updated_at: string }>(
      `
      UPDATE records SET
        title = $1,
        slug = $2,
        short_summary = $3,
        full_description = $4,
        lead_sector_id = $5,
        lead_institution_id = $6,
        implementation_status = $7,
        geographic_scope = $8,
        announced_date = $9,
        announced_date_precision = $10,
        start_date = $11,
        start_date_precision = $12,
        completion_date = $13,
        completion_date_precision = $14,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $15
      RETURNING updated_at::text
      `,
      [
        input.title,
        input.slug,
        input.short_summary || null,
        input.full_description || null,
        input.lead_sector_id || null,
        input.lead_institution_id || null,
        input.implementation_status,
        input.geographic_scope,
        input.announced_date || null,
        input.announced_date_precision,
        input.start_date || null,
        input.start_date_precision,
        input.completion_date || null,
        input.completion_date_precision,
        recordId,
      ],
    );

    // Update profile
    if (input.record_type === 'achievement' && input.achievement_profile) {
      await tx.query(
        `
        INSERT INTO achievement_profiles (record_id, milestone_type, verified_impact_summary, flagship_tier)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (record_id) DO UPDATE SET
          milestone_type = EXCLUDED.milestone_type,
          verified_impact_summary = EXCLUDED.verified_impact_summary,
          flagship_tier = EXCLUDED.flagship_tier
        `,
        [
          recordId,
          input.achievement_profile.milestone_type || null,
          input.achievement_profile.verified_impact_summary || null,
          input.achievement_profile.flagship_tier || null,
        ],
      );
    } else if (input.record_type === 'policy' && input.policy_details) {
      await tx.query(
        `
        INSERT INTO policy_details (record_id, policy_type, legal_instrument_type, gazette_or_order_number, policy_scope)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (record_id) DO UPDATE SET
          policy_type = EXCLUDED.policy_type,
          legal_instrument_type = EXCLUDED.legal_instrument_type,
          gazette_or_order_number = EXCLUDED.gazette_or_order_number,
          policy_scope = EXCLUDED.policy_scope
        `,
        [
          recordId,
          input.policy_details.policy_type || null,
          input.policy_details.legal_instrument_type || null,
          input.policy_details.gazette_or_order_number || null,
          input.policy_details.policy_scope || null,
        ],
      );
    } else if (input.record_type === 'project' && input.project_details) {
      await tx.query(
        `
        INSERT INTO project_details (record_id, project_type, target_completion_year, physical_asset_type, infrastructure_subsector)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (record_id) DO UPDATE SET
          project_type = EXCLUDED.project_type,
          target_completion_year = EXCLUDED.target_completion_year,
          physical_asset_type = EXCLUDED.physical_asset_type,
          infrastructure_subsector = EXCLUDED.infrastructure_subsector
        `,
        [
          recordId,
          input.project_details.project_type || null,
          input.project_details.target_completion_year || null,
          input.project_details.physical_asset_type || null,
          input.project_details.infrastructure_subsector || null,
        ],
      );
    } else if (input.record_type === 'programme' && input.programme_details) {
      await tx.query(
        `
        INSERT INTO programme_details (record_id, programme_type, target_beneficiary_group, recurring_or_fixed)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (record_id) DO UPDATE SET
          programme_type = EXCLUDED.programme_type,
          target_beneficiary_group = EXCLUDED.target_beneficiary_group,
          recurring_or_fixed = EXCLUDED.recurring_or_fixed
        `,
        [
          recordId,
          input.programme_details.programme_type || null,
          input.programme_details.target_beneficiary_group || null,
          input.programme_details.recurring_or_fixed || null,
        ],
      );
    }

    return { success: true, updated_at: updateRes.rows[0].updated_at };
  });
}

// 5. Manage Claims
export async function saveClaim(
  recordId: string,
  input: ClaimInput,
  staffUser: StaffUser,
): Promise<{ id: string }> {
  const db = await getAdminDatabaseConnection();

  return db.withTransaction(async (tx) => {
    const claimId = input.id || randomUUID();

    await tx.query(
      `
      INSERT INTO evidence_claims (
        id, record_id, claim_type, claim_text, value_numeric, value_text,
        unit_code, currency_code, reporting_period_label, data_value_nature,
        source_origin, verification_status, limitations, workflow_status, created_at, updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
      )
      ON CONFLICT (id) DO UPDATE SET
        claim_type = EXCLUDED.claim_type,
        claim_text = EXCLUDED.claim_text,
        value_numeric = EXCLUDED.value_numeric,
        value_text = EXCLUDED.value_text,
        unit_code = EXCLUDED.unit_code,
        currency_code = EXCLUDED.currency_code,
        reporting_period_label = EXCLUDED.reporting_period_label,
        data_value_nature = EXCLUDED.data_value_nature,
        source_origin = EXCLUDED.source_origin,
        verification_status = EXCLUDED.verification_status,
        limitations = EXCLUDED.limitations,
        updated_at = CURRENT_TIMESTAMP
      `,
      [
        claimId,
        recordId,
        input.claim_type,
        input.claim_text,
        input.value_numeric || null,
        input.value_text || null,
        input.unit_code || null,
        input.currency_code,
        input.reporting_period_label || null,
        input.data_value_nature,
        input.source_origin,
        input.verification_status,
        input.limitations || null,
      ],
    );

    // Link sources
    await tx.query(`DELETE FROM claim_source_relationships WHERE claim_id = $1`, [claimId]);
    for (const sourceId of input.linked_source_ids) {
      await tx.query(
        `
        INSERT INTO claim_source_relationships (
          claim_id, source_id, relationship_type, source_role, review_status
        ) VALUES ($1, $2, 'primary_evidence', 'primary', 'draft')
        ON CONFLICT DO NOTHING
        `,
        [claimId, sourceId],
      );
    }

    return { id: claimId };
  });
}

// 6. Manage Sources
export async function saveSource(
  input: SourceInput,
  staffUser: StaffUser,
): Promise<{ id: string }> {
  const db = await getAdminDatabaseConnection();

  return db.withTransaction(async (tx) => {
    const sourceId = input.id || randomUUID();

    await tx.query(
      `
      INSERT INTO sources (
        id, title, publisher_name, source_type, source_level, original_url,
        archival_url, publication_date, publication_date_precision, visibility_class, created_at, updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
      )
      ON CONFLICT (id) DO UPDATE SET
        title = EXCLUDED.title,
        publisher_name = EXCLUDED.publisher_name,
        source_type = EXCLUDED.source_type,
        source_level = EXCLUDED.source_level,
        original_url = EXCLUDED.original_url,
        archival_url = EXCLUDED.archival_url,
        publication_date = EXCLUDED.publication_date,
        publication_date_precision = EXCLUDED.publication_date_precision,
        visibility_class = EXCLUDED.visibility_class,
        updated_at = CURRENT_TIMESTAMP
      `,
      [
        sourceId,
        input.title,
        input.publisher_name,
        input.source_type,
        input.source_level,
        input.original_url,
        input.archival_url || null,
        input.publication_date || null,
        input.publication_date_precision,
        input.visibility_class,
      ],
    );

    return { id: sourceId };
  });
}

// 7. Manage Financials
export async function saveFinancialRecord(
  recordId: string,
  input: FinancialRecordInput,
  staffUser: StaffUser,
): Promise<{ id: string }> {
  const db = await getAdminDatabaseConnection();

  return db.withTransaction(async (tx) => {
    const financialId = input.id || randomUUID();

    await tx.query(
      `
      INSERT INTO financial_records (
        id, record_id, financial_type, amount, currency_code, reporting_period_label,
        period_start, period_end, nominal_or_real, methodology, limitations, created_at, updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
      )
      ON CONFLICT (id) DO UPDATE SET
        financial_type = EXCLUDED.financial_type,
        amount = EXCLUDED.amount,
        currency_code = EXCLUDED.currency_code,
        reporting_period_label = EXCLUDED.reporting_period_label,
        period_start = EXCLUDED.period_start,
        period_end = EXCLUDED.period_end,
        nominal_or_real = EXCLUDED.nominal_or_real,
        methodology = EXCLUDED.methodology,
        limitations = EXCLUDED.limitations,
        updated_at = CURRENT_TIMESTAMP
      `,
      [
        financialId,
        recordId,
        input.financial_type,
        input.amount,
        input.currency_code,
        input.reporting_period_label || null,
        input.period_start || null,
        input.period_end || null,
        input.nominal_or_real,
        input.methodology || null,
        input.limitations || null,
      ],
    );

    return { id: financialId };
  });
}

// 8. Manage Beneficiaries
export async function saveBeneficiaryRecord(
  recordId: string,
  input: BeneficiaryRecordInput,
  staffUser: StaffUser,
): Promise<{ id: string }> {
  const db = await getAdminDatabaseConnection();

  return db.withTransaction(async (tx) => {
    const beneficiaryId = input.id || randomUUID();

    await tx.query(
      `
      INSERT INTO beneficiary_records (
        id, record_id, beneficiary_type, beneficiary_stage, count_value, unit,
        count_basis, cumulative, reporting_period_label, period_start, period_end,
        limitations, created_at, updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
      )
      ON CONFLICT (id) DO UPDATE SET
        beneficiary_type = EXCLUDED.beneficiary_type,
        beneficiary_stage = EXCLUDED.beneficiary_stage,
        count_value = EXCLUDED.count_value,
        unit = EXCLUDED.unit,
        count_basis = EXCLUDED.count_basis,
        cumulative = EXCLUDED.cumulative,
        reporting_period_label = EXCLUDED.reporting_period_label,
        period_start = EXCLUDED.period_start,
        period_end = EXCLUDED.period_end,
        limitations = EXCLUDED.limitations,
        updated_at = CURRENT_TIMESTAMP
      `,
      [
        beneficiaryId,
        recordId,
        input.beneficiary_type,
        input.beneficiary_stage,
        input.count_value,
        input.unit,
        input.count_basis || null,
        input.cumulative,
        input.reporting_period_label || null,
        input.period_start || null,
        input.period_end || null,
        input.limitations || null,
      ],
    );

    return { id: beneficiaryId };
  });
}

// 9. Manage Timeline Events
export async function saveTimelineEvent(
  recordId: string,
  input: TimelineEventInput,
  staffUser: StaffUser,
): Promise<{ id: string }> {
  const db = await getAdminDatabaseConnection();

  return db.withTransaction(async (tx) => {
    const timelineId = input.id || randomUUID();

    await tx.query(
      `
      INSERT INTO timeline_events (
        id, record_id, event_type, title, description, date_value, date_precision,
        period_start, period_end, reporting_period_label, provisional, is_public, created_at, updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
      )
      ON CONFLICT (id) DO UPDATE SET
        event_type = EXCLUDED.event_type,
        title = EXCLUDED.title,
        description = EXCLUDED.description,
        date_value = EXCLUDED.date_value,
        date_precision = EXCLUDED.date_precision,
        period_start = EXCLUDED.period_start,
        period_end = EXCLUDED.period_end,
        reporting_period_label = EXCLUDED.reporting_period_label,
        provisional = EXCLUDED.provisional,
        updated_at = CURRENT_TIMESTAMP
      `,
      [
        timelineId,
        recordId,
        input.event_type,
        input.title,
        input.description || null,
        input.date_value || null,
        input.date_precision,
        input.period_start || null,
        input.period_end || null,
        input.reporting_period_label || null,
        input.provisional,
      ],
    );

    return { id: timelineId };
  });
}

// 10. Dashboard Stats
export async function getAdminDashboardStats() {
  const db = await getAdminDatabaseConnection();

  const [totalRes, draftsRes, byClassRes, recentRes] = await Promise.all([
    db.query<{ count: string }>(`SELECT count(*) as count FROM records`),
    db.query<{ count: string }>(`SELECT count(*) as count FROM records WHERE publication_status = 'draft'`),
    db.query<{ record_type: string; count: string }>(`
      SELECT record_type, count(*) as count
      FROM records
      GROUP BY record_type
      ORDER BY count DESC
    `),
    db.query<AdminRecordSummary>(`
      SELECT
        r.id,
        r.record_type,
        r.title,
        r.slug,
        r.short_summary,
        r.implementation_status,
        r.publication_status,
        r.is_public,
        s.label AS lead_sector_label,
        i.canonical_name AS lead_institution_name,
        r.geographic_scope,
        r.updated_at::text,
        r.created_at::text
      FROM records r
      LEFT JOIN sectors s ON s.id = r.lead_sector_id
      LEFT JOIN institutions i ON i.id = r.lead_institution_id
      ORDER BY r.updated_at DESC
      LIMIT 8
    `),
  ]);

  return {
    totalRecords: parseInt(totalRes.rows[0]?.count || '0', 10),
    draftRecords: parseInt(draftsRes.rows[0]?.count || '0', 10),
    byClass: byClassRes.rows.map((row) => ({
      recordType: row.record_type,
      count: parseInt(row.count, 10),
    })),
    recentRecords: recentRes.rows,
  };
}
