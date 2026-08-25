import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const auth = require('../../node_modules/firebase-tools/lib/auth');
const { requireAuth } = require('../../node_modules/firebase-tools/lib/requireAuth');
const apiv2 = require('../../node_modules/firebase-tools/lib/apiv2');
import { createFirebaseIamDatabase } from '../mission-10c/firebase-iam-pg.mjs';

const PROJECT = 'tinubu-achievement-stg';
const headers = { 'x-goog-user-project': PROJECT };

async function main() {
  const account = auth.getGlobalDefaultAccount();
  await requireAuth({ ...account, project: PROJECT });
  const token = await apiv2.getAccessToken();

  console.log('--- 1. Inspecting Firebase Auth User: realisttechsolutions@gmail.com ---');
  const lookupRes = await fetch(
    `https://identitytoolkit.googleapis.com/v1/projects/${PROJECT}/accounts:lookup`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...headers,
      },
      body: JSON.stringify({ email: ['realisttechsolutions@gmail.com'] }),
    }
  );
  const lookupData = await lookupRes.json();
  const user = lookupData.users?.[0];
  console.log('Firebase Auth User:');
  console.log(` - UID: ${user?.localId}`);
  console.log(` - Email: ${user?.email}`);
  console.log(` - Email Verified: ${user?.emailVerified}`);
  console.log(` - Custom Attributes: ${user?.customAttributes}\n`);

  console.log('--- 2. Connecting to Cloud SQL Staging to inspect actor_profiles schema & rows ---');
  const db = await createFirebaseIamDatabase();
  try {
    // Check columns of actor_profiles
    const colsRes = await db.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'actor_profiles'
      ORDER BY ordinal_position
    `);
    console.log('actor_profiles Table Columns:');
    for (const c of colsRes.rows) {
      console.log(` - ${c.column_name} (${c.data_type}, nullable: ${c.is_nullable})`);
    }

    // Check all existing rows in actor_profiles
    const rowsRes = await db.query(`
      SELECT * FROM actor_profiles
    `);
    console.log(`\nactor_profiles Existing Rows (${rowsRes.rows.length}):`);
    for (const r of rowsRes.rows) {
      console.log(JSON.stringify(r, null, 2));
    }
  } finally {
    await db.close();
  }
}

main().catch(console.error);
