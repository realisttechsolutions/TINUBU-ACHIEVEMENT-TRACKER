/**
 * Next.js Middleware for Administrative Route Protection & Security Headers
 * Development Mission 10E
 *
 * NOTE: Public routes are completely bypassed and require NO authentication.
 * Server components perform authoritative token/session verification.
 */

import { NextResponse, type NextRequest } from 'next/server';

const ADMIN_SESSION_COOKIE = 'tat_admin_session';

const PUBLIC_ADMIN_PATHS = [
  '/admin/login',
  '/admin/forgot-password',
  '/admin/unauthorized',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only intercept /admin routes
  if (!pathname.startsWith('/admin')) {
    return NextResponse.next();
  }

  const hasSessionCookie = request.cookies.has(ADMIN_SESSION_COOKIE);
  const isPublicAdminPath = PUBLIC_ADMIN_PATHS.some(
    p => pathname === p || pathname.startsWith(`${p}/`)
  );

  // 1. If trying to access protected admin route without session cookie -> redirect to /admin/login
  if (!hasSessionCookie && !isPublicAdminPath) {
    const loginUrl = new URL('/admin/login', request.url);
    if (pathname !== '/admin') {
      loginUrl.searchParams.set('redirect', pathname);
    }
    const response = NextResponse.redirect(loginUrl);
    applyAdminSecurityHeaders(response);
    return response;
  }

  // 2. If logged in and visiting /admin/login or /admin/forgot-password -> redirect to /admin dashboard
  if (hasSessionCookie && (pathname === '/admin/login' || pathname === '/admin/forgot-password')) {
    const dashboardUrl = new URL('/admin', request.url);
    const response = NextResponse.redirect(dashboardUrl);
    applyAdminSecurityHeaders(response);
    return response;
  }

  // 3. Allow request to proceed with strict admin security headers
  const response = NextResponse.next();
  applyAdminSecurityHeaders(response);
  return response;
}

function applyAdminSecurityHeaders(response: NextResponse): void {
  // Staging/Admin indexing protection
  response.headers.set(
    'X-Robots-Tag',
    'noindex, nofollow, noarchive, nosnippet, noimageindex'
  );

  // Prevent browser & intermediary proxy caching of sensitive staff data
  response.headers.set(
    'Cache-Control',
    'no-store, no-cache, must-revalidate, proxy-revalidate, private'
  );
  response.headers.set('Pragma', 'no-cache');
  response.headers.set('Expires', '0');
}

export const config = {
  matcher: ['/admin/:path*'],
};
