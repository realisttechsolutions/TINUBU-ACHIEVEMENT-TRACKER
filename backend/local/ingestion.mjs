import { createHash } from 'node:crypto';
import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import Ajv from 'ajv';
import { repositoryRoot } from './database.mjs';

export const CONTRACT_VERSION = '1.1.2';
export const SYNTHETIC_MARKER = '[SYNTHETIC DEMO NON-PRODUCTION]';
export const expectedPackageFiles = [
  'achievement_record.csv', 'beneficiary_record.csv', 'claim_extraction.csv',
  'claim_source_relationship.csv', 'contradiction_log.csv', 'correction_record.csv',
  'data_gap.csv', 'duplicate_review.csv', 'entity_discovery.csv', 'financial_record.csv',
  'freshness_review.csv', 'indicator_observation.csv', 'indicator_record.csv',
  'policy_record.csv', 'programme_record.csv', 'project_record.csv',
  'publication_review.csv', 'source_capture.csv', 'timeline_event.csv',
].sort();

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

export const foreignKeyConfiguration = [
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

const sha256 = (value) => createHash('sha256').update(value).digest('hex');

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
    } else if (quoteClosed) {
      if (char === ',') pushField();
      else if (char === '\n') pushRow();
      else if (char !== '\r') throw new Error(`${fileName}: unexpected character after closing quote at offset ${index}`);
    } else if (char === '"') {
      if (field.length > 0) throw new Error(`${fileName}: quote inside an unquoted field at offset ${index}`);
      inQuotes = true;
    } else if (char === ',') pushField();
    else if (char === '\n') pushRow();
    else if (char !== '\r') field += char;
  }
  if (inQuotes) throw new Error(`${fileName}: unclosed quoted field`);
  if (field.length > 0 || row.length > 0) pushRow();
  return rows;
}

function collectIntegrityErrors(dataMap) {
  const duplicates = [];
  const unresolvedForeignKeys = [];
  const globalIds = new Map();
  for (const [name, idField] of Object.entries(primaryIdFields)) {
    const local = new Set();
    for (const [rowIndex, row] of (dataMap.get(name) ?? []).entries()) {
      const value = row[idField];
      if (!value) continue;
      if (local.has(value)) duplicates.push({ file: `${name}.csv`, row: rowIndex + 2, field: idField, value, kind: 'within_file' });
      if (globalIds.has(value)) duplicates.push({ file: `${name}.csv`, row: rowIndex + 2, field: idField, value, kind: 'cross_file' });
      local.add(value);
      globalIds.set(value, `${name}.${idField}`);
    }
  }
  const targets = {
    sources: new Set((dataMap.get('source_capture') ?? []).map((row) => row.source_id)),
    claims: new Set((dataMap.get('claim_extraction') ?? []).map((row) => row.claim_id)),
    indicators: new Set((dataMap.get('indicator_record') ?? []).map((row) => row.indicator_id)),
    relationships: new Set((dataMap.get('claim_source_relationship') ?? []).map((row) => row.relationship_id)),
    records: new Set(recordPrimaryFields.flatMap(([name, field]) => (dataMap.get(name) ?? []).map((row) => row[field]))),
  };
  for (const [name, field, target, optional] of foreignKeyConfiguration) {
    for (const [rowIndex, row] of (dataMap.get(name) ?? []).entries()) {
      const value = row[field];
      if (optional && !value) continue;
      if (!targets[target].has(value)) unresolvedForeignKeys.push({ file: `${name}.csv`, row: rowIndex + 2, field, value, target });
    }
  }
  const relationships = new Set();
  for (const [rowIndex, row] of (dataMap.get('claim_source_relationship') ?? []).entries()) {
    const key = [row.claim_id, row.source_id, row.source_role, row.relationship_type, row.evidence_location].join('|');
    if (relationships.has(key)) duplicates.push({ file: 'claim_source_relationship.csv', row: rowIndex + 2, value: key, kind: 'relationship_composite' });
    relationships.add(key);
  }
  return { duplicates, unresolvedForeignKeys };
}

