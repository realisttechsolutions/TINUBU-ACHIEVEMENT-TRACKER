import fs from 'node:fs';
import path from 'node:path';
import Ajv from 'ajv';

const root = process.cwd();
const EXPECTED_SCHEMA_COUNT = 19;
const EXPECTED_TEMPLATE_COUNT = 19;

const requiredDocs = [
  'docs/research/MISSION_R01_RESEARCH_DATA_BLUEPRINT.md',
  'docs/research/TAT_RESEARCH_OBJECTIVES.md',
  'docs/research/TAT_COMPLETE_DATA_UNIVERSE.md',
  'docs/research/TAT_RECORD_TAXONOMY.md',
  'docs/research/TAT_SECTOR_TAXONOMY.md',
  'docs/research/TAT_STATUS_AND_CLASSIFICATION_STANDARD.md',
  'docs/research/TAT_SOURCE_HIERARCHY.md',
  'docs/research/TAT_SOURCE_ROLE_STANDARD.md',
  'docs/research/TAT_EVIDENCE_STANDARD.md',
  'docs/research/TAT_EVIDENCE_PROFILE_STANDARD.md',
  'docs/research/TAT_RESEARCH_WORKFLOW.md',
  'docs/research/TAT_VERIFICATION_WORKFLOW.md',
  'docs/research/TAT_CONTRADICTION_PROTOCOL.md',
  'docs/research/TAT_DUPLICATE_DETECTION_STANDARD.md',
  'docs/research/TAT_DATA_FRESHNESS_POLICY.md',
  'docs/research/TAT_RESEARCH_AGENT_OPERATING_MODEL.md',
  'docs/research/TAT_RESEARCH_RISK_CLASSIFICATION.md',
  'docs/research/TAT_SUPABASE_DATA_CONTRACT_V1.md',
  'docs/research/TAT_SUPABASE_ENTITY_RELATIONSHIP_MAP.md',
  'docs/research/TAT_INTERNAL_PUBLIC_DATA_BOUNDARY.md',
  'docs/research/TAT_RESEARCH_OUTPUT_TEMPLATES.md',
  'docs/research/TAT_IMPORT_EXPORT_STANDARD.md',
  'docs/research/TAT_QUALITY_CONTROL_GATES.md',
  'docs/research/TAT_RESEARCH_PRIORITISATION_STANDARD.md',
  'docs/research/TAT_PILOT_RESEARCH_DESIGN.md',
  'docs/research/TAT_RESEARCH_ROADMAP.md',
  'docs/research/TAT_RESEARCH_GOVERNANCE.md',
  'docs/research/TAT_DATA_VERSIONING_AND_CORRECTION_STANDARD.md',
  'docs/research/TAT_RESEARCH_RISK_REGISTER.md',
  'docs/research/TAT_RESEARCH_TO_DEVELOPMENT_HANDOFF.md',
  'docs/research/TAT_MISSION_R01_COMPLIANCE_MATRIX.md',
  'docs/research/TAT_RESEARCH_CONTRACT_V1_1.md',
  'docs/research/TAT_CODEX_AUDIT_RESOLUTION_LOG.md',
  'docs/research/TAT_RESEARCH_DOCUMENT_INDEX.md',
  'docs/research/TAT_FRONTEND_CONTRACT_ALIGNMENT_REQUIREMENTS.md',
  'docs/research/TAT_RESEARCH_CONTRACT_CHANGELOG.md',
];

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
  'revised_by',
  'reviewed_by',
  'created_by',
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
    'exact_day': isCalendarDate,
    'exact-day': isCalendarDate,
    month: isMonth,
    quarter: isQuarter,
    year: isYear,
    fiscal_year: isFiscalYear,
    range: isDateRange,
    unknown: () => true,
  };
  return Boolean(checks[precision]?.(value));
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
    field.endsWith('_date') ||
    field.endsWith('_at')
  );
}

