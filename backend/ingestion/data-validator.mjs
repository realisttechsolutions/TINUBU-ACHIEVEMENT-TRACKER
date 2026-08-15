import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import Ajv from 'ajv';

export const primaryIdFields = {
  achievement_record: 'achievement_id',
  beneficiary_record: 'id',
  claim_extraction: 'claim_id',
  claim_source_relationship: 'relationship_id',
  contradiction_log: 'contradiction_id',
  correction_record: 'correction_id',
  data_gap: 'gap_id',
  duplicate_review: 'review_id',
  entity_discovery: 'candidate_id',
  financial_record: 'id',
  freshness_review: 'review_id',
  indicator_observation: 'id',
  indicator_record: 'indicator_id',
  policy_record: 'policy_id',
  programme_record: 'programme_id',
  project_record: 'project_id',
  publication_review: 'review_id',
  source_capture: 'source_id',
  timeline_event: 'event_id',
};

export const foreignKeyRules = [
  { table: 'claim_extraction', fkField: 'record_id', targetNamespace: 'records', optional: false },
  { table: 'claim_source_relationship', fkField: 'claim_id', targetNamespace: 'claims', optional: false },
  { table: 'claim_source_relationship', fkField: 'source_id', targetNamespace: 'sources', optional: false },
  { table: 'claim_source_relationship', fkField: 'superseded_by_relationship_id', targetNamespace: 'relationships', optional: true },
  { table: 'financial_record', fkField: 'record_id', targetNamespace: 'records', optional: false },
  { table: 'financial_record', fkField: 'claim_id', targetNamespace: 'claims', optional: false },
  { table: 'beneficiary_record', fkField: 'record_id', targetNamespace: 'records', optional: false },
  { table: 'beneficiary_record', fkField: 'claim_id', targetNamespace: 'claims', optional: false },
  { table: 'indicator_observation', fkField: 'indicator_id', targetNamespace: 'indicators', optional: false },
  { table: 'indicator_observation', fkField: 'claim_id', targetNamespace: 'claims', optional: false },
  { table: 'timeline_event', fkField: 'record_id', targetNamespace: 'records', optional: false },
  { table: 'timeline_event', fkField: 'evidence_source_id', targetNamespace: 'sources', optional: true },
  { table: 'contradiction_log', fkField: 'claim_id_a', targetNamespace: 'claims', optional: false },
  { table: 'contradiction_log', fkField: 'claim_id_b', targetNamespace: 'claims', optional: false },
  { table: 'contradiction_log', fkField: 'source_id_a', targetNamespace: 'sources', optional: false },
  { table: 'contradiction_log', fkField: 'source_id_b', targetNamespace: 'sources', optional: false },
  { table: 'correction_record', fkField: 'record_id', targetNamespace: 'records', optional: false },
  { table: 'correction_record', fkField: 'claim_id', targetNamespace: 'claims', optional: false },
  { table: 'correction_record', fkField: 'source_id', targetNamespace: 'sources', optional: false },
  { table: 'publication_review', fkField: 'record_id', targetNamespace: 'records', optional: false },
  { table: 'freshness_review', fkField: 'record_id', targetNamespace: 'records', optional: false },
  { table: 'duplicate_review', fkField: 'record_id_1', targetNamespace: 'records', optional: false },
  { table: 'duplicate_review', fkField: 'record_id_2', targetNamespace: 'records', optional: false },
  { table: 'duplicate_review', fkField: 'primary_record_id', targetNamespace: 'records', optional: false },
];

export function parseCsv(content, fileName = 'input.csv') {
  const text = content.replace(/^\uFEFF/, '');
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;
  let quoteClosed = false;
  const pushField = () => { row.push(field); field = ''; quoteClosed = false; };
  const pushRow = () => { pushField(); if (row.some((value) => value.length > 0)) rows.push(row); row = []; };

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    if (inQuotes) {
      if (char === '"') {
        if (text[index + 1] === '"') { field += '"'; index += 1; }
        else { inQuotes = false; quoteClosed = true; }
      } else field += char;
    } else if (char === '"') {
      if (quoteClosed) throw new Error(`Malformed quoted CSV: character after quote closure in ${fileName} around position ${index}`);
      inQuotes = true;
    } else if (char === ',') {
      pushField();
    } else if (char === '\n') {
      pushRow();
    } else if (char === '\r') {
      if (text[index + 1] === '\n') index += 1;
      pushRow();
    } else {
      if (quoteClosed) throw new Error(`Malformed quoted CSV: unquoted character after quote in ${fileName}`);
      field += char;
    }
  }
  if (inQuotes) throw new Error(`Unterminated quote in ${fileName}`);
  if (field.length > 0 || row.length > 0) pushRow();
  return rows;
}

export function rowsToObjects(matrix) {
  if (!matrix || matrix.length === 0) return [];
  const headers = matrix[0].map(h => h.trim());
  const objects = [];
  for (let i = 1; i < matrix.length; i++) {
    const row = matrix[i];
    const obj = {};
    headers.forEach((h, colIdx) => {
      obj[h] = row[colIdx] !== undefined ? row[colIdx] : '';
    });
    objects.push(obj);
  }
  return objects;
}

