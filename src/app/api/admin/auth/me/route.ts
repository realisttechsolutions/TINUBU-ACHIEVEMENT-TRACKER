/**
 * Administrative Identity Verification Endpoint
 * GET /api/admin/auth/me
 * Development Mission 10E
 */

import { NextResponse, type NextRequest } from 'next/server';
import { verifyStaffSession, ADMIN_SESSION_COOKIE_NAME } from '@/lib/server/session';

export async function GET(request: NextRequest) {
  const sessionCookie = request.cookies.get(ADMIN_SESSION_COOKIE_NAME)?.value;

  if (!sessionCookie) {
    return NextResponse.json(
      { authenticated: false },
      { status: 401, headers: { 'Cache-Control': 'no-store, private' } }
    );
  }

  const staffUser = await verifyStaffSession(sessionCookie);

  if (!staffUser) {
    return NextResponse.json(
      { authenticated: false },
      { status: 401, headers: { 'Cache-Control': 'no-store, private' } }
    );
  }

  return NextResponse.json(
    {
      authenticated: true,
      user: {
        uid: staffUser.uid,
        email: staffUser.email,
        role: staffUser.role,
        displayName: staffUser.displayName,
      },
    },
    { headers: { 'Cache-Control': 'no-store, private' } }
  );
}
