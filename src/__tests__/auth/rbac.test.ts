import { describe, it, expect } from 'vitest';
import {
  isValidStaffRole,
  isRoleAuthorizedForPath,
  getAllowedRoutesForRole,
  ROLE_ROUTE_PERMISSIONS,
  type StaffRole,
} from '@/lib/auth/types';

describe('Staff RBAC Authorization Matrix (Mission 10E)', () => {
  it('validates recognized staff roles and rejects unauthorized roles', () => {
    expect(isValidStaffRole('super_admin')).toBe(true);
    expect(isValidStaffRole('researcher')).toBe(true);
    expect(isValidStaffRole('reviewer')).toBe(true);
    expect(isValidStaffRole('publisher')).toBe(true);

    expect(isValidStaffRole('viewer')).toBe(false);
    expect(isValidStaffRole('public_user')).toBe(false);
    expect(isValidStaffRole('admin')).toBe(false);
    expect(isValidStaffRole(null)).toBe(false);
    expect(isValidStaffRole(undefined)).toBe(false);
    expect(isValidStaffRole('')).toBe(false);
  });

  describe('Super Admin Role Permissions', () => {
    const role: StaffRole = 'super_admin';

    it('has universal access across all admin routes', () => {
      expect(isRoleAuthorizedForPath(role, '/admin')).toBe(true);
      expect(isRoleAuthorizedForPath(role, '/admin/research')).toBe(true);
      expect(isRoleAuthorizedForPath(role, '/admin/review')).toBe(true);
      expect(isRoleAuthorizedForPath(role, '/admin/publish')).toBe(true);
      expect(isRoleAuthorizedForPath(role, '/admin/users')).toBe(true);
      expect(isRoleAuthorizedForPath(role, '/admin/custom-subpath')).toBe(true);
    });

    it('returns all 5 admin route permissions in navigation helper', () => {
      const routes = getAllowedRoutesForRole(role);
      expect(routes).toContain('/admin');
      expect(routes).toContain('/admin/research');
      expect(routes).toContain('/admin/review');
      expect(routes).toContain('/admin/publish');
      expect(routes).toContain('/admin/users');
    });
  });

  describe('Researcher Role Permissions', () => {
    const role: StaffRole = 'researcher';

    it('is authorized ONLY for /admin and /admin/research', () => {
      expect(isRoleAuthorizedForPath(role, '/admin')).toBe(true);
      expect(isRoleAuthorizedForPath(role, '/admin/research')).toBe(true);
      expect(isRoleAuthorizedForPath(role, '/admin/research/intake')).toBe(true);
    });

    it('is strictly forbidden from review, publish, and user management', () => {
      expect(isRoleAuthorizedForPath(role, '/admin/review')).toBe(false);
      expect(isRoleAuthorizedForPath(role, '/admin/publish')).toBe(false);
      expect(isRoleAuthorizedForPath(role, '/admin/users')).toBe(false);
    });
  });

  describe('Reviewer Role Permissions', () => {
    const role: StaffRole = 'reviewer';

    it('is authorized ONLY for /admin and /admin/review', () => {
      expect(isRoleAuthorizedForPath(role, '/admin')).toBe(true);
      expect(isRoleAuthorizedForPath(role, '/admin/review')).toBe(true);
      expect(isRoleAuthorizedForPath(role, '/admin/review/audit-123')).toBe(true);
    });

    it('is strictly forbidden from research, publish, and user management', () => {
      expect(isRoleAuthorizedForPath(role, '/admin/research')).toBe(false);
      expect(isRoleAuthorizedForPath(role, '/admin/publish')).toBe(false);
      expect(isRoleAuthorizedForPath(role, '/admin/users')).toBe(false);
    });
  });

  describe('Publisher Role Permissions', () => {
    const role: StaffRole = 'publisher';

    it('is authorized ONLY for /admin and /admin/publish', () => {
      expect(isRoleAuthorizedForPath(role, '/admin')).toBe(true);
      expect(isRoleAuthorizedForPath(role, '/admin/publish')).toBe(true);
      expect(isRoleAuthorizedForPath(role, '/admin/publish/release-456')).toBe(true);
    });

    it('is strictly forbidden from research, review, and user management', () => {
      expect(isRoleAuthorizedForPath(role, '/admin/research')).toBe(false);
      expect(isRoleAuthorizedForPath(role, '/admin/review')).toBe(false);
      expect(isRoleAuthorizedForPath(role, '/admin/users')).toBe(false);
    });
  });
});
