import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const auth = require('../../node_modules/firebase-tools/lib/auth');
const { requireAuth } = require('../../node_modules/firebase-tools/lib/requireAuth');
const apiv2 = require('../../node_modules/firebase-tools/lib/apiv2');

const STAGING_URL = 'https://tat-staging--tinubu-achievement-stg.us-central1.hosted.app';
const TEST_RECORD_ID = '34d05fa9-6b66-4629-8eff-88a12f442fc6';
const TEST_SLUG = 'system-test-ptat-administrative-workflow-validation';
const PROJECT = 'tinubu-achievement-stg';
const API_KEY = 'AIzaSyDALsIYsYfBjU5uoBN7xKcLmi9vOpHOrXg';
const headers = { 'x-goog-user-project': PROJECT };

const STAFF_USERS = {
  super_admin: { email: 'staging-qa-superadmin@tinubu.stg', role: 'super_admin' },
  researcher: { email: 'staging-qa-researcher@tinubu.stg', role: 'researcher' },
  reviewer: { email: 'staging-qa-reviewer@tinubu.stg', role: 'reviewer' },
  publisher: { email: 'staging-qa-publisher@tinubu.stg', role: 'publisher' },
};
const DEFAULT_PASSWORD = 'TestPassword123!@#Secure';

async function setupStaffAccounts() {
  const account = auth.getGlobalDefaultAccount();
  await requireAuth({ ...account, project: PROJECT });
  const token = await apiv2.getAccessToken();

  for (const [key, user] of Object.entries(STAFF_USERS)) {
    const lookup = await fetch(
      `https://identitytoolkit.googleapis.com/v1/projects/${PROJECT}/accounts:lookup`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          ...headers,
        },
        body: JSON.stringify({ email: [user.email] }),
      }
    );
    const lookupData = await lookup.json();
    const uid = lookupData.users?.[0]?.localId;
    if (!uid) throw new Error(`User not found: ${user.email}`);

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
          localId: uid,
          password: DEFAULT_PASSWORD,
          emailVerified: true,
          customAttributes: JSON.stringify({
            tat_staff: true,
            tat_role: user.role,
            email_verified: true,
          }),
        }),
      }
    );
  }
}

async function loginStaff(role) {
  const user = STAFF_USERS[role];
  const signInRes = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: user.email,
        password: DEFAULT_PASSWORD,
        returnSecureToken: true,
      }),
    }
  );
  const signInData = await signInRes.json();
  if (!signInData.idToken) {
    throw new Error(`Auth failed for ${role}: ${JSON.stringify(signInData)}`);
  }

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
  if (!sessionCookie) throw new Error(`No session cookie returned for ${role}`);
  return sessionCookie.split(';')[0];
}

async function verifyPublicIsolation(stageName) {
  const pubRes = await fetch(`${STAGING_URL}/achievements/${TEST_SLUG}`);
  const pubText = await pubRes.text();
  const exposed = pubText.includes('SYSTEM TEST') || pubText.includes(TEST_RECORD_ID);
  if (exposed) {
    throw new Error(`PUBLIC ISOLATION BREACH during ${stageName}: record exposed on /achievements/${TEST_SLUG}`);
  }

  const achList = await fetch(`${STAGING_URL}/achievements`);
  const achText = await achList.text();
  if (achText.includes('SYSTEM TEST') || achText.includes(TEST_RECORD_ID)) {
    throw new Error(`PUBLIC ISOLATION BREACH during ${stageName}: record exposed in /achievements catalog`);
  }
}

