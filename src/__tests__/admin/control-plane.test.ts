import { describe, it, expect, vi, beforeEach } from 'vitest';

const mocks = vi.hoisted(() => ({
  verifySessionCookie: vi.fn(),
}));

vi.mock('firebase-admin/app', () => ({
  initializeApp: vi.fn(),
  getApps: vi.fn(() => [{ name: 'test' }]),
  getApp: vi.fn(() => ({ name: 'test' })),
}));

vi.mock('firebase-admin/auth', () => ({
  getAuth: vi.fn(() => ({
    verifySessionCookie: mocks.verifySessionCookie,
  })),
}));

import { authenticateAdminRequest, AuthError } from '@/admin-service/auth';
import { AdminRecordsManager } from '@/admin-service/records';
import type { AdminControlPlaneDb } from '@/admin-service/db';

describe('Admin Control Plane Double Authorization & RBAC (Mission 10F-B)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('rejects unauthenticated requests without session cookie (401)', async () => {
    await expect(authenticateAdminRequest({}, 'write')).rejects.toThrowError(
      new AuthError(401, 'UNAUTHENTICATED: No admin session cookie provided.'),
    );
  });

  it('rejects unverified email accounts (403)', async () => {
    mocks.verifySessionCookie.mockResolvedValueOnce({
      uid: 'user-1',
      email: 'user@example.com',
      email_verified: false,
      tat_staff: true,
      tat_role: 'super_admin',
    });

    await expect(
      authenticateAdminRequest({ cookie: 'tat_admin_session=valid-session-token' }, 'write'),
    ).rejects.toThrowError(new AuthError(403, 'FORBIDDEN: Email address must be verified.'));
  });

  it('rejects non-staff users (403)', async () => {
    mocks.verifySessionCookie.mockResolvedValueOnce({
      uid: 'user-2',
      email: 'user@example.com',
      email_verified: true,
      tat_staff: false,
      tat_role: 'super_admin',
    });

    await expect(
      authenticateAdminRequest({ cookie: 'tat_admin_session=valid-session-token' }, 'write'),
    ).rejects.toThrowError(new AuthError(403, 'FORBIDDEN: Account does not have staff credentials.'));
  });

  it('strictly rejects Reviewer role from mutations (403)', async () => {
    mocks.verifySessionCookie.mockResolvedValueOnce({
      uid: 'reviewer-1',
      email: 'reviewer@example.com',
      email_verified: true,
      tat_staff: true,
      tat_role: 'reviewer',
    });

    await expect(
      authenticateAdminRequest({ cookie: 'tat_admin_session=valid-session-token' }, 'write'),
    ).rejects.toThrowError(
      new AuthError(403, 'FORBIDDEN: Role reviewer is not authorized for administrative mutations.'),
    );
  });

  it('strictly rejects Publisher role from mutations (403)', async () => {
    mocks.verifySessionCookie.mockResolvedValueOnce({
      uid: 'publisher-1',
      email: 'publisher@example.com',
      email_verified: true,
      tat_staff: true,
      tat_role: 'publisher',
    });

    await expect(
      authenticateAdminRequest({ cookie: 'tat_admin_session=valid-session-token' }, 'write'),
    ).rejects.toThrowError(
      new AuthError(403, 'FORBIDDEN: Role publisher is not authorized for administrative mutations.'),
    );
  });

  it('authorizes Researcher and Super Admin roles for mutations', async () => {
    mocks.verifySessionCookie.mockResolvedValueOnce({
      uid: 'researcher-1',
      email: 'researcher@example.com',
      email_verified: true,
      tat_staff: true,
      tat_role: 'researcher',
    });

    const staffResearcher = await authenticateAdminRequest(
      { cookie: 'tat_admin_session=valid-session-token' },
      'write',
    );
    expect(staffResearcher.role).toBe('researcher');

    mocks.verifySessionCookie.mockResolvedValueOnce({
      uid: 'superadmin-1',
      email: 'superadmin@example.com',
      email_verified: true,
      tat_staff: true,
      tat_role: 'super_admin',
    });

    const staffSuperAdmin = await authenticateAdminRequest(
      { cookie: 'tat_admin_session=valid-session-token' },
      'write',
    );
    expect(staffSuperAdmin.role).toBe('super_admin');
  });

  it('executes transaction rollback smoke test and asserts zero persistent data', async () => {
    const executedQueries: string[] = [];
    const mockDb: AdminControlPlaneDb = {
      query: vi.fn(),
      async withTransaction<T>(callback: (client: any) => Promise<T>): Promise<T> {
        try {
          return await callback({
            async query(text: string, values?: any[]) {
              executedQueries.push(text.trim());
              return { rows: [], rowCount: 1 };
            },
          });
        } catch (err) {
          executedQueries.push('ROLLBACK');
          throw err;
        }
      },
      close: vi.fn(),
    };

    const manager = new AdminRecordsManager(mockDb);
    const result = await manager.smokeTestRollback();

    expect(result.success).toBe(true);
    expect(result.operationsTested).toContain('ROLLBACK verified');
    expect(executedQueries).toContain('ROLLBACK');
  });
});
