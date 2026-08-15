import path from 'node:path';
import { createLocalDatabase } from '../../backend/local/database.mjs';
import { executeM02Ingestion } from '../../backend/ingestion/importer.mjs';
import { reconcileDatabaseWithM02 } from '../../backend/ingestion/reconciler.mjs';

const dryRun = process.argv.includes('--dry-run');
const snapshotDir = path.resolve('data/research-snapshots/m02');

console.log(`Starting M02 Ingestion Pipeline... (Dry-run: ${dryRun})`);
const db = await createLocalDatabase({ seed: false });

try {
  const result = await executeM02Ingestion(db, { snapshotDir, dryRun });

  if (!result.success) {
    console.error('FAILED: Ingestion errors:');
    result.errors.forEach(e => console.error(` - ${e}`));
    process.exit(1);
  }

  console.log(`PASS: Ingestion pipeline execution completed in ${result.durationMs}ms`);
  console.log(` - Manifest Verified: ${result.manifestVerified}`);
  console.log(` - Data Validated: ${result.dataValidated}`);
  console.log(` - Idempotent Skip: ${result.idempotentSkip}`);
  console.log(` - Batch ID: ${result.batchId}`);
  console.log(`Ingestion entity counts:`);
  Object.entries(result.counts).forEach(([k, v]) => {
    console.log(`   * ${k.padEnd(28)}: ${v}`);
  });

  if (!dryRun) {
    console.log(`\nRunning Canonical Database Reconciliation...`);
    const recon = await reconcileDatabaseWithM02(db);
    console.log(`Reconciliation status: ${recon.reconciled ? '100% RECONCILED (0 DISCREPANCIES)' : 'DISCREPANCIES DETECTED'}`);
    console.log(`Showcase records verified: ${recon.showcaseVerified}/${recon.showcaseTotal}`);

    if (!recon.reconciled) {
      console.error('Discrepancies:', JSON.stringify(recon.discrepancies, null, 2));
      process.exit(1);
    }
  }
} finally {
  await db.close();
}