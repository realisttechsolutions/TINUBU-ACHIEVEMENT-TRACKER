import { describe, it, expect } from 'vitest';
import { NextRequest } from 'next/server';
import { middleware } from '@/middleware';

describe('Admin Security Middleware & Public Route Immunity (Mission 10E)', () => {
  describe('Public Route Immunity (Zero Authentication Required)', () => {
    const publicPaths = [
      '/',
      '/achievements',
      '/achievements/p-01',
      '/policies',
      '/policies/electricity-act-2023',
      '/projects',
      '/programmes',
      '/sectors',
      '/timeline',
      '/impact-map',
      '/api/health',
    ];

    it.each(publicPaths)('completely bypasses auth checks for public route %s', (path) => {
      const req = new NextRequest(`http://localhost:3000${path}`);
      const res = middleware(req);

      // Should not redirect
      expect(res.status).toBe(200);
      expect(res.headers.get('location')).toBeNull();
    });
  });

  describe('Administrative Route Protection', () => {
    it('redirects anonymous requests from /admin to /admin/login', () => {
      const req = new NextRequest('http://localhost:3000/admin');
      const res = middleware(req);

      expect(res.status).toBe(307);
      expect(res.headers.get('location')).toBe('http://localhost:3000/admin/login');
      expect(res.headers.get('x-robots-tag')).toContain('noindex');
      expect(res.headers.get('cache-control')).toContain('no-store');
    });

    it('redirects anonymous requests from /admin/research to /admin/login with redirect param', () => {
      const req = new NextRequest('http://localhost:3000/admin/research');
      const res = middleware(req);

      expect(res.status).toBe(307);
      expect(res.headers.get('location')).toBe(
        'http://localhost:3000/admin/login?redirect=%2Fadmin%2Fresearch'
      );
    });

    it('allows anonymous access to /admin/login and /admin/forgot-password with security headers', () => {
      const reqLogin = new NextRequest('http://localhost:3000/admin/login');
      const resLogin = middleware(reqLogin);
      expect(resLogin.status).toBe(200);
      expect(resLogin.headers.get('x-robots-tag')).toContain('noindex');

      const reqForgot = new NextRequest('http://localhost:3000/admin/forgot-password');
      const resForgot = middleware(reqForgot);
      expect(resForgot.status).toBe(200);
      expect(resForgot.headers.get('x-robots-tag')).toContain('noindex');
    });

    it('redirects authenticated staff on /admin/login back to /admin dashboard', () => {
      const req = new NextRequest('http://localhost:3000/admin/login', {
        headers: {
          cookie: 'tat_admin_session=active_valid_session_cookie',
        },
      });
      const res = middleware(req);

      expect(res.status).toBe(307);
      expect(res.headers.get('location')).toBe('http://localhost:3000/admin');
    });
  });
});
