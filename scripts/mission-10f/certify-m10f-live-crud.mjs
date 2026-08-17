import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const auth = require('../../node_modules/firebase-tools/lib/auth');
const { requireAuth } = require('../../node_modules/firebase-tools/lib/requireAuth');
const apiv2 = require('../../node_modules/firebase-tools/lib/apiv2');
import { createFirebaseIamDatabase } from '../mission-10c/firebase-iam-pg.mjs';

const PROJECT = 'tinubu-achievement-stg';
const APP_HOSTING_URL = 'https://tat-staging--tinubu-achievement-stg.us-central1.hosted.app';
const API_KEY = 'AIzaSyDALsIYsYfBjU5uoBN7xKcLmi9vOpHOrXg';
const headers = { 'x-goog-user-project': PROJECT };
const REQUEST_TIMEOUT_MS = 30000;

async function fetchWithTimeout(url, options = {}, retries = 3) {
  let lastError;
  for (let attempt = 1; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), options.timeout || REQUEST_TIMEOUT_MS);
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      return response;
    } catch (err) {
      lastError = err;
      if (attempt < retries) {
        await new Promise((r) => setTimeout(r, 1000 * attempt));
      }
    } finally {
      clearTimeout(id);
    }
  }
  throw lastError;
}

async function getSuperAdminSession() {
  const account = auth.getGlobalDefaultAccount();
  await requireAuth({ ...account, project: PROJECT });
  const token = await apiv2.getAccessToken();
  const email = 'staging-qa-superadmin@tinubu.stg';
  const password = 'TestPassword123!@#Secure';

  // 1. Ensure user exists & has correct claims
  let uid;
  const lookup = await fetchWithTimeout(
    `https://identitytoolkit.googleapis.com/v1/projects/${PROJECT}/accounts:lookup`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...headers,
      },
      body: JSON.stringify({ email: [email] }),
    }
  );
  const lookupData = await lookup.json();

  if (lookupData.users?.[0]) {
    uid = lookupData.users[0].localId;
    await fetchWithTimeout(
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
          password,
          emailVerified: true,
          customAttributes: JSON.stringify({
            tat_staff: true,
            tat_role: 'super_admin',
            email_verified: true,
          }),
        }),
      }
    );
  } else {
    const createRes = await fetchWithTimeout(
      `https://identitytoolkit.googleapis.com/v1/projects/${PROJECT}/accounts`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          ...headers,
        },
        body: JSON.stringify({
          email,
          password,
          emailVerified: true,
          customAttributes: JSON.stringify({
            tat_staff: true,
            tat_role: 'super_admin',
            email_verified: true,
          }),
        }),
      }
    );
    const createData = await createRes.json();
    uid = createData.localId;
  }

  // 2. Sign in with password
  const signInRes = await fetchWithTimeout(
    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        password,
        returnSecureToken: true,
      }),
    }
  );
  const signInData = await signInRes.json();
  if (!signInData.idToken) {
    throw new Error(`Sign in failed for Super Admin: ${JSON.stringify(signInData)}`);
  }

  // 3. Exchange on live App Hosting session endpoint
  const sessionRes = await fetchWithTimeout(`${APP_HOSTING_URL}/api/admin/auth/session`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-tat-admin-csrf': '1',
      'Origin': APP_HOSTING_URL,
    },
    body: JSON.stringify({ idToken: signInData.idToken }),
  });

  const cookieHeader = sessionRes.headers.get('set-cookie');
  if (!cookieHeader) {
    throw new Error(`Failed to obtain session cookie: HTTP ${sessionRes.status}`);
  }

  const match = cookieHeader.match(/tat_admin_session=([^;]+)/);
  if (!match) throw new Error('tat_admin_session cookie not found in set-cookie');

  return { sessionCookie: match[1], uid };
}

function parseArgs() {
  const args = process.argv.slice(2);
  const parsed = {
    recordId: null,
    startStep: 1,
  };
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--record-id' && args[i + 1]) {
      parsed.recordId = args[i + 1];
      i++;
    } else if (args[i] === '--start-step' && args[i + 1]) {
      parsed.startStep = parseInt(args[i + 1], 10);
      i++;
    }
  }
  return parsed;
}

