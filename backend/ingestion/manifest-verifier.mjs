import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

export async function verifySnapshotManifest(snapshotDir) {
  const manifestPath = path.join(snapshotDir, 'manifest.json');
  const manifestContent = await readFile(manifestPath, 'utf8');
  const manifest = JSON.parse(manifestContent);
  const results = {
    valid: true,
    snapshotId: manifest.snapshotId,
    manifestHash: manifest.aggregateManifestHash,
    checkedFiles: 0,
    errors: [],
  };

  let aggregateHashBuffer = '';

  for (const fileEntry of manifest.files) {
    const filePath = path.join(snapshotDir, fileEntry.relativePath);
    try {
      const content = await readFile(filePath);
      const sha256 = createHash('sha256').update(content).digest('hex');
      const sizeBytes = content.length;
      const text = content.toString('utf8').replace(/^\uFEFF/, '');
      const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
      const rowCount = Math.max(0, lines.length - 1);

      if (sha256 !== fileEntry.sha256) {
        results.valid = false;
        results.errors.push(`File ${fileEntry.name} SHA256 mismatch: expected ${fileEntry.sha256}, got ${sha256}`);
      }
      if (sizeBytes !== fileEntry.sizeBytes) {
        results.valid = false;
        results.errors.push(`File ${fileEntry.name} size mismatch: expected ${fileEntry.sizeBytes}, got ${sizeBytes}`);
      }
      if (rowCount !== fileEntry.rowCount) {
        results.valid = false;
        results.errors.push(`File ${fileEntry.name} row count mismatch: expected ${fileEntry.rowCount}, got ${rowCount}`);
      }

      aggregateHashBuffer += `${fileEntry.name}:${sha256}:${sizeBytes}:${rowCount};`;
      results.checkedFiles += 1;
    } catch (err) {
      results.valid = false;
      results.errors.push(`Failed reading file ${fileEntry.name}: ${err.message}`);
    }
  }

  const computedAggregateHash = createHash('sha256').update(aggregateHashBuffer).digest('hex');
  if (computedAggregateHash !== manifest.aggregateManifestHash) {
    results.valid = false;
    results.errors.push(`Aggregate manifest hash mismatch: expected ${manifest.aggregateManifestHash}, got ${computedAggregateHash}`);
  }

  return results;
}