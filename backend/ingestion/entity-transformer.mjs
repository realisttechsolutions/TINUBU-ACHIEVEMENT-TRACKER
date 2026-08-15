import { createHash } from 'node:crypto';

export function externalIdToUuid(externalId, namespace = '6ba7b810-9dad-11d1-80b4-00c04fd430c8') {
  if (!externalId) return null;
  const hash = createHash('sha1').update(namespace + externalId).digest('hex');
  return [
    hash.substring(0, 8),
    hash.substring(8, 12),
    '5' + hash.substring(13, 16),
    ((parseInt(hash.substring(16, 18), 16) & 0x3f) | 0x80).toString(16).padStart(2, '0') + hash.substring(18, 20),
    hash.substring(20, 32),
  ].join('-');
}

export function slugify(text) {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/[\[\]]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function mapVerificationStatus(status) {
  if (!status) return 'source_confirmed';
  const s = status.toLowerCase().trim();
  if (s === 'independently_verified' || s === 'independently_corroborated') return 'independently_corroborated';
  if (s === 'multi_source_cross_referenced' || s === 'cross_referenced') return 'cross_referenced';
  if (s === 'source_confirmed') return 'source_confirmed';
  if (s === 'under_review') return 'under_review';
  if (s === 'unverified') return 'unverified';
  if (s === 'disputed') return 'disputed';
  if (s === 'corrected') return 'corrected';
  if (s === 'withdrawn') return 'withdrawn';
  return 'source_confirmed';
}

function mapEvidenceProfile(profile) {
  if (!profile) return 'direct_physical_delivery';
  const p = profile.toLowerCase().trim();
  if (p === 'policy_legal_enactment' || p === 'statutory_legal_enactment') return 'statutory_legal_enactment';
  if (p === 'direct_physical_delivery') return 'direct_physical_delivery';
  if (p === 'verified_administrative_disbursement') return 'verified_administrative_disbursement';
  if (p === 'statistical_indicator_movement') return 'statistical_indicator_movement';
  if (p === 'official_policy_declaration') return 'official_policy_declaration';
  if (p === 'third_party_independent_assessment') return 'third_party_independent_assessment';
  if (p === 'multilateral_partner_evaluation') return 'multilateral_partner_evaluation';
  if (p === 'institutional_reform_milestone') return 'institutional_reform_milestone';
  return 'direct_physical_delivery';
}

function mapSourceType(type) {
  if (!type) return 'gazette';
  const t = type.toLowerCase().trim();
  const allowed = [
    'gazette', 'act_statute', 'executive_order', 'court_ruling', 'statistical_bulletin',
    'economic_report', 'debt_report', 'multilateral_report', 'audit_report', 'academic_study',
    'investigative_report', 'mainstream_media', 'specialist_press', 'state_house_release',
    'ministerial_statement', 'agency_portal', 'social_lead'
  ];
  if (allowed.includes(t)) return t;
  if (t === 'official_gazette') return 'gazette';
  if (t === 'press_release') return 'state_house_release';
  if (t === 'audit') return 'audit_report';
  return 'agency_portal';
}

function mapSourceRole(role) {
  if (!role) return 'primary';
  const r = role.toLowerCase().trim();
  const allowed = [
    'primary', 'official_statistical', 'direct_implementation', 'independent_assessment',
    'corroborating', 'supporting', 'contextual', 'contradictory', 'replacement',
    'archived', 'discovery_lead'
  ];
  if (allowed.includes(r)) return r;
  if (r === 'authoritative') return 'primary';
  if (r === 'secondary') return 'corroborating';
  return 'supporting';
}

function mapRelationshipType(type) {
  if (!type) return 'supports';
  const t = type.toLowerCase().trim();
  const allowed = ['supports', 'contradicts', 'replaces', 'contextualises', 'discovery_only'];
  if (allowed.includes(t)) return t;
  if (t === 'corroborates') return 'supports';
  return 'supports';
}

function mapDataValueNature(nature) {
  if (!nature) return 'actual';
  const n = nature.toLowerCase().trim();
  const allowed = ['actual', 'provisional', 'estimated', 'projected', 'target', 'calculated', 'modelled'];
  if (allowed.includes(n)) return n;
  if (n === 'direct_physical_delivery' || n === 'statutory_enactment' || n === 'official_record') return 'actual';
  return 'actual';
}

function mapSourceOrigin(origin) {
  if (!origin) return 'government_reported';
  const o = origin.toLowerCase().trim();
  const allowed = ['government_reported', 'independently_reported', 'mixed', 'unknown'];
  if (allowed.includes(o)) return o;
  if (o === 'primary_government_source' || o === 'official_agency') return 'government_reported';
  if (o === 'independent_watchdog' || o === 'academic' || o === 'media') return 'independently_reported';
  return 'government_reported';
}

function mapBeneficiaryType(type) {
  if (!type) return 'individuals';
  const t = type.toLowerCase().trim();
  const allowed = ['individuals', 'households', 'farmers', 'students', 'msmes', 'enterprises', 'communities'];
  if (allowed.includes(t)) return t;
  if (t === 'youth' || t === 'citizens' || t === 'workers') return 'individuals';
  if (t === 'nano_enterprises' || t === 'micro_traders') return 'msmes';
  return 'individuals';
}

function mapCountBasis(basis) {
  if (!basis) return 'cumulative_to_date';
  const b = basis.toLowerCase().trim();
  const allowed = ['cumulative_to_date', 'period_specific', 'target_capacity', 'annual_average'];
  if (allowed.includes(b)) return b;
  if (b === 'cumulative') return 'cumulative_to_date';
  return 'cumulative_to_date';
}

function mapProjectType(type) {
  if (!type) return 'highway_road';
  const t = type.toLowerCase().trim();
  const allowed = [
    'highway_road', 'bridge_tunnel', 'rail_system', 'port_maritime', 'airport_aviation',
    'power_plant_grid', 'housing_estate', 'hospital_health_center',
    'school_educational_facility', 'water_dam_irrigation', 'digital_broadband', 'public_building'
  ];
  if (allowed.includes(t)) return t;
  if (t === 'transport_corridor' || t === 'road') return 'highway_road';
  if (t === 'railway' || t === 'rail') return 'rail_system';
  if (t === 'housing') return 'housing_estate';
  if (t === 'health') return 'hospital_health_center';
  return 'highway_road';
}

function mapProgrammeType(type) {
  if (!type) return 'social_investment';
  const t = type.toLowerCase().trim();
  const allowed = [
    'social_investment', 'financial_credit', 'youth_employment', 'agricultural_intervention',
    'industrial_acceleration', 'health_intervention', 'energy_access', 'digital_transformation'
  ];
  if (allowed.includes(t)) return t;
  if (t === 'credit' || t === 'consumer_credit') return 'financial_credit';
  if (t === 'skills' || t === 'youth') return 'youth_employment';
  if (t === 'agriculture') return 'agricultural_intervention';
  if (t === 'digital' || t === 'tech') return 'digital_transformation';
  return 'social_investment';
}

function mapPolicyType(type) {
  if (!type) return 'national_policy';
  const t = type.toLowerCase().trim();
  const allowed = [
    'national_policy', 'executive_order', 'statutory_act', 'regulatory_framework',
    'presidential_directive', 'strategic_roadmap'
  ];
  if (allowed.includes(t)) return t;
  if (t === 'act' || t === 'legislation') return 'statutory_act';
  if (t === 'order') return 'executive_order';
  return 'national_policy';
}

export function transformM02Package(datasetObjects, systemActorId = '00000000-0000-4000-8000-000000000001') {
  const transformed = {
    records: [],
    policyDetails: [],
    projectDetails: [],
    programmeDetails: [],
    achievementProfiles: [],
    sources: [],
    evidenceClaims: [],
    claimSourceRelationships: [],
    financialRecords: [],
    beneficiaryRecords: [],
    indicators: [],
    indicatorObservations: [],
    timelineEvents: [],
    corrections: [],
    reviewDecisions: [],
  };

  const idMap = {
    records: new Map(),
    sources: new Map(),
    claims: new Map(),
    indicators: new Map(),
    relationships: new Map(),
  };

  // 1. Transform Achievements -> records + achievement_profiles
  const achievements = datasetObjects['achievement_record'] || [];
  achievements.forEach((ach) => {
    const extId = ach.achievement_id;
    const uuid = externalIdToUuid(extId);
    idMap.records.set(extId, uuid);
    const rawSlug = slugify(ach.title) || extId.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const slug = rawSlug.replace(/^-+|-+$/g, '');

    const pubDate = ach.date ? `${ach.date}T00:00:00Z` : '2024-08-01T00:00:00Z';

    transformed.records.push({
      id: uuid,
      external_id: extId,
      slug,
      record_type: 'achievement',
      title: ach.title,
      short_title: ach.title.length > 60 ? ach.title.substring(0, 57) + '...' : ach.title,
      summary: ach.summary,
      body: ach.reported_outcomes || ach.summary,
      implementation_status: ach.status || 'completed',
      workflow_status: 'ready_for_publication',
      publication_status: 'published',
      verification_status: mapVerificationStatus(ach.verification_status),
      evidence_profile: mapEvidenceProfile(ach.evidence_profile),
      risk_level: 'low',
      is_public: true,
      qualification: ach.publication_status === 'publication_ready_with_qualification' ? (ach.notes || 'Methodological qualification noted.') : null,
      internal_notes: ach.notes || null,
      created_by: systemActorId,
      current_revision: 1,
      published_at: pubDate,
    });

    transformed.achievementProfiles.push({
      record_id: uuid,
      public_impact_narrative: ach.reported_outcomes || ach.summary,
      public_qualification: ach.notes || null,
      featured_asset_url: null,
      display_priority: 10,
    });
  });

  // 2. Transform Policies -> records + policy_details
  const policies = datasetObjects['policy_record'] || [];
  policies.forEach((pol) => {
    const extId = pol.policy_id;
    const uuid = externalIdToUuid(extId);
    idMap.records.set(extId, uuid);
    const rawSlug = slugify(pol.policy_title) || extId.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const slug = rawSlug.replace(/^-+|-+$/g, '');
    const pubDate = pol.effective_date ? `${pol.effective_date}T00:00:00Z` : '2024-08-01T00:00:00Z';

    transformed.records.push({
      id: uuid,
      external_id: extId,
      slug,
      record_type: 'policy',
      title: pol.policy_title,
      short_title: pol.policy_title.length > 60 ? pol.policy_title.substring(0, 57) + '...' : pol.policy_title,
      summary: pol.key_objectives || pol.policy_title,
      body: pol.notes || pol.key_objectives,
      implementation_status: pol.status || 'enacted',
      workflow_status: 'ready_for_publication',
      publication_status: 'published',
      verification_status: 'independently_corroborated',
      evidence_profile: 'statutory_legal_enactment',
      risk_level: 'low',
      is_public: true,
      qualification: null,
      internal_notes: pol.notes || null,
      created_by: systemActorId,
      current_revision: 1,
      published_at: pubDate,
    });

    transformed.policyDetails.push({
      record_id: uuid,
      policy_type: mapPolicyType(pol.policy_type),
      legal_authority: pol.legal_authority || 'Gazette Authority',
      reference_number: pol.gazette_reference || pol.policy_id,
      effect_scope: 'national',
    });
  });

  // 3. Transform Projects -> records + project_details
  const projects = datasetObjects['project_record'] || [];
  projects.forEach((prj) => {
    const extId = prj.project_id;
    const uuid = externalIdToUuid(extId);
    idMap.records.set(extId, uuid);
    const rawSlug = slugify(prj.project_title) || extId.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const slug = rawSlug.replace(/^-+|-+$/g, '');
    const pubDate = prj.start_date ? `${prj.start_date}T00:00:00Z` : '2024-08-01T00:00:00Z';

    transformed.records.push({
      id: uuid,
      external_id: extId,
      slug,
      record_type: 'physical_project',
      title: prj.project_title,
      short_title: prj.project_title.length > 60 ? prj.project_title.substring(0, 57) + '...' : prj.project_title,
      summary: prj.notes || prj.project_title,
      body: prj.notes || prj.project_title,
      implementation_status: prj.status || 'operational',
      workflow_status: 'ready_for_publication',
      publication_status: 'published',
      verification_status: 'independently_corroborated',
      evidence_profile: 'direct_physical_delivery',
      risk_level: 'low',
      is_public: true,
      qualification: null,
      internal_notes: prj.notes || null,
      created_by: systemActorId,
      current_revision: 1,
      published_at: pubDate,
    });

    transformed.projectDetails.push({
      record_id: uuid,
      project_type: mapProjectType(prj.project_type),
      progress_percentage: prj.progress_percentage ? parseFloat(prj.progress_percentage) : 100.0,
      contract_reference: prj.contractor || null,
      project_reference: prj.project_id,
      location_narrative: prj.states_covered || 'Nigeria',
    });
  });

  // 4. Transform Programmes -> records + programme_details
  const programmes = datasetObjects['programme_record'] || [];
  programmes.forEach((prog) => {
    const extId = prog.programme_id;
    const uuid = externalIdToUuid(extId);
    idMap.records.set(extId, uuid);
    const rawSlug = slugify(prog.programme_title) || extId.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const slug = rawSlug.replace(/^-+|-+$/g, '');
    const pubDate = prog.launch_date ? `${prog.launch_date}T00:00:00Z` : '2024-08-01T00:00:00Z';

    transformed.records.push({
      id: uuid,
      external_id: extId,
      slug,
      record_type: 'programme',
      title: prog.programme_title,
      short_title: prog.programme_title.length > 60 ? prog.programme_title.substring(0, 57) + '...' : prog.programme_title,
      summary: prog.notes || prog.programme_title,
      body: prog.notes || prog.programme_title,
      implementation_status: prog.status || 'operational',
      workflow_status: 'ready_for_publication',
      publication_status: 'published',
      verification_status: 'independently_corroborated',
      evidence_profile: 'direct_physical_delivery',
      risk_level: 'low',
      is_public: true,
      qualification: null,
      internal_notes: prog.notes || null,
      created_by: systemActorId,
      current_revision: 1,
      published_at: pubDate,
    });

    transformed.programmeDetails.push({
      record_id: uuid,
      programme_type: mapProgrammeType(prog.programme_type),
      target_group_narrative: prog.target_beneficiary_type || 'Beneficiaries across Nigeria',
      enrolment_model: 'Direct registration',
      disbursement_model: 'Direct transfer',
    });
  });

  // 5. Transform Sources -> sources
  const sources = datasetObjects['source_capture'] || [];
  sources.forEach((src) => {
    const extId = src.source_id;
    const uuid = externalIdToUuid(extId);
    idMap.sources.set(extId, uuid);

    const level = src.source_level.startsWith('LEVEL_') ? src.source_level : `LEVEL_${src.source_level.replace(/[^0-9]/g, '')}`;

    transformed.sources.push({
      id: uuid,
      external_id: extId,
      title: src.source_title,
      publisher_institution_id: null,
      publisher_name: src.publisher || src.institution || 'Federal Ministry',
      source_type: mapSourceType(src.source_type),
      source_level: level,
      original_url: src.url && src.url.startsWith('http') ? src.url : null,
      archival_url: src.archive_url && src.archive_url.startsWith('http') ? src.archive_url : null,
      document_number: src.document_number || null,
      publication_date: src.publication_date || null,
      publication_date_precision: src.publication_date_precision || 'exact_day',
      access_date: src.access_date || '2024-08-01',
      source_status: 'active',
      sha256: null,
      visibility_class: 'public',
      created_by: systemActorId,
    });
  });

  // 6. Transform Claims -> evidence_claims
  const claims = datasetObjects['claim_extraction'] || [];
  claims.forEach((clm) => {
    const extId = clm.claim_id;
    const uuid = externalIdToUuid(extId);
    idMap.claims.set(extId, uuid);
    const recordUuid = idMap.records.get(clm.record_id);

    transformed.evidenceClaims.push({
      id: uuid,
      external_id: extId,
      record_id: recordUuid,
      claim_type: clm.claim_type || 'implementation_status',
      claim_text: clm.claim_text,
      value_numeric: clm.numeric_value ? parseFloat(clm.numeric_value) : null,
      value_text: clm.numeric_value ? `${clm.numeric_value} ${clm.unit || ''}`.trim() : null,
      unit_code: clm.unit || null,
      date_value: clm.date_value || null,
      date_precision: clm.date_precision || 'exact_day',
      period_start: null,
      period_end: null,
      reporting_period_label: clm.reporting_period || null,
      data_value_nature: mapDataValueNature(clm.value_nature),
      source_origin: mapSourceOrigin(clm.reporting_origin),
      verification_status: mapVerificationStatus(clm.verification_status),
      evidence_profile: 'direct_physical_delivery',
      risk_level: 'low',
      workflow_status: 'ready_for_publication',
      limitations: clm.notes || null,
      internal_notes: clm.notes || null,
      created_by: systemActorId,
    });
  });

  // 7. Transform Claim-Source Relationships -> claim_source_relationships
  const relationships = datasetObjects['claim_source_relationship'] || [];
  relationships.forEach((rel) => {
    const extId = rel.relationship_id;
    const uuid = externalIdToUuid(extId);
    idMap.relationships.set(extId, uuid);
    const claimUuid = idMap.claims.get(rel.claim_id);
    const sourceUuid = idMap.sources.get(rel.source_id);

    transformed.claimSourceRelationships.push({
      id: uuid,
      external_id: extId,
      claim_id: claimUuid,
      source_id: sourceUuid,
      source_role: mapSourceRole(rel.source_role),
      relationship_type: mapRelationshipType(rel.relationship_type),
      evidence_location: rel.evidence_location || 'Page 1',
      evidence_summary: rel.evidence_summary || 'Primary evidentiary support confirmed.',
      limitation: rel.evidence_limitation || null,
      review_status: 'ready_for_publication',
      reviewed_by: systemActorId,
      reviewed_at: '2024-08-15T00:00:00Z',
      created_by: systemActorId,
    });
  });

  // 8. Transform Financial Records -> financial_records
  const financials = datasetObjects['financial_record'] || [];
  financials.forEach((fin) => {
    const extId = fin.id;
    const uuid = externalIdToUuid(extId);
    const recordUuid = idMap.records.get(fin.record_id);
    const claimUuid = idMap.claims.get(fin.claim_id);

    const start = fin.period_start || '2024-01-01';
    const end = fin.period_end || '2024-12-31';

    transformed.financialRecords.push({
      id: uuid,
      external_id: extId,
      record_id: recordUuid,
      claim_id: claimUuid,
      geographic_unit_id: null,
      financial_type: fin.financial_type,
      amount: parseFloat(fin.amount),
      currency_code: fin.currency || 'NGN',
      reporting_period_label: fin.reporting_period || '2024',
      period_start: start,
      period_end: end,
      date_precision: fin.date_precision || 'exact_day',
      aggregation_basis: fin.aggregation_basis || 'period',
      nominal_or_real: fin.nominal_or_real || 'nominal',
      methodology: fin.notes || 'Direct fiscal appropriation / warrant record.',
      limitations: fin.notes || null,
      created_by: systemActorId,
    });
  });

  // 9. Transform Beneficiary Records -> beneficiary_records
  const beneficiaries = datasetObjects['beneficiary_record'] || [];
  beneficiaries.forEach((ben) => {
    const extId = ben.id;
    const uuid = externalIdToUuid(extId);
    const recordUuid = idMap.records.get(ben.record_id);
    const claimUuid = idMap.claims.get(ben.claim_id);

    const countBasis = mapCountBasis(ben.count_basis);
    const isCumulative = countBasis === 'cumulative_to_date';

    transformed.beneficiaryRecords.push({
      id: uuid,
      external_id: extId,
      record_id: recordUuid,
      claim_id: claimUuid,
      geographic_unit_id: null,
      beneficiary_type: mapBeneficiaryType(ben.beneficiary_type),
      beneficiary_stage: ben.beneficiary_stage,
      count_value: parseInt(ben.count_value, 10),
      unit: 'individuals',
      count_basis: countBasis,
      cumulative: isCumulative,
      reporting_period_label: ben.reporting_period || '2024',
      period_start: '2024-01-01',
      period_end: '2024-12-31',
      cohort_key: ben.cohort_key || 'NATIONAL_2024',
      methodology: ben.notes || 'Verified portal registrations / disbursement logs.',
      double_counting_notes: ben.double_counting_note || null,
      limitations: ben.notes || null,
      created_by: systemActorId,
    });
  });

  // 10. Transform Indicators -> indicators
  const indicators = datasetObjects['indicator_record'] || [];
  indicators.forEach((ind) => {
    const extId = ind.indicator_id;
    const uuid = externalIdToUuid(extId);
    idMap.indicators.set(extId, uuid);
    const rawSlug = slugify(ind.indicator_name) || extId.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const slug = rawSlug.replace(/^-+|-+$/g, '');

    transformed.indicators.push({
      id: uuid,
      external_id: extId,
      slug,
      name: ind.indicator_name,
      definition: ind.methodology_summary || ind.indicator_name,
      unit: ind.unit || 'index',
      frequency: ind.frequency || 'quarterly',
      methodology: ind.methodology_summary || ind.indicator_name,
      sector_id: null,
      source_institution_id: null,
      active: true,
      created_by: systemActorId,
    });
  });

  // 11. Transform Indicator Observations -> indicator_observations
  const observations = datasetObjects['indicator_observation'] || [];
  observations.forEach((obs) => {
    const extId = obs.id;
    const uuid = externalIdToUuid(extId);
    const indicatorUuid = idMap.indicators.get(obs.indicator_id);
    const claimUuid = idMap.claims.get(obs.claim_id);

    transformed.indicatorObservations.push({
      id: uuid,
      external_id: extId,
      indicator_id: indicatorUuid,
      claim_id: claimUuid,
      geographic_unit_id: null,
      value_numeric: obs.observed_value ? parseFloat(obs.observed_value) : null,
      value_display: obs.observed_value,
      reporting_period_label: obs.period || '2024-Q2',
      period_start: obs.period_start || '2024-01-01',
      period_end: obs.period_end || '2024-06-30',
      data_value_nature: mapDataValueNature(obs.data_value_nature),
      source_origin: mapSourceOrigin(obs.source_origin),
      verification_status: mapVerificationStatus(obs.verification_status),
      provisional: false,
      created_by: systemActorId,
    });
  });

  // 12. Transform Timeline Events -> timeline_events
  const timelineEvents = datasetObjects['timeline_event'] || [];
  timelineEvents.forEach((evt) => {
    const extId = evt.event_id;
    const uuid = externalIdToUuid(extId);
    const recordUuid = idMap.records.get(evt.record_id);

    transformed.timelineEvents.push({
      id: uuid,
      external_id: extId,
      record_id: recordUuid,
      claim_id: null,
      event_type: evt.event_type || 'operation',
      title: evt.event_title,
      description: evt.summary || evt.notes || null,
      date_value: evt.event_date || null,
      date_precision: evt.date_precision || 'exact_day',
      period_start: null,
      period_end: null,
      reporting_period_label: null,
      provisional: false,
      is_public: true,
      created_by: systemActorId,
    });
  });

  // 13. Transform Corrections -> corrections
  const corrections = datasetObjects['correction_record'] || [];
  corrections.forEach((cor) => {
    const extId = cor.correction_id;
    const uuid = externalIdToUuid(extId);
    const recordUuid = idMap.records.get(cor.record_id);
    const claimUuid = idMap.claims.get(cor.claim_id);
    const sourceUuid = idMap.sources.get(cor.source_id);

    transformed.corrections.push({
      id: uuid,
      external_id: extId,
      record_id: recordUuid,
      claim_id: claimUuid,
      source_id: sourceUuid,
      correction_type: 'numerical_update',
      original_value: cor.previous_value,
      corrected_value: cor.corrected_value,
      reason: cor.reason || 'Data update following verified official release.',
      lifecycle_status: 'approved',
      reviewed_by: systemActorId,
      approved_by: systemActorId,
      approved_at: '2024-08-15T00:00:00Z',
      created_by: systemActorId,
      created_at: cor.revision_date ? `${cor.revision_date}T00:00:00Z` : '2024-08-15T00:00:00Z',
    });
  });

  // 14. Transform Publication Reviews -> review_decisions
  const pubReviews = datasetObjects['publication_review'] || [];
  pubReviews.forEach((pub) => {
    const extId = pub.review_id;
    const uuid = externalIdToUuid(extId);
    const recordUuid = idMap.records.get(pub.record_id) || transformed.records[0]?.id;

    transformed.reviewDecisions.push({
      id: uuid,
      external_id: extId,
      record_id: recordUuid,
      claim_id: null,
      subject_scope: 'record',
      record_revision: 1,
      gate_code: 'gate_5_publication_stewardship',
      decision: pub.review_decision === 'publication_ready_with_qualification' ? 'approved_with_qualification' : 'approved',
      reviewer_id: systemActorId,
      rationale: `Publication review: ${pub.review_decision}. Audit pass: ${pub.truth_rules_audit_pass}. Notes: ${pub.notes || 'None'}`,
      risk_level: 'low',
      decided_at: pub.review_date ? `${pub.review_date}T00:00:00Z` : '2024-08-15T00:00:00Z',
    });
  });

  return {
    transformed,
    idMap,
  };
}