export async function validateResearchPackage(packageDirectory) {
  const foundFiles = (await readdir(packageDirectory)).filter((name) => name.endsWith('.csv')).sort();
  const errors = [];
  const missing = expectedPackageFiles.filter((name) => !foundFiles.includes(name));
  const unexpected = foundFiles.filter((name) => !expectedPackageFiles.includes(name));
  if (missing.length) errors.push({ code: 'MISSING_FILES', files: missing });
  if (unexpected.length) errors.push({ code: 'UNEXPECTED_FILES', files: unexpected });

  const ajv = new Ajv({ allErrors: true, strict: false });
  ajv.addFormat('uri', { type: 'string', validate: (value) => /^https?:\/\//i.test(value) });
  const dataMap = new Map();
  const manifestFiles = [];
  let rowCount = 0;

  for (const fileName of expectedPackageFiles) {
    if (!foundFiles.includes(fileName)) continue;
    const name = fileName.replace('.csv', '');
    const csvText = await readFile(path.join(packageDirectory, fileName), 'utf8');
    const schemaText = await readFile(path.join(repositoryRoot, 'research/schemas', `${name}.schema.json`), 'utf8');
    const schema = JSON.parse(schemaText);
    const validate = ajv.compile(schema);
    let matrix;
    try { matrix = parseCsv(csvText, fileName); }
    catch (error) { errors.push({ code: 'CSV_PARSE', file: fileName, message: error.message }); continue; }
    if (matrix.length < 2) { errors.push({ code: 'NO_DATA', file: fileName }); continue; }
    const [headers, ...valuesRows] = matrix;
    const expectedHeaders = Object.keys(schema.properties);
    if (headers.join('\u0000') !== expectedHeaders.join('\u0000')) {
      errors.push({ code: 'HEADER_MISMATCH', file: fileName, expected: expectedHeaders, received: headers });
      continue;
    }
    const parsedRows = [];
    for (const [rowIndex, values] of valuesRows.entries()) {
      if (values.length !== headers.length) { errors.push({ code: 'COLUMN_COUNT', file: fileName, row: rowIndex + 2 }); continue; }
      const row = Object.fromEntries(headers.map((header, index) => [header, values[index]]));
      if (!Object.values(row).some((value) => value.includes(SYNTHETIC_MARKER))) {
        errors.push({ code: 'SYNTHETIC_MARKER_REQUIRED', file: fileName, row: rowIndex + 2 });
      }
      for (const required of schema.required ?? []) {
        if (!row[required]?.trim()) errors.push({ code: 'REQUIRED_VALUE', file: fileName, row: rowIndex + 2, field: required });
      }
      if (!validate(row)) errors.push({ code: 'SCHEMA', file: fileName, row: rowIndex + 2, details: structuredClone(validate.errors) });
      parsedRows.push(row);
      rowCount += 1;
    }
    dataMap.set(name, parsedRows);
    manifestFiles.push({ fileName, bytes: Buffer.byteLength(csvText), sha256: sha256(csvText), rows: parsedRows.length });
  }
  const { duplicates, unresolvedForeignKeys } = collectIntegrityErrors(dataMap);
  if (duplicates.length) errors.push({ code: 'DUPLICATE_IDENTIFIERS', count: duplicates.length });
  if (unresolvedForeignKeys.length) errors.push({ code: 'UNRESOLVED_FOREIGN_KEYS', count: unresolvedForeignKeys.length });
  const packageChecksum = sha256(JSON.stringify(manifestFiles));
  const planHash = sha256(JSON.stringify({ contractVersion: CONTRACT_VERSION, files: manifestFiles, rowCount }));
  return {
    valid: errors.length === 0, contractVersion: CONTRACT_VERSION, rowCount,
    errors, unresolvedForeignKeys, duplicates,
    manifest: { classification: 'SYNTHETIC DEMO NON-PRODUCTION', contractVersion: CONTRACT_VERSION, files: manifestFiles },
    packageChecksum, planHash,
  };
}

function uuidFromHash(hash) {
  return `${hash.slice(0, 8)}-${hash.slice(8, 12)}-4${hash.slice(13, 16)}-8${hash.slice(17, 20)}-${hash.slice(20, 32)}`;
}

export async function executeIngestion(db, { packageDirectory, mode = 'dry_run', idempotencyKey, submittedBy, approvedBy = null }) {
  if (!['validate', 'dry_run', 'stage', 'commit'].includes(mode)) throw new Error(`Unsupported ingestion mode: ${mode}`);
  const report = await validateResearchPackage(packageDirectory);
  if (!report.valid) return { mode, persisted: false, reused: false, report };
  if (mode === 'validate' || mode === 'dry_run') return { mode, persisted: false, reused: false, report };
  if (!idempotencyKey) throw new Error('idempotencyKey is required for stage and commit');
  if (!submittedBy) throw new Error('submittedBy is required for stage and commit');
  if (mode === 'commit' && !approvedBy) throw new Error('approvedBy is required for commit');

  await db.exec('BEGIN');
  try {
    const existingResult = await db.query('SELECT * FROM research_batches WHERE idempotency_key = $1 OR package_checksum = $2 FOR UPDATE', [idempotencyKey, report.packageChecksum]);
    const existing = existingResult.rows[0];
    if (existing) {
      if (existing.idempotency_key !== idempotencyKey || existing.package_checksum !== report.packageChecksum) {
        throw new Error('Idempotency collision: key or package checksum was previously used for different input');
      }
      if (existing.status === 'committed') { await db.exec('COMMIT'); return { mode, persisted: true, reused: true, batch: existing, report }; }
      if (mode === 'stage') { await db.exec('COMMIT'); return { mode, persisted: true, reused: true, batch: existing, report }; }
      const updated = await db.query(
        `UPDATE research_batches SET mode = 'commit', status = 'committed', approved_by = $2,
          import_summary = $3::jsonb, completed_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *`,
        [existing.id, approvedBy, JSON.stringify({ plannedRows: report.rowCount, domainRowsWritten: 0, controlPlaneOnly: true })],
      );
      await db.exec('COMMIT');
      return { mode, persisted: true, reused: false, batch: updated.rows[0], report };
    }

    const id = uuidFromHash(sha256(idempotencyKey));
    const status = mode === 'stage' ? 'staged' : 'committed';
    const result = await db.query(
      `INSERT INTO research_batches (
        id, external_id, idempotency_key, package_checksum, contract_version, schema_version,
        taxonomy_version, mode, status, submitted_by, approved_by, plan_hash, manifest_json,
        validation_report, unresolved_fk_report, duplicate_report, import_summary, completed_at
      ) VALUES ($1,$2,$3,$4,'1.1.2','e01-local-1','1.1.2',$5,$6,$7,$8,$9,$10::jsonb,$11::jsonb,$12::jsonb,$13::jsonb,$14::jsonb,
        CASE WHEN $6 = 'committed' THEN CURRENT_TIMESTAMP ELSE NULL END) RETURNING *`,
      [id, `SYNTHETIC-DEMO-BATCH-${report.packageChecksum.slice(0, 12)}`, idempotencyKey, report.packageChecksum,
        mode, status, submittedBy, approvedBy, report.planHash, JSON.stringify(report.manifest),
        JSON.stringify({ valid: true, errors: [] }), JSON.stringify(report.unresolvedForeignKeys),
        JSON.stringify(report.duplicates), JSON.stringify({ plannedRows: report.rowCount, domainRowsWritten: 0, controlPlaneOnly: true })],
    );
    await db.exec('COMMIT');
    return { mode, persisted: true, reused: false, batch: result.rows[0], report };
  } catch (error) {
    await db.exec('ROLLBACK');
    throw error;
  }
}

function csvEscape(value) {
  return /[",\r\n]/.test(value) ? `"${value.replaceAll('"', '""')}"` : value;
}

export async function createSyntheticResearchPackage(outputDirectory) {
  await mkdir(outputDirectory, { recursive: true });
  for (const fileName of expectedPackageFiles) {
    const templateText = await readFile(path.join(repositoryRoot, 'research/templates', fileName), 'utf8');
    const schema = JSON.parse(await readFile(path.join(repositoryRoot, 'research/schemas', fileName.replace('.csv', '.schema.json')), 'utf8'));
    const [headers, ...rows] = parseCsv(templateText, fileName);
    const transformed = rows.map((values) => values.map((value, index) => {
      const field = headers[index];
      const property = schema.properties[field] ?? {};
      let next = value.replaceAll('EXAMPLE-ONLY', 'SYNTHETIC-DEMO').replaceAll('[EXAMPLE ONLY - NOT A PRODUCTION RECORD]', SYNTHETIC_MARKER);
      if (field === headers[0] && !Object.values(Object.fromEntries(headers.map((h, i) => [h, values[i]]))).some((v) => v.includes('[EXAMPLE ONLY - NOT A PRODUCTION RECORD]'))) {
        next = `${next}`;
      }
      if (/url/i.test(field) && next) next = `https://example.invalid/e01/${fileName.replace('.csv', '')}/${index}`;
      if (field === 'language' && next) next = 'en';
      return next;
    }));
    // Every source row must carry an explicit classification without changing schema topology.
    for (const row of transformed) {
      const markerIndex = headers.findIndex((field) => ['notes', 'summary', 'title', 'source_title', 'claim_text', 'description', 'rationale'].includes(field));
      if (markerIndex >= 0 && !row.some((value) => value.includes(SYNTHETIC_MARKER))) row[markerIndex] = `${SYNTHETIC_MARKER} ${row[markerIndex]}`;
    }
    const output = [headers, ...transformed].map((row) => row.map((value) => csvEscape(value)).join(',')).join('\r\n') + '\r\n';
    await writeFile(path.join(outputDirectory, fileName), output, 'utf8');
  }
  return outputDirectory;
}
