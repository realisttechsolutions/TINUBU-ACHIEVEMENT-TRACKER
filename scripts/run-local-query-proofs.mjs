import { createLocalDatabase } from '../backend/local/database.mjs';
import { runQueryProofs } from '../backend/local/query-proofs.mjs';

const db = await createLocalDatabase();
try {
  const results = await runQueryProofs(db);
  for (const result of results) console.log(`PASS ${result.file}: ${result.rowCount} row(s)`);
} finally {
  await db.close();
}
