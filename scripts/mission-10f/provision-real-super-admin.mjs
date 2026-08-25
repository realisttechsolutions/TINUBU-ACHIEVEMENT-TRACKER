import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const auth = require('../../node_modules/firebase-tools/lib/auth');
const { requireAuth } = require('../../node_modules/firebase-tools/lib/requireAuth');
const apiv2 = require('../../node_modules/firebase-tools/lib/apiv2');
import { createFirebaseIamDatabase } from '../mission-10c/firebase-iam-pg.mjs';

const PROJECT = 'tinubu-achievement-stg';
const headers = { 'x-goog-user-project': PROJECT };

const REAL_SUPERADMIN_EMAIL = 'realisttechsolutions@gmail.com';
const EXPECTED_FIREBASE_UID = 'LGb4LLjQeuhBEFKEHuV4VPcnTrF3';
const ACTOR_ID = '00000000-0000-4000-8000-000000000015';

async function main() {
  console.log('============================================================');
  console.log('PROVISIONING REAL SUPER ADMIN ACTOR PROFILE IN STAGING DB');
  console.log('============================================================\n');

  const account = auth.getGlobalDefaultAccount();
  await requireAuth({ ...account, project: PROJECT });
  const token = await apiv2.getAccessToken();

  // 1. Verify Firebase Auth User Identity & Claims
  console.log('1. Confirming Firebase Auth identity...');
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
  if (!user) throw new Error(`User not found in Firebase Auth: ${REAL_SUPERADMIN_EMAIL}`);
  if (user.localId !== EXPECTED_FIREBASE_UID) {
    throw new Error(`UID mismatch! Expected: ${EXPECTED_FIREBASE_UID}, Found: ${user.localId}`);
  }
  console.log(` - Verified Firebase User: ${user.email} (UID: ${user.localId})`);
  console.log(` - Custom Attributes: ${user.customAttributes}\n`);

  // 2. Connect to Database & Provision Actor Profile
  console.log('2. Inserting actor profile in staging Cloud SQL (tat_staging)...');
  const db = await createFirebaseIamDatabase();
  try {
    // Check if already exists
    const existing = await db.query(
      `SELECT * FROM actor_profiles WHERE firebase_uid = $1 OR email = $2`,
      [user.localId, REAL_SUPERADMIN_EMAIL]
    );

    if (existing.rows.length > 0) {
      console.log(' - Actor profile already exists:', existing.rows[0]);
      // Ensure active and correct UID
      await db.query(
        `
        UPDATE actor_profiles
        SET firebase_uid = $1,
            email = $2,
            display_name = $3,
            status = 'active',
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $4
        `,
        [user.localId, REAL_SUPERADMIN_EMAIL, 'Super Administrator (Realist Tech Solutions)', existing.rows[0].id]
      );
      console.log(' - Updated existing actor profile to active.');
    } else {
      await db.query(
        `
        INSERT INTO actor_profiles (
          id, external_id, firebase_uid, actor_kind, display_name, email, status, created_at, updated_at
        ) VALUES (
          $1, 'PTAT-STAFF-SUPERADMIN-REAL', $2, 'human', $3, $4, 'active', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
        )
        `,
        [
          ACTOR_ID,
          user.localId,
          'Super Administrator (Realist Tech Solutions)',
          REAL_SUPERADMIN_EMAIL,
        ]
      );
      console.log(` - Successfully provisioned actor profile with ID: ${ACTOR_ID}`);
    }

    // Verify insertion
    const verified = await db.query(
      `SELECT * FROM actor_profiles WHERE firebase_uid = $1`,
      [user.localId]
    );
    console.log('\nVerified Provisioned Actor Profile in DB:');
    console.log(JSON.stringify(verified.rows[0], null, 2));
  } finally {
    await db.close();
  }
}

main().catch(console.error);
