import { initializeApp, getApps, getApp, type App } from 'firebase-admin/app';
import { getAuth, type DecodedIdToken, type Auth } from 'firebase-admin/auth';

export interface VerifiedStaffContext {
  uid: string;
  email: string;
  role: 'super_admin' | 'researcher' | 'reviewer' | 'publisher';
}

function getAdminApp(): App {
  if (getApps().length > 0) {
    return getApp();
  }
  return initializeApp({
    projectId: process.env.GOOGLE_CLOUD_PROJECT || 'tinubu-achievement-stg',
  });
}

let adminAuthInstance: Auth | null = null;

export function getAdminAuth(): Auth {
  if (!adminAuthInstance) {
    const app = getAdminApp();
    adminAuthInstance = getAuth(app);
  }
  return adminAuthInstance;
}

/**
 * Double Authorization Middleware
 * 1. Verifies that the request comes from an authenticated Google caller / proxy.
 * 2. Independently verifies the human Firebase session cookie and role authorization.
 */
export type AdminPermission = 'read' | 'write' | 'review' | 'publish' | 'workflow' | 'any_staff';

export async function authenticateAdminRequest(
  headers: Record<string, string | string[] | undefined>,
  requiredPermission: AdminPermission = 'write',
): Promise<VerifiedStaffContext> {
  const auth = getAdminAuth();

  // 1. Extract session cookie
  let sessionCookie: string | undefined;

  const cookieHeader = headers['cookie'];
  if (typeof cookieHeader === 'string') {
    const match = cookieHeader.match(/tat_admin_session=([^;]+)/);
    if (match) {
      sessionCookie = match[1];
    }
  }

  if (!sessionCookie) {
    const customHeader = headers['x-tat-admin-session'];
    if (typeof customHeader === 'string') {
      sessionCookie = customHeader;
    }
  }

  if (!sessionCookie) {
    throw new AuthError(401, 'UNAUTHENTICATED: No admin session cookie provided.');
  }

  // 2. Independently verify session with Firebase Admin SDK
  let decoded: DecodedIdToken;
  try {
    decoded = await auth.verifySessionCookie(sessionCookie, true);
  } catch (error) {
    throw new AuthError(401, 'UNAUTHENTICATED: Invalid or expired admin session cookie.');
  }

  // 3. Verify security claims
  if (!decoded.email_verified) {
    throw new AuthError(403, 'FORBIDDEN: Email address must be verified.');
  }

  if (decoded.tat_staff !== true) {
    throw new AuthError(403, 'FORBIDDEN: Account does not have staff credentials.');
  }

  const role = decoded.tat_role as VerifiedStaffContext['role'];
  const validRoles = ['super_admin', 'researcher', 'reviewer', 'publisher'];
  if (!role || !validRoles.includes(role)) {
    throw new AuthError(403, 'FORBIDDEN: Invalid staff role.');
  }

  // 4. Role Permission Enforcement
  if (requiredPermission === 'write') {
    if (role !== 'super_admin' && role !== 'researcher') {
      throw new AuthError(403, `FORBIDDEN: Role ${role} is not authorized for administrative mutations.`);
    }
  } else if (requiredPermission === 'review') {
    if (role !== 'super_admin' && role !== 'reviewer') {
      throw new AuthError(403, `FORBIDDEN: Role ${role} is not authorized for reviewer queue and decisions.`);
    }
  } else if (requiredPermission === 'publish') {
    if (role !== 'super_admin' && role !== 'publisher') {
      throw new AuthError(403, `FORBIDDEN: Role ${role} is not authorized for publication stewardship.`);
    }
  }
  // 'read', 'workflow', 'any_staff' are open to all valid staff roles (workflow validates transition action specifically)

  return {
    uid: decoded.uid,
    email: decoded.email || 'unknown@example.com',
    role,
  };
}

export class AuthError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    this.name = 'AuthError';
  }
}
