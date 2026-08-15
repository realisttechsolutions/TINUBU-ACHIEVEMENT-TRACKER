import fs from 'node:fs';
import path from 'node:path';
import Ajv from 'ajv';

const root = process.cwd();
const EXPECTED_SCHEMA_COUNT = 19;
const EXPECTED_TEMPLATE_COUNT = 19;
const EXACT_EXAMPLE_MARKER = '[EXAMPLE ONLY - NOT A PRODUCTION RECORD]';

// All 43 indexed research documents
const canonicalDocs = [
  'docs/research/TAT_RESEARCH_CONTRACT_V1_1_1.md',
  'docs/research/TAT_RESEARCH_CONTRACT_V1_1.md',
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
  'docs/research/TAT_RESEARCH_TO_DEVELOPMENT_HANDOFF.md',
];

const historicalRetiredDocs = [
  'docs/research/CANONICAL_TAXONOMIES.md',
  'docs/research/DATA_INGESTION_CONTRACT.md',
  'docs/research/EVIDENCE_GOVERNANCE_AND_VERIFICATION.md',
  'docs/research/RESEARCH_TEMPLATES_GUIDE.md',
  'docs/research/RESEARCH_TO_DEV_HANDOFF.md',
  'docs/research/SUPABASE_DATA_CONTRACT_AND_ENTITY_MAP.md',
  'docs/research/TAT_SUPABASE_DATA_CONTRACT_V1.md',
  'docs/research/TAT_SUPABASE_ENTITY_RELATIONSHIP_MAP.md',
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

function validateDomainValues(row, context) {
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

  if (row.date_precision && row.date && !dateMatchesPrecision(row.date, row.date_precision)) {
    fail(`${context}: 'date' does not match date_precision '${row.date_precision}'`);
  }
  if (row.date_precision && row.date_value && !dateMatchesPrecision(row.date_value, row.date_precision)) {
    fail(`${context}: 'date_value' does not match date_precision '${row.date_precision}'`);
  }
  if (
    row.publication_date_precision &&
    row.publication_date &&
    !dateMatchesPrecision(row.publication_date, row.publication_date_precision)
  ) {
    fail(`${context}: 'publication_date' does not match publication_date_precision '${row.publication_date_precision}'`);
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
console.log('TINUBU ACHIEVEMENT TRACKER - RESEARCH FOUNDATION VALIDATOR v1.1.1');
console.log('===================================================================');

// 1. Documentation inventory validation (all 43 indexed documents)
console.log(`\n1. Documentation inventory check (${allIndexedDocs.length} total indexed documents)`);
for (const relativePath of allIndexedDocs) {
  const filePath = path.join(root, relativePath);
  if (!fs.existsSync(filePath)) {
    fail(`Missing indexed document: ${relativePath}`);
    continue;
  }
  const content = fs.readFileSync(filePath, 'utf8').trim();
  if (content.length <= 100) fail(`${relativePath} is not substantive (${content.length} characters)`);
}
if (totalErrors === 0) pass(`All ${allIndexedDocs.length} indexed documents exist and pass substance checks (17 Canonical, 18 Supporting, 8 Superseded/Deprecated)`);

// 2. Canonical Vocabulary Registry validation (v1.1.1)
console.log('\n2. Canonical machine-readable vocabulary registry v1.1.1');
const vocabPath = path.join(root, 'research/schemas/canonical-vocabulary.v1.1.1.json');
let vocabRegistry = null;
const vocabSets = new Map();

if (!fs.existsSync(vocabPath)) {
  fail(`Missing canonical vocabulary registry: ${vocabPath}`);
} else {
  try {
    vocabRegistry = JSON.parse(fs.readFileSync(vocabPath, 'utf8'));
    if (vocabRegistry.schema_version !== '1.1.1') fail('canonical-vocabulary: expected schema_version 1.1.1');

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

    if (totalErrors === 0) pass(`Canonical vocabulary v1.1.1 validated across ${vocabSets.size} distinct controlled namespaces`);
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

      // Check schema enums against vocabulary
      for (const [propName, propDef] of Object.entries(schema.properties || {})) {
        if (propDef.enum) {
          const vocabNs = getVocabNamespace(baseSchemaName, propName);
          if (vocabNs && vocabSets.has(vocabNs)) {
            const allowedSet = vocabSets.get(vocabNs);
            for (const enumVal of propDef.enum) {
              if (!allowedSet.has(enumVal)) {
                fail(`${fileName}: property '${propName}' contains unregistered/deprecated enum code '${enumVal}' (not in vocabulary '${vocabNs}')`);
              }
            }
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
    pass(`Compiled all ${EXPECTED_SCHEMA_COUNT} Draft-07 schemas with AJV; all enums verified against canonical vocabulary`);
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
      validateDomainValues(row, context);
      parsedRows.push(row);
    });

    templateDataMap.set(fileName.replace('.csv', ''), parsedRows);
  }
  if (totalErrors === 0) pass(`Parsed and validated all ${EXPECTED_TEMPLATE_COUNT} CSV templates against schemas and exact example marker`);
}

// 5. Cross-File Referential Integrity and Composite Uniqueness Validation
console.log('\n5. Cross-file referential integrity & composite uniqueness validation');
if (templateDataMap.size === EXPECTED_TEMPLATE_COUNT) {
  // Collect all known IDs
  const allSourceIds = new Set(templateDataMap.get('source_capture')?.map(r => r.source_id) || []);
  const allClaimIds = new Set(templateDataMap.get('claim_extraction')?.map(r => r.claim_id) || []);
  const allIndicatorIds = new Set(templateDataMap.get('indicator_record')?.map(r => r.indicator_id) || []);
  
  const allRecordIds = new Set([
    ...(templateDataMap.get('achievement_record')?.map(r => r.achievement_id) || []),
    ...(templateDataMap.get('policy_record')?.map(r => r.policy_id) || []),
    ...(templateDataMap.get('project_record')?.map(r => r.project_id) || []),
    ...(templateDataMap.get('programme_record')?.map(r => r.programme_id) || []),
    ...(templateDataMap.get('entity_discovery')?.map(r => r.candidate_id) || []),
    ...(templateDataMap.get('indicator_record')?.map(r => r.indicator_id) || [])
  ]);

  // Validate claim_extraction record_ids
  for (const claim of templateDataMap.get('claim_extraction') || []) {
    if (!allRecordIds.has(claim.record_id)) {
      fail(`claim_extraction '${claim.claim_id}': references nonexistent record_id '${claim.record_id}'`);
    }
  }

  // Validate claim_source_relationship integrity & composite uniqueness
  const relationshipCompositeKeys = new Set();
  for (const rel of templateDataMap.get('claim_source_relationship') || []) {
    if (!allClaimIds.has(rel.claim_id)) {
      fail(`claim_source_relationship '${rel.relationship_id}': references nonexistent claim_id '${rel.claim_id}'`);
    }
    if (!allSourceIds.has(rel.source_id)) {
      fail(`claim_source_relationship '${rel.relationship_id}': references nonexistent source_id '${rel.source_id}'`);
    }
    const compKey = `${rel.claim_id}|${rel.source_id}|${rel.source_role}|${rel.relationship_type}|${rel.evidence_location}`;
    if (relationshipCompositeKeys.has(compKey)) {
      fail(`claim_source_relationship '${rel.relationship_id}': duplicate composite relationship key '${compKey}'`);
    }
    relationshipCompositeKeys.add(compKey);
  }

  // Validate financial_records
  for (const fin of templateDataMap.get('financial_record') || []) {
    if (!allRecordIds.has(fin.record_id)) fail(`financial_record '${fin.id}': nonexistent record_id '${fin.record_id}'`);
    if (!allClaimIds.has(fin.claim_id)) fail(`financial_record '${fin.id}': nonexistent claim_id '${fin.claim_id}'`);
  }

  // Validate beneficiary_records
  for (const ben of templateDataMap.get('beneficiary_record') || []) {
    if (!allRecordIds.has(ben.record_id)) fail(`beneficiary_record '${ben.id}': nonexistent record_id '${ben.record_id}'`);
    if (!allClaimIds.has(ben.claim_id)) fail(`beneficiary_record '${ben.id}': nonexistent claim_id '${ben.claim_id}'`);
  }

  // Validate indicator_observations
  for (const obs of templateDataMap.get('indicator_observation') || []) {
    if (!allIndicatorIds.has(obs.indicator_id)) fail(`indicator_observation '${obs.id}': nonexistent indicator_id '${obs.indicator_id}'`);
    if (!allClaimIds.has(obs.claim_id)) fail(`indicator_observation '${obs.id}': nonexistent claim_id '${obs.claim_id}'`);
  }

  // Validate timeline_events
  for (const tle of templateDataMap.get('timeline_event') || []) {
    if (!allRecordIds.has(tle.record_id)) fail(`timeline_event '${tle.event_id}': nonexistent record_id '${tle.record_id}'`);
    if (tle.evidence_source_id && !allSourceIds.has(tle.evidence_source_id)) {
      fail(`timeline_event '${tle.event_id}': nonexistent evidence_source_id '${tle.evidence_source_id}'`);
    }
  }

  // Validate contradiction_logs
  for (const con of templateDataMap.get('contradiction_log') || []) {
    if (!allClaimIds.has(con.claim_id_a)) fail(`contradiction_log '${con.contradiction_id}': nonexistent claim_id_a '${con.claim_id_a}'`);
    if (!allClaimIds.has(con.claim_id_b)) fail(`contradiction_log '${con.contradiction_id}': nonexistent claim_id_b '${con.claim_id_b}'`);
    if (!allSourceIds.has(con.source_id_a)) fail(`contradiction_log '${con.contradiction_id}': nonexistent source_id_a '${con.source_id_a}'`);
    if (!allSourceIds.has(con.source_id_b)) fail(`contradiction_log '${con.contradiction_id}': nonexistent source_id_b '${con.source_id_b}'`);
  }

  // Validate correction_records
  for (const cor of templateDataMap.get('correction_record') || []) {
    if (!allRecordIds.has(cor.record_id)) fail(`correction_record '${cor.correction_id}': nonexistent record_id '${cor.record_id}'`);
    if (!allClaimIds.has(cor.claim_id)) fail(`correction_record '${cor.correction_id}': nonexistent claim_id '${cor.claim_id}'`);
    if (!allSourceIds.has(cor.source_id)) fail(`correction_record '${cor.correction_id}': nonexistent source_id '${cor.source_id}'`);
  }

  // Validate reviews
  for (const rev of templateDataMap.get('publication_review') || []) {
    if (!allRecordIds.has(rev.record_id)) fail(`publication_review '${rev.review_id}': nonexistent record_id '${rev.record_id}'`);
  }
  for (const fre of templateDataMap.get('freshness_review') || []) {
    if (!allRecordIds.has(fre.record_id)) fail(`freshness_review '${fre.review_id}': nonexistent record_id '${fre.record_id}'`);
  }

  if (totalErrors === 0) pass('All cross-file referential foreign keys and composite uniqueness constraints validated successfully');
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
const engineInterface = {
  checkSchemaVocabulary: (testSchema, fileName) => {
    let errs = 0;
    const baseSchemaName = fileName.replace('.schema.json', '');
    for (const [propName, propDef] of Object.entries(testSchema.properties || {})) {
      if (propDef.enum) {
        const vocabNs = getVocabNamespace(baseSchemaName, propName);
        if (vocabNs && vocabSets.has(vocabNs)) {
          const allowed = vocabSets.get(vocabNs);
          for (const val of propDef.enum) {
            if (!allowed.has(val)) errs += 1;
          }
        }
      }
    }
    return errs;
  },
  checkReferentialIntegrity: (relationships, claims, sources) => {
    let errs = 0;
    for (const r of relationships) {
      if (!claims.has(r.claim_id)) errs += 1;
      if (!sources.has(r.source_id)) errs += 1;
    }
    return errs;
  },
  checkRelationshipUniqueness: (relationships) => {
    let errs = 0;
    const seen = new Set();
    for (const r of relationships) {
      const key = `${r.claim_id}|${r.source_id}|${r.source_role}|${r.relationship_type}|${r.evidence_location}`;
      if (seen.has(key)) errs += 1;
      seen.add(key);
    }
    return errs;
  },
  checkDateMatchesPrecision: dateMatchesPrecision,
  checkPeriodBounds: checkPeriodBounds,
  checkExampleMarker: (row) => Object.values(row).some(v => typeof v === 'string' && v.includes(EXACT_EXAMPLE_MARKER)),
  parseCsv: parseCsv,
  getSchema: (name) => schemas.get(name)
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
