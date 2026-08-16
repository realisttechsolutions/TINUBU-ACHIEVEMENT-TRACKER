import { describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  cloudSqlEnabled: true,
  getDatabaseConnection: vi.fn(),
  readCloudSqlConfig: vi.fn(() => ({ IAM_DB_USER: 'tat_public_reader' })),
  assertPublicDatabaseBoundary: vi.fn(),
}));

vi.mock('@/server/db/config', () => ({
  isCloudSqlDataEnabled: () => mocks.cloudSqlEnabled,
  readCloudSqlConfig: mocks.readCloudSqlConfig,
}));

vi.mock('@/server/db/pool', () => ({
  getDatabaseConnection: mocks.getDatabaseConnection,
}));

vi.mock('@/server/security/public-database-boundary', () => ({
  assertPublicDatabaseBoundary: mocks.assertPublicDatabaseBoundary,
}));

import { GET } from '@/app/api/health/route';

describe('public health route', () => {
  it('returns only a generic healthy status after the Cloud SQL boundary check passes', async () => {
    mocks.cloudSqlEnabled = true;
    mocks.getDatabaseConnection.mockResolvedValue({});
    mocks.assertPublicDatabaseBoundary.mockResolvedValue(undefined);

    const response = await GET();

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ status: 'healthy' });
    expect(mocks.assertPublicDatabaseBoundary).toHaveBeenCalledWith({}, 'tat_public_reader');
  });

  it('does not disclose runtime configuration when the Cloud SQL check fails', async () => {
    mocks.cloudSqlEnabled = true;
    mocks.getDatabaseConnection.mockRejectedValue(new Error('connection failed'));

    const response = await GET();

    expect(response.status).toBe(503);
    expect(await response.json()).toEqual({ status: 'unhealthy' });
  });
});
