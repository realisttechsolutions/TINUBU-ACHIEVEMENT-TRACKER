import { createHash } from 'node:crypto';
import path from 'node:path';
import { verifySnapshotManifest } from './manifest-verifier.mjs';
import { validateResearchPackage } from './data-validator.mjs';
import { transformM02Package } from './entity-transformer.mjs';

export async function executeM02Ingestion(db, options = {}) {
  const {
    snapshotDir = path.resolve('data/research-snapshots/m02'),
    dryRun = false,
    systemActorId = '00000000-0000-4000-8000-000000000001',
    batchExternalId = 'BATCH-2024-M02-001',
  } = options;

  const startTime = Date.now();
  const report = {
    batchId: null,
    batchExternalId,
    snapshotDir,
    dryRun,
    success: false,
    manifestVerified: false,
    dataValidated: false,
    idempotentSkip: false,
    durationMs: 0,
    counts: {},
    errors: [],
    warnings: [],
  };

  // Step 1: Verify Snapshot Manifest
  const manifestResult = await verifySnapshotManifest(snapshotDir);
  if (!manifestResult.valid) {
    report.errors.push(...manifestResult.errors);
    report.durationMs = Date.now() - startTime;
    return report;
  }
  report.manifestVerified = true;
  const packageChecksum = manifestResult.manifestHash;
  const idempotencyKey = `INGEST-${manifestResult.snapshotId}-${packageChecksum.substring(0, 16)}`;

  // Step 2: Validate Data
  const validationResult = await validateResearchPackage(snapshotDir);
  if (!validationResult.valid) {
    report.errors.push(...validationResult.report.errors);
    report.durationMs = Date.now() - startTime;
    return report;
  }
  report.dataValidated = true;

  // Step 3: Transform Data
  const { transformed } = transformM02Package(validationResult.datasetObjects, systemActorId);

  report.counts = {
    records: transformed.records.length,
    achievements: transformed.achievementProfiles.length,
    policies: transformed.policyDetails.length,
    projects: transformed.projectDetails.length,
    programmes: transformed.programmeDetails.length,
    sources: transformed.sources.length,
    evidenceClaims: transformed.evidenceClaims.length,
    claimSourceRelationships: transformed.claimSourceRelationships.length,
    financialRecords: transformed.financialRecords.length,
    beneficiaryRecords: transformed.beneficiaryRecords.length,
    indicators: transformed.indicators.length,
    indicatorObservations: transformed.indicatorObservations.length,
    timelineEvents: transformed.timelineEvents.length,
    corrections: transformed.corrections.length,
    reviewDecisions: transformed.reviewDecisions.length,
  };

  // If dry-run, stop before DB writes
  if (dryRun) {
    report.success = true;
    report.durationMs = Date.now() - startTime;
    return report;
  }

  // Step 4: Database Ingestion
  await db.query('BEGIN');
  try {
    // Check existing batch
    const existingBatch = await db.query(
      'SELECT id, status FROM research_batches WHERE idempotency_key = $1 OR package_checksum = $2',
      [idempotencyKey, packageChecksum]
    );

    if (existingBatch.rows.length > 0 && existingBatch.rows[0].status === 'committed') {
      report.idempotentSkip = true;
      report.batchId = existingBatch.rows[0].id;
      report.success = true;
      await db.query('COMMIT');
      report.durationMs = Date.now() - startTime;
      return report;
    }

    const batchUuid = '80000000-0000-4000-8000-000000000002';
    report.batchId = batchUuid;

    // Create or Upsert Research Batch
    await db.query(
      `INSERT INTO research_batches (
        id, external_id, idempotency_key, package_checksum, contract_version,
        schema_version, taxonomy_version, mode, status, submitted_by, approved_by, plan_hash,
        manifest_json, validation_report, import_summary, started_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, CURRENT_TIMESTAMP)
      ON CONFLICT (external_id) DO UPDATE SET
        package_checksum = EXCLUDED.package_checksum,
        status = EXCLUDED.status,
        manifest_json = EXCLUDED.manifest_json`,
      [
        batchUuid,
        batchExternalId,
        idempotencyKey,
        packageChecksum,
        '1.1.2',
        'TAT_DB_SCHEMA_V1',
        '1.1.2',
        'commit',
        'staged',
        systemActorId,
        systemActorId,
        packageChecksum,
        JSON.stringify(manifestResult),
        JSON.stringify(validationResult.report),
        JSON.stringify(report.counts),
      ]
    );

    // Insert Records
    for (const r of transformed.records) {
      await db.query(
        `INSERT INTO records (
          id, external_id, slug, record_type, title, short_title, summary, body,
          implementation_status, workflow_status, publication_status, verification_status,
          evidence_profile, risk_level, is_public, qualification, internal_notes,
          created_by, current_revision, published_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
        ON CONFLICT (external_id) DO UPDATE SET
          slug = EXCLUDED.slug,
          title = EXCLUDED.title,
          summary = EXCLUDED.summary,
          implementation_status = EXCLUDED.implementation_status,
          publication_status = EXCLUDED.publication_status,
          verification_status = EXCLUDED.verification_status,
          evidence_profile = EXCLUDED.evidence_profile,
          qualification = EXCLUDED.qualification,
          updated_at = CURRENT_TIMESTAMP`,
        [
          r.id, r.external_id, r.slug, r.record_type, r.title, r.short_title, r.summary, r.body,
          r.implementation_status, r.workflow_status, r.publication_status, r.verification_status,
          r.evidence_profile, r.risk_level, r.is_public, r.qualification, r.internal_notes,
          r.created_by, r.current_revision, r.published_at,
        ]
      );
    }

    // Insert Achievement Profiles
    for (const ap of transformed.achievementProfiles) {
      await db.query(
        `INSERT INTO achievement_profiles (
          record_id, public_impact_narrative, public_qualification, featured_asset_url, display_priority
        ) VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (record_id) DO UPDATE SET
          public_impact_narrative = EXCLUDED.public_impact_narrative,
          public_qualification = EXCLUDED.public_qualification,
          display_priority = EXCLUDED.display_priority`,
        [ap.record_id, ap.public_impact_narrative, ap.public_qualification, ap.featured_asset_url, ap.display_priority]
      );
    }

    // Insert Policy Details
    for (const pd of transformed.policyDetails) {
      await db.query(
        `INSERT INTO policy_details (
          record_id, policy_type, legal_authority, reference_number, effect_scope
        ) VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (record_id) DO UPDATE SET
          policy_type = EXCLUDED.policy_type,
          legal_authority = EXCLUDED.legal_authority,
          reference_number = EXCLUDED.reference_number`,
        [pd.record_id, pd.policy_type, pd.legal_authority, pd.reference_number, pd.effect_scope]
      );
    }

    // Insert Project Details
    for (const pr of transformed.projectDetails) {
      await db.query(
        `INSERT INTO project_details (
          record_id, project_type, progress_percentage, contract_reference, project_reference, location_narrative
        ) VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (record_id) DO UPDATE SET
          project_type = EXCLUDED.project_type,
          progress_percentage = EXCLUDED.progress_percentage,
          location_narrative = EXCLUDED.location_narrative`,
        [pr.record_id, pr.project_type, pr.progress_percentage, pr.contract_reference, pr.project_reference, pr.location_narrative]
      );
    }

    // Insert Programme Details
    for (const pg of transformed.programmeDetails) {
      await db.query(
        `INSERT INTO programme_details (
          record_id, programme_type, target_group_narrative, enrolment_model, disbursement_model
        ) VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (record_id) DO UPDATE SET
          programme_type = EXCLUDED.programme_type,
          target_group_narrative = EXCLUDED.target_group_narrative`,
        [pg.record_id, pg.programme_type, pg.target_group_narrative, pg.enrolment_model, pg.disbursement_model]
      );
    }

    // Insert Sources
    for (const s of transformed.sources) {
      await db.query(
        `INSERT INTO sources (
          id, external_id, title, publisher_institution_id, publisher_name, source_type, source_level,
          original_url, archival_url, document_number, publication_date, publication_date_precision,
          access_date, source_status, sha256, visibility_class, created_by
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
        ON CONFLICT (external_id) DO UPDATE SET
          title = EXCLUDED.title,
          original_url = EXCLUDED.original_url,
          source_status = EXCLUDED.source_status`,
        [s.id, s.external_id, s.title, s.publisher_institution_id, s.publisher_name, s.source_type, s.source_level, s.original_url, s.archival_url, s.document_number, s.publication_date, s.publication_date_precision, s.access_date, s.source_status, s.sha256, s.visibility_class, s.created_by]
      );
    }

    // Insert Evidence Claims
    for (const c of transformed.evidenceClaims) {
      await db.query(
        `INSERT INTO evidence_claims (
          id, external_id, record_id, claim_type, claim_text, value_numeric, value_text, unit_code,
          date_value, date_precision, period_start, period_end, reporting_period_label,
          data_value_nature, source_origin, verification_status, evidence_profile, risk_level,
          workflow_status, limitations, internal_notes, created_by
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22)
        ON CONFLICT (external_id) DO UPDATE SET
          claim_text = EXCLUDED.claim_text,
          value_numeric = EXCLUDED.value_numeric,
          verification_status = EXCLUDED.verification_status`,
        [c.id, c.external_id, c.record_id, c.claim_type, c.claim_text, c.value_numeric, c.value_text, c.unit_code, c.date_value, c.date_precision, c.period_start, c.period_end, c.reporting_period_label, c.data_value_nature, c.source_origin, c.verification_status, c.evidence_profile, c.risk_level, c.workflow_status, c.limitations, c.internal_notes, c.created_by]
      );
    }

    // Insert Claim Source Relationships
    for (const rel of transformed.claimSourceRelationships) {
      await db.query(
        `INSERT INTO claim_source_relationships (
          id, external_id, claim_id, source_id, source_role, relationship_type, evidence_location,
          evidence_summary, limitation, review_status, reviewed_by, reviewed_at, created_by
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        ON CONFLICT (external_id) DO UPDATE SET
          relationship_type = EXCLUDED.relationship_type,
          evidence_location = EXCLUDED.evidence_location,
          evidence_summary = EXCLUDED.evidence_summary,
          review_status = EXCLUDED.review_status`,
        [rel.id, rel.external_id, rel.claim_id, rel.source_id, rel.source_role, rel.relationship_type, rel.evidence_location, rel.evidence_summary, rel.limitation, rel.review_status, rel.reviewed_by, rel.reviewed_at, rel.created_by]
      );
    }

    // Insert Financial Records
    for (const f of transformed.financialRecords) {
      await db.query(
        `INSERT INTO financial_records (
          id, external_id, record_id, claim_id, geographic_unit_id, financial_type, amount, currency_code,
          reporting_period_label, period_start, period_end, date_precision, aggregation_basis, nominal_or_real,
          methodology, limitations, created_by
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
        ON CONFLICT (external_id) DO UPDATE SET
          amount = EXCLUDED.amount,
          financial_type = EXCLUDED.financial_type,
          aggregation_basis = EXCLUDED.aggregation_basis`,
        [f.id, f.external_id, f.record_id, f.claim_id, f.geographic_unit_id, f.financial_type, f.amount, f.currency_code, f.reporting_period_label, f.period_start, f.period_end, f.date_precision, f.aggregation_basis, f.nominal_or_real, f.methodology, f.limitations, f.created_by]
      );
    }

    // Insert Beneficiary Records
    for (const b of transformed.beneficiaryRecords) {
      await db.query(
        `INSERT INTO beneficiary_records (
          id, external_id, record_id, claim_id, geographic_unit_id, beneficiary_type, beneficiary_stage,
          count_value, unit, count_basis, cumulative, reporting_period_label, period_start, period_end,
          cohort_key, methodology, double_counting_notes, limitations, created_by
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
        ON CONFLICT (external_id) DO UPDATE SET
          count_value = EXCLUDED.count_value,
          beneficiary_stage = EXCLUDED.beneficiary_stage,
          count_basis = EXCLUDED.count_basis`,
        [b.id, b.external_id, b.record_id, b.claim_id, b.geographic_unit_id, b.beneficiary_type, b.beneficiary_stage, b.count_value, b.unit, b.count_basis, b.cumulative, b.reporting_period_label, b.period_start, b.period_end, b.cohort_key, b.methodology, b.double_counting_notes, b.limitations, b.created_by]
      );
    }

    // Insert Indicators
    for (const ind of transformed.indicators) {
      await db.query(
        `INSERT INTO indicators (
          id, external_id, slug, name, definition, unit, frequency, methodology, sector_id, source_institution_id, active, created_by
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        ON CONFLICT (external_id) DO UPDATE SET
          name = EXCLUDED.name,
          definition = EXCLUDED.definition,
          methodology = EXCLUDED.methodology`,
        [ind.id, ind.external_id, ind.slug, ind.name, ind.definition, ind.unit, ind.frequency, ind.methodology, ind.sector_id, ind.source_institution_id, ind.active, ind.created_by]
      );
    }

    // Insert Indicator Observations
    for (const io of transformed.indicatorObservations) {
      await db.query(
        `INSERT INTO indicator_observations (
          id, external_id, indicator_id, claim_id, geographic_unit_id, value_numeric, value_display,
          reporting_period_label, period_start, period_end, data_value_nature, source_origin, verification_status, provisional, created_by
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
        ON CONFLICT (external_id) DO UPDATE SET
          value_numeric = EXCLUDED.value_numeric,
          value_display = EXCLUDED.value_display,
          verification_status = EXCLUDED.verification_status`,
        [io.id, io.external_id, io.indicator_id, io.claim_id, io.geographic_unit_id, io.value_numeric, io.value_display, io.reporting_period_label, io.period_start, io.period_end, io.data_value_nature, io.source_origin, io.verification_status, io.provisional, io.created_by]
      );
    }

    // Insert Timeline Events
    for (const te of transformed.timelineEvents) {
      await db.query(
        `INSERT INTO timeline_events (
          id, external_id, record_id, claim_id, event_type, title, description,
          date_value, date_precision, period_start, period_end, reporting_period_label, provisional, is_public, created_by
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
        ON CONFLICT (external_id) DO UPDATE SET
          title = EXCLUDED.title,
          description = EXCLUDED.description,
          event_type = EXCLUDED.event_type`,
        [te.id, te.external_id, te.record_id, te.claim_id, te.event_type, te.title, te.description, te.date_value, te.date_precision, te.period_start, te.period_end, te.reporting_period_label, te.provisional, te.is_public, te.created_by]
      );
    }

    // Insert Corrections
    for (const cor of transformed.corrections) {
      await db.query(
        `INSERT INTO corrections (
          id, external_id, record_id, claim_id, source_id, correction_type, original_state, corrected_state,
          reason, lifecycle_status, reviewed_by, approved_by, approved_at, created_by, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
        ON CONFLICT (external_id) DO UPDATE SET
          corrected_state = EXCLUDED.corrected_state,
          reason = EXCLUDED.reason,
          lifecycle_status = EXCLUDED.lifecycle_status`,
        [
          cor.id, cor.external_id, cor.record_id, cor.claim_id, cor.source_id, cor.correction_type,
          JSON.stringify({ value: cor.original_value }), JSON.stringify({ value: cor.corrected_value }),
          cor.reason, cor.lifecycle_status, cor.reviewed_by, cor.approved_by, cor.approved_at,
          cor.created_by, cor.created_at
        ]
      );
    }

    // Insert Review Decisions (Publication Reviews)
    for (const rd of transformed.reviewDecisions) {
      await db.query(
        `INSERT INTO review_decisions (
          id, external_id, record_id, claim_id, subject_scope, record_revision,
          gate_code, decision, reviewer_id, rationale, risk_level, decided_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        ON CONFLICT (record_id, record_revision, gate_code, reviewer_id) DO UPDATE SET
          decision = EXCLUDED.decision,
          rationale = EXCLUDED.rationale`,
        [rd.id, rd.external_id, rd.record_id, rd.claim_id, rd.subject_scope, rd.record_revision, rd.gate_code, rd.decision, rd.reviewer_id, rd.rationale, rd.risk_level, rd.decided_at]
      );
    }

    // Finalize Batch Status
    await db.query(
      `UPDATE research_batches SET status = 'committed', completed_at = CURRENT_TIMESTAMP WHERE id = $1`,
      [batchUuid]
    );

    await db.query('COMMIT');
    report.success = true;
  } catch (err) {
    await db.query('ROLLBACK');
    report.errors.push(`Database ingestion failed: ${err.message}`);
  }

  report.durationMs = Date.now() - startTime;
  return report;
}
