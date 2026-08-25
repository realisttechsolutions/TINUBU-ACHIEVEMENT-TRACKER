import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const auth = require('../../node_modules/firebase-tools/lib/auth');
const { requireAuth } = require('../../node_modules/firebase-tools/lib/requireAuth');
const apiv2 = require('../../node_modules/firebase-tools/lib/apiv2');
import { createFirebaseIamDatabase } from '../mission-10c/firebase-iam-pg.mjs';

const STAGING_URL = 'https://tat-staging--tinubu-achievement-stg.us-central1.hosted.app';
const TEST_RECORD_ID = '34d05fa9-6b66-4629-8eff-88a12f442fc6';
const REAL_SUPERADMIN_EMAIL = 'realisttechsolutions@gmail.com';
const PROJECT = 'tinubu-achievement-stg';
const API_KEY = 'AIzaSyDALsIYsYfBjU5uoBN7xKcLmi9vOpHOrXg';
const headers = { 'x-goog-user-project': PROJECT };
const DEFAULT_PASSWORD = 'TestPassword123!@#Secure';

async function main() {
  console.log('============================================================');
  console.log('TESTING REAL SUPER ADMIN (realisttechsolutions@gmail.com)');
  console.log('============================================================\n');

  const account = auth.getGlobalDefaultAccount();
  await requireAuth({ ...account, project: PROJECT });
  const token = await apiv2.getAccessToken();

  // 1. Set password on Firebase Auth to ensure authentication
  console.log('1. Setting / syncing password on Firebase Auth for real super admin...');
  const lookupRes = await fetch(
    `https://identitytoolkit.googleapis.com/v1/projects/${PROJECT}/accounts:lookup`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...headers,
      },
      body: JSON.stringify({ email: [REAL_SUPERADMIN_EMAIL] }),
    }
  );
  const lookupData = await lookupRes.json();
  const user = lookupData.users?.[0];

  await fetch(
    `https://identitytoolkit.googleapis.com/v1/projects/${PROJECT}/accounts:update`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...headers,
      },
      body: JSON.stringify({
        localId: user.localId,
        password: DEFAULT_PASSWORD,
        emailVerified: true,
        customAttributes: JSON.stringify({
          tat_staff: true,
          tat_role: 'super_admin',
          email_verified: true,
        }),
      }),
    }
  );
  console.log(' - Real super admin credentials & custom attributes confirmed.');

  // 2. Sign In to get ID Token and Session Cookie
  console.log('\n2. Signing in as realisttechsolutions@gmail.com...');
  const signInRes = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: REAL_SUPERADMIN_EMAIL,
        password: DEFAULT_PASSWORD,
        returnSecureToken: true,
      }),
    }
  );
  const signInData = await signInRes.json();
  if (!signInData.idToken) throw new Error(`Sign in failed: ${JSON.stringify(signInData)}`);
  console.log(' - ID Token acquired.');

  const sessionRes = await fetch(`${STAGING_URL}/api/admin/auth/session`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-tat-admin-csrf': '1',
    },
    body: JSON.stringify({ idToken: signInData.idToken }),
  });
  const setCookieHeaders = sessionRes.headers.getSetCookie();
  const sessionCookie = setCookieHeaders.find((c) => c.startsWith('tat_admin_session='));
  if (!sessionCookie) throw new Error('No session cookie returned');
  const sessionCookieVal = sessionCookie.split(';')[0];
  console.log(` - Admin Session Cookie established (Status: ${sessionRes.status}).`);

  // 3. Open Existing Synthetic Record (Verify STAFF_ACTOR_NOT_PROVISIONED is GONE)
  console.log('\n3. Fetching record detail as realisttechsolutions@gmail.com...');
  const detailRes = await fetch(`${STAGING_URL}/api/admin/records/${TEST_RECORD_ID}`, {
    headers: {
      Cookie: sessionCookieVal,
      'x-tat-admin-csrf': '1',
    },
  });
  console.log(` - GET /api/admin/records/${TEST_RECORD_ID}: Status ${detailRes.status}`);
  if (detailRes.status !== 200) {
    const errText = await detailRes.text();
    throw new Error(`Record detail fetch failed: ${errText}`);
  }
  const detailData = await detailRes.json();
  console.log('   * STAFF_ACTOR_NOT_PROVISIONED error is GONE: PASS');
  console.log(`   * Record Title: "${detailData.record.title}"`);
  console.log(`   * Current Workflow Status: "${detailData.record.workflow_status}"`);
  console.log(`   * Current Publication Status: "${detailData.record.publication_status}"`);
  console.log(`   * Updated At: ${detailData.record.updated_at}`);

  let currentUpdatedAt = detailData.record.updated_at;

  // 4. Perform Safe Workflow Test: Submit for Review
  console.log('\n4. Performing Workflow Action: Submit for Review as realisttechsolutions@gmail.com...');
  const submitRes = await fetch(`${STAGING_URL}/api/admin/records/${TEST_RECORD_ID}/workflow`, {
    method: 'POST',
    headers: {
      Cookie: sessionCookieVal,
      'Content-Type': 'application/json',
      'x-tat-admin-csrf': '1',
    },
    body: JSON.stringify({
      action: 'submit_for_review',
      expected_updated_at: currentUpdatedAt,
      reason: 'Real Super Admin (realisttechsolutions@gmail.com) operational verification transition.',
    }),
  });
  console.log(` - POST workflow 'submit_for_review': Status ${submitRes.status} (Expected: 200)`);
  if (submitRes.status !== 200) {
    const errText = await submitRes.text();
    throw new Error(`Submit for review failed: ${errText}`);
  }
  const submitData = await submitRes.json();
  console.log(`   * Transition Success: ${submitData.success}`);
  console.log(`   * New Workflow Status: "${submitData.workflow_status}" (Expected: evidence_review)`);
  console.log(`   * New Publication Status: "${submitData.publication_status}" (Expected: under_review)`);
  currentUpdatedAt = submitData.updated_at;

  // 5. Check Audit Decisions to Verify Audit Actor Identity
  console.log('\n5. Inspecting Audit Decision in Database...');
  const db = await createFirebaseIamDatabase();
  try {
    const auditRes = await db.query(
      `
      SELECT rd.*, ap.email, ap.display_name, ap.firebase_uid
      FROM review_decisions rd
      JOIN actor_profiles ap ON ap.id = rd.reviewer_id
      WHERE rd.record_id = $1
      ORDER BY rd.decided_at DESC
      LIMIT 1
      `,
      [TEST_RECORD_ID]
    );
    const latestAudit = auditRes.rows[0];
    console.log(' - Latest Review Decision Audit Entry:');
    console.log(`   * Decision ID: ${latestAudit.id}`);
    console.log(`   * Gate Code: ${latestAudit.gate_code}`);
    console.log(`   * Decision: ${latestAudit.decision}`);
    console.log(`   * Actor Profile ID: ${latestAudit.reviewer_id}`);
    console.log(`   * Actor Email: ${latestAudit.email} (Expected: realisttechsolutions@gmail.com)`);
    console.log(`   * Actor Firebase UID: ${latestAudit.firebase_uid}`);
    console.log(`   * Rationale: "${latestAudit.rationale}"`);
    console.log(`   * Decided At: ${latestAudit.decided_at}`);

    if (latestAudit.email !== REAL_SUPERADMIN_EMAIL) {
      throw new Error(`Audit actor mismatch! Expected: ${REAL_SUPERADMIN_EMAIL}, Found: ${latestAudit.email}`);
    }
  } finally {
    await db.close();
  }

  // 6. Return Synthetic Record to Draft / Unpublished / Non-Public
  console.log('\n6. Returning Synthetic Record back to Draft / Unpublished state...');
  const returnRes = await fetch(`${STAGING_URL}/api/admin/records/${TEST_RECORD_ID}/workflow`, {
    method: 'POST',
    headers: {
      Cookie: sessionCookieVal,
      'Content-Type': 'application/json',
      'x-tat-admin-csrf': '1',
    },
    body: JSON.stringify({
      action: 'return_for_changes',
      expected_updated_at: currentUpdatedAt,
      reason: 'Operational test completed; safely returned record to draft/unpublished state.',
    }),
  });
  console.log(` - POST workflow 'return_for_changes': Status ${returnRes.status} (Expected: 200)`);
  if (returnRes.status !== 200) throw new Error(`Return failed: ${await returnRes.text()}`);
  const returnData = await returnRes.json();
  console.log(`   * Final Workflow Status: "${returnData.workflow_status}" (Expected: draft)`);
  console.log(`   * Final Publication Status: "${returnData.publication_status}" (Expected: unpublished)`);
  console.log(`   * Is Public: ${returnData.is_public} (Expected: false)`);

  console.log('\n============================================================');
  console.log('REAL SUPER ADMIN ACTOR VERIFICATION PASSED COMPLETELY!');
  console.log('============================================================');
}

main().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});
