export async function reconcileDatabaseWithM02(db) {
  const queries = {
    records: 'SELECT count(*)::int AS count FROM records',
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
    records: 56, // 30 achievements + 10 policies + 8 projects + 8 programmes
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

  return {
    reconciled: discrepancies.length === 0 && missingShowcase.length === 0,
    actual,
    expected,
    discrepancies,
    showcaseVerified: showcaseCheck.rows.length,
    showcaseTotal: showcaseIds.length,
    missingShowcase,
    showcaseRecords: showcaseCheck.rows,
  };
}
