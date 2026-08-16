import path from 'node:path';
import { executeM02Ingestion } from '../../backend/ingestion/importer.mjs';
import { reconcileDatabaseWithM02 } from '../../backend/ingestion/reconciler.mjs';
import { createFirebaseIamDatabase } from './firebase-iam-pg.mjs';

const PROJECT = 'tinubu-achievement-stg';
const INSTANCE = 'tat-db-staging';
const DATABASE = 'tat_staging';
const snapshotDir = path.resolve('data/research-snapshots/m02');
const commit = process.argv.includes('--commit');

if (!commit) {
  const dryRun = await executeM02Ingestion({ query: async () => { throw new Error('Dry run attempted a database query.'); } }, { snapshotDir, dryRun: true });
  if (!dryRun.success) throw new Error(`M02 dry run failed: ${dryRun.errors.join('; ')}`);
  console.log(JSON.stringify({ mode: 'dry-run', project: PROJECT, instance: INSTANCE, database: DATABASE, ...dryRun }, null, 2));
  process.exit(0);
}

const database = await createFirebaseIamDatabase({ project: PROJECT, instance: INSTANCE, database: DATABASE, max: 1 });
const operator = database.username;
const quotedOperator = `"${operator.replaceAll('"', '""')}"`;

try {
  const preflight = await database.query(`
    SELECT
      (SELECT count(*)::int FROM records) AS records,
      (SELECT count(*)::int FROM research_batches) AS research_batches,
      (SELECT count(*)::int FROM sources) AS sources`);
  const state = preflight.rows[0];
  if (state.records !== 0 || state.research_batches !== 0 || state.sources !== 0) {
    throw new Error(`Staging preflight expected an empty M02 domain: ${JSON.stringify(state)}`);
  }

  await database.query(`GRANT tat_ingestion_writer TO ${quotedOperator}`);
  await database.query('SET ROLE tat_ingestion_writer');
  const role = await database.query('SELECT current_user, session_user');
  if (role.rows[0].current_user !== 'tat_ingestion_writer') throw new Error('Trusted ingestion role activation failed.');

  const result = await executeM02Ingestion(database, { snapshotDir, dryRun: false });
  if (!result.success) throw new Error(`M02 staging ingestion failed: ${result.errors.join('; ')}`);

  // Restart-safety proof: the same committed package must be skipped without writes.
  const replay = await executeM02Ingestion(database, { snapshotDir, dryRun: false });
  if (!replay.success || !replay.idempotentSkip || replay.batchId !== result.batchId) {
    throw new Error(`M02 idempotent replay failed: ${JSON.stringify(replay)}`);
  }

  const parity = await reconcileDatabaseWithM02(database);
  if (!parity.reconciled) throw new Error(`M02 cloud parity failed: ${JSON.stringify(parity)}`);

  console.log(JSON.stringify({
    target: { project: PROJECT, instance: INSTANCE, database: DATABASE },
    role: role.rows[0],
    ingestion: result,
    replay: { success: replay.success, idempotentSkip: replay.idempotentSkip, batchId: replay.batchId },
    parity,
  }, null, 2));
  console.log('M10C M02 CLOUD INGESTION AND DATA PARITY: PASS');
} finally {
  await database.query('RESET ROLE').catch(() => undefined);
  await database.query(`REVOKE tat_ingestion_writer FROM ${quotedOperator}`).catch(() => undefined);
  await database.close();
}
