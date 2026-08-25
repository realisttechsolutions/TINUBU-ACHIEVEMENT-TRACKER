import 'server-only';
import { cookies } from 'next/headers';
import { GoogleAuth } from 'google-auth-library';
import { CSRF_HEADER_NAME, CSRF_HEADER_EXPECTED_VALUE } from '@/lib/auth/types';

const auth = new GoogleAuth();

export function getAdminControlPlaneUrl(): string {
  return process.env.ADMIN_CONTROL_PLANE_URL || 'https://tat-admin-api-staging-jhekxvkq5q-uc.a.run.app';
}

/**
 * Proxy request to the dedicated Admin Control Plane with Google Service-to-Service
 * authentication token and forwarded human Firebase admin session cookie.
 */
export async function forwardToAdminControlPlane(
  path: string,
  options: {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    body?: any;
  },
): Promise<{ status: number; data: any }> {
  const baseUrl = getAdminControlPlaneUrl();
  const targetUrl = `${baseUrl.replace(/\/$/, '')}${path.startsWith('/') ? path : `/${path}`}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    [CSRF_HEADER_NAME]: CSRF_HEADER_EXPECTED_VALUE,
  };

  // 1. Attach human session cookie from incoming request context
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('tat_admin_session')?.value;
    if (sessionCookie) {
      headers['Cookie'] = `tat_admin_session=${sessionCookie}`;
      headers['x-tat-admin-session'] = sessionCookie;
    }
  } catch {
    // Context without cookies (e.g. testing)
  }

  // 2. Attach Google Service-to-Service ID token when running in Google Cloud
  if (baseUrl.includes('.run.app') || process.env.K_SERVICE) {
    try {
      const client = await auth.getIdTokenClient(baseUrl);
      const idTokenHeaders = await client.getRequestHeaders(targetUrl);
      if (idTokenHeaders.Authorization) {
        headers['Authorization'] = idTokenHeaders.Authorization;
      }
    } catch (err) {
      console.warn('Google Auth ID Token generation skipped or failed:', (err as Error).message);
    }
  }

  try {
    const res = await fetch(targetUrl, {
      method: options.method,
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined,
      cache: 'no-store',
    });

    let data: any = {};
    const text = await res.text();
    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        data = { message: text };
      }
    }

    return { status: res.status, data };
  } catch (error: any) {
    console.error('Failed to proxy request to Admin Control Plane:', error);
    return {
      status: 502,
      data: { error: 'Bad Gateway: Unable to connect to dedicated admin control plane.' },
    };
  }
}
