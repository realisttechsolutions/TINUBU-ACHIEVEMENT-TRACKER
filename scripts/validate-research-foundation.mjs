import fs from 'node:fs';
import path from 'node:path';
import Ajv from 'ajv';

const root = process.cwd();
const EXPECTED_SCHEMA_COUNT = 19;
const EXPECTED_TEMPLATE_COUNT = 19;
const EXACT_EXAMPLE_MARKER = '[EXAMPLE ONLY - NOT A PRODUCTION RECORD]';

// Expected v1.1.2 authority groups; the validator also reconciles these with
// the document-index table and the filesystem rather than trusting this list.
const canonicalDocs = [
  'docs/research/TAT_RESEARCH_CONTRACT_V1_1_2.md',
  'docs/research/TAT_CODEX_AUDIT_RESOLUTION_LOG.md',
  'docs/research/TAT_RESEARCH_DOCUMENT_INDEX.md',
  'docs/research/TAT_FRONTEND_CONTRACT_ALIGNMENT_REQUIREMENTS.md',
  'docs/research/TAT_RESEARCH_CONTRACT_CHANGELOG.md',
  'docs/research/TAT_SECTOR_TAXONOMY.md',
  'docs/research/TAT_STATUS_AND_CLASSIFICATION_STANDARD.md',
  'docs/research/TAT_SOURCE_HIERARCHY.md',
  'docs/research/TAT_SOURCE_ROLE_STANDARD.md',
  'docs/research/TAT_EVIDENCE_STANDARD.md',
  'docs/research/TAT_EVIDENCE_PROFILE_STANDARD.md',
  'docs/research/TAT_QUALITY_CONTROL_GATES.md',
  'docs/research/TAT_RESEARCH_AGENT_OPERATING_MODEL.md',
  'docs/research/TAT_RESEARCH_ROADMAP.md',
  'docs/research/TAT_RESEARCH_RISK_REGISTER.md',
  'docs/research/TAT_MISSION_R01_COMPLIANCE_MATRIX.md',
];

const supportingDocs = [
  'docs/research/TAT_RESEARCH_WORKFLOW.md',
  'docs/research/TAT_VERIFICATION_WORKFLOW.md',
  'docs/research/TAT_CONTRADICTION_PROTOCOL.md',
  'docs/research/TAT_DUPLICATE_DETECTION_STANDARD.md',
  'docs/research/TAT_DATA_FRESHNESS_POLICY.md',
  'docs/research/TAT_DATA_VERSIONING_AND_CORRECTION_STANDARD.md',
  'docs/research/TAT_INTERNAL_PUBLIC_DATA_BOUNDARY.md',
  'docs/research/TAT_RESEARCH_OUTPUT_TEMPLATES.md',
  'docs/research/TAT_IMPORT_EXPORT_STANDARD.md',
  'docs/research/TAT_RESEARCH_GOVERNANCE.md',
  'docs/research/TAT_PILOT_RESEARCH_DESIGN.md',
  'docs/research/TAT_COMPLETE_DATA_UNIVERSE.md',
  'docs/research/TAT_RECORD_TAXONOMY.md',
  'docs/research/MISSION_R01_RESEARCH_DATA_BLUEPRINT.md',
  'docs/research/TAT_RESEARCH_OBJECTIVES.md',
  'docs/research/TAT_RESEARCH_PRIORITISATION_STANDARD.md',
  'docs/research/TAT_RESEARCH_RISK_CLASSIFICATION.md',
];

const historicalRetiredDocs = [
  'docs/research/TAT_RESEARCH_CONTRACT_V1_1_1.md',
  'docs/research/TAT_RESEARCH_CONTRACT_V1_1.md',
  'docs/research/CANONICAL_TAXONOMIES.md',
  'docs/research/DATA_INGESTION_CONTRACT.md',
  'docs/research/EVIDENCE_GOVERNANCE_AND_VERIFICATION.md',
  'docs/research/RESEARCH_TEMPLATES_GUIDE.md',
  'docs/research/RESEARCH_TO_DEV_HANDOFF.md',
  'docs/research/SUPABASE_DATA_CONTRACT_AND_ENTITY_MAP.md',
  'docs/research/TAT_SUPABASE_DATA_CONTRACT_V1.md',
  'docs/research/TAT_SUPABASE_ENTITY_RELATIONSHIP_MAP.md',
  'docs/research/TAT_RESEARCH_TO_DEVELOPMENT_HANDOFF.md',
];

const allIndexedDocs = [...canonicalDocs, ...supportingDocs, ...historicalRetiredDocs];

const pipeDelimitedFields = new Set([
  'aliases',
  'key_objectives',
  'related_achievement_slugs',
  'reported_outcomes',
  'responsible_institutions',
  'states_covered',
]);
const actorIdentifierFields = new Set([
  'assigned_reviewer',
  'editor_id',
  'researcher_id',
  'reviewer_id',
  'revised_by',
  'reviewed_by',
  'resolved_by',
  'created_by',
  'lead_actor'
]);
const nonDateFieldsEndingInDate = new Set(['candidate_title']);
const datePrecisionBindings = {
  achievement_record: { precisionField: 'date_precision', valueFields: ['date'] },
  beneficiary_record: { precisionField: 'date_precision', valueFields: ['reporting_period'] },
  claim_extraction: { precisionField: 'date_precision', valueFields: ['date_value'] },
  financial_record: { precisionField: 'date_precision', valueFields: ['reporting_period'] },
  indicator_observation: { precisionField: 'date_precision', valueFields: ['period'] },
  policy_record: { precisionField: 'date_precision', valueFields: ['approval_date', 'effective_date'] },
  programme_record: { precisionField: 'date_precision', valueFields: ['launch_date'] },
  project_record: { precisionField: 'date_precision', valueFields: ['start_date', 'completion_or_current_date'] },
  source_capture: { precisionField: 'publication_date_precision', valueFields: ['publication_date'] },
  timeline_event: { precisionField: 'date_precision', valueFields: ['event_date'] },
};

