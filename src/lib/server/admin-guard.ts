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
 * Authoritative Server Component guard.
 * Verifies staff session with Firebase Admin and enforces required roles.
 *
 * - If unauthenticated -> redirects to /admin/login
 * - If authenticated but role is forbidden -> redirects to /admin/unauthorized
 */
export async function requireStaffAuth(
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
