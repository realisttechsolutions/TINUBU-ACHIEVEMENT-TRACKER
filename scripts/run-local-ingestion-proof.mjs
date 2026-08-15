import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { createLocalDatabase } from '../backend/local/database.mjs';
import { createSyntheticResearchPackage, executeIngestion } from '../backend/local/ingestion.mjs';

const packageDirectory = await mkdtemp(path.join(tmpdir(), 'tat-e01-package-'));
const db = await createLocalDatabase();
try {
  await createSyntheticResearchPackage(packageDirectory);
  const result = await executeIngestion(db, { packageDirectory, mode: 'dry_run' });
  if (!result.report.valid) throw new Error(JSON.stringify(result.report.errors, null, 2));
  console.log(`PASS: dry-run validated ${result.report.rowCount} rows across ${result.report.manifest.files.length} files`);
  console.log(`Package checksum: ${result.report.packageChecksum}`);
  console.log(`Plan hash: ${result.report.planHash}`);
} finally {
  await db.close();
  await rm(packageDirectory, { recursive: true, force: true });
}
