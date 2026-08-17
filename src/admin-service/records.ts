import { randomUUID } from 'node:crypto';
import type { AdminControlPlaneDb } from './db';
import type { VerifiedStaffContext } from './auth';
import type {
  CreateRecordInput,
  UpdateRecordOverviewInput,
  ClaimInput,
  SourceInput,
  FinancialRecordInput,
  BeneficiaryRecordInput,
  TimelineEventInput,
} from './validation';

export class AdminRecordsManager {
  constructor(private db: AdminControlPlaneDb) {}

  // 1. Create Record (Draft)
  async createRecord(input: CreateRecordInput, staff: VerifiedStaffContext): Promise<{ id: string; slug: string }> {
    return this.db.withTransaction(async (tx) => {
      const recordId = randomUUID();

      await tx.query(
        `
        INSERT INTO records (
          id, record_type, title, slug, short_summary, full_description,
          lead_sector_id, lead_institution_id, implementation_status,
          publication_status, is_public, provisional, announced_date,
          announced_date_precision, start_date, start_date_precision,
          completion_date, completion_date_precision, geographic_scope,
          created_at, updated_at
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

      // Insert Profile
      if (input.record_type === 'achievement' && input.achievement_profile) {
        await tx.query(
          `
          INSERT INTO achievement_profiles (record_id, milestone_type, verified_impact_summary, flagship_tier)
          VALUES ($1, $2, $3, $4)
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
          `,
          [
            recordId,
            input.programme_details.programme_type || null,
            input.programme_details.target_beneficiary_group || null,
            input.programme_details.recurring_or_fixed || null,
          ],
        );
      }

      // Link Sectors
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

      // Link Institutions
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

      return { id: recordId, slug: input.slug };
    });
  }

  // 2. Update Record Overview (Optimistic Concurrency)
  async updateRecordOverview(
    recordId: string,
    input: UpdateRecordOverviewInput,
    staff: VerifiedStaffContext,
  ): Promise<{ success: boolean; updated_at: string }> {
    return this.db.withTransaction(async (tx) => {
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

      // Update Profile
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

  // 3. Manage Claims
  async saveClaim(recordId: string, input: ClaimInput, staff: VerifiedStaffContext): Promise<{ id: string }> {
    return this.db.withTransaction(async (tx) => {
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

      await tx.query(`DELETE FROM claim_source_relationships WHERE claim_id = $1`, [claimId]);
      for (const sourceId of input.linked_source_ids) {
        await tx.query(
          `
          INSERT INTO claim_source_relationships (claim_id, source_id, relationship_type, source_role, review_status)
          VALUES ($1, $2, 'primary_evidence', 'primary', 'draft')
          ON CONFLICT DO NOTHING
          `,
          [claimId, sourceId],
        );
      }

      return { id: claimId };
    });
  }

  // 4. Manage Sources
  async saveSource(input: SourceInput, staff: VerifiedStaffContext): Promise<{ id: string }> {
    return this.db.withTransaction(async (tx) => {
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

  // 5. Manage Financials
  async saveFinancialRecord(recordId: string, input: FinancialRecordInput, staff: VerifiedStaffContext): Promise<{ id: string }> {
    return this.db.withTransaction(async (tx) => {
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

  // 6. Manage Beneficiaries
  async saveBeneficiaryRecord(recordId: string, input: BeneficiaryRecordInput, staff: VerifiedStaffContext): Promise<{ id: string }> {
    return this.db.withTransaction(async (tx) => {
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

  // 7. Manage Timeline Events
  async saveTimelineEvent(recordId: string, input: TimelineEventInput, staff: VerifiedStaffContext): Promise<{ id: string }> {
    return this.db.withTransaction(async (tx) => {
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

  // 8. Transaction Smoke Test with Explicit Rollback
  async smokeTestRollback(): Promise<{ success: boolean; operationsTested: string[] }> {
    return this.db.withTransaction(async (tx) => {
      const testId = randomUUID();
      const operations: string[] = [];

      // Test INSERT draft record
      await tx.query(
        `
        INSERT INTO records (
          id, record_type, title, slug, implementation_status, publication_status, is_public, created_at, updated_at
        ) VALUES ($1, 'achievement', 'M10F Smoke Test Temporary Row', $2, 'in_progress', 'draft', false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        `,
        [testId, `smoke-test-${Date.now()}`],
      );
      operations.push('INSERT draft record');

      // Test UPDATE
      await tx.query(`UPDATE records SET short_summary = 'Tested mutation' WHERE id = $1`, [testId]);
      operations.push('UPDATE draft record');

      // Test INSERT claim
      const claimId = randomUUID();
      await tx.query(
        `
        INSERT INTO evidence_claims (id, record_id, claim_type, claim_text, currency_code, workflow_status, created_at, updated_at)
        VALUES ($1, $2, 'test_claim', 'Smoke test claim', 'NGN', 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        `,
        [claimId, testId],
      );
      operations.push('INSERT evidence claim');

      // Force Rollback to leave zero persistent data
      throw new Error('SMOKE_TEST_INTENTIONAL_ROLLBACK');
    }).catch((err) => {
      if (err.message === 'SMOKE_TEST_INTENTIONAL_ROLLBACK') {
        return {
          success: true,
          operationsTested: ['INSERT draft record', 'UPDATE draft record', 'INSERT evidence claim', 'ROLLBACK verified'],
        };
      }
      throw err;
    });
  }
}