let totalErrors = 0;

function pass(message) {
  console.log(`PASS: ${message}`);
}

function fail(message) {
  console.error(`FAIL: ${message}`);
  totalErrors += 1;
}

function isHttpUrl(value) {
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isIdentifier(value) {
  return (
    /^\[[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*\]$/.test(value) ||
    /^[a-z0-9]+(?:[-_][a-z0-9]+)*$/.test(value) ||
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)
  );
}

function isIsoCurrency(value) {
  if (!/^[A-Z]{3}$/.test(value)) return false;
  try {
    return Intl.supportedValuesOf('currency').includes(value);
  } catch {
    return false;
  }
}

function isCalendarDate(value) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return false;
  const [, year, month, day] = match.map(Number);
  const parsed = new Date(Date.UTC(year, month - 1, day));
  return (
    parsed.getUTCFullYear() === year &&
    parsed.getUTCMonth() === month - 1 &&
    parsed.getUTCDate() === day
  );
}

function isYear(value) {
  return /^(19|20|21)\d{2}$/.test(value);
}

function isMonth(value) {
  const match = /^(19|20|21)\d{2}-(0[1-9]|1[0-2])$/.exec(value);
  return Boolean(match);
}

function isQuarter(value) {
  return /^(19|20|21)\d{2}-Q[1-4]$/.test(value);
}

function isFiscalYear(value) {
  return /^FY(19|20|21)\d{2}$/.test(value) || /^(19|20|21)\d{2}\/\d{2}$/.test(value);
}

function isDateRange(value) {
  const parts = value.split('/');
  if (parts.length !== 2) return false;
  return parts.every(part => isCalendarDate(part) || isMonth(part) || isYear(part));
}

function isReportingDate(value) {
  return (
    isCalendarDate(value) ||
    isMonth(value) ||
    isQuarter(value) ||
    isYear(value) ||
    isFiscalYear(value) ||
    isDateRange(value)
  );
}

function dateMatchesPrecision(value, precision) {
  const checks = {
    exact_day: isCalendarDate,
    month: isMonth,
    quarter: isQuarter,
    year: isYear,
    fiscal_year: isFiscalYear,
    range: isDateRange,
    unknown: () => true,
  };
  return Boolean(checks[precision]?.(value));
}

function checkPeriodBounds(start, end) {
  if (!start || !end) return true;
  if (isCalendarDate(start) && isCalendarDate(end)) {
    return new Date(start).getTime() <= new Date(end).getTime();
  }
  return start <= end;
}

function sectorMatchesParent(publicGroup, sectorId, registry) {
  if (!publicGroup || !sectorId || !registry?.canonical_sectors) return true;
  const sector = registry.canonical_sectors.find(item => item.sector_id === sectorId);
  return Boolean(sector && sector.parent_public_group === publicGroup);
}

function isDateField(field) {
  if (nonDateFieldsEndingInDate.has(field)) return false;
  return (
    field === 'date' ||
    field === 'date_value' ||
    field === 'reporting_period' ||
    field === 'start_date' ||
    field === 'period_start' ||
    field === 'period_end' ||
    field === 'completion_or_current_date' ||
    field === 'launch_date' ||
    field === 'approval_date' ||
    field === 'effective_date' ||
    field === 'event_date' ||
    field === 'last_verified_date' ||
    field === 'next_review_due' ||
    field === 'review_date' ||
    field === 'revision_date' ||
    field === 'resolution_date' ||
    field === 'date_observed' ||
    field === 'target_resolution_date' ||
    field.endsWith('_date') ||
    field.endsWith('_at')
  );
}

export function parseCsv(content, fileName) {
  const text = content.replace(/^\uFEFF/, '');
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;
  let quoteClosed = false;

  const pushField = () => {
    row.push(field);
    field = '';
    quoteClosed = false;
  };
  const pushRow = () => {
    pushField();
    if (row.some(value => value.length > 0)) rows.push(row);
    row = [];
  };

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    if (inQuotes) {
      if (char === '"') {
        if (text[index + 1] === '"') {
          field += '"';
          index += 1;
        } else {
          inQuotes = false;
          quoteClosed = true;
        }
      } else {
        field += char;
      }
      continue;
    }

    if (quoteClosed) {
      if (char === ',') pushField();
      else if (char === '\n') pushRow();
      else if (char !== '\r') {
        throw new Error(`${fileName}: unexpected character after closing quote at offset ${index}`);
      }
      continue;
    }

    if (char === '"') {
      if (field.length > 0) {
        throw new Error(`${fileName}: quote inside an unquoted field at offset ${index}`);
      }
      inQuotes = true;
    } else if (char === ',') {
      pushField();
    } else if (char === '\n') {
      pushRow();
    } else if (char !== '\r') {
      field += char;
    }
  }

  if (inQuotes) throw new Error(`${fileName}: unclosed quoted field`);
  if (field.length > 0 || row.length > 0) pushRow();
  return rows;
}

function validateRequiredValues(row, schema, context) {
  for (const field of schema.required ?? []) {
    if (typeof row[field] !== 'string' || row[field].trim() === '') {
      fail(`${context}: required field '${field}' is blank`);
    }
  }
}

