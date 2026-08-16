/**
 * Server-Side Session & Cookie Management
 * Development Mission 10E / 10E-LIVE
 *
 * Implements authoritative session cookie verification, token-to-session exchange,
 * role validation, email verification enforcement, recent auth enforcement, and session revocation.
 */

import 'server-only';
import { getAdminAuth } from './firebase-admin';
import { isValidStaffRole, type StaffRole, type StaffUser } from '../auth/types';

export const ADMIN_SESSION_COOKIE_NAME = 'tat_admin_session';

// 8 hours in seconds
export const SESSION_DURATION_SECONDS = 8 * 60 * 60;
// 8 hours in milliseconds for Firebase Admin
export const SESSION_DURATION_MS = SESSION_DURATION_SECONDS * 1000;

// Maximum acceptable age of ID token auth_time (5 minutes)
export const MAX_AUTH_AGE_SECONDS = 5 * 60;

export interface SessionCookieOptions {
  name: string;
  value: string;
  httpOnly: boolean;
  secure: boolean;
  sameSite: 'lax' | 'strict' | 'none';
  path: string;
  maxAge: number;
}

export function getSessionCookieAttributes(sessionCookie: string): SessionCookieOptions {
  const isProd = process.env.NODE_ENV === 'production';
  return {
    name: ADMIN_SESSION_COOKIE_NAME,
    value: sessionCookie,
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_DURATION_SECONDS,
  };
}

export interface CreateSessionResult {
  sessionCookie: string;
  user: StaffUser;
}

export class AuthSecurityError extends Error {
  constructor(message: string, public readonly code: string) {
    super(message);
    this.name = 'AuthSecurityError';
  }
}

/**
 * Verifies Firebase ID token, validates staff custom claims & email verification,
 * enforces recent authentication timestamp, and mints an authoritative server-side session cookie.
 */
export async function createStaffSession(idToken: string): Promise<CreateSessionResult> {
  if (!idToken || typeof idToken !== 'string') {
    throw new AuthSecurityError('ID token is required.', 'INVALID_ID_TOKEN');
  }

  const auth = getAdminAuth();

  // Verify ID token with revocation check
  let decodedToken;
  try {
    decodedToken = await auth.verifyIdToken(idToken, true);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Invalid or expired ID token';
    throw new AuthSecurityError(`Token verification failed: ${message}`, 'TOKEN_VERIFICATION_FAILED');
  }

  // 1. Enforce Recent Authentication Time (<= 5 minutes old)
  const authTime = decodedToken.auth_time;
  const currentTime = Math.floor(Date.now() / 1000);
  if (typeof authTime === 'number' && currentTime - authTime > MAX_AUTH_AGE_SECONDS) {
    throw new AuthSecurityError(
      'Recent authentication is required to issue an administrative session. Please re-authenticate.',
      'RECENT_AUTH_REQUIRED'
    );
  }

  // 2. Enforce Email Verification
  if (!decodedToken.email_verified) {
    throw new AuthSecurityError(
      'Staff account email must be verified before an administrative session can be issued.',
      'EMAIL_NOT_VERIFIED'
    );
  }

  // 3. Enforce Staff Flag
  if (decodedToken.tat_staff !== true) {
    throw new AuthSecurityError(
      'User is not authorized for staff administration.',
      'NOT_STAFF'
    );
  }

  // 4. Enforce Valid Staff Role
  const role = decodedToken.tat_role;
  if (!isValidStaffRole(role)) {
    throw new AuthSecurityError(
      'User does not have a valid staff role assigned.',
      'INVALID_STAFF_ROLE'
    );
  }

  // 5. Create Firebase Server-Side Session Cookie (8 hours)
  let sessionCookie: string;
  try {
    sessionCookie = await auth.createSessionCookie(idToken, {
      expiresIn: SESSION_DURATION_MS,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to create session cookie';
    throw new AuthSecurityError(`Session cookie creation failed: ${message}`, 'SESSION_CREATION_FAILED');
  }

  const user: StaffUser = {
    uid: decodedToken.uid,
    email: decodedToken.email || '',
    emailVerified: true,
    role: role as StaffRole,
    displayName: decodedToken.name || null,
  };

  return {
    sessionCookie,
    user,
  };
}

/**
 * Verifies a server-side session cookie with Firebase Admin and returns
 * the authenticated StaffUser if valid and not revoked.
 */
export async function verifyStaffSession(sessionCookie: string | undefined): Promise<StaffUser | null> {
  if (!sessionCookie || typeof sessionCookie !== 'string') {
    return null;
  }

  const auth = getAdminAuth();

  try {
    // Verify session cookie with checkRevoked = true
    const decoded = await auth.verifySessionCookie(sessionCookie, true);

    if (decoded.tat_staff !== true || !isValidStaffRole(decoded.tat_role)) {
      return null;
    }

    return {
      uid: decoded.uid,
      email: decoded.email || '',
      emailVerified: decoded.email_verified || false,
      role: decoded.tat_role as StaffRole,
      displayName: decoded.name || null,
    };
  } catch {
    // Cookie invalid, expired, revoked, or user disabled
    return null;
  }
}

/**
 * Revokes all sessions and refresh tokens for the given session's user
 */
export async function revokeStaffSession(sessionCookie: string | undefined): Promise<void> {
  if (!sessionCookie) return;

  const auth = getAdminAuth();

  try {
    const decoded = await auth.verifySessionCookie(sessionCookie, false);
    if (decoded && decoded.uid) {
      await auth.revokeRefreshTokens(decoded.uid);
    }
  } catch {
    // Silent fail if session was already invalid
  }
}
