#!/usr/bin/env node
import { initializeApp, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const fbAuth = require('../../node_modules/firebase-tools/lib/auth');
const { requireAuth } = require('../../node_modules/firebase-tools/lib/requireAuth');
const apiv2 = require('../../node_modules/firebase-tools/lib/apiv2');

async function main() {
  const email = (process.argv[2] || 'realisttechsolutions@gmail.com').trim().toLowerCase();
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

  const actionCodeSettings = {
    url: 'https://tat-staging--tinubu-achievement-stg.us-central1.hosted.app/admin/login',
    handleCodeInApp: false
  };

  const verificationLink = await auth.generateEmailVerificationLink(email, actionCodeSettings);
  const passwordResetLink = await auth.generatePasswordResetLink(email, actionCodeSettings);

  console.log('=== ACTION LINKS ===');
  console.log('VERIFICATION_LINK:', verificationLink);
  console.log('PASSWORD_RESET_LINK:', passwordResetLink);
}

main();
