import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { createLocalDatabase } from '../backend/local/database.mjs';
import { exportPublicDataset } from '../backend/local/export-service.mjs';
import { runQueryProofs } from '../backend/local/query-proofs.mjs';
import {
  createSyntheticResearchPackage, executeIngestion, parseCsv, validateResearchPackage,
} from '../backend/local/ingestion.mjs';

const db = await createLocalDatabase();
const packageDirectory = await mkdtemp(path.join(tmpdir(), 'tat-e01-db-tests-'));

function toCsv(matrix) {
  const escape = (value) => /[",\r\n]/.test(value) ? `"${value.replaceAll('"', '""')}"` : value;
  return matrix.map((row) => row.map(escape).join(',')).join('\r\n') + '\r\n';
}

async function expectDatabaseError(action, message) {
  await assert.rejects(action, undefined, message);
}

try {
  const tableCount = await db.query("SELECT count(*)::int AS count FROM pg_tables WHERE schemaname = 'public'");
  assert.equal(tableCount.rows[0].count, 27, 'exactly 27 public base tables must exist');

  const recordSectorColumns = await db.query(`SELECT column_name FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'record_sectors' ORDER BY ordinal_position`);
  assert.ok(!recordSectorColumns.rows.some((row) => row.column_name === 'id'), 'record_sectors must not have a synthetic id');
  const recordSectorPrimaryKey = await db.query(`SELECT pg_get_constraintdef(oid) AS definition
    FROM pg_constraint WHERE conrelid = 'public.record_sectors'::regclass AND contype = 'p'`);
  assert.equal(recordSectorPrimaryKey.rows[0].definition, 'PRIMARY KEY (record_id, sector_id, role_code)');

  await expectDatabaseError(
    () => db.query(`INSERT INTO record_sectors (record_id, sector_id, role_code)
      VALUES ('ffffffff-ffff-4fff-8fff-fffffffffff2','ffffffff-ffff-4fff-8fff-fffffffffff3','primary')`),
    'foreign keys must reject nonexistent records and sectors',
  );
  await expectDatabaseError(
    () => db.query(`INSERT INTO records (
      id, external_id, slug, record_type, title, summary, implementation_status,
      workflow_status, publication_status, verification_status, evidence_profile, created_by
    ) VALUES (
      'ffffffff-ffff-4fff-8fff-fffffffffff4','SYNTHETIC-DEMO-DUPLICATE','synthetic-demo-learning-labs',
      'achievement','SYNTHETIC DEMO Duplicate','SYNTHETIC DEMO duplicate should fail','completed','draft',
      'unpublished','under_review','direct_physical_delivery','00000000-0000-4000-8000-000000000001')`),
    'unique slug must be enforced',
  );

  const relationships = await db.query('SELECT count(*)::int AS count FROM record_relationships');
  assert.equal(relationships.rows[0].count, 1, 'record relationships must load');
  const manySources = await db.query(`SELECT count(*)::int AS count FROM claim_source_relationships
    WHERE claim_id = '60000000-0000-4000-8000-000000000001'`);
  assert.equal(manySources.rows[0].count, 2, 'one claim must support many sources');

  const finance = await db.query('SELECT financial_type, amount::text AS amount FROM financial_records ORDER BY financial_type');
  assert.deepEqual(finance.rows.map((row) => row.financial_type).sort(), ['budget_allocation', 'funding_released']);
  assert.equal(finance.rows.length, 2, 'financial classifications remain separate');
  await expectDatabaseError(
    () => db.query(`UPDATE financial_records SET financial_type = 'money_spent' WHERE id = '70000000-0000-4000-8000-000000000001'`),
    'non-canonical financial type must fail',
  );

  const beneficiaries = await db.query('SELECT beneficiary_stage, count_value FROM beneficiary_records ORDER BY beneficiary_stage');
  assert.deepEqual(beneficiaries.rows.map((row) => row.beneficiary_stage).sort(), ['applicant', 'disbursement_recipient']);
  await expectDatabaseError(
    () => db.query(`UPDATE beneficiary_records SET beneficiary_stage = 'recipient' WHERE id = '71000000-0000-4000-8000-000000000001'`),
    'ambiguous beneficiary stage must fail',
  );

  const allRecords = await db.query('SELECT count(*)::int AS count FROM records');
  const publicRecords = await db.query('SELECT count(*)::int AS count FROM public_record_catalog');
  assert.equal(allRecords.rows[0].count, 3);
  assert.equal(publicRecords.rows[0].count, 2, 'unpublished record must be excluded');
  const publicColumns = await db.query(`SELECT column_name FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'public_record_catalog'`);
  assert.ok(!publicColumns.rows.some((row) => row.column_name === 'internal_notes'), 'public view must exclude internal notes');
  assert.ok(!publicColumns.rows.some((row) => row.column_name === 'workflow_status'), 'public view must exclude workflow state');

  const proofResults = await runQueryProofs(db);
  assert.equal(proofResults.length, 13);
  for (const result of proofResults.slice(0, 12)) assert.ok(result.rowCount > 0, `${result.file} must return proof rows`);
  const pageOne = await db.query(`SELECT id FROM public_record_catalog ORDER BY id LIMIT 1 OFFSET 0`);
  const pageTwo = await db.query(`SELECT id FROM public_record_catalog ORDER BY id LIMIT 1 OFFSET 1`);
  assert.equal(pageOne.rows.length, 1);
  assert.equal(pageTwo.rows.length, 1);
  assert.notEqual(pageOne.rows[0].id, pageTwo.rows[0].id, 'pagination must be deterministic');
  const safeFinance = proofResults.find((result) => result.file.startsWith('13-'));
  assert.equal(safeFinance.rows.length, 2);
  assert.ok(safeFinance.rows.every((row) => row.financial_type && row.currency_code && row.aggregation_basis));

  const jsonExport = await exportPublicDataset(db, { format: 'json' });
  const csvExport = await exportPublicDataset(db, { format: 'csv' });
  assert.equal(jsonExport.rowCount, 2);
  assert.equal(csvExport.rowCount, 2);
  assert.ok(!jsonExport.body.includes('internal_notes'));
  assert.ok(csvExport.body.startsWith('slug,record_type,title'));

  await createSyntheticResearchPackage(packageDirectory);
  const batchBefore = await db.query('SELECT count(*)::int AS count FROM research_batches');
  const dryRun = await executeIngestion(db, { packageDirectory, mode: 'dry_run' });
  assert.equal(dryRun.report.valid, true, JSON.stringify(dryRun.report.errors));
  assert.equal(dryRun.persisted, false);
  const batchAfterDryRun = await db.query('SELECT count(*)::int AS count FROM research_batches');
  assert.equal(batchAfterDryRun.rows[0].count, batchBefore.rows[0].count, 'dry-run must not write');

  const claimFile = path.join(packageDirectory, 'claim_extraction.csv');
  const claimMatrix = parseCsv(await readFile(claimFile, 'utf8'), 'claim_extraction.csv');
  const recordIdIndex = claimMatrix[0].indexOf('record_id');
  const originalRecordId = claimMatrix[1][recordIdIndex];
  claimMatrix[1][recordIdIndex] = '[SYNTHETIC-DEMO-MISSING-RECORD]';
  await writeFile(claimFile, toCsv(claimMatrix), 'utf8');
  const invalidFk = await validateResearchPackage(packageDirectory);
  assert.equal(invalidFk.valid, false);
  assert.ok(invalidFk.unresolvedForeignKeys.some((entry) => entry.field === 'record_id'));
  claimMatrix[1][recordIdIndex] = originalRecordId;
  await writeFile(claimFile, toCsv(claimMatrix), 'utf8');

  const sourceFile = path.join(packageDirectory, 'source_capture.csv');
  const sourceMatrix = parseCsv(await readFile(sourceFile, 'utf8'), 'source_capture.csv');
  sourceMatrix.push([...sourceMatrix[1]]);
  await writeFile(sourceFile, toCsv(sourceMatrix), 'utf8');
  const duplicate = await validateResearchPackage(packageDirectory);
  assert.equal(duplicate.valid, false);
  assert.ok(duplicate.duplicates.length > 0, 'duplicate package identifiers must be reported');
  await createSyntheticResearchPackage(packageDirectory);

  const actors = {
    researcher: '00000000-0000-4000-8000-000000000001',
    publisher: '00000000-0000-4000-8000-000000000004',
  };
  const ingestionArgs = {
    packageDirectory, idempotencyKey: 'SYNTHETIC-DEMO-E01-IDEMPOTENCY-PROOF', submittedBy: actors.researcher,
  };
  const staged = await executeIngestion(db, { ...ingestionArgs, mode: 'stage' });
  assert.equal(staged.batch.status, 'staged');
  const committed = await executeIngestion(db, { ...ingestionArgs, mode: 'commit', approvedBy: actors.publisher });
  assert.equal(committed.batch.status, 'committed');
  const replay = await executeIngestion(db, { ...ingestionArgs, mode: 'commit', approvedBy: actors.publisher });
  assert.equal(replay.reused, true, 'identical committed input must be idempotent');
  const proofBatchCount = await db.query(`SELECT count(*)::int AS count FROM research_batches
    WHERE idempotency_key = 'SYNTHETIC-DEMO-E01-IDEMPOTENCY-PROOF'`);
  assert.equal(proofBatchCount.rows[0].count, 1);

  console.log('PASS: 27-table schema, integrity, query, export, boundary, and ingestion test suite');
} finally {
  await db.close();
  await rm(packageDirectory, { recursive: true, force: true });
}
