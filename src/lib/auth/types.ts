/**
 * Staff Authentication & Authorization Types
 * Development Mission 10E
 */

export type StaffRole = 'super_admin' | 'researcher' | 'reviewer' | 'publisher';

export const VALID_STAFF_ROLES: readonly StaffRole[] = [
  'super_admin',
  'researcher',
  'reviewer',
  'publisher',
] as const;

export const CSRF_HEADER_NAME = 'x-tat-admin-csrf';
export const CSRF_HEADER_EXPECTED_VALUE = '1';

export interface StaffCustomClaims {
  tat_staff: true;
  tat_role: StaffRole;
}

export interface StaffUser {
  uid: string;
  email: string;
  emailVerified: boolean;
  role: StaffRole;
  displayName?: string | null;
}

export interface SessionPayload {
  uid: string;
  email: string;
  role: StaffRole;
  staff: true;
}

export function isValidStaffRole(role: unknown): role is StaffRole {
  return typeof role === 'string' && VALID_STAFF_ROLES.includes(role as StaffRole);
}

/**
 * Route authorization matrix
 */
export const ROLE_ROUTE_PERMISSIONS: Record<StaffRole, readonly string[]> = {
  super_admin: ['/admin', '/admin/records', '/admin/research', '/admin/review', '/admin/publish', '/admin/users'],
  researcher: ['/admin', '/admin/records', '/admin/research'],
  reviewer: ['/admin', '/admin/records', '/admin/review'],
  publisher: ['/admin', '/admin/records', '/admin/publish'],
} as const;

/**
 * Checks if a given role is authorized to access a target admin path
 */
export function isRoleAuthorizedForPath(role: StaffRole, targetPath: string): boolean {
  if (role === 'super_admin') {
    return true;
  }

  const normalizedPath = targetPath.endsWith('/') && targetPath.length > 1 
    ? targetPath.slice(0, -1) 
    : targetPath;

  if (normalizedPath === '/admin') {
    return true;
  }

  if (normalizedPath === '/admin/records' || normalizedPath.startsWith('/admin/records/')) {
    if (normalizedPath === '/admin/records/new') {
      return role === 'researcher';
    }
    return true;
  }

  if (normalizedPath === '/admin/research' || normalizedPath.startsWith('/admin/research/')) {
    return role === 'researcher';
  }

  if (normalizedPath === '/admin/review' || normalizedPath.startsWith('/admin/review/')) {
    return role === 'reviewer';
  }

  if (normalizedPath === '/admin/publish' || normalizedPath.startsWith('/admin/publish/')) {
    return role === 'publisher';
  }

  if (normalizedPath === '/admin/users' || normalizedPath.startsWith('/admin/users/')) {
    return false; // Only super_admin is allowed, which was already checked above
  }

  return false;
}

/**
 * Returns accessible navigation items for a given role
 */
export function getAllowedRoutesForRole(role: StaffRole): readonly string[] {
  return ROLE_ROUTE_PERMISSIONS[role] || [];
}
