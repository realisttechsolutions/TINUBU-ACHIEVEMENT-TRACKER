import { runQueryFile } from './database.mjs';

export const queryProofs = [
  ['01-homepage-summary.sql', []],
  ['02-list-records-by-sector.sql', ['education_human_capital', 25, 0]],
  ['03-filter-records-by-status.sql', ['operational', 25, 0]],
  ['04-filter-records-by-state.sql', ['SYNTHETIC-DEMO-STATE', 25, 0]],
  ['05-search-records.sql', ['Interplanetary', 25, 0]],
  ['06-record-detail.sql', ['synthetic-demo-learning-labs']],
  ['07-claim-evidence.sql', ['synthetic-demo-learning-labs']],
  ['08-record-timeline.sql', ['synthetic-demo-learning-labs']],
  ['09-sector-aggregates.sql', []],
  ['10-geography-aggregates.sql', []],
  ['11-indicators.sql', []],
  ['12-public-download.sql', [null, null, 100, 0]],
  ['13-safe-financial-aggregates.sql', []],
];

export async function runQueryProofs(db) {
  const results = [];
  for (const [file, params] of queryProofs) {
    const result = await runQueryFile(db, file, params);
    results.push({ file, rowCount: result.rows.length, rows: result.rows });
  }
  return results;
}
