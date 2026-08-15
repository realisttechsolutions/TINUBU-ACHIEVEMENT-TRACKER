import { createLocalDatabase } from '../backend/local/database.mjs';
import { executeM02Ingestion } from '../backend/ingestion/importer.mjs';

async function main() {
  const db = await createLocalDatabase({ seed: true });
  await executeM02Ingestion(db);

  const tableRes = await db.query(
    "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE' ORDER BY table_name"
  );

  console.log('=== TOTAL BASE TABLES:', tableRes.rows.length, '===');

  const results = [];
  for (const row of tableRes.rows) {
    const tName = row.table_name;
    const countRes = await db.query(`SELECT count(*)::int as count FROM ${tName}`);
    results.push({ table: tName, count: countRes.rows[0].count });
  }

  for (const r of results) {
    console.log(`${r.table.padEnd(30)} : ${r.count}`);
  }

  const viewRes = await db.query(
    "SELECT table_name FROM information_schema.views WHERE table_schema = 'public' ORDER BY table_name"
  );
  console.log('\n=== TOTAL VIEWS:', viewRes.rows.length, '===');
  for (const row of viewRes.rows) {
    const countRes = await db.query(`SELECT count(*)::int as count FROM ${row.table_name}`);
    console.log(`${row.table_name.padEnd(30)} : ${countRes.rows[0].count}`);
  }

  await db.close();
}

main().catch(console.error);
