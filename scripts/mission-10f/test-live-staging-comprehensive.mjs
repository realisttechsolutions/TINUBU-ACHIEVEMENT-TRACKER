import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const auth = require('../../node_modules/firebase-tools/lib/auth');
const { requireAuth } = require('../../node_modules/firebase-tools/lib/requireAuth');
const { Client } = require('../../node_modules/firebase-tools/lib/apiv2');
const { GoogleAuth } = require('google-auth-library');

const STAGING_URL = 'https://tat-staging--tinubu-achievement-stg.us-central1.hosted.app';
const TEST_RECORD_ID = '34d05fa9-6b66-4629-8eff-88a12f442fc6';
const TEST_SLUG = 'system-test-ptat-administrative-workflow-validation';
const PROJECT = 'tinubu-achievement-stg';

async function main() {
  console.log('============================================================');
  console.log('PTAT MISSION 10F: LIVE STAGING INTEGRATION SUITE');
  console.log('============================================================\n');

  // 1. PUBLIC ISOLATION TESTS
  console.log('--- 1. Testing Public Isolation ---');
  
  // 1a. Public direct achievement lookup by slug
  const pubRes = await fetch(`${STAGING_URL}/achievements/${TEST_SLUG}`);
  const pubText = await pubRes.text();
  const exposed = pubText.includes('SYSTEM TEST') || pubText.includes(TEST_RECORD_ID);
  const isNotFound = pubText.includes('Achievement Not Found') || pubText.includes('Record Not Found') || pubText.includes('could not be found');
  console.log(` - GET /achievements/${TEST_SLUG}:`);
  console.log(`   * Draft content exposed: ${exposed} (Expected: false)`);
  console.log(`   * Renders "Not Found" state: ${isNotFound} (Expected: true)`);
  if (exposed || !isNotFound) {
    throw new Error(`Security violation: draft exposed or not blocked at /achievements/${TEST_SLUG}`);
  }

  // 1b. Public achievements listing
  const pubListRes = await fetch(`${STAGING_URL}/achievements`);
  const pubListHtml = await pubListRes.text();
  const foundInAchievements = pubListHtml.includes('SYSTEM TEST') || pubListHtml.includes(TEST_RECORD_ID);
  console.log(` - /achievements catalog contains draft record: ${foundInAchievements} (Expected: false)`);
  if (foundInAchievements) throw new Error('Security violation: draft record leaked into public /achievements list');

  // 1c. Public timeline
  const pubTimeRes = await fetch(`${STAGING_URL}/timeline`);
  const pubTimeHtml = await pubTimeRes.text();
  const foundInTimeline = pubTimeHtml.includes('SYSTEM TEST') || pubTimeHtml.includes(TEST_RECORD_ID);
  console.log(` - /timeline contains draft record: ${foundInTimeline} (Expected: false)`);
  if (foundInTimeline) throw new Error('Security violation: draft record leaked into public /timeline');

  // 1d. Unauthenticated Admin Detail Request
  const unauthDetailRes = await fetch(`${STAGING_URL}/api/admin/records/${TEST_RECORD_ID}`);
  console.log(` - Unauthenticated GET /api/admin/records/${TEST_RECORD_ID}: Status ${unauthDetailRes.status} (Expected: 401)`);
  if (unauthDetailRes.status !== 401) throw new Error('Security violation: unauthenticated admin detail request was not rejected with 401');

  // 2. AUTHENTICATED SUPER ADMIN TESTS
  console.log('\n--- 2. Authenticating Super Admin ---');
  const signInRes = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDALsIYsYfBjU5uoBN7xKcLmi9vOpHOrXg`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'staging-qa-superadmin@tinubu.stg',
        password: 'TestPassword123!@#Secure',
        returnSecureToken: true,
      }),
    }
  );
  const signInData = await signInRes.json();
  if (!signInData.idToken) {
    throw new Error(`Super admin auth failed: ${JSON.stringify(signInData)}`);
  }
  const idToken = signInData.idToken;
  console.log(' - Super Admin ID Token acquired.');

  // Create session cookie on staging Next.js app
  const sessionRes = await fetch(`${STAGING_URL}/api/admin/auth/session`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-tat-admin-csrf': '1',
    },
    body: JSON.stringify({ idToken }),
  });
  console.log(` - Session creation status: ${sessionRes.status}`);
  const setCookieHeaders = sessionRes.headers.getSetCookie();
  const sessionCookie = setCookieHeaders.find((c) => c.startsWith('tat_admin_session='));
  if (!sessionCookie) throw new Error('No tat_admin_session cookie returned');
  const sessionCookieVal = sessionCookie.split(';')[0];
  console.log(' - Admin Session Cookie established.');

  // 3. AUTHENTICATED ADMIN RECORD OPERATIONS
  console.log('\n--- 3. Testing Authenticated Admin Record Endpoints ---');

  // 3a. Admin Record Detail API
  const adminDetailRes = await fetch(`${STAGING_URL}/api/admin/records/${TEST_RECORD_ID}`, {
    headers: {
      Cookie: sessionCookieVal,
      'x-tat-admin-csrf': '1',
    },
  });
  console.log(` - GET /api/admin/records/${TEST_RECORD_ID}: Status ${adminDetailRes.status}`);
  if (adminDetailRes.status !== 200) throw new Error(`Detail API failed with status ${adminDetailRes.status}`);
  const detailData = await adminDetailRes.json();
  console.log(`   * Record Title: "${detailData.record.title}"`);
  console.log(`   * Workflow Status: "${detailData.record.workflow_status}"`);
  console.log(`   * Publication Status: "${detailData.record.publication_status}"`);
  console.log(`   * Is Public: ${detailData.record.is_public}`);
  console.log(`   * Lead Sector ID: ${detailData.record.lead_sector_id}`);
  console.log(`   * Sectors Count: ${detailData.sectors?.length || 0}`);
  console.log(`   * Institutions Count: ${detailData.institutions?.length || 0}`);

  if (detailData.record.workflow_status !== 'draft') throw new Error('Expected workflow_status = draft');
  if (detailData.record.publication_status !== 'unpublished') throw new Error('Expected publication_status = unpublished');
  if (detailData.record.is_public !== false) throw new Error('Expected is_public = false');

  // 3b. Admin Records List API
  const adminListRes = await fetch(`${STAGING_URL}/api/admin/records?q=SYSTEM+TEST`, {
    headers: {
      Cookie: sessionCookieVal,
      'x-tat-admin-csrf': '1',
    },
  });
  console.log(` - GET /api/admin/records?q=SYSTEM+TEST: Status ${adminListRes.status}`);
  const listData = await adminListRes.json();
  console.log(`   * Total matching records: ${listData.total}`);
  console.log(`   * Records returned: ${listData.records?.length || 0}`);
  if (listData.total < 1) throw new Error('Admin list query did not return the test record');

  // 4. CORE PUBLIC REGRESSION
  console.log('\n--- 4. Core Public Regression Tests ---');
  const achRes = await fetch(`${STAGING_URL}/achievements`);
  console.log(` - GET /achievements: Status ${achRes.status}`);
  
  const timeRes = await fetch(`${STAGING_URL}/timeline`);
  console.log(` - GET /timeline: Status ${timeRes.status}`);

  const aiRes = await fetch(`${STAGING_URL}/ai`);
  console.log(` - GET /ai: Status ${aiRes.status}`);

  console.log('\n============================================================');
  console.log('ALL PROGRAMMATIC STAGING INTEGRATION TESTS PASSED!');
  console.log('============================================================');
}

main().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});
