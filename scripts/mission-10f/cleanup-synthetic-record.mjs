import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const auth = require('../../node_modules/firebase-tools/lib/auth');
const { requireAuth } = require('../../node_modules/firebase-tools/lib/requireAuth');
const { GoogleAuth } = require('google-auth-library');
const { Connector } = require('@google-cloud/cloud-sql-connector');
const pg = require('pg');

const PROJECT = 'tinubu-achievement-stg';
const INSTANCE = 'tinubu-achievement-stg:us-central1:tat-db-staging';
const DB = 'tat_staging';
const USER = 'firebase-app-hosting-compute@tinubu-achievement-stg.iam';
const TEST_RECORD_ID = '34d05fa9-6b66-4629-8eff-88a12f442fc6';

async function main() {
  console.log('Connecting to Staging Cloud SQL to archive synthetic test record...');
  const connector = new Connector();
  const clientOpts = await connector.getOptions({
    instanceConnectionName: INSTANCE,
    authType: 'IAM',
  });

  const pool = new pg.Pool({
    ...clientOpts,
    user: USER,
    database: DB,
    max: 2,
  });

  const client = await pool.connect();
  try {
    await client.query('SET ROLE tat_admin_writer_m10f');

    console.log(`Setting record ${TEST_RECORD_ID} to ARCHIVED / UNPUBLISHED...`);
    const updateRes = await client.query(
      `
      UPDATE records
      SET workflow_status = 'archived',
          publication_status = 'unpublished',
          is_public = false,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING id, title, workflow_status, publication_status, is_public, updated_at::text
      `,
      [TEST_RECORD_ID]
    );

    console.log('Updated Record State:', JSON.stringify(updateRes.rows[0], null, 2));

    // Verify audit decisions are completely intact
    const decisionsRes = await client.query(
      `SELECT count(*)::int as count FROM review_decisions WHERE record_id = $1`,
      [TEST_RECORD_ID]
    );
    console.log(`Audit History Preserved: ${decisionsRes.rows[0].count} review decisions in DB.`);

    // Verify public view isolation
    const pubRes = await client.query(
      `SELECT count(*)::int as count FROM public_record_catalog WHERE id = $1`,
      [TEST_RECORD_ID]
    );
    console.log(`Public Catalog Exposure: ${pubRes.rows[0].count} rows (Expected: 0).`);
  } finally {
    try { await client.query('RESET ROLE'); } catch {}
    client.release();
    await pool.end();
    connector.close();
  }
}

main().catch(console.error);
