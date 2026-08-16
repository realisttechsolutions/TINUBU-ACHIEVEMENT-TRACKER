/**
 * Administrative Session Creation Endpoint
 * POST /api/admin/auth/session
 * Development Mission 10E
 */

import { NextResponse, type NextRequest } from 'next/server';
import { createStaffSession, getSessionCookieAttributes, AuthSecurityError } from '@/lib/server/session';
import { validateCsrf } from '@/lib/server/csrf';

export async function POST(request: NextRequest) {
  // 1. Enforce Anti-CSRF Check
  if (!validateCsrf(request)) {
    return NextResponse.json(
      { error: 'Invalid or missing CSRF token.' },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const { idToken } = body;

    if (!idToken || typeof idToken !== 'string') {
      return NextResponse.json(
        { error: 'ID token is required.' },
        { status: 400 }
      );
    }

    // 2. Mint session cookie & validate claims
    const { sessionCookie, user } = await createStaffSession(idToken);

    // 3. Construct response with HTTP-only cookie
    const response = NextResponse.json({
      success: true,
      role: user.role,
      email: user.email,
    });

    const cookieOptions = getSessionCookieAttributes(sessionCookie);
    response.cookies.set({
      name: cookieOptions.name,
      value: cookieOptions.value,
      httpOnly: cookieOptions.httpOnly,
      secure: cookieOptions.secure,
      sameSite: cookieOptions.sameSite,
      path: cookieOptions.path,
      maxAge: cookieOptions.maxAge,
    });

    response.headers.set('Cache-Control', 'no-store, private');
    return response;
  } catch (err: unknown) {
    if (err instanceof AuthSecurityError) {
      return NextResponse.json(
        { error: err.message, code: err.code },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'Authentication failed. Please check credentials and staff authorization.' },
      { status: 401 }
    );
  }
}
