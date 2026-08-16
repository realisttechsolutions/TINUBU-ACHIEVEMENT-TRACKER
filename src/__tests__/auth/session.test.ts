import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  createStaffSession,
  verifyStaffSession,
  getSessionCookieAttributes,
  ADMIN_SESSION_COOKIE_NAME,
  SESSION_DURATION_SECONDS,
  AuthSecurityError,
} from '@/lib/server/session';
import * as firebaseAdminModule from '@/lib/server/firebase-admin';

describe('Staff Session & Cookie Verification (Mission 10E)', () => {
  const mockVerifyIdToken = vi.fn();
  const mockCreateSessionCookie = vi.fn();
  const mockVerifySessionCookie = vi.fn();
  const mockRevokeRefreshTokens = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(firebaseAdminModule, 'getAdminAuth').mockReturnValue({
      verifyIdToken: mockVerifyIdToken,
      createSessionCookie: mockCreateSessionCookie,
      verifySessionCookie: mockVerifySessionCookie,
      revokeRefreshTokens: mockRevokeRefreshTokens,
    } as any);
  });

  describe('Session Cookie Attributes', () => {
    it('sets 8-hour expiration, HttpOnly, and Lax sameSite attributes', () => {
      const cookie = getSessionCookieAttributes('mock-session-cookie-value');
      expect(cookie.name).toBe(ADMIN_SESSION_COOKIE_NAME);
      expect(cookie.value).toBe('mock-session-cookie-value');
      expect(cookie.httpOnly).toBe(true);
      expect(cookie.sameSite).toBe('lax');
      expect(cookie.path).toBe('/');
      expect(cookie.maxAge).toBe(SESSION_DURATION_SECONDS); // 28,800 seconds (8 hours)
    });
  });

  describe('createStaffSession', () => {
    it('successfully creates session for verified staff with valid role', async () => {
      mockVerifyIdToken.mockResolvedValue({
        uid: 'staff-uid-123',
        email: 'researcher@tracker.gov.ng',
        email_verified: true,
        tat_staff: true,
        tat_role: 'researcher',
      });
      mockCreateSessionCookie.mockResolvedValue('firebase-session-cookie-789');

      const result = await createStaffSession('valid-id-token');

      expect(result.sessionCookie).toBe('firebase-session-cookie-789');
      expect(result.user.uid).toBe('staff-uid-123');
      expect(result.user.email).toBe('researcher@tracker.gov.ng');
      expect(result.user.role).toBe('researcher');
      expect(result.user.emailVerified).toBe(true);

      expect(mockVerifyIdToken).toHaveBeenCalledWith('valid-id-token', true);
      expect(mockCreateSessionCookie).toHaveBeenCalledWith('valid-id-token', {
        expiresIn: 8 * 60 * 60 * 1000,
      });
    });

    it('rejects unverified email addresses', async () => {
      mockVerifyIdToken.mockResolvedValue({
        uid: 'staff-uid-unverified',
        email: 'unverified@tracker.gov.ng',
        email_verified: false,
        tat_staff: true,
        tat_role: 'reviewer',
      });

      await expect(createStaffSession('token-unverified')).rejects.toThrowError(
        /email must be verified/i
      );
      expect(mockCreateSessionCookie).not.toHaveBeenCalled();
    });

    it('rejects users without tat_staff custom claim', async () => {
      mockVerifyIdToken.mockResolvedValue({
        uid: 'public-user-123',
        email: 'public@example.com',
        email_verified: true,
        // Missing tat_staff: true
      });

      await expect(createStaffSession('token-non-staff')).rejects.toThrowError(
        /not authorized for staff administration/i
      );
      expect(mockCreateSessionCookie).not.toHaveBeenCalled();
    });

    it('rejects users with invalid or unrecognized staff role claim', async () => {
      mockVerifyIdToken.mockResolvedValue({
        uid: 'staff-invalid-role',
        email: 'user@tracker.gov.ng',
        email_verified: true,
        tat_staff: true,
        tat_role: 'viewer', // invalid role
      });

      await expect(createStaffSession('token-invalid-role')).rejects.toThrowError(
        /valid staff role assigned/i
      );
      expect(mockCreateSessionCookie).not.toHaveBeenCalled();
    });
  });

  describe('verifyStaffSession', () => {
    it('returns StaffUser for active, valid session cookie', async () => {
      mockVerifySessionCookie.mockResolvedValue({
        uid: 'staff-uid-456',
        email: 'superadmin@tracker.gov.ng',
        email_verified: true,
        tat_staff: true,
        tat_role: 'super_admin',
      });

      const user = await verifyStaffSession('active-session-cookie');
      expect(user).not.toBeNull();
      expect(user?.uid).toBe('staff-uid-456');
      expect(user?.role).toBe('super_admin');
      expect(mockVerifySessionCookie).toHaveBeenCalledWith('active-session-cookie', true);
    });

    it('returns null if session cookie is missing or empty', async () => {
      expect(await verifyStaffSession(undefined)).toBeNull();
      expect(await verifyStaffSession('')).toBeNull();
      expect(mockVerifySessionCookie).not.toHaveBeenCalled();
    });

    it('returns null if session cookie verification throws (expired/revoked)', async () => {
      mockVerifySessionCookie.mockRejectedValue(new Error('Firebase ID token has been revoked'));

      const user = await verifyStaffSession('revoked-cookie');
      expect(user).toBeNull();
    });
  });
});