function parseCsv(content, fileName) {
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

    if ((field === 'url' || field.endsWith('_url') || field === 'featured_image') && !isHttpUrl(value)) {
      fail(`${context}: '${field}' is not an HTTP(S) URL`);
    }

    const identifierField = field === 'id' || field.endsWith('_id') || /^record_id_[12]$/.test(field) || field === 'claim_id_a' || field === 'claim_id_b' || field === 'source_id_a' || field === 'source_id_b';
    if (identifierField) {
      const valid = actorIdentifierFields.has(field)
        ? isIdentifier(value) || isEmail(value)
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

console.log('TINUBU ACHIEVEMENT TRACKER - RESEARCH FOUNDATION VALIDATOR v1.1');

console.log(`\n1. Required documentation (${requiredDocs.length} files)`);
for (const relativePath of requiredDocs) {
  const filePath = path.join(root, relativePath);
  if (!fs.existsSync(filePath)) {
    fail(`Missing required document: ${relativePath}`);
    continue;
  }
  const content = fs.readFileSync(filePath, 'utf8').trim();
  if (content.length <= 100) fail(`${relativePath} is not substantive (${content.length} characters)`);
}
if (totalErrors === 0) pass(`All ${requiredDocs.length} required documents exist and exceed the minimum size check`);

console.log('\n2. Canonical machine-readable vocabulary');
const vocabPath = path.join(root, 'research/schemas/canonical-vocabulary.v1.1.json');
if (!fs.existsSync(vocabPath)) {
  fail(`Missing canonical vocabulary: ${vocabPath}`);
} else {
  try {
    const vocab = JSON.parse(fs.readFileSync(vocabPath, 'utf8'));
    if (vocab.schema_version !== '1.1') fail('canonical-vocabulary: expected schema_version 1.1');
    if (!Array.isArray(vocab.record_types) || vocab.record_types.length < 20) fail('canonical-vocabulary: record_types incomplete');
    if (!Array.isArray(vocab.implementation_statuses) || vocab.implementation_statuses.length < 21) fail('canonical-vocabulary: implementation_statuses incomplete');
    if (!Array.isArray(vocab.financial_value_types) || vocab.financial_value_types.length < 11) fail('canonical-vocabulary: financial_value_types incomplete');
    if (!Array.isArray(vocab.beneficiary_stages) || vocab.beneficiary_stages.length < 6) fail('canonical-vocabulary: beneficiary_stages incomplete');
    if (!Array.isArray(vocab.source_roles) || vocab.source_roles.length < 11) fail('canonical-vocabulary: source_roles incomplete');
    pass('Canonical machine-readable vocabulary dictionary v1.1 validated successfully');
  } catch (error) {
    fail(`canonical-vocabulary: ${error.message}`);
  }
}

console.log(`\n3. Draft-07 schema compilation (${EXPECTED_SCHEMA_COUNT} schemas)`);
const ajv = new Ajv({ allErrors: true, strict: false });
ajv.addFormat('uri', { type: 'string', validate: isHttpUrl });
const schemaDirectory = path.join(root, 'research/schemas');
const schemas = new Map();
if (!fs.existsSync(schemaDirectory)) {
  fail(`Missing schema directory: ${schemaDirectory}`);
} else {
  const schemaFiles = fs.readdirSync(schemaDirectory).filter(file => file.endsWith('.schema.json')).sort();
  if (schemaFiles.length !== EXPECTED_SCHEMA_COUNT) {
    fail(`Expected ${EXPECTED_SCHEMA_COUNT} schemas, found ${schemaFiles.length}`);
  }
  for (const fileName of schemaFiles) {
    try {
      const schema = JSON.parse(fs.readFileSync(path.join(schemaDirectory, fileName), 'utf8'));
      if (schema.$schema !== 'http://json-schema.org/draft-07/schema#') {
        fail(`${fileName}: expected an explicit Draft-07 $schema declaration`);
      }
      schemas.set(fileName.replace('.schema.json', ''), {
        schema,
        validate: ajv.compile(schema),
      });
    } catch (error) {
      fail(`${fileName}: ${error.message}`);
    }
  }
  if (schemas.size === EXPECTED_SCHEMA_COUNT) pass(`Compiled all ${EXPECTED_SCHEMA_COUNT} Draft-07 schemas with AJV`);
}

console.log(`\n4. CSV parsing, schema validation, and field checks (${EXPECTED_TEMPLATE_COUNT} templates)`);
const templateDirectory = path.join(root, 'research/templates');
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

    dataRows.forEach((values, rowIndex) => {
      const context = `${fileName} row ${rowIndex + 2}`;
      if (values.length !== headers.length) {
        fail(`${context}: expected ${headers.length} columns, found ${values.length}`);
        return;
      }
      const row = Object.fromEntries(headers.map((header, index) => [header, values[index]]));
      if (!Object.values(row).some(value => typeof value === 'string' && (value.includes('[EXAMPLE ONLY - NOT A PRODUCTION RECORD]') || value.includes('[DEMO-NON-PROD') || value.includes('EXAMPLE')))) {
        fail(`${context}: missing a non-production marker`);
      }
      validateRequiredValues(row, schemaEntry.schema, context);
      if (!schemaEntry.validate(row)) {
        const details = schemaEntry.validate.errors
          ?.map(error => `${error.instancePath || '/'} ${error.message}`)
          .join('; ');
        fail(`${context}: JSON Schema validation failed: ${details}`);
      }
      validateDomainValues(row, context);
    });
  }
  if (totalErrors === 0) pass(`Parsed and validated all ${EXPECTED_TEMPLATE_COUNT} templates against their schemas`);
}

console.log('\n5. Automated negative test assertions');
try {
  const testSchema = schemas.get('financial_record');
  if (testSchema) {
    const invalidRow = {
      id: '[DEMO-INVALID-001]',
      record_id: '[REC-001]',
      claim_id: '[CLM-001]',
      financial_type: 'invalid_type_not_in_enum',
      amount: '47000000000.00',
      currency: 'NGN',
      reporting_period: '2024-Q1',
      aggregation_basis: 'period',
    };
    const isValid = testSchema.validate(invalidRow);
    if (isValid) {
      fail('Negative test failed: schema accepted invalid financial_type enum');
    } else {
      pass('Negative assertion: AJV schema correctly rejects non-canonical enum codes');
    }
  }
} catch (error) {
  fail(`Negative test error: ${error.message}`);
}

console.log('\n6. Markdown file links');
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
if (totalErrors === 0) pass('All checked Markdown file links resolve');

console.log('');
if (totalErrors > 0) {
  console.error(`VALIDATION FAILED: ${totalErrors} error(s)`);
  process.exit(1);
}
console.log('VALIDATION PASSED: 0 errors');
