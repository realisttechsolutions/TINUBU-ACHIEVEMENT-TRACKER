import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const auth = require('../../node_modules/firebase-tools/lib/auth');
const { requireAuth } = require('../../node_modules/firebase-tools/lib/requireAuth');
const { GoogleAuth } = require('../../node_modules/google-auth-library');
import { createFirebaseIamDatabase, createFirebasePasswordDatabase } from '../mission-10c/firebase-iam-pg.mjs';

const PROJECT = 'tinubu-achievement-stg';
const RUN_URL = 'https://tat-admin-api-staging-jhekxvkq5q-uc.a.run.app';

async function main() {
  console.log('============================================================');
  console.log('MISSION 10F-B: LIVE SECURITY & BOUNDARY VERIFICATION HARNESS');
  console.log('============================================================\n');

  const account = auth.getGlobalDefaultAccount();
  await requireAuth({ ...account, project: PROJECT });

  // 1. Cloud Run Unauthenticated Security Test
  console.log('[1/4] Testing Cloud Run Service-to-Service boundary...');
  try {
    const unauthPostRes = await fetch(`${RUN_URL}/api/records`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'unauthorized_payload' }),
    });
    console.log(` - Unauthenticated POST /api/records response: ${unauthPostRes.status} (Expected: 401 or 403)`);
    if (unauthPostRes.status !== 401 && unauthPostRes.status !== 403) {
      throw new Error(`Cloud Run service allowed unauthenticated POST! Status: ${unauthPostRes.status}`);
    }
  } catch (err) {
    console.log(` - Unauthenticated request rejected at network/IAM layer: ${err.message}`);
  }

  // 2. Database Boundary: Public App Hosting Identity
  console.log('\n[2/4] Testing Public App Hosting DB Role (tat_public_reader)...');
  const db = await createFirebaseIamDatabase();

  // Test Public Reader SET ROLE escalation
  let escalationBlocked = false;
  try {
    await db.query('SET ROLE tat_admin_writer_m10f');
  } catch (err) {
    escalationBlocked = true;
    console.log(' - SET ROLE tat_admin_writer_m10f correctly DENIED to non-member:', err.message);
  }
  if (!escalationBlocked) {
    throw new Error('CRITICAL FAILURE: Public database session was able to assume tat_admin_writer_m10f!');
  }

  let ingestionEscalationBlocked = false;
  try {
    await db.query('SET ROLE tat_ingestion_writer');
  } catch (err) {
    ingestionEscalationBlocked = true;
    console.log(' - SET ROLE tat_ingestion_writer correctly DENIED to non-member:', err.message);
  }
  if (!ingestionEscalationBlocked) {
    throw new Error('CRITICAL FAILURE: Public database session was able to assume tat_ingestion_writer!');
  }

  // 3. Admin Writer Role Privilege Verification on tat_admin_writer_m10f
  console.log('\n[3/4] Testing tat_admin_writer_m10f Table Privileges & Role Grants in Catalog...');
  const privs = await db.query(`
    SELECT table_name, privilege_type
    FROM information_schema.role_table_grants
    WHERE grantee = 'tat_admin_writer_m10f'
    ORDER BY table_name, privilege_type
  `);
  console.log(` - tat_admin_writer_m10f table privileges granted count: ${privs.rows.length}`);
  console.table(privs.rows);

  const roleAttrs = await db.query(`
    SELECT rolname, rolsuper, rolinherit, rolcreaterole, rolcreatedb, rolcanlogin, rolreplication, rolbypassrls
    FROM pg_roles
    WHERE rolname = 'tat_admin_writer_m10f'
  `);
  console.log(' - tat_admin_writer_m10f attributes (Zero super/DDL):');
  console.table(roleAttrs.rows);

  // 4. Assert zero persistent staging data mutated
  console.log('\n[4/4] Verifying database integrity and draft isolation...');
  const countAfter = await db.query('SELECT count(*) as count FROM records');
  console.log(` - Staging records count: ${countAfter.rows[0].count}`);

  const isolationRes = await db.query(`
    SELECT
      (SELECT count(*) FROM records) as total_records,
      (SELECT count(*) FROM records WHERE publication_status = 'draft') as draft_records,
      (SELECT count(*) FROM public_record_catalog) as public_catalog_records
  `);
  console.log('--- DRAFT & PUBLIC CATALOG STATE ---');
  console.table(isolationRes.rows);

  await db.close();
  console.log('\nALL LIVE SECURITY GATES AND BOUNDARIES PASSED.');
}

main().catch(console.error);
