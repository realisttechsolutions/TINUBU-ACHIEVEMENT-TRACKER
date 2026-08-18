/**
 * Server-Side Admin Authentication & Authorization Guard
 * Development Mission 10E
 */

import 'server-only';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyStaffSession, ADMIN_SESSION_COOKIE_NAME } from './session';
import { isRoleAuthorizedForPath, type StaffRole, type StaffUser } from '../auth/types';

/**
 * Server Component page guard.
 * Verifies staff session with Firebase Admin and redirects to login/unauthorized.
 */
export async function requireStaffPageAuth(
  allowedRoles?: StaffRole[],
  targetPath?: string
): Promise<StaffUser> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(ADMIN_SESSION_COOKIE_NAME)?.value;

  if (!sessionCookie) {
    redirect('/admin/login');
  }

  const staffUser = await verifyStaffSession(sessionCookie);

  if (!staffUser) {
    redirect('/admin/login');
  }

  if (allowedRoles && allowedRoles.length > 0) {
    if (!allowedRoles.includes(staffUser.role) && staffUser.role !== 'super_admin') {
      redirect('/admin/unauthorized');
    }
  }

  if (targetPath) {
    if (!isRoleAuthorizedForPath(staffUser.role, targetPath)) {
      redirect('/admin/unauthorized');
    }
  }

  return staffUser;
}

/**
 * API Route Handler guard.
 * Verifies staff session and throws explicit UNAUTHENTICATED / FORBIDDEN errors for JSON response mapping.
 */
export async function requireStaffAuth(
  allowedRoles?: StaffRole[],
  targetPath?: string
): Promise<StaffUser> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(ADMIN_SESSION_COOKIE_NAME)?.value;

  if (!sessionCookie) {
    throw new Error('UNAUTHENTICATED: Valid staff session cookie is required.');
  }

  const staffUser = await verifyStaffSession(sessionCookie);

  if (!staffUser) {
    throw new Error('UNAUTHENTICATED: Invalid or expired admin session.');
  }

  if (allowedRoles && allowedRoles.length > 0) {
    if (!allowedRoles.includes(staffUser.role) && staffUser.role !== 'super_admin') {
      throw new Error('FORBIDDEN: Insufficient permissions for this action.');
    }
  }

  if (targetPath) {
    if (!isRoleAuthorizedForPath(staffUser.role, targetPath)) {
      throw new Error('FORBIDDEN: Insufficient permissions for target path.');
    }
  }

  return staffUser;
}


/**
 * Non-redirecting session check for API routes and optional UI state
 */
export async function getAuthenticatedStaffUser(): Promise<StaffUser | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(ADMIN_SESSION_COOKIE_NAME)?.value;

  if (!sessionCookie) {
    return null;
  }

  return verifyStaffSession(sessionCookie);
}
