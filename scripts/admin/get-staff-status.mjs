#!/usr/bin/env node
import { initializeApp, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const fbAuth = require('../../node_modules/firebase-tools/lib/auth');
const { requireAuth } = require('../../node_modules/firebase-tools/lib/requireAuth');
const apiv2 = require('../../node_modules/firebase-tools/lib/apiv2');

async function main() {
  const email = process.argv[2]?.trim().toLowerCase();
  if (!email || !email.includes('@')) {
    console.error('Usage: node scripts/admin/get-staff-status.mjs <email>');
    process.exit(1);
  }
  const projectId = process.env.FIREBASE_PROJECT_ID || 'tinubu-achievement-stg';

  const account = fbAuth.getGlobalDefaultAccount();
  if (account) {
    await requireAuth({ ...account, project: projectId });
  }

  const credential = account ? {
    getAccessToken: async () => ({
      access_token: await apiv2.getAccessToken(),
      expires_in: 3600,
    })
  } : undefined;

  if (getApps().length === 0) {
    initializeApp({ projectId, credential });
  }

  const auth = getAuth();
  try {
    const user = await auth.getUserByEmail(email);
    console.log('=== STAFF USER STATE ===');
    console.log('email:         ', user.email);
    console.log('emailVerified: ', user.emailVerified);
    console.log('disabled:      ', user.disabled);
    console.log('customClaims:  ', JSON.stringify(user.customClaims));
    console.log('tokensValidAfterTime:', user.tokensValidAfterTime);
  } catch (err) {
    console.error('Error fetching user:', err.message);
  }
}

main();
