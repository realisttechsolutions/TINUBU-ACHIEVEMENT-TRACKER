import pg from 'pg';

const client = new pg.Client({ host: '127.0.0.1', port: 5432, database: 'tat_e01_local', user: 'postgres', ssl: false });
try {
  await client.connect();
  const { rows } = await client.query("SELECT count(*)::int AS count FROM pg_tables WHERE schemaname = 'public'");
  if (rows[0].count !== 27) throw new Error(`Expected 27 SQL Connect emulator tables, found ${rows[0].count}`);
  console.log(`PASS: SQL Connect emulator generated ${rows[0].count} public tables`);
} finally {
  await client.end();
}
