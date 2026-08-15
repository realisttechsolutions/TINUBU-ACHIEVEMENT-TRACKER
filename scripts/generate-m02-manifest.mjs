import { createHash } from 'node:crypto';
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const dir = 'data/research-snapshots/m02/csv';
const files = readdirSync(dir).sort();
const fileEntries = [];

let aggregateHashBuffer = '';

for (const f of files) {
  const fullPath = path.join(dir, f);
  const content = readFileSync(fullPath);
  const text = content.toString('utf8').replace(/^\uFEFF/, '');
  const lines = text.split(/\r?\n/).filter(line => line.trim().length > 0);
  const rowCount = Math.max(0, lines.length - 1);
  const sha256 = createHash('sha256').update(content).digest('hex');
  const sizeBytes = content.length;
  
  aggregateHashBuffer += `${f}:${sha256}:${sizeBytes}:${rowCount};`;

  fileEntries.push({
    name: f,
    relativePath: `csv/${f}`,
    sha256,
    sizeBytes,
    rowCount,
    schemaReference: `schemas/${f.replace('.csv', '.schema.json')}`
  });
}

const aggregateManifestHash = createHash('sha256').update(aggregateHashBuffer).digest('hex');

const manifest = {
  snapshotId: 'm02',
  researchMission: 'TAT-RM-02',
  researchBranch: 'research/mission-02-pilot-achievements',
  researchCommit: '3284182',
  researchContractVersion: '1.1.2',
  canonicalVocabularyVersion: '1.1.2',
  createdAt: new Date().toISOString(),
  aggregateManifestHash,
  fileCount: fileEntries.length,
  totalRows: fileEntries.reduce((acc, curr) => acc + curr.rowCount, 0),
  files: fileEntries
};

writeFileSync('data/research-snapshots/m02/manifest.json', JSON.stringify(manifest, null, 2) + '\n');
console.log('Generated data/research-snapshots/m02/manifest.json successfully.');
console.log(`Total files: ${manifest.fileCount}, Total rows: ${manifest.totalRows}, Aggregate Hash: ${aggregateManifestHash}`);