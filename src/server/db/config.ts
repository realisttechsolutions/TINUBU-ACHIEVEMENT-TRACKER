import { z } from 'zod';

const cloudSqlConfigSchema = z.object({
  INSTANCE_CONNECTION_NAME: z.string().regex(
    /^[a-z][a-z0-9-]{4,28}[a-z0-9]:[a-z0-9-]+:[a-z][a-z0-9-]*$/,
    'must be project:region:instance',
  ),
  DB_NAME: z.string().regex(/^[a-z_][a-z0-9_]*$/),
  IAM_DB_USER: z.string().min(3).refine(
    (value) => !value.endsWith('.gserviceaccount.com'),
    'PostgreSQL service-account usernames must omit .gserviceaccount.com',
  ),
  ALLOWED_CLOUD_SQL_PROJECT: z.string().min(6),
  DB_IP_TYPE: z.enum(['PUBLIC', 'PRIVATE', 'PSC']).default('PUBLIC'),
  DB_POOL_MAX: z.coerce.number().int().min(1).max(10).default(4),
  DB_IDLE_TIMEOUT_MS: z.coerce.number().int().min(1_000).max(120_000).default(10_000),
  DB_CONNECTION_TIMEOUT_MS: z.coerce.number().int().min(1_000).max(60_000).default(10_000),
  DB_STATEMENT_TIMEOUT_MS: z.coerce.number().int().min(1_000).max(120_000).default(15_000),
});

export type CloudSqlConfig = z.infer<typeof cloudSqlConfigSchema> & {
  projectId: string;
};

export function readCloudSqlConfig(environment: Record<string, string | undefined> = process.env): CloudSqlConfig {
  const parsed = cloudSqlConfigSchema.safeParse(environment);
  if (!parsed.success) {
    const fields = parsed.error.issues.map((issue) => issue.path.join('.') || 'configuration');
    throw new Error(`Invalid Cloud SQL runtime configuration: ${[...new Set(fields)].join(', ')}`);
  }

  const projectId = parsed.data.INSTANCE_CONNECTION_NAME.split(':', 1)[0];
  if (projectId !== parsed.data.ALLOWED_CLOUD_SQL_PROJECT) {
    throw new Error('Cloud SQL project does not match the explicit runtime allowlist.');
  }

  return { ...parsed.data, projectId };
}

export function isCloudSqlDataEnabled(environment: Record<string, string | undefined> = process.env): boolean {
  const value = environment.TAT_DATA_SOURCE ?? 'synthetic';
  if (value !== 'synthetic' && value !== 'cloud-sql') {
    throw new Error('TAT_DATA_SOURCE must be synthetic or cloud-sql.');
  }
  return value === 'cloud-sql';
}