function validateDomainValues(row, schemaName, context) {
  for (const [field, rawValue] of Object.entries(row)) {
    const value = rawValue.trim();
    if (!value) continue;

    if ((field === 'url' || field.endsWith('_url') || field === 'featured_image' || field === 'discovery_source_url') && !isHttpUrl(value)) {
      fail(`${context}: '${field}' is not an HTTP(S) URL`);
    }

    const identifierField =
      field === 'id' ||
      field === 'achievement_id' ||
      field === 'policy_id' ||
      field === 'project_id' ||
      field === 'programme_id' ||
      field === 'indicator_id' ||
      field === 'candidate_id' ||
      field === 'claim_id' ||
      field === 'source_id' ||
      field === 'relationship_id' ||
      field === 'event_id' ||
      field === 'contradiction_id' ||
      field === 'review_id' ||
      field === 'gap_id' ||
      field === 'correction_id' ||
      field.endsWith('_id') ||
      /^record_id_[12]$/.test(field) ||
      field === 'claim_id_a' ||
      field === 'claim_id_b' ||
      field === 'source_id_a' ||
      field === 'source_id_b';

    if (identifierField) {
      const valid = actorIdentifierFields.has(field)
        ? isIdentifier(value) || isEmail(value) || value.length >= 2
        : isIdentifier(value);
      if (!valid) fail(`${context}: '${field}' is not a valid identifier ('${value}')`);
    }

    if (pipeDelimitedFields.has(field) && value.includes('|')) {
      const parts = value.split('|');
      if (parts.some(part => !part || part !== part.trim())) {
        fail(`${context}: '${field}' contains an empty item or whitespace around '|'`);
      }
      if (field === 'related_achievement_slugs' && parts.some(part => !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(part))) {
        fail(`${context}: '${field}' contains an invalid slug`);
      }
    }

    if (isDateField(field) && !isReportingDate(value)) {
      fail(`${context}: '${field}' has an invalid date or reporting-period value '${value}'`);
    }
  }

  const dateBinding = datePrecisionBindings[schemaName];
  if (dateBinding) {
    const precision = row[dateBinding.precisionField];
    for (const field of dateBinding.valueFields) {
      if (precision && row[field] && !dateMatchesPrecision(row[field], precision)) {
        fail(`${context}: '${field}' does not match ${dateBinding.precisionField} '${precision}'`);
      }
    }
  }
  if (row.public_navigation_group && row.sector && !sectorMatchesParent(row.public_navigation_group, row.sector, vocabRegistry)) {
    fail(`${context}: sector '${row.sector}' is not a child of public_navigation_group '${row.public_navigation_group}'`);
  }
  if (row.period_start && row.period_end && !checkPeriodBounds(row.period_start, row.period_end)) {
    fail(`${context}: period_start (${row.period_start}) must be <= period_end (${row.period_end})`);
  }
  if (row.currency && !isIsoCurrency(row.currency)) {
    fail(`${context}: currency '${row.currency}' is not a recognized three-letter currency code`);
  }
  if (row.amount && (!/^\d+(?:\.\d{1,4})?$/.test(row.amount) || Number(row.amount) <= 0)) {
    fail(`${context}: amount must be a positive base-unit decimal with at most four fractional digits`);
  }
  if (row.count_value && (!/^\d+$/.test(row.count_value) || Number(row.count_value) < 0)) {
    fail(`${context}: count_value must be a non-negative integer`);
  }
  if (row.progress_percentage && (!/^\d+(?:\.\d+)?$/.test(row.progress_percentage) || Number(row.progress_percentage) < 0 || Number(row.progress_percentage) > 100)) {
    fail(`${context}: progress_percentage must be between 0 and 100`);
  }
  if (row.match_confidence && (!/^\d+(?:\.\d+)?$/.test(row.match_confidence) || Number(row.match_confidence) < 0 || Number(row.match_confidence) > 1)) {
    fail(`${context}: match_confidence must be between 0 and 1`);
  }
  if (row.stale_threshold_days && (!/^\d+$/.test(row.stale_threshold_days) || Number(row.stale_threshold_days) <= 0)) {
    fail(`${context}: stale_threshold_days must be a positive integer`);
  }
  if (row.year && !isYear(row.year)) {
    fail(`${context}: year must be a four-digit calendar year`);
  }
  if (row.truth_rules_audit_pass && !/^(true|false)$/.test(row.truth_rules_audit_pass)) {
    fail(`${context}: truth_rules_audit_pass must be true or false`);
  }
}

// ----------------------------------------------------
// MAIN VALIDATION EXECUTION
// ----------------------------------------------------
console.log('===================================================================');
console.log('TINUBU ACHIEVEMENT TRACKER - RESEARCH FOUNDATION VALIDATOR v1.1.2');
console.log('===================================================================');

// 1. Document index, expected authority status, and filesystem reconciliation
console.log(`\n1. Document registry and filesystem reconciliation (${allIndexedDocs.length} expected documents)`);
const documentationErrorsBefore = totalErrors;
const documentIndexPath = path.join(root, 'docs/research/TAT_RESEARCH_DOCUMENT_INDEX.md');
const allowedDocumentStatuses = new Set(['CANONICAL', 'SUPPORTING', 'SUPERSEDED', 'DEPRECATED', 'LEGACY']);
const expectedStatusByPath = new Map([
  ...canonicalDocs.map(relativePath => [relativePath, 'CANONICAL']),
  ...supportingDocs.map(relativePath => [relativePath, 'SUPPORTING']),
  ...[
    'docs/research/TAT_RESEARCH_CONTRACT_V1_1_1.md',
    'docs/research/TAT_RESEARCH_CONTRACT_V1_1.md',
    'docs/research/CANONICAL_TAXONOMIES.md',
    'docs/research/DATA_INGESTION_CONTRACT.md',
    'docs/research/EVIDENCE_GOVERNANCE_AND_VERIFICATION.md',
    'docs/research/RESEARCH_TEMPLATES_GUIDE.md',
  ].map(relativePath => [relativePath, 'SUPERSEDED']),
  ...[
    'docs/research/RESEARCH_TO_DEV_HANDOFF.md',
    'docs/research/SUPABASE_DATA_CONTRACT_AND_ENTITY_MAP.md',
    'docs/research/TAT_SUPABASE_DATA_CONTRACT_V1.md',
    'docs/research/TAT_SUPABASE_ENTITY_RELATIONSHIP_MAP.md',
  ].map(relativePath => [relativePath, 'DEPRECATED']),
  ['docs/research/TAT_RESEARCH_TO_DEVELOPMENT_HANDOFF.md', 'LEGACY'],
]);

