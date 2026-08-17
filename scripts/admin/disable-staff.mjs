#!/usr/bin/env node
/**
 * Disable Staff Account Script
 * Development Mission 10E
 *
 * Usage:
 *   node scripts/admin/disable-staff.mjs --email <email> [--confirm]
 */

import { initializeApp, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

function parseArgs() {
  const args = process.argv.slice(2);
  const params = {
    email: '',
    confirm: false,
  };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--email' && args[i + 1]) {
      params.email = args[++i].trim().toLowerCase();
    } else if (args[i] === '--confirm') {
      params.confirm = true;
    }
  }

  return params;
}

async function main() {
  const { email, confirm } = parseArgs();

  console.log('='.repeat(60));
  console.log('TAT DISABLE STAFF CLI — MISSION 10E');
  console.log('='.repeat(60));

  if (!email || !email.includes('@')) {
    console.error('Error: Valid --email is required.');
    process.exit(1);
  }

  const projectId = process.env.FIREBASE_PROJECT_ID || process.env.GCP_PROJECT || 'tinubu-achievement-stg';
  console.log(`Target Firebase Project: ${projectId}`);
  console.log(`Staff Email:             ${email}`);
  console.log(`Mode:                    ${confirm ? 'EXECUTE ACCOUNT DISABLE' : 'DRY RUN ONLY'}`);
  console.log('-'.repeat(60));

  if (!confirm) {
    console.log('[DRY RUN] No changes made. Pass --confirm to disable staff account and revoke all sessions.');
    process.exit(0);
  }

  if (getApps().length === 0) {
    let credential;
    try {
      const { createRequire } = await import('node:module');
      const require = createRequire(import.meta.url);
      const fbAuth = require('../../node_modules/firebase-tools/lib/auth');
      const { requireAuth } = require('../../node_modules/firebase-tools/lib/requireAuth');
      const apiv2 = require('../../node_modules/firebase-tools/lib/apiv2');
      const account = fbAuth.getGlobalDefaultAccount();
      if (account) {
        await requireAuth({ ...account, project: projectId });
        credential = {
          getAccessToken: async () => {
            const token = await apiv2.getAccessToken();
            return {
              access_token: token,
              expires_in: 3600,
            };
          },
        };
      }
    } catch {
      // Fallback to ADC if firebase-tools is not accessible
    }

    initializeApp({
      projectId,
      credential,
    });
  }

  const auth = getAuth();

  try {
    const user = await auth.getUserByEmail(email);
    console.log(`[INFO] Account found (UID: ${user.uid}).`);

    // Disable account and revoke all sessions immediately
    await auth.updateUser(user.uid, { disabled: true });
    await auth.revokeRefreshTokens(user.uid);

    console.log(`[SUCCESS] Account for ${email} has been DISABLED and all active sessions/refresh tokens REVOKED.`);
  } catch (err) {
    console.error('[ERROR] Failed to disable account:', err.message);
    process.exit(1);
  }
}

main();
