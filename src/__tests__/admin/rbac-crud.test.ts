import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

const mocks = vi.hoisted(() => ({
  requireStaffAuth: vi.fn(),
  validateCsrfProtection: vi.fn(),
  listAdminRecords: vi.fn(),
  createRecord: vi.fn(),
  getAdminRecordDetail: vi.fn(),
  updateRecordOverview: vi.fn(),
}));

vi.mock('@/lib/server/admin-guard', () => ({
  requireStaffAuth: mocks.requireStaffAuth,
}));

vi.mock('@/lib/server/csrf', () => ({
  validateCsrfProtection: mocks.validateCsrfProtection,
}));

vi.mock('@/server/admin/records-service', () => ({
  listAdminRecords: mocks.listAdminRecords,
  createRecord: mocks.createRecord,
  getAdminRecordDetail: mocks.getAdminRecordDetail,
  updateRecordOverview: mocks.updateRecordOverview,
}));

import { GET as getRecords, POST as postRecord } from '@/app/api/admin/records/route';
import { GET as getRecordDetail, PUT as putRecord } from '@/app/api/admin/records/[id]/route';

describe('Admin CRUD API Authorization & Route Guards (Mission 10F)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/admin/records', () => {
    it('returns 401 when unauthenticated', async () => {
      mocks.requireStaffAuth.mockRejectedValueOnce(new Error('UNAUTHENTICATED'));
      const req = new NextRequest('http://localhost:3000/api/admin/records');
      const res = await getRecords(req);
      expect(res.status).toBe(401);
    });

    it('returns records list for any valid authenticated staff role (e.g. reviewer)', async () => {
      mocks.requireStaffAuth.mockResolvedValueOnce({
        uid: 'test-reviewer-uid',
        email: 'reviewer@example.com',
        role: 'reviewer',
        emailVerified: true,
      });
      mocks.listAdminRecords.mockResolvedValueOnce({
        records: [],
        total: 0,
        page: 1,
        limit: 20,
        totalPages: 1,
      });

      const req = new NextRequest('http://localhost:3000/api/admin/records');
      const res = await getRecords(req);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.total).toBe(0);
    });
  });

  describe('POST /api/admin/records (Create Draft)', () => {
    it('returns 403 Forbidden when attempted by Reviewer role', async () => {
      mocks.requireStaffAuth.mockResolvedValueOnce({
        uid: 'test-reviewer-uid',
        email: 'reviewer@example.com',
        role: 'reviewer',
        emailVerified: true,
      });

      const req = new NextRequest('http://localhost:3000/api/admin/records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-tat-admin-csrf': '1' },
        body: JSON.stringify({
          record_type: 'achievement',
          title: 'Unauthorized Record',
          slug: 'unauthorized-record',
        }),
      });

      const res = await postRecord(req);
      expect(res.status).toBe(403);
      const data = await res.json();
      expect(data.error).toContain('Insufficient role permissions');
    });

    it('returns 403 Forbidden when CSRF header is missing', async () => {
      mocks.requireStaffAuth.mockResolvedValueOnce({
        uid: 'test-researcher-uid',
        email: 'researcher@example.com',
        role: 'researcher',
        emailVerified: true,
      });
      mocks.validateCsrfProtection.mockReturnValueOnce(false);

      const req = new NextRequest('http://localhost:3000/api/admin/records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          record_type: 'achievement',
          title: 'Valid Record',
          slug: 'valid-record',
        }),
      });

      const res = await postRecord(req);
      expect(res.status).toBe(403);
      const data = await res.json();
      expect(data.error).toContain('CSRF validation failed');
    });

    it('successfully creates draft record when requested by Researcher', async () => {
      mocks.requireStaffAuth.mockResolvedValueOnce({
        uid: 'test-researcher-uid',
        email: 'researcher@example.com',
        role: 'researcher',
        emailVerified: true,
      });
      mocks.validateCsrfProtection.mockReturnValueOnce(true);
      mocks.createRecord.mockResolvedValueOnce({
        id: 'rec-12345',
        slug: 'lagos-calabar-coastal-highway',
      });

      const req = new NextRequest('http://localhost:3000/api/admin/records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-tat-admin-csrf': '1' },
        body: JSON.stringify({
          record_type: 'achievement',
          title: 'Lagos-Calabar Coastal Highway',
          slug: 'lagos-calabar-coastal-highway',
        }),
      });

      const res = await postRecord(req);
      expect(res.status).toBe(201);
      const data = await res.json();
      expect(data.success).toBe(true);
      expect(data.id).toBe('rec-12345');
    });
  });

  describe('PUT /api/admin/records/[id] (Concurrency Conflict Handling)', () => {
    it('returns 409 Conflict when record has been updated concurrently', async () => {
      mocks.requireStaffAuth.mockResolvedValueOnce({
        uid: 'test-super-admin-uid',
        email: 'superadmin@example.com',
        role: 'super_admin',
        emailVerified: true,
      });
      mocks.validateCsrfProtection.mockReturnValueOnce(true);
      mocks.updateRecordOverview.mockRejectedValueOnce(new Error('CONCURRENCY_CONFLICT'));

      const req = new NextRequest('http://localhost:3000/api/admin/records/rec-123', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-tat-admin-csrf': '1' },
        body: JSON.stringify({
          record_type: 'achievement',
          title: 'Updated Title',
          slug: 'updated-slug',
          expected_updated_at: '2026-08-17T01:00:00Z',
        }),
      });

      const res = await putRecord(req, { params: Promise.resolve({ id: 'rec-123' }) });
      expect(res.status).toBe(409);
      const data = await res.json();
      expect(data.error).toContain('modified by another editor');
    });
  });
});
