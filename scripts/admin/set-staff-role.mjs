#!/usr/bin/env node
/**
 * Update Staff Role Script
 * Development Mission 10E
 *
 * Usage:
 *   node scripts/admin/set-staff-role.mjs --email <email> --role <super_admin|researcher|reviewer|publisher> [--confirm]
 */

import { initializeApp, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

const VALID_ROLES = ['super_admin', 'researcher', 'reviewer', 'publisher'];

function parseArgs() {
  const args = process.argv.slice(2);
  const params = {
    email: '',
    role: '',
    confirm: false,
  };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--email' && args[i + 1]) {
      params.email = args[++i].trim().toLowerCase();
    } else if (args[i] === '--role' && args[i + 1]) {
      params.role = args[++i].trim().toLowerCase();
    } else if (args[i] === '--confirm') {
      params.confirm = true;
    }
  }

  return params;
}

async function main() {
  const { email, role, confirm } = parseArgs();

  console.log('='.repeat(60));
  console.log('TAT SET STAFF ROLE CLI — MISSION 10E');
  console.log('='.repeat(60));

  if (!email || !email.includes('@')) {
    console.error('Error: Valid --email is required.');
    process.exit(1);
  }

  if (!role || !VALID_ROLES.includes(role)) {
    console.error(`Error: Valid --role is required. Allowed roles: ${VALID_ROLES.join(', ')}`);
    process.exit(1);
  }

  const projectId = process.env.FIREBASE_PROJECT_ID || process.env.GCP_PROJECT || 'tinubu-achievement-stg';
  console.log(`Target Firebase Project: ${projectId}`);
  console.log(`Staff Email:             ${email}`);
  console.log(`Target Role:             ${role}`);
  console.log(`Mode:                    ${confirm ? 'EXECUTE MUTATION' : 'DRY RUN ONLY'}`);
  console.log('-'.repeat(60));

  if (!confirm) {
    console.log('[DRY RUN] No changes made. Pass --confirm to apply role change.');
    process.exit(0);
  }

  if (getApps().length === 0) {
    initializeApp({ projectId });
  }

  const auth = getAuth();

  try {
    const user = await auth.getUserByEmail(email);
    console.log(`[INFO] Account found (UID: ${user.uid}). Previous custom claims:`, user.customClaims);

    const customClaims = {
      tat_staff: true,
      tat_role: role,
    };

    await auth.setCustomUserClaims(user.uid, customClaims);
    // Revoke refresh tokens to force re-authentication with new claims
    await auth.revokeRefreshTokens(user.uid);

    console.log(`[SUCCESS] Updated claims for ${email} to role '${role}'. Previous sessions revoked.`);
  } catch (err) {
    console.error('[ERROR] Failed to update role:', err.message);
    process.exit(1);
  }
}

main();