async function main() {
  const { recordId: cliRecordId, startStep } = parseArgs();
  console.log('============================================================');
  console.log('MISSION 10F-C: LIVE STAGING CRUD CERTIFICATION HARNESS');
  console.log(`Resume Options: recordId=${cliRecordId || 'AUTO'}, startStep=${startStep}`);
  console.log('============================================================\n');

  let db = null;
  try {
    db = await createFirebaseIamDatabase();

    // 1. Session Setup
    console.log('[1/12] Minting Super Admin live session via App Hosting session endpoint...');
    const { sessionCookie: superAdminSession } = await getSuperAdminSession();
    console.log(' - Super Admin session successfully authenticated.');

    const superAdminHeaders = {
      'Content-Type': 'application/json',
      'x-tat-admin-csrf': '1',
      'x-tat-admin-session': superAdminSession,
      'Cookie': `tat_admin_session=${superAdminSession}`,
      'Origin': APP_HOSTING_URL,
      'Referer': `${APP_HOSTING_URL}/admin/records/new`,
    };

    // 2. Reference Data
    console.log('\n[2/12] Fetching reference data from /api/admin/reference-data...');
    const refRes = await fetchWithTimeout(`${APP_HOSTING_URL}/api/admin/reference-data`, {
      headers: superAdminHeaders,
    });
    const refData = await refRes.json();
    const sampleSectorId = refData.sectors?.[0]?.id;
    const sampleInstitutionId = refData.institutions?.[0]?.id;
    const sampleGeoId = refData.geographies?.[0]?.id;
    console.log(` - Reference data loaded: ${refData.sectors?.length} sectors, ${refData.institutions?.length} institutions, ${refData.geographies?.length} geographies.`);

    let testRecordId = cliRecordId;

    // 3. Create Draft Record (or use existing)
    if (!testRecordId && startStep <= 3) {
      console.log('\n[3/12] Creating synthetic staging draft record (Overview Create)...');
      const createPayload = {
        record_type: 'achievement',
        title: 'M10F STAGING TEST RECORD — DO NOT PUBLISH',
        slug: `m10f-test-record-${Date.now()}`,
        short_summary: 'Synthetic staging verification record created for Mission 10F-C CRUD certification.',
        full_description: 'Full synthetic description verifying draft isolation, control-plane transactions, and editor persistence.',
        lead_sector_id: sampleSectorId,
        lead_institution_id: sampleInstitutionId,
        implementation_status: 'in_progress',
        geographic_scope: 'national',
        announced_date: '2024-01-15',
        announced_date_precision: 'exact_day',
        achievement_profile: {
          milestone_type: 'Staging Operational Test',
          verified_impact_summary: 'Synthetic impact summary for testing purposes only.',
          flagship_tier: 1,
        },
        sector_ids: sampleSectorId ? [sampleSectorId] : [],
        institution_ids: sampleInstitutionId ? [sampleInstitutionId] : [],
        geographic_unit_ids: sampleGeoId ? [sampleGeoId] : [],
      };

      const createRes = await fetchWithTimeout(`${APP_HOSTING_URL}/api/admin/records`, {
        method: 'POST',
        headers: superAdminHeaders,
        body: JSON.stringify(createPayload),
      });

      const createData = await createRes.json();
      console.log(` - Create Record HTTP Status: ${createRes.status}`, createData);
      if (createRes.status !== 201 || !createData.id) {
        throw new Error(`Failed to create record: ${JSON.stringify(createData)}`);
      }
      testRecordId = createData.id;
    } else {
      if (!testRecordId) {
        testRecordId = '61ea8f9b-f32e-45b3-9aaa-88f89f422a42';
      }
      console.log(`\n[3/12] Using existing Canonical Test Record: ${testRecordId}`);
    }

    // 4. Concurrency & Overview Update
    if (startStep <= 4) {
      console.log('\n[4/12] Testing Record Overview Update & Concurrency Protection...');
      const dbRecord = await db.query(`SELECT updated_at::text, is_public, publication_status FROM records WHERE id = $1`, [testRecordId]);
      if (dbRecord.rows.length === 0) {
        throw new Error(`Record ${testRecordId} not found in database.`);
      }
      const currentUpdatedAt = dbRecord.rows[0].updated_at;
      console.log(` - Current updated_at in PostgreSQL: ${currentUpdatedAt}`);
      console.log(` - Draft status in PostgreSQL: is_public=${dbRecord.rows[0].is_public}, publication_status=${dbRecord.rows[0].publication_status}`);

      // Stale update rejection (Expected 409)
      const staleRes = await fetchWithTimeout(`${APP_HOSTING_URL}/api/admin/records/${testRecordId}`, {
        method: 'PUT',
        headers: superAdminHeaders,
        body: JSON.stringify({
          record_type: 'achievement',
          title: 'M10F STAGING TEST RECORD — DO NOT PUBLISH',
          slug: 'm10f-test-record-1786951298678',
          short_summary: 'Stale concurrency overwrite test attempt.',
          implementation_status: 'in_progress',
          geographic_scope: 'national',
          expected_updated_at: '2020-01-01T00:00:00.000Z',
        }),
      });
      console.log(` - Stale Update Response (Expected 409): ${staleRes.status}`);
      if (staleRes.status !== 409) {
        throw new Error(`Concurrency protection failed! Expected 409, got ${staleRes.status}`);
      }

      // Valid update (Expected 200)
      const validUpdateRes = await fetchWithTimeout(`${APP_HOSTING_URL}/api/admin/records/${testRecordId}`, {
        method: 'PUT',
        headers: superAdminHeaders,
        body: JSON.stringify({
          record_type: 'achievement',
          title: 'M10F STAGING TEST RECORD — DO NOT PUBLISH',
          slug: 'm10f-test-record-1786951298678',
          short_summary: 'Updated synthetic summary verifying optimistic concurrency check passed.',
          implementation_status: 'in_progress',
          geographic_scope: 'national',
          expected_updated_at: currentUpdatedAt,
        }),
      });
      console.log(` - Valid Update Response (Expected 200): ${validUpdateRes.status}`);
      if (validUpdateRes.status !== 200) {
        throw new Error('Valid update failed!');
      }
    }

    let testSourceId = null;
    let testClaimId = null;

    // 5. Source & Claim CRUD
    console.log('\n[5/12] Testing Source & Evidence Claim CRUD...');
    const sourcePayload = {
      title: 'TAT Staging Verification Document — Synthetic Citation',
      publisher_name: 'Staging QA Harness',
      source_type: 'statutory_report',
      source_level: 1,
      original_url: 'https://staging.tat.example.com/qa-source-doc',
      publication_date: '2024-05-29',
      publication_date_precision: 'exact_day',
      visibility_class: 'public',
    };

    const sourceRes = await fetchWithTimeout(`${APP_HOSTING_URL}/api/admin/records/${testRecordId}/sources`, {
      method: 'POST',
      headers: superAdminHeaders,
      body: JSON.stringify(sourcePayload),
    });
    const sourceData = await sourceRes.json();
    console.log(` - Save Source HTTP Status: ${sourceRes.status}`, sourceData);
    if (sourceRes.status !== 200 || !sourceData.id) {
      throw new Error(`Failed to save source: ${JSON.stringify(sourceData)}`);
    }
    testSourceId = sourceData.id;

    const claimPayload = {
      claim_type: 'financial_value',
      claim_text: 'M10F staging workflow verification claim — not for publication.',
      value_numeric: '5000000.00',
      value_text: '5 Million NGN',
      unit_code: 'NGN',
      currency_code: 'NGN',
      reporting_period_label: 'FY2024-Q1',
      data_value_nature: 'actual',
      source_origin: 'statutory_report',
      verification_status: 'verified',
      limitations: 'Synthetic verification test entry.',
      linked_source_ids: [testSourceId],
    };

    const claimRes = await fetchWithTimeout(`${APP_HOSTING_URL}/api/admin/records/${testRecordId}/claims`, {
      method: 'POST',
      headers: superAdminHeaders,
      body: JSON.stringify(claimPayload),
    });
    const claimData = await claimRes.json();
    console.log(` - Save Claim HTTP Status: ${claimRes.status}`, claimData);
    if (claimRes.status !== 200 || !claimData.id) {
      throw new Error(`Failed to save claim: ${JSON.stringify(claimData)}`);
    }
    testClaimId = claimData.id;

    // 6. Claim-Source Relinking (Edge deletion & insertion on claim_source_relationships)
    console.log('\n[6/12] Testing Claim-Source Relinking & Citation Edge Mutation...');
    const source2Res = await fetchWithTimeout(`${APP_HOSTING_URL}/api/admin/records/${testRecordId}/sources`, {
      method: 'POST',
      headers: superAdminHeaders,
      body: JSON.stringify({
        ...sourcePayload,
        title: 'TAT Staging Secondary Verification Source',
        original_url: 'https://staging.tat.example.com/secondary-source',
      }),
    });
    const source2Data = await source2Res.json();
    const testSource2Id = source2Data.id;

    // Relink claim to source 2 (exercises DELETE on claim_source_relationships)
    const relinkRes = await fetchWithTimeout(`${APP_HOSTING_URL}/api/admin/records/${testRecordId}/claims`, {
      method: 'POST',
      headers: superAdminHeaders,
      body: JSON.stringify({
        ...claimPayload,
        id: testClaimId,
        linked_source_ids: [testSource2Id],
      }),
    });
    console.log(` - Relink Claim Status: ${relinkRes.status}`, await relinkRes.json());
    if (relinkRes.status !== 200) {
      throw new Error('Relink claim failed!');
    }

    const relCheck = await db.query(`SELECT * FROM claim_source_relationships WHERE claim_id = $1`, [testClaimId]);
    console.log(` - Active claim relationships count: ${relCheck.rows.length}`);
    console.log(` - Linked source ID in DB: ${relCheck.rows[0]?.source_id} (Expected: ${testSource2Id})`);
    if (relCheck.rows[0]?.source_id !== testSource2Id) {
      throw new Error('Claim-source relinking verification failed in database!');
    }

    // 7. Financials CRUD
    console.log('\n[7/12] Testing Financial Records CRUD...');
    const finPayload = {
      financial_type: 'capital_allocation',
      amount: '123456789.50',
      currency_code: 'NGN',
      reporting_period_label: 'FY2024 Capital Budget',
      period_start: '2024-01-01',
      period_end: '2024-12-31',
      nominal_or_real: 'nominal',
      methodology: 'Synthetic staging budget entry',
      limitations: 'QA Test data',
    };
    const finRes = await fetchWithTimeout(`${APP_HOSTING_URL}/api/admin/records/${testRecordId}/financials`, {
      method: 'POST',
      headers: superAdminHeaders,
      body: JSON.stringify(finPayload),
    });
    console.log(` - Save Financial Status: ${finRes.status}`, await finRes.json());
    if (finRes.status !== 200) throw new Error('Save financial failed!');

    // 8. Beneficiaries CRUD
    console.log('\n[8/12] Testing Beneficiary Records CRUD...');
    const benPayload = {
      beneficiary_type: 'students',
      beneficiary_stage: 'targeted',
      count_value: 50000,
      unit: 'individual',
      count_basis: 'period_specific',
      cumulative: false,
      reporting_period_label: 'FY2024 Cohort 1',
      period_start: '2024-01-01',
      period_end: '2024-06-30',
      limitations: 'Synthetic cohort figures',
    };
    const benRes = await fetchWithTimeout(`${APP_HOSTING_URL}/api/admin/records/${testRecordId}/beneficiaries`, {
      method: 'POST',
      headers: superAdminHeaders,
      body: JSON.stringify(benPayload),
    });
    console.log(` - Save Beneficiary Status: ${benRes.status}`, await benRes.json());
    if (benRes.status !== 200) throw new Error('Save beneficiary failed!');

    // 9. Timeline Events CRUD
    console.log('\n[9/12] Testing Timeline Events CRUD...');
    const timePayload = {
      event_type: 'approved',
      title: 'Synthetic Staging Approval Event',
      description: 'Federal Executive Council synthetic approval milestone for testing.',
      date_value: '2024-02-01',
      date_precision: 'exact_day',
      provisional: false,
      is_public: false,
    };
    const timeRes = await fetchWithTimeout(`${APP_HOSTING_URL}/api/admin/records/${testRecordId}/timeline`, {
      method: 'POST',
      headers: superAdminHeaders,
      body: JSON.stringify(timePayload),
    });
    console.log(` - Save Timeline Status: ${timeRes.status}`, await timeRes.json());
    if (timeRes.status !== 200) throw new Error('Save timeline event failed!');

    // 10. Live RBAC & Security Invariant Checks (No mock token generation)
    console.log('\n[10/12] Testing Live Security & RBAC Invariants...');

    // A. Genuine Super Admin Mutation
    const superAdminMutationRes = await fetchWithTimeout(`${APP_HOSTING_URL}/api/admin/records/${testRecordId}/timeline`, {
      method: 'POST',
      headers: superAdminHeaders,
      body: JSON.stringify({ ...timePayload, title: 'Super Admin Verified Event' }),
    });
    console.log(` - Genuine Super Admin Mutation (Expected 200): ${superAdminMutationRes.status}`);
    if (superAdminMutationRes.status !== 200) throw new Error('Super admin mutation failed!');

    // B. Anonymous / Unauthenticated Request
    const anonRes = await fetchWithTimeout(`${APP_HOSTING_URL}/api/admin/records/${testRecordId}/timeline`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-tat-admin-csrf': '1' },
      body: JSON.stringify(timePayload),
    });
    console.log(` - Unauthenticated Mutation Denial (Expected Denial / non-200): ${anonRes.status}`);
    if (anonRes.status === 200 || anonRes.status === 201) throw new Error(`Expected denial for unauthenticated request, got ${anonRes.status}`);

    // C. Invalid / Fake Credentials
    const fakeTokenRes = await fetchWithTimeout(`${APP_HOSTING_URL}/api/admin/records/${testRecordId}/timeline`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-tat-admin-csrf': '1',
        'x-tat-admin-session': 'invalid_forged_session_token_12345',
        'Cookie': 'tat_admin_session=invalid_forged_session_token_12345',
      },
      body: JSON.stringify(timePayload),
    });
    console.log(` - Fake/Invalid Credential Denial (Expected Denial / non-200): ${fakeTokenRes.status}`);
    if (fakeTokenRes.status === 200 || fakeTokenRes.status === 201) throw new Error(`Expected denial for fake credential, got ${fakeTokenRes.status}`);

    // D. Missing CSRF Header
    const noCsrfRes = await fetchWithTimeout(`${APP_HOSTING_URL}/api/admin/records/${testRecordId}/timeline`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-tat-admin-session': superAdminSession,
        'Cookie': `tat_admin_session=${superAdminSession}`,
      },
      body: JSON.stringify(timePayload),
    });
    console.log(` - Missing CSRF Header Denial (Expected 403): ${noCsrfRes.status}`);
    if (noCsrfRes.status !== 403 && noCsrfRes.status !== 401) throw new Error(`Expected 403 for missing CSRF, got ${noCsrfRes.status}`);

    // 11. Draft / Public Isolation Direct Proofs (Across ALL 3 staging test records)
    console.log('\n[11/12] Auditing Draft / Public Isolation across 4 Public Views for all staging test records...');
    const allTestRecordIds = [
      '9b26f55e-af84-47e8-a6bb-15e1acfc2904',
      'd342f707-85f6-435b-a988-ec104f78b57f',
      '61ea8f9b-f32e-45b3-9aaa-88f89f422a42',
    ];

    for (const recId of allTestRecordIds) {
      const catCheck = await db.query(`SELECT * FROM public_record_catalog WHERE id = $1`, [recId]);
      const claimCheck = await db.query(`SELECT * FROM public_claim_evidence WHERE record_id = $1`, [recId]);
      const finCheck = await db.query(`SELECT * FROM public_financial_records WHERE record_id = $1`, [recId]);
      const benCheck = await db.query(`SELECT * FROM public_beneficiary_records WHERE record_id = $1`, [recId]);

      console.log(` - Record ${recId}:`);
      console.log(`     in public_record_catalog: ${catCheck.rows.length} rows (Expected: 0)`);
      console.log(`     in public_claim_evidence: ${claimCheck.rows.length} rows (Expected: 0)`);
      console.log(`     in public_financial_records: ${finCheck.rows.length} rows (Expected: 0)`);
      console.log(`     in public_beneficiary_records: ${benCheck.rows.length} rows (Expected: 0)`);

      if (catCheck.rows.length > 0 || claimCheck.rows.length > 0 || finCheck.rows.length > 0 || benCheck.rows.length > 0) {
        throw new Error(`CRITICAL ISOLATION FAILURE: Draft record ${recId} leaked into public database views!`);
      }
    }

    // Check public website search
    const pubSearchRes = await fetchWithTimeout(`${APP_HOSTING_URL}/achievements?q=M10F+STAGING`);
    const searchHtml = await pubSearchRes.text();
    const searchLeaked = searchHtml.includes('M10F STAGING TEST RECORD') || searchHtml.includes('M10F ABORTED STAGING');
    console.log(` - Public website search contains draft/aborted records: ${searchLeaked} (Expected: false)`);
    if (searchLeaked) throw new Error('Public search isolation failure!');

    // 12. Public Anonymous Access Regression
    console.log('\n[12/12] Testing Anonymous Public Access Regression across all public endpoints...');
    const publicRoutes = ['/', '/achievements', '/policies', '/projects', '/programmes', '/sectors', '/timeline', '/impact-map', '/sources', '/downloads'];
    for (const route of publicRoutes) {
      const res = await fetchWithTimeout(`${APP_HOSTING_URL}${route}`);
      console.log(` - Public route ${route.padEnd(16)} => HTTP ${res.status}`);
      if (res.status !== 200) {
        throw new Error(`Public route ${route} returned unexpected status ${res.status}`);
      }
    }

    console.log('\n============================================================');
    console.log('MISSION 10F-C LIVE CERTIFICATION COMPLETE: 100% SUCCESS');
    console.log(`Canonical Test Record ID: ${testRecordId}`);
    console.log('============================================================');
  } finally {
    if (db) {
      await db.close();
    }
  }
}

main().catch((err) => {
  console.error('FATAL CERTIFICATION ERROR:', err);
  process.exit(1);
});