export async function validateResearchPackage(snapshotDir) {
  const csvDir = path.join(snapshotDir, 'csv');
  const schemasDir = path.join(snapshotDir, 'schemas');
  const vocabPath = path.join(schemasDir, 'canonical-vocabulary.v1.1.2.json');

  const vocab = JSON.parse(await readFile(vocabPath, 'utf8'));
  const ajv = new Ajv({ allErrors: true, strict: false });

  const datasetNames = Object.keys(primaryIdFields);
  const parsedDatasets = {};
  const datasetObjects = {};
  const primaryIdRegistry = {
    records: new Set(),
    sources: new Set(),
    claims: new Set(),
    indicators: new Set(),
    relationships: new Set(),
    allPrimaryIds: new Set(),
  };

  const validationReport = {
    valid: true,
    errors: [],
    warnings: [],
    datasetCounts: {},
    schemaValidationResults: {},
    foreignKeyValidationResults: {},
  };

  // 1. Read & Parse all CSVs
  for (const name of datasetNames) {
    const csvFile = path.join(csvDir, `${name}.csv`);
    const schemaFile = path.join(schemasDir, `${name}.schema.json`);

    try {
      const csvContent = await readFile(csvFile, 'utf8');
      const matrix = parseCsv(csvContent, `${name}.csv`);
      parsedDatasets[name] = matrix;
      datasetObjects[name] = rowsToObjects(matrix);
      validationReport.datasetCounts[name] = datasetObjects[name].length;

      // Schema compile & validate
      const schemaContent = await readFile(schemaFile, 'utf8');
      const schema = JSON.parse(schemaContent);
      const validate = ajv.compile(schema);

      let schemaErrors = 0;
      datasetObjects[name].forEach((item, rowIdx) => {
        const valid = validate(item);
        if (!valid) {
          schemaErrors += 1;
          validate.errors.forEach(err => {
            validationReport.errors.push(`[${name}.csv row ${rowIdx + 2}] ${err.instancePath} ${err.message}`);
          });
        }
      });
      validationReport.schemaValidationResults[name] = { valid: schemaErrors === 0, errorCount: schemaErrors };
      if (schemaErrors > 0) validationReport.valid = false;

    } catch (err) {
      validationReport.valid = false;
      validationReport.errors.push(`Failed loading/parsing ${name}: ${err.message}`);
    }
  }

  // 2. Populate Primary ID Registries & Check Primary Uniqueness
  for (const name of datasetNames) {
    const idField = primaryIdFields[name];
    const items = datasetObjects[name] || [];

    for (let i = 0; i < items.length; i++) {
      const idVal = items[i][idField]?.trim();
      if (!idVal) {
        validationReport.valid = false;
        validationReport.errors.push(`[${name}.csv row ${i + 2}] Missing required primary ID in column '${idField}'`);
        continue;
      }

      if (primaryIdRegistry.allPrimaryIds.has(idVal)) {
        validationReport.valid = false;
        validationReport.errors.push(`[${name}.csv row ${i + 2}] Duplicate global primary ID '${idVal}'`);
      }
      primaryIdRegistry.allPrimaryIds.add(idVal);

      if (['achievement_record', 'policy_record', 'project_record', 'programme_record', 'entity_discovery'].includes(name)) {
        primaryIdRegistry.records.add(idVal);
      } else if (name === 'source_capture') {
        primaryIdRegistry.sources.add(idVal);
      } else if (name === 'claim_extraction') {
        primaryIdRegistry.claims.add(idVal);
      } else if (name === 'indicator_record') {
        primaryIdRegistry.indicators.add(idVal);
      } else if (name === 'claim_source_relationship') {
        primaryIdRegistry.relationships.add(idVal);
      }
    }
  }

  // 3. Foreign Key Validation
  for (const rule of foreignKeyRules) {
    const items = datasetObjects[rule.table] || [];
    const targetSet = primaryIdRegistry[rule.targetNamespace];
    let fkErrors = 0;

    for (let i = 0; i < items.length; i++) {
      const val = items[i][rule.fkField]?.trim();
      if (!val) {
        if (!rule.optional) {
          fkErrors += 1;
          validationReport.errors.push(`[${rule.table}.csv row ${i + 2}] Missing required foreign key in '${rule.fkField}' referencing ${rule.targetNamespace}`);
        }
      } else {
        if (!targetSet.has(val)) {
          fkErrors += 1;
          validationReport.errors.push(`[${rule.table}.csv row ${i + 2}] Broken foreign key in '${rule.fkField}': value '${val}' not found in ${rule.targetNamespace}`);
        }
      }
    }

    validationReport.foreignKeyValidationResults[`${rule.table}.${rule.fkField}`] = { valid: fkErrors === 0, errorCount: fkErrors };
    if (fkErrors > 0) validationReport.valid = false;
  }

  // 4. Special Semantic Rules
  // 4a. Check financial records for non-aggregation & valid types
  const financials = datasetObjects['financial_record'] || [];
  const validFinancialTypes = new Set((vocab.financial_value_types || []).map(v => v.code || v));
  for (let i = 0; i < financials.length; i++) {
    const f = financials[i];
    if (!validFinancialTypes.has(f.financial_type)) {
      validationReport.valid = false;
      validationReport.errors.push(`[financial_record.csv row ${i + 2}] Invalid financial_type '${f.financial_type}'`);
    }
    const amt = parseFloat(f.amount);
    if (isNaN(amt) || amt < 0) {
      validationReport.valid = false;
      validationReport.errors.push(`[financial_record.csv row ${i + 2}] Invalid non-negative amount '${f.amount}'`);
    }
  }

  // 4b. Check beneficiary records for valid stage
  const beneficiaries = datasetObjects['beneficiary_record'] || [];
  const validBeneficiaryStages = new Set((vocab.beneficiary_stages || []).map(v => v.code || v));
  for (let i = 0; i < beneficiaries.length; i++) {
    const b = beneficiaries[i];
    if (!validBeneficiaryStages.has(b.beneficiary_stage)) {
      validationReport.valid = false;
      validationReport.errors.push(`[beneficiary_record.csv row ${i + 2}] Invalid beneficiary_stage '${b.beneficiary_stage}'`);
    }
  }

  return {
    valid: validationReport.valid,
    report: validationReport,
    parsedDatasets,
    datasetObjects,
  };
}