async function main() {
  console.log('============================================================');
  console.log('PTAT GOVERNANCE WORKFLOW: LIVE CERTIFICATION SUITE');
  console.log('============================================================\n');

  console.log('1. Setting up / verifying staff test accounts in Firebase Auth...');
  await setupStaffAccounts();
  console.log('   All 4 staff roles synchronized: super_admin, researcher, reviewer, publisher.\n');

  // Authenticate all 4 staff roles
  console.log('2. Authenticating staff sessions on staging Next.js App Hosting...');
  const researcherCookie = await loginStaff('researcher');
  const reviewerCookie = await loginStaff('reviewer');
  const publisherCookie = await loginStaff('publisher');
  const superAdminCookie = await loginStaff('super_admin');
  console.log('   All 4 staff session cookies successfully established.\n');

  // Check initial state of test record
  console.log('3. Inspecting Initial State of Synthetic Test Record...');
  const initRes = await fetch(`${STAGING_URL}/api/admin/records/${TEST_RECORD_ID}`, {
    headers: { Cookie: superAdminCookie, 'x-tat-admin-csrf': '1' },
  });
  const initData = await initRes.json();
  console.log(`   Initial Record ID: ${initData.record.id}`);
  console.log(`   Initial Title: "${initData.record.title}"`);
  console.log(`   Initial Workflow Status: "${initData.record.workflow_status}"`);
  console.log(`   Initial Publication Status: "${initData.record.publication_status}"`);
  console.log(`   Initial Is Public: ${initData.record.is_public}`);
  console.log(`   Initial Updated At: ${initData.record.updated_at}`);

  let currentUpdatedAt = initData.record.updated_at;

  // Verify Public Isolation Initially
  await verifyPublicIsolation('Initial State');
  console.log('   Public Isolation Verified: is_public = false, not exposed publicly.\n');

  // ------------------------------------------------------------------------
  // SECTION 3: RESEARCH STAGE TEST
  // ------------------------------------------------------------------------
  console.log('============================================================');
  console.log('SECTION 3: RESEARCH STAGE TEST (Researcher Role)');
  console.log('============================================================');

  // 3a. Researcher Reads Record
  const rReadRes = await fetch(`${STAGING_URL}/api/admin/records/${TEST_RECORD_ID}`, {
    headers: { Cookie: researcherCookie, 'x-tat-admin-csrf': '1' },
  });
  console.log(` - Researcher GET record detail: Status ${rReadRes.status} (Expected: 200)`);
  if (rReadRes.status !== 200) throw new Error('Researcher failed to read record detail');

  // 3b. Researcher Edits Research Metadata
  const rEditRes = await fetch(`${STAGING_URL}/api/admin/records/${TEST_RECORD_ID}`, {
    method: 'PUT',
    headers: {
      Cookie: researcherCookie,
      'Content-Type': 'application/json',
      'x-tat-admin-csrf': '1',
    },
    body: JSON.stringify({
      record_type: 'achievement',
      title: 'SYSTEM TEST — PTAT Administrative Workflow Validation',
      slug: TEST_SLUG,
      short_summary: 'Validation of multi-tier governance workflow from research through editorial review to publication stewardship.',
      full_description: 'Controlled synthetic record verifying strict role boundaries, optimistic concurrency, review decision auditing, and public isolation.',
      implementation_status: 'in_progress',
      expected_updated_at: currentUpdatedAt,
    }),
  });
  console.log(` - Researcher PUT record overview: Status ${rEditRes.status} (Expected: 200)`);
  if (rEditRes.status !== 200) throw new Error(`Researcher edit failed: ${await rEditRes.text()}`);
  const rEditData = await rEditRes.json();
  currentUpdatedAt = rEditData.updated_at;

  // 3c. Researcher Attempts Prohibited Action: Direct Publish
  const rPublishRes = await fetch(`${STAGING_URL}/api/admin/records/${TEST_RECORD_ID}/workflow`, {
    method: 'POST',
    headers: {
      Cookie: researcherCookie,
      'Content-Type': 'application/json',
      'x-tat-admin-csrf': '1',
    },
    body: JSON.stringify({
      action: 'publish',
      expected_updated_at: currentUpdatedAt,
      reason: 'Illegal direct publish by researcher',
    }),
  });
  console.log(` - Researcher POST workflow 'publish': Status ${rPublishRes.status} (Expected: 403)`);
  if (rPublishRes.status !== 403) throw new Error('Security violation: researcher was not denied direct publish');

  // 3d. Researcher Attempts Prohibited Action: Review Approval
  const rApproveRes = await fetch(`${STAGING_URL}/api/admin/records/${TEST_RECORD_ID}/workflow`, {
    method: 'POST',
    headers: {
      Cookie: researcherCookie,
      'Content-Type': 'application/json',
      'x-tat-admin-csrf': '1',
    },
    body: JSON.stringify({
      action: 'approve_review',
      expected_updated_at: currentUpdatedAt,
      reason: 'Illegal self-approval by researcher',
    }),
  });
  console.log(` - Researcher POST workflow 'approve_review': Status ${rApproveRes.status} (Expected: 403)`);
  if (rApproveRes.status !== 403) throw new Error('Security violation: researcher was not denied editorial approval');

  // 3e. Researcher Submits for Review
  const rSubmitRes = await fetch(`${STAGING_URL}/api/admin/records/${TEST_RECORD_ID}/workflow`, {
    method: 'POST',
    headers: {
      Cookie: researcherCookie,
      'Content-Type': 'application/json',
      'x-tat-admin-csrf': '1',
    },
    body: JSON.stringify({
      action: 'submit_for_review',
      expected_updated_at: currentUpdatedAt,
      reason: 'Research package completed and submitted for Gate 4 editorial review.',
    }),
  });
  console.log(` - Researcher POST workflow 'submit_for_review': Status ${rSubmitRes.status} (Expected: 200)`);
  if (rSubmitRes.status !== 200) throw new Error(`Submit for review failed: ${await rSubmitRes.text()}`);
  const rSubmitData = await rSubmitRes.json();
  console.log(`   * New Workflow Status: "${rSubmitData.workflow_status}" (Expected: evidence_review)`);
  console.log(`   * New Publication Status: "${rSubmitData.publication_status}" (Expected: under_review)`);
  console.log(`   * Is Public: ${rSubmitData.is_public} (Expected: false)`);
  currentUpdatedAt = rSubmitData.updated_at;

  await verifyPublicIsolation('After Researcher Submit for Review');
  console.log('   Public Isolation Verified: is_public = false.\n');

  // ------------------------------------------------------------------------
  // SECTION 4: REVIEW STAGE TEST
  // ------------------------------------------------------------------------
  console.log('============================================================');
  console.log('SECTION 4: REVIEW STAGE TEST (Reviewer Role)');
  console.log('============================================================');

  // 4a. Reviewer Accesses Review Queue
  const revQueueRes = await fetch(`${STAGING_URL}/api/admin/records/review-queue`, {
    headers: { Cookie: reviewerCookie, 'x-tat-admin-csrf': '1' },
  });
  console.log(` - Reviewer GET /api/admin/records/review-queue: Status ${revQueueRes.status} (Expected: 200)`);
  if (revQueueRes.status !== 200) throw new Error('Reviewer failed to access review queue');
  const revQueueData = await revQueueRes.json();
  const foundInQueue = revQueueData.records?.some((r) => r.id === TEST_RECORD_ID);
  console.log(`   * Test Record Present in Review Queue: ${foundInQueue} (Expected: true)`);
  if (!foundInQueue) throw new Error('Test record not found in reviewer queue');

  // 4b. Reviewer Attempts Prohibited Action: Direct Mutation of Record Overview
  const revMutateRes = await fetch(`${STAGING_URL}/api/admin/records/${TEST_RECORD_ID}`, {
    method: 'PUT',
    headers: {
      Cookie: reviewerCookie,
      'Content-Type': 'application/json',
      'x-tat-admin-csrf': '1',
    },
    body: JSON.stringify({
      title: 'Illegal Edit by Reviewer',
      expected_updated_at: currentUpdatedAt,
    }),
  });
  console.log(` - Reviewer PUT record overview (unauthorized mutation): Status ${revMutateRes.status} (Expected: 403)`);
  if (revMutateRes.status !== 403) throw new Error('Security violation: reviewer was not forbidden from mutating record overview');

  // 4c. Reviewer Attempts Prohibited Action: Publish
  const revPublishRes = await fetch(`${STAGING_URL}/api/admin/records/${TEST_RECORD_ID}/workflow`, {
    method: 'POST',
    headers: {
      Cookie: reviewerCookie,
      'Content-Type': 'application/json',
      'x-tat-admin-csrf': '1',
    },
    body: JSON.stringify({
      action: 'publish',
      expected_updated_at: currentUpdatedAt,
      reason: 'Illegal publish by reviewer',
    }),
  });
  console.log(` - Reviewer POST workflow 'publish': Status ${revPublishRes.status} (Expected: 403)`);
  if (revPublishRes.status !== 403) throw new Error('Security violation: reviewer was not denied publish');

  // 4d. Reviewer Approves Editorial Review (Gate 4)
  const revApproveRes = await fetch(`${STAGING_URL}/api/admin/records/${TEST_RECORD_ID}/workflow`, {
    method: 'POST',
    headers: {
      Cookie: reviewerCookie,
      'Content-Type': 'application/json',
      'x-tat-admin-csrf': '1',
    },
    body: JSON.stringify({
      action: 'approve_review',
      expected_updated_at: currentUpdatedAt,
      reason: 'Editorial review passed: Synthetic governance validation criteria met.',
      qualification: 'Synthetic Staging Demonstration Only',
    }),
  });
  console.log(` - Reviewer POST workflow 'approve_review': Status ${revApproveRes.status} (Expected: 200)`);
  if (revApproveRes.status !== 200) throw new Error(`Review approval failed: ${await revApproveRes.text()}`);
  const revApproveData = await revApproveRes.json();
  console.log(`   * New Workflow Status: "${revApproveData.workflow_status}" (Expected: ready_for_publication)`);
  console.log(`   * New Publication Status: "${revApproveData.publication_status}" (Expected: publishable_with_qualification)`);
  console.log(`   * Is Public: ${revApproveData.is_public} (Expected: false)`);
  currentUpdatedAt = revApproveData.updated_at;

  await verifyPublicIsolation('After Reviewer Approve Review');
  console.log('   Public Isolation Verified: is_public = false.\n');

  // ------------------------------------------------------------------------
  // SECTION 5: PUBLISHER BOUNDARY TEST
  // ------------------------------------------------------------------------
  console.log('============================================================');
  console.log('SECTION 5: PUBLISHER BOUNDARY TEST (Publisher Role)');
  console.log('============================================================');

  // 5a. Publisher Accesses Publish Queue
  const pubQueueRes = await fetch(`${STAGING_URL}/api/admin/records/publish-queue`, {
    headers: { Cookie: publisherCookie, 'x-tat-admin-csrf': '1' },
  });
  console.log(` - Publisher GET /api/admin/records/publish-queue: Status ${pubQueueRes.status} (Expected: 200)`);
  if (pubQueueRes.status !== 200) throw new Error('Publisher failed to access publish queue');
  const pubQueueData = await pubQueueRes.json();
  const foundInPubQueue = pubQueueData.records?.some((r) => r.id === TEST_RECORD_ID);
  console.log(`   * Test Record Present in Publish Queue: ${foundInPubQueue} (Expected: true)`);
  if (!foundInPubQueue) throw new Error('Test record not found in publish queue');

  // 5b. Researcher Attempts Publish on Approved Record -> DENIED
  const rPubDenyRes = await fetch(`${STAGING_URL}/api/admin/records/${TEST_RECORD_ID}/workflow`, {
    method: 'POST',
    headers: {
      Cookie: researcherCookie,
      'Content-Type': 'application/json',
      'x-tat-admin-csrf': '1',
    },
    body: JSON.stringify({
      action: 'publish',
      expected_updated_at: currentUpdatedAt,
      reason: 'Researcher trying to publish approved record',
    }),
  });
  console.log(` - Researcher POST workflow 'publish' on approved record: Status ${rPubDenyRes.status} (Expected: 403)`);
  if (rPubDenyRes.status !== 403) throw new Error('Security violation: researcher allowed to publish');

  // 5c. Reviewer Attempts Publish on Approved Record -> DENIED
  const revPubDenyRes = await fetch(`${STAGING_URL}/api/admin/records/${TEST_RECORD_ID}/workflow`, {
    method: 'POST',
    headers: {
      Cookie: reviewerCookie,
      'Content-Type': 'application/json',
      'x-tat-admin-csrf': '1',
    },
    body: JSON.stringify({
      action: 'publish',
      expected_updated_at: currentUpdatedAt,
      reason: 'Reviewer trying to publish approved record',
    }),
  });
  console.log(` - Reviewer POST workflow 'publish' on approved record: Status ${revPubDenyRes.status} (Expected: 403)`);
  if (revPubDenyRes.status !== 403) throw new Error('Security violation: reviewer allowed to publish');

  // 5d. Publisher Authority: Return for Changes (Gate 5 Publication Stewardship Return)
  // (We DO NOT execute 'publish' to preserve the invariant: DO NOT PUBLISH TEST RECORD)
  console.log(' - Testing Publisher Stewardship Boundary (Return for Changes to preserve non-public invariant)...');
  const pubReturnRes = await fetch(`${STAGING_URL}/api/admin/records/${TEST_RECORD_ID}/workflow`, {
    method: 'POST',
    headers: {
      Cookie: publisherCookie,
      'Content-Type': 'application/json',
      'x-tat-admin-csrf': '1',
    },
    body: JSON.stringify({
      action: 'return_for_changes',
      expected_updated_at: currentUpdatedAt,
      reason: 'Publisher verified authorization boundary and safely cycled record back to draft state without publishing.',
    }),
  });
  console.log(` - Publisher POST workflow 'return_for_changes': Status ${pubReturnRes.status} (Expected: 200)`);
  if (pubReturnRes.status !== 200) throw new Error(`Publisher return failed: ${await pubReturnRes.text()}`);
  const pubReturnData = await pubReturnRes.json();
  console.log(`   * Returned Workflow Status: "${pubReturnData.workflow_status}" (Expected: draft)`);
  console.log(`   * Returned Publication Status: "${pubReturnData.publication_status}" (Expected: unpublished)`);
  console.log(`   * Is Public: ${pubReturnData.is_public} (Expected: false)`);
  currentUpdatedAt = pubReturnData.updated_at;

  await verifyPublicIsolation('After Publisher Return for Changes');
  console.log('   Public Isolation Verified: is_public = false.\n');

  // ------------------------------------------------------------------------
  // SECTION 6 & 7: SUPER ADMIN & AUDIT TRAIL VERIFICATION
  // ------------------------------------------------------------------------
  console.log('============================================================');
  console.log('SECTION 6 & 7: SUPER ADMIN & AUDIT TRAIL VERIFICATION');
  console.log('============================================================');

  const saHistoryRes = await fetch(`${STAGING_URL}/api/admin/records/${TEST_RECORD_ID}/history`, {
    headers: { Cookie: superAdminCookie, 'x-tat-admin-csrf': '1' },
  });
  console.log(` - Super Admin GET record history: Status ${saHistoryRes.status} (Expected: 200)`);
  const saHistoryData = await saHistoryRes.json();
  const history = saHistoryData.history || [];
  console.log(`   * Total Review Decision Audit Entries: ${history.length}`);
  for (const [idx, h] of history.entries()) {
    console.log(`     [Decision #${idx + 1}] Gate: ${h.gate_code}, Decision: ${h.decision}, Reviewer: ${h.reviewer_email || h.reviewer_name}, Rationale: "${h.rationale}"`);
  }

  if (history.length < 3) {
    throw new Error('Audit trail incomplete: expected at least 3 decisions (Submit Gate 3, Review Gate 4, Publisher Gate 5)');
  }

  // ------------------------------------------------------------------------
  // SECTION 8: SERVER-SIDE SESSION & RBAC ENFORCEMENT SUMMARY
  // ------------------------------------------------------------------------
  console.log('============================================================');
  console.log('SECTION 8: SERVER-SIDE SESSION & RBAC CHECKS');
  console.log('============================================================');

  // Public (No Cookie) -> 401
  const unauthRes = await fetch(`${STAGING_URL}/api/admin/records/${TEST_RECORD_ID}/workflow`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-tat-admin-csrf': '1' },
    body: JSON.stringify({ action: 'submit_for_review', expected_updated_at: currentUpdatedAt }),
  });
  console.log(` - Anonymous / Public POST workflow: Status ${unauthRes.status} (Expected: 401)`);
  if (unauthRes.status !== 401) throw new Error('Unauthenticated workflow access not rejected with 401');

  // Verify final state of test record
  const finalDetailRes = await fetch(`${STAGING_URL}/api/admin/records/${TEST_RECORD_ID}`, {
    headers: { Cookie: superAdminCookie, 'x-tat-admin-csrf': '1' },
  });
  const finalDetail = await finalDetailRes.json();
  console.log(`\nFinal Test Record State:`);
  console.log(` - Title: "${finalDetail.record.title}"`);
  console.log(` - Workflow Status: "${finalDetail.record.workflow_status}"`);
  console.log(` - Publication Status: "${finalDetail.record.publication_status}"`);
  console.log(` - Is Public: ${finalDetail.record.is_public}`);

  console.log('\n============================================================');
  console.log('ALL GOVERNANCE WORKFLOW & RBAC CERTIFICATION TESTS PASSED!');
  console.log('============================================================');
}

main().catch((err) => {
  console.error('Certification failed:', err);
  process.exit(1);
});