const indexedStatusByPath = new Map();
if (!fs.existsSync(documentIndexPath)) {
  fail('Missing authoritative document index');
} else {
  const indexContent = fs.readFileSync(documentIndexPath, 'utf8');
  const rowPattern = /^\|\s*\d+\s*\|\s*`(docs\/research\/[^`]+\.md)`\s*\|\s*\*\*(CANONICAL|SUPPORTING|SUPERSEDED|DEPRECATED|LEGACY)\*\*/gm;
  for (const match of indexContent.matchAll(rowPattern)) {
    const [, relativePath, status] = match;
    if (!allowedDocumentStatuses.has(status)) fail(`Document index: invalid status '${status}' for ${relativePath}`);
    if (indexedStatusByPath.has(relativePath)) fail(`Document index: duplicate entry '${relativePath}'`);
    indexedStatusByPath.set(relativePath, status);
  }
}

const filesystemDocs = fs.readdirSync(path.join(root, 'docs/research'))
  .filter(fileName => fileName.endsWith('.md'))
  .map(fileName => `docs/research/${fileName}`)
  .sort();
const filesystemDocSet = new Set(filesystemDocs);
for (const relativePath of filesystemDocs) {
  if (!indexedStatusByPath.has(relativePath)) fail(`Document index: filesystem document is not registered: ${relativePath}`);
}
for (const relativePath of indexedStatusByPath.keys()) {
  if (!filesystemDocSet.has(relativePath)) fail(`Document index: registered document does not exist: ${relativePath}`);
}
for (const [relativePath, expectedStatus] of expectedStatusByPath) {
  if (indexedStatusByPath.get(relativePath) !== expectedStatus) {
    fail(`Document index: ${relativePath} expected status ${expectedStatus}, found ${indexedStatusByPath.get(relativePath) || 'UNREGISTERED'}`);
  }
}
if (expectedStatusByPath.size !== filesystemDocs.length) {
  fail(`Document authority configuration has ${expectedStatusByPath.size} entries but filesystem has ${filesystemDocs.length}`);
}
for (const relativePath of filesystemDocs) {
  const filePath = path.join(root, relativePath);
  const content = fs.readFileSync(filePath, 'utf8').trim();
  if (content.length <= 100) fail(`${relativePath} is not substantive (${content.length} characters)`);
}
if (totalErrors === documentationErrorsBefore) {
  const statusCounts = [...indexedStatusByPath.values()].reduce((counts, status) => ({ ...counts, [status]: (counts[status] || 0) + 1 }), {});
  pass(`Document index exactly matches ${filesystemDocs.length} Markdown files (${Object.entries(statusCounts).map(([status, count]) => `${count} ${status}`).join(', ')})`);
}

// 2. Canonical Vocabulary Registry validation (v1.1.2)
console.log('\n2. Canonical machine-readable vocabulary registry v1.1.2');
const vocabularyErrorsBefore = totalErrors;
const vocabPath = path.join(root, 'research/schemas/canonical-vocabulary.v1.1.2.json');
let vocabRegistry = null;
const vocabSets = new Map();

if (!fs.existsSync(vocabPath)) {
  fail(`Missing canonical vocabulary registry: ${vocabPath}`);
} else {
  try {
    vocabRegistry = JSON.parse(fs.readFileSync(vocabPath, 'utf8'));
    if (vocabRegistry.schema_version !== '1.1.2') fail('canonical-vocabulary: expected schema_version 1.1.2');
    if (vocabRegistry.authority_status !== 'CANONICAL') fail('canonical-vocabulary: v1.1.2 must have CANONICAL authority status');
    if (vocabRegistry.governing_contract !== 'TAT_RESEARCH_CONTRACT_V1_1_2.md') fail('canonical-vocabulary: wrong governing contract');

    // Extract all vocabulary arrays into sets
    const arrayNamespaces = [
      'public_navigation_groups', 'canonical_sectors', 'sector_hierarchy_levels',
      'record_types', 'policy_types', 'project_types', 'programme_types',
      'implementation_statuses', 'data_value_nature', 'source_origin',
      'verification_statuses', 'workflow_statuses', 'publication_statuses',
      'source_levels', 'source_roles', 'source_types', 'source_statuses',
      'claim_types', 'claim_source_relationship_types', 'evidence_profiles',
      'financial_value_types', 'beneficiary_stages', 'beneficiary_types',
      'date_precisions', 'timeline_event_types', 'geographic_scope_types',
      'relationship_roles', 'contradiction_severities', 'contradiction_resolution_statuses',
      'correction_types', 'correction_lifecycle_statuses', 'freshness_statuses',
      'research_risk_levels', 'review_gates', 'review_decisions',
      'count_basis', 'aggregation_basis', 'discovery_statuses', 'gap_statuses',
      'gap_evidence_types', 'indicator_frequencies', 'duplicate_resolution_actions',
      'nominal_or_real'
    ];

    const actualArrayNamespaces = Object.entries(vocabRegistry).filter(([, value]) => Array.isArray(value)).map(([name]) => name);
    for (const ns of actualArrayNamespaces) {
      if (!arrayNamespaces.includes(ns)) fail(`canonical-vocabulary: unexpected uncontrolled array namespace '${ns}'`);
    }
    if (actualArrayNamespaces.length !== arrayNamespaces.length) {
      fail(`canonical-vocabulary: expected exactly ${arrayNamespaces.length} controlled array namespaces, found ${actualArrayNamespaces.length}`);
    }

    for (const ns of arrayNamespaces) {
      if (!Array.isArray(vocabRegistry[ns])) {
        fail(`canonical-vocabulary: missing required namespace array '${ns}'`);
        continue;
      }
      const set = new Set();
      for (const item of vocabRegistry[ns]) {
        const code = typeof item === 'string' ? item : item.code || item.sector_id;
        if (!code) {
          fail(`canonical-vocabulary: item in '${ns}' missing code/sector_id`);
          continue;
        }
        if (set.has(code)) {
          fail(`canonical-vocabulary: duplicate code '${code}' in namespace '${ns}'`);
        }
        set.add(code);
      }
      vocabSets.set(ns, set);
    }

    // Check sector parent references
    const groupSet = vocabSets.get('public_navigation_groups');
    for (const sector of vocabRegistry.canonical_sectors) {
      if (!groupSet.has(sector.parent_public_group)) {
        fail(`canonical-vocabulary: sector '${sector.sector_id}' references invalid parent group '${sector.parent_public_group}'`);
      }
    }

    for (const historicalFile of ['canonical-vocabulary.v1.1.json', 'canonical-vocabulary.v1.1.1.json']) {
      const historical = JSON.parse(fs.readFileSync(path.join(root, 'research/schemas', historicalFile), 'utf8'));
      if (historical.authority_status !== 'SUPERSEDED' || historical.superseded_by !== 'canonical-vocabulary.v1.1.2.json') {
        fail(`${historicalFile}: must be explicitly SUPERSEDED by canonical-vocabulary.v1.1.2.json`);
      }
    }

    if (totalErrors === vocabularyErrorsBefore) pass(`Canonical vocabulary v1.1.2 validated across exactly ${vocabSets.size} controlled namespaces; prior registries are superseded`);
  } catch (error) {
    fail(`canonical-vocabulary parsing failed: ${error.message}`);
  }
}

// 3. Draft-07 Schema Compilation and Vocabulary Comparison (19 Schemas)
console.log(`\n3. Draft-07 JSON Schema compilation & vocabulary consistency (${EXPECTED_SCHEMA_COUNT} schemas)`);
const ajv = new Ajv({ allErrors: true, strict: false });
ajv.addFormat('uri', { type: 'string', validate: isHttpUrl });
const schemaDirectory = path.join(root, 'research/schemas');
const schemas = new Map();
const localEnumAllowlist = new Set(['publication_review.truth_rules_audit_pass']);
let exactEnumMappingChecks = 0;

function getVocabNamespace(schemaName, propName) {
  if (schemaName === 'correction_record' && propName === 'status') return 'correction_lifecycle_statuses';
  if (schemaName === 'entity_discovery' && propName === 'status') return 'discovery_statuses';
  if (schemaName === 'data_gap' && propName === 'status') return 'gap_statuses';
  if (schemaName === 'data_gap' && propName === 'missing_evidence_type') return 'gap_evidence_types';
  if (schemaName === 'data_gap' && propName === 'priority') return 'research_risk_levels';
  if (schemaName === 'duplicate_review' && propName === 'resolution_action') return 'duplicate_resolution_actions';
  if (schemaName === 'indicator_record' && propName === 'frequency') return 'indicator_frequencies';
  if (schemaName === 'financial_record' && propName === 'nominal_or_real') return 'nominal_or_real';

  const defaultPropMap = {
    public_navigation_group: 'public_navigation_groups',
    sector: 'canonical_sectors',
    record_type: 'record_types',
    policy_type: 'policy_types',
    project_type: 'project_types',
    programme_type: 'programme_types',
    status: 'implementation_statuses',
    evidence_profile: 'evidence_profiles',
    data_value_nature: 'data_value_nature',
    value_nature: 'data_value_nature',
    source_origin: 'source_origin',
    reporting_origin: 'source_origin',
    verification_status: 'verification_statuses',
    review_status: 'verification_statuses',
    workflow_status: 'workflow_statuses',
    publication_status: 'publication_statuses',
    source_level: 'source_levels',
    source_role: 'source_roles',
    source_type: 'source_types',
    source_status: 'source_statuses',
    claim_type: 'claim_types',
    relationship_type: 'claim_source_relationship_types',
    financial_type: 'financial_value_types',
    beneficiary_stage: 'beneficiary_stages',
    beneficiary_type: 'beneficiary_types',
    target_beneficiary_type: 'beneficiary_types',
    date_precision: 'date_precisions',
    publication_date_precision: 'date_precisions',
    event_type: 'timeline_event_types',
    geographic_scope: 'geographic_scope_types',
    relationship_role: 'relationship_roles',
    severity: 'contradiction_severities',
    resolution_status: 'contradiction_resolution_statuses',
    correction_type: 'correction_types',
    freshness_status: 'freshness_statuses',
    priority: 'research_risk_levels',
    review_gate: 'review_gates',
    review_decision: 'review_decisions',
    count_basis: 'count_basis',
    aggregation_basis: 'aggregation_basis'
  };

  return defaultPropMap[propName] || null;
}

if (!fs.existsSync(schemaDirectory)) {
  fail(`Missing schema directory: ${schemaDirectory}`);
} else {
  const schemaFiles = fs.readdirSync(schemaDirectory).filter(file => file.endsWith('.schema.json')).sort();
  if (schemaFiles.length !== EXPECTED_SCHEMA_COUNT) {
    fail(`Expected ${EXPECTED_SCHEMA_COUNT} schemas, found ${schemaFiles.length}`);
  }
  for (const fileName of schemaFiles) {
    const baseSchemaName = fileName.replace('.schema.json', '');
    try {
      const schema = JSON.parse(fs.readFileSync(path.join(schemaDirectory, fileName), 'utf8'));
      if (schema.$schema !== 'http://json-schema.org/draft-07/schema#') {
        fail(`${fileName}: expected an explicit Draft-07 $schema declaration`);
      }
      if (schema.type !== 'object') fail(`${fileName}: root type must be object`);
      if (schema.additionalProperties !== false) fail(`${fileName}: additionalProperties must be false`);
      if (!Array.isArray(schema.required) || schema.required.length === 0) fail(`${fileName}: required must be a non-empty array`);
      for (const requiredField of schema.required || []) {
        if (!schema.properties?.[requiredField]) fail(`${fileName}: required field '${requiredField}' has no property definition`);
      }
      if (!ajv.validateSchema(schema)) {
        fail(`${fileName}: invalid Draft-07 schema structure: ${ajv.errorsText(ajv.errors)}`);
      }

      // Check exact bidirectional schema-enum equality against vocabulary.
      for (const [propName, propDef] of Object.entries(schema.properties || {})) {
        if (propDef.enum) {
          const vocabNs = getVocabNamespace(baseSchemaName, propName);
          const localKey = `${baseSchemaName}.${propName}`;
          if (!vocabNs) {
            if (!localEnumAllowlist.has(localKey)) fail(`${fileName}: enum property '${propName}' has no controlled-vocabulary mapping or local allowlist entry`);
            continue;
          }
          if (!vocabSets.has(vocabNs)) {
            fail(`${fileName}: enum property '${propName}' maps to missing vocabulary namespace '${vocabNs}'`);
            continue;
          }
          exactEnumMappingChecks += 1;
          const schemaSet = new Set(propDef.enum);
          const vocabularySet = vocabSets.get(vocabNs);
          for (const enumVal of schemaSet) {
            if (!vocabularySet.has(enumVal)) fail(`${fileName}: '${propName}' has extra/unregistered code '${enumVal}' outside '${vocabNs}'`);
          }
          for (const canonicalValue of vocabularySet) {
            if (!schemaSet.has(canonicalValue)) fail(`${fileName}: '${propName}' is missing canonical code '${canonicalValue}' from '${vocabNs}'`);
          }
        }
      }

      schemas.set(baseSchemaName, {
        schema,
        validate: ajv.compile(schema),
      });
    } catch (error) {
      fail(`${fileName}: ${error.message}`);
    }
  }
  if (schemas.size === EXPECTED_SCHEMA_COUNT && totalErrors === 0) {
    pass(`Compiled ${EXPECTED_SCHEMA_COUNT} Draft-07 schemas; verified exact bidirectional equality for ${exactEnumMappingChecks} mapped enum properties and ${localEnumAllowlist.size} explicit local enum`);
  }
}

// 4. CSV Parsing, Schema Row Validation, and Example Marker Enforcement (19 Templates)
console.log(`\n4. CSV parsing, schema validation & non-production marker checks (${EXPECTED_TEMPLATE_COUNT} templates)`);
const templateDirectory = path.join(root, 'research/templates');
const templateDataMap = new Map();

if (!fs.existsSync(templateDirectory)) {
  fail(`Missing template directory: ${templateDirectory}`);
} else {
  const templateFiles = fs.readdirSync(templateDirectory).filter(file => file.endsWith('.csv')).sort();
  if (templateFiles.length !== EXPECTED_TEMPLATE_COUNT) {
    fail(`Expected ${EXPECTED_TEMPLATE_COUNT} templates, found ${templateFiles.length}`);
  }
  for (const fileName of templateFiles) {
    const schemaEntry = schemas.get(fileName.replace('.csv', ''));
    if (!schemaEntry) {
      fail(`${fileName}: no matching JSON schema`);
      continue;
    }

    let rows;
    try {
      rows = parseCsv(fs.readFileSync(path.join(templateDirectory, fileName), 'utf8'), fileName);
    } catch (error) {
      fail(error.message);
      continue;
    }
    if (rows.length < 2) {
      fail(`${fileName}: expected a header and at least one non-production row`);
      continue;
    }

    const [headers, ...dataRows] = rows;
    const duplicateHeaders = headers.filter((header, index) => headers.indexOf(header) !== index);
    if (duplicateHeaders.length > 0) fail(`${fileName}: duplicate header(s): ${[...new Set(duplicateHeaders)].join(', ')}`);

    const schemaFields = Object.keys(schemaEntry.schema.properties ?? {});
    const missingHeaders = schemaFields.filter(field => !headers.includes(field));
    const unexpectedHeaders = headers.filter(field => !schemaFields.includes(field));
    if (missingHeaders.length > 0) fail(`${fileName}: missing schema header(s): ${missingHeaders.join(', ')}`);
    if (unexpectedHeaders.length > 0) fail(`${fileName}: unexpected header(s): ${unexpectedHeaders.join(', ')}`);

    const parsedRows = [];
    dataRows.forEach((values, rowIndex) => {
      const context = `${fileName} row ${rowIndex + 2}`;
      if (values.length !== headers.length) {
        fail(`${context}: expected ${headers.length} columns, found ${values.length}`);
        return;
      }
      const row = Object.fromEntries(headers.map((header, index) => [header, values[index]]));
      
      // Strict example marker check: must contain exact approved marker string
      const hasExactMarker = Object.values(row).some(v => typeof v === 'string' && v.includes(EXACT_EXAMPLE_MARKER));
      if (!hasExactMarker) {
        fail(`${context}: missing exact approved non-production marker '${EXACT_EXAMPLE_MARKER}'`);
      }

      validateRequiredValues(row, schemaEntry.schema, context);
      if (!schemaEntry.validate(row)) {
        const details = schemaEntry.validate.errors
          ?.map(error => `${error.instancePath || '/'} ${error.message}`)
          .join('; ');
        fail(`${context}: JSON Schema validation failed: ${details}`);
      }
      validateDomainValues(row, fileName.replace('.csv', ''), context);
      parsedRows.push(row);
    });

    templateDataMap.set(fileName.replace('.csv', ''), parsedRows);
  }
  if (totalErrors === 0) pass(`Parsed and validated all ${EXPECTED_TEMPLATE_COUNT} CSV templates against schemas and exact example marker`);
}

const primaryIdFields = {
  achievement_record: 'achievement_id', beneficiary_record: 'id', claim_extraction: 'claim_id',
  claim_source_relationship: 'relationship_id', contradiction_log: 'contradiction_id',
  correction_record: 'correction_id', data_gap: 'gap_id', duplicate_review: 'review_id',
  entity_discovery: 'candidate_id', financial_record: 'id', freshness_review: 'review_id',
  indicator_observation: 'id', indicator_record: 'indicator_id', policy_record: 'policy_id',
  programme_record: 'programme_id', project_record: 'project_id', publication_review: 'review_id',
  source_capture: 'source_id', timeline_event: 'event_id',
};

const recordPrimaryFields = [
  ['achievement_record', 'achievement_id'], ['policy_record', 'policy_id'],
  ['project_record', 'project_id'], ['programme_record', 'programme_id'],
  ['entity_discovery', 'candidate_id'], ['indicator_record', 'indicator_id'],
];

const foreignKeyConfiguration = [
  ['claim_extraction', 'record_id', 'records', false],
  ['claim_source_relationship', 'claim_id', 'claims', false],
  ['claim_source_relationship', 'source_id', 'sources', false],
  ['claim_source_relationship', 'superseded_by_relationship_id', 'relationships', true],
  ['financial_record', 'record_id', 'records', false], ['financial_record', 'claim_id', 'claims', false],
  ['beneficiary_record', 'record_id', 'records', false], ['beneficiary_record', 'claim_id', 'claims', false],
  ['indicator_observation', 'indicator_id', 'indicators', false], ['indicator_observation', 'claim_id', 'claims', false],
  ['timeline_event', 'record_id', 'records', false], ['timeline_event', 'evidence_source_id', 'sources', true],
  ['contradiction_log', 'claim_id_a', 'claims', false], ['contradiction_log', 'claim_id_b', 'claims', false],
  ['contradiction_log', 'source_id_a', 'sources', false], ['contradiction_log', 'source_id_b', 'sources', false],
  ['correction_record', 'record_id', 'records', false], ['correction_record', 'claim_id', 'claims', false],
  ['correction_record', 'source_id', 'sources', false],
  ['publication_review', 'record_id', 'records', false], ['freshness_review', 'record_id', 'records', false],
  ['duplicate_review', 'record_id_1', 'records', false], ['duplicate_review', 'record_id_2', 'records', false],
  ['duplicate_review', 'primary_record_id', 'records', false],
];

function collectPackageIntegrityErrors(dataMap) {
  const errors = [];
  const globalPrimaryIds = new Map();
  for (const [templateName, idField] of Object.entries(primaryIdFields)) {
    const localIds = new Set();
    for (const [rowIndex, row] of (dataMap.get(templateName) || []).entries()) {
      const value = row[idField];
      if (!value) continue;
      if (localIds.has(value)) errors.push(`${templateName} row ${rowIndex + 2}: duplicate primary identifier '${value}'`);
      localIds.add(value);
      if (globalPrimaryIds.has(value)) errors.push(`${templateName} row ${rowIndex + 2}: primary identifier '${value}' duplicates ${globalPrimaryIds.get(value)}`);
      else globalPrimaryIds.set(value, `${templateName}.${idField}`);
    }
  }

  const targets = {
    sources: new Set((dataMap.get('source_capture') || []).map(row => row.source_id)),
    claims: new Set((dataMap.get('claim_extraction') || []).map(row => row.claim_id)),
    indicators: new Set((dataMap.get('indicator_record') || []).map(row => row.indicator_id)),
    relationships: new Set((dataMap.get('claim_source_relationship') || []).map(row => row.relationship_id)),
    records: new Set(recordPrimaryFields.flatMap(([templateName, idField]) => (dataMap.get(templateName) || []).map(row => row[idField]))),
  };

  for (const [templateName, field, targetName, optional] of foreignKeyConfiguration) {
    for (const [rowIndex, row] of (dataMap.get(templateName) || []).entries()) {
      const value = row[field];
      if (optional && !value) continue;
      if (!targets[targetName].has(value)) errors.push(`${templateName} row ${rowIndex + 2}: '${field}' references nonexistent ${targetName} identifier '${value}'`);
    }
  }

  const relationshipCompositeKeys = new Set();
  for (const [rowIndex, relationship] of (dataMap.get('claim_source_relationship') || []).entries()) {
    const key = `${relationship.claim_id}|${relationship.source_id}|${relationship.source_role}|${relationship.relationship_type}|${relationship.evidence_location}`;
    if (relationshipCompositeKeys.has(key)) errors.push(`claim_source_relationship row ${rowIndex + 2}: duplicate composite relationship key '${key}'`);
    relationshipCompositeKeys.add(key);
  }
  return errors;
}

// 5. Configured FK, primary-ID, and relationship uniqueness validation
console.log('\n5. Configured foreign keys, primary identifiers & relationship uniqueness');
if (templateDataMap.size === EXPECTED_TEMPLATE_COUNT) {
  const packageErrors = collectPackageIntegrityErrors(templateDataMap);
  for (const message of packageErrors) fail(message);
  if (packageErrors.length === 0) {
    pass(`Validated ${foreignKeyConfiguration.length} configured FK fields, ${Object.keys(primaryIdFields).length} primary-ID namespaces, global primary-ID uniqueness, and the five-part relationship composite`);
  }
}

// 6. Markdown File Links Validation
console.log('\n6. Markdown cross-link resolution check');
const docsDirectory = path.join(root, 'docs/research');
if (fs.existsSync(docsDirectory)) {
  for (const fileName of fs.readdirSync(docsDirectory).filter(file => file.endsWith('.md'))) {
    const filePath = path.join(docsDirectory, fileName);
    const content = fs.readFileSync(filePath, 'utf8');
    const links = content.matchAll(/\[[^\]]+\]\(([^)]+\.md)(?:#[^)]+)?\)/g);
    for (const match of links) {
      const target = match[1];
      let resolved;
      if (target.startsWith('file:///')) {
        resolved = decodeURIComponent(target.slice('file:///'.length));
      } else {
        resolved = path.resolve(path.dirname(filePath), target);
      }
      if (!fs.existsSync(resolved)) fail(`${fileName}: broken Markdown link '${target}'`);
    }
  }
}
if (totalErrors === 0) pass('All checked Markdown file links resolve cleanly');

// 7. Permanent Fixture Runner Suite
console.log('\n7. Permanent test fixture suite execution');

function countSchemaVocabularyErrors(testSchema, fileName) {
  let errors = 0;
  const schemaName = fileName.replace('.schema.json', '');
  for (const [propertyName, definition] of Object.entries(testSchema.properties || {})) {
    if (!Array.isArray(definition.enum)) continue;
    const namespace = getVocabNamespace(schemaName, propertyName);
    const localKey = `${schemaName}.${propertyName}`;
    if (!namespace) {
      if (!localEnumAllowlist.has(localKey)) errors += 1;
      continue;
    }
    const vocabularySet = vocabSets.get(namespace);
    if (!vocabularySet) {
      errors += 1;
      continue;
    }
    const schemaSet = new Set(definition.enum);
    for (const value of schemaSet) if (!vocabularySet.has(value)) errors += 1;
    for (const value of vocabularySet) if (!schemaSet.has(value)) errors += 1;
  }
  return errors;
}

function countRowValidationErrors(schemaName, row, requireMarker = true) {
  let errors = 0;
  const schemaEntry = schemas.get(schemaName);
  if (!schemaEntry) return 1;
  for (const field of schemaEntry.schema.required || []) {
    if (typeof row[field] !== 'string' || row[field].trim() === '') errors += 1;
  }
  if (!schemaEntry.validate(row)) errors += schemaEntry.validate.errors?.length || 1;
  for (const [field, rawValue] of Object.entries(row)) {
    const value = typeof rawValue === 'string' ? rawValue.trim() : '';
    if (value && isDateField(field) && !isReportingDate(value)) errors += 1;
  }
  const binding = datePrecisionBindings[schemaName];
  if (binding) {
    const precision = row[binding.precisionField];
    for (const field of binding.valueFields) {
      if (precision && row[field] && !dateMatchesPrecision(row[field], precision)) errors += 1;
    }
  }
  if (row.period_start && row.period_end && !checkPeriodBounds(row.period_start, row.period_end)) errors += 1;
  if (row.public_navigation_group && row.sector && !sectorMatchesParent(row.public_navigation_group, row.sector, vocabRegistry)) errors += 1;
  if (row.amount && (!/^\d+(?:\.\d{1,4})?$/.test(row.amount) || Number(row.amount) <= 0)) errors += 1;
  if (row.count_value && (!/^\d+$/.test(row.count_value) || Number(row.count_value) < 0)) errors += 1;
  if (requireMarker && !Object.values(row).some(value => typeof value === 'string' && value.includes(EXACT_EXAMPLE_MARKER))) errors += 1;
  return errors;
}

function cloneCurrentPackage() {
  return new Map([...templateDataMap.entries()].map(([name, rows]) => [name, rows.map(row => ({ ...row }))]));
}

function countCompletePackageErrors(dataMap) {
  let errors = dataMap.size === EXPECTED_TEMPLATE_COUNT ? 0 : 1;
  for (const [schemaName, rows] of dataMap) {
    for (const row of rows) errors += countRowValidationErrors(schemaName, row, true);
  }
  errors += collectPackageIntegrityErrors(dataMap).length;
  return errors;
}

const engineInterface = {
  checkSchemaVocabulary: countSchemaVocabularyErrors,
  getVocabularyCodes: namespace => [...(vocabSets.get(namespace) || [])],
  countRowErrors: countRowValidationErrors,
  cloneCurrentPackage,
  countPackageErrors: countCompletePackageErrors,
  checkPackageIntegrity: dataMap => collectPackageIntegrityErrors(dataMap).length,
  checkDateMatchesPrecision: dateMatchesPrecision,
  checkPeriodBounds: checkPeriodBounds,
  checkSectorParent: (publicGroup, sector) => sectorMatchesParent(publicGroup, sector, vocabRegistry),
  checkExampleMarker: (row) => Object.values(row).some(v => typeof v === 'string' && v.includes(EXACT_EXAMPLE_MARKER)),
  parseCsv: parseCsv,
  getSchema: name => schemas.get(name),
};

try {
  const { runFixtureSuite } = await import('./test-research-fixtures.mjs');
  const fixturePassed = await runFixtureSuite(engineInterface);
  if (!fixturePassed) fail('One or more permanent fixture tests failed');
} catch (error) {
  fail(`Fixture suite runner error: ${error.message}`);
}

console.log('===================================================================');
if (totalErrors > 0) {
  console.error(`VALIDATION FAILED: ${totalErrors} error(s)`);
  process.exit(1);
}
console.log('VALIDATION PASSED: 0 errors');
console.log('===================================================================');
