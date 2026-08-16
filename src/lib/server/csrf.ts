/**
 * Anti-CSRF Protection for Administrative Endpoints
 * Development Mission 10E
 */

import 'server-only';
import { type NextRequest } from 'next/server';
import { CSRF_HEADER_NAME, CSRF_HEADER_EXPECTED_VALUE } from '../auth/types';

export { CSRF_HEADER_NAME, CSRF_HEADER_EXPECTED_VALUE };

/**
 * Validates that an incoming administrative POST request contains the required
 * custom CSRF protection header and valid Origin/Referer headers.
 */
export function validateCsrf(request: NextRequest): boolean {
  // 1. Check custom anti-CSRF header
  const customHeader = request.headers.get(CSRF_HEADER_NAME);
  if (customHeader === CSRF_HEADER_EXPECTED_VALUE) {
    return true;
  }

  // 2. Validate Origin header
  const origin = request.headers.get('origin');
  const host = request.headers.get('host');

  if (origin && host) {
    try {
      const originUrl = new URL(origin);
      if (originUrl.host === host) {
        return true;
      }
    } catch {
      // Invalid origin URL
    }
  }

  // 3. Fallback to Referer header check
  const referer = request.headers.get('referer');
  if (referer && host) {
    try {
      const refererUrl = new URL(referer);
      if (refererUrl.host === host) {
        return true;
      }
    } catch {
      // Invalid referer URL
    }
  }

  return false;
}
