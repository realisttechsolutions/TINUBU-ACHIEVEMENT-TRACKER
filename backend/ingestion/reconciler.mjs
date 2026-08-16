import { createHash } from 'node:crypto';
import path from 'node:path';
import { validateResearchPackage } from './data-validator.mjs';
import { transformM02Package } from './entity-transformer.mjs';

export async function reconcileDatabaseWithM02(db) {
  const queries = {
    institutions: 'SELECT count(*)::int AS count FROM institutions',
    geographicUnits: 'SELECT count(*)::int AS count FROM geographic_units',
    records: 'SELECT count(*)::int AS count FROM records',
    recordInstitutions: 'SELECT count(*)::int AS count FROM record_institutions',
    recordSectors: 'SELECT count(*)::int AS count FROM record_sectors',
    recordGeographies: 'SELECT count(*)::int AS count FROM record_geographies',
    recordRelationships: 'SELECT count(*)::int AS count FROM record_relationships',
    achievements: 'SELECT count(*)::int AS count FROM achievement_profiles',
    policies: 'SELECT count(*)::int AS count FROM policy_details',
    projects: 'SELECT count(*)::int AS count FROM project_details',
    programmes: 'SELECT count(*)::int AS count FROM programme_details',
    sources: 'SELECT count(*)::int AS count FROM sources',
    evidenceClaims: 'SELECT count(*)::int AS count FROM evidence_claims',
    claimSourceRelationships: 'SELECT count(*)::int AS count FROM claim_source_relationships',
    financialRecords: 'SELECT count(*)::int AS count FROM financial_records',
    beneficiaryRecords: 'SELECT count(*)::int AS count FROM beneficiary_records',
    indicators: 'SELECT count(*)::int AS count FROM indicators',
    indicatorObservations: 'SELECT count(*)::int AS count FROM indicator_observations',
    timelineEvents: 'SELECT count(*)::int AS count FROM timeline_events',
    corrections: 'SELECT count(*)::int AS count FROM corrections',
    reviewDecisions: 'SELECT count(*)::int AS count FROM review_decisions',
    researchBatches: 'SELECT count(*)::int AS count FROM research_batches',
  };

  const actual = {};
  for (const [key, sql] of Object.entries(queries)) {
    const res = await db.query(sql);
    actual[key] = res.rows[0].count;
  }

  const expected = {
    institutions: 73,
    geographicUnits: 18,
    records: 56, // 30 achievements + 10 policies + 8 projects + 8 programmes
    recordInstitutions: 94,
    recordSectors: 56,
    recordGeographies: 86,
    recordRelationships: 0,
    achievements: 30,
    policies: 10,
    projects: 8,
    programmes: 8,
    sources: 35,
    evidenceClaims: 33,
    claimSourceRelationships: 36,
    financialRecords: 8,
    beneficiaryRecords: 8,
    indicators: 3,
    indicatorObservations: 4,
    timelineEvents: 15,
    corrections: 2,
    reviewDecisions: 30, // 30 publication review gate decisions
    researchBatches: 1,
  };

  const discrepancies = [];
  for (const [table, expCount] of Object.entries(expected)) {
    const actCount = actual[table];
    if (actCount !== expCount) {
      discrepancies.push({
        table,
        expected: expCount,
        actual: actCount,
        diff: actCount - expCount,
      });
    }
  }

  // Showcase records check (Verify specific external IDs)
  const showcaseIds = [
    'ACH-2023-0001', // Electricity Act
    'ACH-2023-0002', // FX Unification
    'ACH-2023-0004', // Presidential CNG
    'ACH-2023-0007', // NAGS-AP Wheat
    'ACH-2023-0009', // 3MTT Phase 1
    'ACH-2024-0012', // Lagos-Calabar Highway
    'ACH-2024-0013', // Abuja Light Rail
    'ACH-2024-0019', // NELFUND Tuition
    'ACH-2024-0023', // PCGS 1M Nano Grants
    'ACH-2024-0028', // LGA Autonomy Ruling
  ];

  const searchIds = showcaseIds.flatMap((id) => [id, `[${id}]`]);

  const showcaseCheck = await db.query(
    'SELECT external_id, title, implementation_status, publication_status FROM records WHERE external_id = ANY($1)',
    [searchIds]
  );

  const missingShowcase = showcaseIds.filter(
    (id) => !showcaseCheck.rows.some((row) => row.external_id === id || row.external_id === `[${id}]`)
  );

  const validation = await validateResearchPackage(path.resolve('data/research-snapshots/m02'));
  if (!validation.valid) throw new Error('Cannot reconcile identities because the approved M02 package is invalid.');
  const { transformed } = transformM02Package(validation.datasetObjects);
  const recordExternalId = new Map(transformed.records.map((record) => [record.id, record.external_id]));
  const institutionName = new Map(transformed.institutions.map((institution) => [institution.id, institution.canonical_name]));
  const sorted = (values) => [...values].map(String).sort();
  const key = (...values) => values.map(String).join('|');
  const expectedIdentities = {
    records: sorted(transformed.records.map((row) => row.external_id)),
    achievements: sorted(transformed.achievementProfiles.map((row) => recordExternalId.get(row.record_id))),
    policies: sorted(transformed.policyDetails.map((row) => recordExternalId.get(row.record_id))),
    projects: sorted(transformed.projectDetails.map((row) => recordExternalId.get(row.record_id))),
    programmes: sorted(transformed.programmeDetails.map((row) => recordExternalId.get(row.record_id))),
    institutions: sorted(transformed.institutions.map((row) => row.canonical_name)),
    geographicUnits: sorted(transformed.geographicUnits.map((row) => row.code)),
    sources: sorted(transformed.sources.map((row) => row.external_id)),
    evidenceClaims: sorted(transformed.evidenceClaims.map((row) => row.external_id)),
    claimSourceRelationships: sorted(transformed.claimSourceRelationships.map((row) => row.external_id)),
    financialRecords: sorted(transformed.financialRecords.map((row) => row.external_id)),
    beneficiaryRecords: sorted(transformed.beneficiaryRecords.map((row) => row.external_id)),
    indicators: sorted(transformed.indicators.map((row) => row.external_id)),
    indicatorObservations: sorted(transformed.indicatorObservations.map((row) => row.external_id)),
    timelineEvents: sorted(transformed.timelineEvents.map((row) => row.external_id)),
    corrections: sorted(transformed.corrections.map((row) => row.external_id)),
    reviewDecisions: sorted(transformed.reviewDecisions.map((row) => row.external_id)),
    recordSectors: sorted(transformed.recordSectors.map((row) => key(recordExternalId.get(row.record_id), row.sector_code, row.role_code))),
    recordInstitutions: sorted(transformed.recordInstitutions.map((row) => key(recordExternalId.get(row.record_id), institutionName.get(row.institution_id), row.role_code))),
    recordGeographies: sorted(transformed.recordGeographies.map((row) => key(recordExternalId.get(row.record_id), row.geography_code, row.coverage_role))),
    recordRelationships: sorted(transformed.recordRelationships.map((row) => key(row.from_record_id, row.to_record_id, row.relationship_role))),
  };

  const identityQueries = {
    records: 'SELECT external_id AS value FROM records ORDER BY value',
    achievements: 'SELECT r.external_id AS value FROM achievement_profiles d JOIN records r ON r.id = d.record_id ORDER BY value',
    policies: 'SELECT r.external_id AS value FROM policy_details d JOIN records r ON r.id = d.record_id ORDER BY value',
    projects: 'SELECT r.external_id AS value FROM project_details d JOIN records r ON r.id = d.record_id ORDER BY value',
    programmes: 'SELECT r.external_id AS value FROM programme_details d JOIN records r ON r.id = d.record_id ORDER BY value',
    institutions: 'SELECT canonical_name AS value FROM institutions ORDER BY value',
    geographicUnits: 'SELECT code AS value FROM geographic_units ORDER BY value',
    sources: 'SELECT external_id AS value FROM sources ORDER BY value',
    evidenceClaims: 'SELECT external_id AS value FROM evidence_claims ORDER BY value',
    claimSourceRelationships: 'SELECT external_id AS value FROM claim_source_relationships ORDER BY value',
    financialRecords: 'SELECT external_id AS value FROM financial_records ORDER BY value',
    beneficiaryRecords: 'SELECT external_id AS value FROM beneficiary_records ORDER BY value',
    indicators: 'SELECT external_id AS value FROM indicators ORDER BY value',
    indicatorObservations: 'SELECT external_id AS value FROM indicator_observations ORDER BY value',
    timelineEvents: 'SELECT external_id AS value FROM timeline_events ORDER BY value',
    corrections: 'SELECT external_id AS value FROM corrections ORDER BY value',
    reviewDecisions: 'SELECT external_id AS value FROM review_decisions ORDER BY value',
    recordSectors: `SELECT concat_ws('|', r.external_id, s.code, rs.role_code) AS value FROM record_sectors rs JOIN records r ON r.id = rs.record_id JOIN sectors s ON s.id = rs.sector_id ORDER BY value`,
    recordInstitutions: `SELECT concat_ws('|', r.external_id, i.canonical_name, ri.role_code) AS value FROM record_institutions ri JOIN records r ON r.id = ri.record_id JOIN institutions i ON i.id = ri.institution_id ORDER BY value`,
    recordGeographies: `SELECT concat_ws('|', r.external_id, g.code, rg.coverage_role) AS value FROM record_geographies rg JOIN records r ON r.id = rg.record_id JOIN geographic_units g ON g.id = rg.geographic_unit_id ORDER BY value`,
    recordRelationships: `SELECT concat_ws('|', source.external_id, target.external_id, rr.relationship_role) AS value FROM record_relationships rr JOIN records source ON source.id = rr.from_record_id JOIN records target ON target.id = rr.to_record_id ORDER BY value`,
  };
  const identityDiscrepancies = [];
  const identityDigests = {};
  for (const [name, query] of Object.entries(identityQueries)) {
    const actualValues = sorted((await db.query(query)).rows.map((row) => row.value));
    const expectedValues = expectedIdentities[name];
    const expectedSet = new Set(expectedValues);
    const actualSet = new Set(actualValues);
    const missing = expectedValues.filter((value) => !actualSet.has(value));
    const unexpected = actualValues.filter((value) => !expectedSet.has(value));
    const digest = (values) => createHash('sha256').update(JSON.stringify(values)).digest('hex');
    identityDigests[name] = { expected: digest(expectedValues), actual: digest(actualValues), count: actualValues.length };
    if (missing.length || unexpected.length) identityDiscrepancies.push({ name, missing, unexpected });
  }

  return {
    reconciled: discrepancies.length === 0 && missingShowcase.length === 0 && identityDiscrepancies.length === 0,
    actual,
    expected,
    discrepancies,
    showcaseVerified: showcaseCheck.rows.length,
    showcaseTotal: showcaseIds.length,
    missingShowcase,
    showcaseRecords: showcaseCheck.rows,
    identityDiscrepancies,
    identityDigests,
  };
}
