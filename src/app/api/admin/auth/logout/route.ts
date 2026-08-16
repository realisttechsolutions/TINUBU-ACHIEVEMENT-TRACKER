/**
 * Administrative Logout Endpoint
 * POST /api/admin/auth/logout
 * Development Mission 10E
 */

import { NextResponse, type NextRequest } from 'next/server';
import { revokeStaffSession, ADMIN_SESSION_COOKIE_NAME } from '@/lib/server/session';
import { validateCsrf } from '@/lib/server/csrf';

export async function POST(request: NextRequest) {
  // 1. Enforce Anti-CSRF Check
  if (!validateCsrf(request)) {
    return NextResponse.json(
      { error: 'Invalid or missing CSRF token.' },
      { status: 403 }
    );
  }

  const sessionCookie = request.cookies.get(ADMIN_SESSION_COOKIE_NAME)?.value;

  if (sessionCookie) {
    await revokeStaffSession(sessionCookie);
  }

  const response = NextResponse.json({ success: true });

  // Clear session cookie
  response.cookies.set({
    name: ADMIN_SESSION_COOKIE_NAME,
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });

  response.headers.set('Cache-Control', 'no-store, private');
  return response;
}
