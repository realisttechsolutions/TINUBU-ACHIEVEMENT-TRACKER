#!/usr/bin/env node
/**
 * Staff Account Bootstrap Script
 * Development Mission 10E / 10E-LIVE
 *
 * Safe, repeatable operator CLI script to provision staff accounts and assign custom claims.
 *
 * Invariant: Permanent staff accounts MUST prove email ownership through genuine Firebase
 * email verification before admin sessions can be minted.
 *
 * Usage:
 *   node scripts/admin/bootstrap-staff.mjs --email <email> --role <super_admin|researcher|reviewer|publisher> [--confirm]
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
    displayName: '',
  };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--email' && args[i + 1]) {
      params.email = args[++i].trim().toLowerCase();
    } else if (args[i] === '--role' && args[i + 1]) {
      params.role = args[++i].trim().toLowerCase();
    } else if (args[i] === '--name' && args[i + 1]) {
      params.displayName = args[++i].trim();
    } else if (args[i] === '--confirm') {
      params.confirm = true;
    }
  }

  return params;
}

async function main() {
  const { email, role, confirm, displayName } = parseArgs();

  console.log('='.repeat(60));
  console.log('TAT STAFF BOOTSTRAP CLI — MISSION 10E-LIVE');
  console.log('='.repeat(60));

  if (!email || !email.includes('@')) {
    console.error('Error: Valid --email is required.');
    console.log('Usage: node scripts/admin/bootstrap-staff.mjs --email <email> --role <role> [--confirm]');
    process.exit(1);
  }

  if (!role || !VALID_ROLES.includes(role)) {
    console.error(`Error: Valid --role is required. Allowed roles: ${VALID_ROLES.join(', ')}`);
    process.exit(1);
  }

  const projectId = process.env.FIREBASE_PROJECT_ID || process.env.GCP_PROJECT || 'tinubu-achievement-stg';
  console.log(`Target Firebase Project: ${projectId}`);
  console.log(`Staff Email:             ${email}`);
  console.log(`Assigned Role:           ${role}`);
  console.log(`Initial Verified Status: UNVERIFIED (Verification Required)`);
  console.log(`Mode:                    ${confirm ? 'EXECUTE MUTATION' : 'DRY RUN ONLY'}`);
  console.log('-'.repeat(60));

  if (!confirm) {
    console.log('[DRY RUN] No changes were made. Pass --confirm to execute account bootstrap.');
    process.exit(0);
  }

  if (getApps().length === 0) {
    initializeApp({ projectId });
  }

  const auth = getAuth();

  try {
    let user;
    try {
      user = await auth.getUserByEmail(email);
      console.log(`[INFO] Existing Firebase Auth account found (UID: ${user.uid}).`);
    } catch (err) {
      if (err.code === 'auth/user-not-found') {
        console.log('[INFO] Account does not exist. Creating new staff user record...');
        user = await auth.createUser({
          email,
          emailVerified: false, // Email verification strictly required
          displayName: displayName || undefined,
          disabled: false,
        });
        console.log(`[SUCCESS] Created new user (UID: ${user.uid}).`);
      } else {
        throw err;
      }
    }

    // Set custom claims server-side
    const customClaims = {
      tat_staff: true,
      tat_role: role,
    };

    console.log(`[INFO] Setting custom claims: ${JSON.stringify(customClaims)}`);
    await auth.setCustomUserClaims(user.uid, customClaims);

    // Generate secure email verification link
    let verificationLink = '';
    try {
      verificationLink = await auth.generateEmailVerificationLink(email);
    } catch (verErr) {
      console.warn('[WARN] Could not generate verification link:', verErr.message);
    }

    // Generate secure password reset link
    let passwordResetLink = '';
    try {
      passwordResetLink = await auth.generatePasswordResetLink(email);
    } catch (pwErr) {
      console.warn('[WARN] Could not generate password reset link:', pwErr.message);
    }

    console.log('='.repeat(60));
    console.log('[SUCCESS] STAFF ACCOUNT PROVISIONED SUCCESSFULLY');
    console.log('='.repeat(60));
    console.log('OPERATOR ACTIVATION INSTRUCTIONS:');
    console.log('1. First, verify email ownership by opening the link below:');
    if (verificationLink) {
      console.log(`   Verification Link: ${verificationLink}`);
    } else {
      console.log('   (Send verification email directly from Firebase Console)');
    }
    console.log('');
    console.log('2. Next, set your secure password by opening the link below:');
    if (passwordResetLink) {
      console.log(`   Password Link:     ${passwordResetLink}`);
    } else {
      console.log('   (Send password reset email via /admin/forgot-password)');
    }
    console.log('');
    console.log('3. Password Requirements: >= 12 characters, uppercase, lowercase, number, special character.');
    console.log('4. Once verified and password is set, log in at /admin/login.');
    console.log('='.repeat(60));
  } catch (err) {
    console.error('[ERROR] Bootstrap failed:', err.message);
    process.exit(1);
  }
}

main();
