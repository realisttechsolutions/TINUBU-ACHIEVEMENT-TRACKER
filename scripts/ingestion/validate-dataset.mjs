import path from 'node:path';
import { validateResearchPackage } from '../../backend/ingestion/data-validator.mjs';

const snapshotDir = process.argv[2] || path.resolve('data/research-snapshots/m02');
console.log(`Validating research package dataset at: ${snapshotDir}`);

const result = await validateResearchPackage(snapshotDir);
if (!result.valid) {
  console.error('FAILED: Research package validation errors:');
  result.report.errors.forEach(e => console.error(` - ${e}`));
  process.exit(1);
} else {
  console.log(`PASS: All 19 CSV datasets passed schema, vocabulary, primary ID, and foreign key validation.`);
  console.log(`Dataset summary:`);
  Object.entries(result.report.datasetCounts).forEach(([name, count]) => {
    console.log(` - ${name.padEnd(28)}: ${count} rows`);
  });
}