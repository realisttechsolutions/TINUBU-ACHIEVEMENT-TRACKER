import { describe, it, expect } from 'vitest';
import { NextRequest } from 'next/server';
import {
  validateCsrf,
  CSRF_HEADER_NAME,
  CSRF_HEADER_EXPECTED_VALUE,
} from '@/lib/server/csrf';

describe('Anti-CSRF Protection for Administrative Endpoints (Mission 10E)', () => {
  it('accepts requests with valid x-tat-admin-csrf header', () => {
    const req = new NextRequest('http://localhost:3000/api/admin/auth/session', {
      method: 'POST',
      headers: {
        [CSRF_HEADER_NAME]: CSRF_HEADER_EXPECTED_VALUE,
      },
    });

    expect(validateCsrf(req)).toBe(true);
  });

  it('rejects requests without csrf header and without matching origin', () => {
    const req = new NextRequest('http://localhost:3000/api/admin/auth/session', {
      method: 'POST',
      headers: {
        host: 'localhost:3000',
        origin: 'https://malicious-attacker-site.com',
      },
    });

    expect(validateCsrf(req)).toBe(false);
  });

  it('accepts requests matching same-origin headers', () => {
    const req = new NextRequest('https://tat-staging.hosted.app/api/admin/auth/session', {
      method: 'POST',
      headers: {
        host: 'tat-staging.hosted.app',
        origin: 'https://tat-staging.hosted.app',
      },
    });

    expect(validateCsrf(req)).toBe(true);
  });

  it('accepts requests matching same-origin referer header', () => {
    const req = new NextRequest('https://tat-staging.hosted.app/api/admin/auth/session', {
      method: 'POST',
      headers: {
        host: 'tat-staging.hosted.app',
        referer: 'https://tat-staging.hosted.app/admin/login',
      },
    });

    expect(validateCsrf(req)).toBe(true);
  });

  it('rejects cross-origin referer without csrf header', () => {
    const req = new NextRequest('https://tat-staging.hosted.app/api/admin/auth/session', {
      method: 'POST',
      headers: {
        host: 'tat-staging.hosted.app',
        referer: 'https://attacker.com/exploit.html',
      },
    });

    expect(validateCsrf(req)).toBe(false);
  });
});
