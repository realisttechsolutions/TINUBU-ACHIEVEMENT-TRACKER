import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { POST as handleSessionPost } from '@/app/api/admin/auth/session/route';
import { POST as handleLogoutPost } from '@/app/api/admin/auth/logout/route';
import { GET as handleMeGet } from '@/app/api/admin/auth/me/route';
import * as sessionModule from '@/lib/server/session';
import { CSRF_HEADER_NAME, CSRF_HEADER_EXPECTED_VALUE } from '@/lib/server/csrf';

describe('Admin Authentication API Routes (Mission 10E)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('POST /api/admin/auth/session', () => {
    it('rejects requests without CSRF protection header with 403', async () => {
      const req = new NextRequest('http://localhost:3000/api/admin/auth/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken: 'some-token' }),
      });

      const res = await handleSessionPost(req);
      expect(res.status).toBe(403);
      const data = await res.json();
      expect(data.error).toContain('CSRF');
    });

    it('successfully creates session and sets HTTP-only cookie on valid token', async () => {
      vi.spyOn(sessionModule, 'createStaffSession').mockResolvedValue({
        sessionCookie: 'mock-firebase-session-cookie',
        user: {
          uid: 'staff-uid-1',
          email: 'publisher@tracker.gov.ng',
          emailVerified: true,
          role: 'publisher',
          displayName: 'Test Publisher',
        },
      });

      const req = new NextRequest('http://localhost:3000/api/admin/auth/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          [CSRF_HEADER_NAME]: CSRF_HEADER_EXPECTED_VALUE,
        },
        body: JSON.stringify({ idToken: 'valid-firebase-id-token' }),
      });

      const res = await handleSessionPost(req);
      expect(res.status).toBe(200);

      const data = await res.json();
      expect(data.success).toBe(true);
      expect(data.role).toBe('publisher');
      expect(data.email).toBe('publisher@tracker.gov.ng');

      const setCookieHeader = res.headers.get('set-cookie');
      expect(setCookieHeader).toContain(sessionModule.ADMIN_SESSION_COOKIE_NAME);
      expect(setCookieHeader).toContain('HttpOnly');
    });
  });

  describe('POST /api/admin/auth/logout', () => {
    it('clears session cookie and returns success', async () => {
      vi.spyOn(sessionModule, 'revokeStaffSession').mockResolvedValue(undefined);

      const req = new NextRequest('http://localhost:3000/api/admin/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          [CSRF_HEADER_NAME]: CSRF_HEADER_EXPECTED_VALUE,
          cookie: `${sessionModule.ADMIN_SESSION_COOKIE_NAME}=session-to-clear`,
        },
      });

      const res = await handleLogoutPost(req);
      expect(res.status).toBe(200);

      const data = await res.json();
      expect(data.success).toBe(true);

      const setCookieHeader = res.headers.get('set-cookie');
      expect(setCookieHeader).toContain(`${sessionModule.ADMIN_SESSION_COOKIE_NAME}=;`);
      expect(setCookieHeader).toContain('Max-Age=0');
    });
  });

  describe('GET /api/admin/auth/me', () => {
    it('returns 401 when session cookie is absent', async () => {
      const req = new NextRequest('http://localhost:3000/api/admin/auth/me', {
        method: 'GET',
      });

      const res = await handleMeGet(req);
      expect(res.status).toBe(401);
      const data = await res.json();
      expect(data.authenticated).toBe(false);
    });

    it('returns authenticated user info when valid session cookie is present', async () => {
      vi.spyOn(sessionModule, 'verifyStaffSession').mockResolvedValue({
        uid: 'staff-uid-99',
        email: 'superadmin@tracker.gov.ng',
        emailVerified: true,
        role: 'super_admin',
        displayName: 'Super Admin User',
      });

      const req = new NextRequest('http://localhost:3000/api/admin/auth/me', {
        method: 'GET',
        headers: {
          cookie: `${sessionModule.ADMIN_SESSION_COOKIE_NAME}=valid-cookie`,
        },
      });

      const res = await handleMeGet(req);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.authenticated).toBe(true);
      expect(data.user.email).toBe('superadmin@tracker.gov.ng');
      expect(data.user.role).toBe('super_admin');
    });
  });
});
