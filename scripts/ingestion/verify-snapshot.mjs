import path from 'node:path';
import { verifySnapshotManifest } from '../../backend/ingestion/manifest-verifier.mjs';

const snapshotDir = process.argv[2] || path.resolve('data/research-snapshots/m02');
console.log(`Verifying research snapshot manifest at: ${snapshotDir}`);

const result = await verifySnapshotManifest(snapshotDir);
if (!result.valid) {
  console.error('FAILED: Snapshot manifest verification errors:');
  result.errors.forEach(e => console.error(` - ${e}`));
  process.exit(1);
} else {
  console.log(`PASS: Snapshot manifest verified successfully.`);
  console.log(` - Snapshot ID: ${result.snapshotId}`);
  console.log(` - Checked Files: ${result.checkedFiles}`);
  console.log(` - Manifest Hash: ${result.manifestHash}`);
}