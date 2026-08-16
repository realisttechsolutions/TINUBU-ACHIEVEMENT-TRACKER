// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { isCloudSqlDataEnabled, readCloudSqlConfig } from '@/server/db/config';

const valid = {
  INSTANCE_CONNECTION_NAME: 'tinubu-achievement-stg:us-central1:tat-db-staging',
  DB_NAME: 'tat_staging',
  IAM_DB_USER: 'firebase-app-hosting-compute@tinubu-achievement-stg.iam',
  ALLOWED_CLOUD_SQL_PROJECT: 'tinubu-achievement-stg',
};

describe('Cloud SQL runtime configuration', () => {
  it('accepts the explicit staging IAM configuration without credentials', () => {
    const config = readCloudSqlConfig(valid);
    expect(config.projectId).toBe('tinubu-achievement-stg');
    expect(config.DB_POOL_MAX).toBe(4);
    expect(config).not.toHaveProperty('password');
  });

  it('fails closed on a project mismatch and a full service-account email', () => {
    expect(() => readCloudSqlConfig({ ...valid, ALLOWED_CLOUD_SQL_PROJECT: 'another-project' })).toThrow('allowlist');
    expect(() => readCloudSqlConfig({ ...valid, IAM_DB_USER: 'reader@example.iam.gserviceaccount.com' })).toThrow('IAM_DB_USER');
  });

  it('requires an explicit known data-source mode', () => {
    expect(isCloudSqlDataEnabled({ TAT_DATA_SOURCE: 'cloud-sql' })).toBe(true);
    expect(isCloudSqlDataEnabled({ TAT_DATA_SOURCE: 'synthetic' })).toBe(false);
    expect(() => isCloudSqlDataEnabled({ TAT_DATA_SOURCE: 'fallback-on-error' })).toThrow();
  });
});
