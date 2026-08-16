// @vitest-environment node
import { describe, expect, it, vi } from 'vitest';
import { assertPublicDatabaseBoundary } from '@/server/security/public-database-boundary';

const enforcedBoundary = {
  expected_identity: true,
  public_role_member: true,
  database_connect: true,
  schema_usage: true,
  required_view_select: true,
  zero_base_table_select: true,
  zero_relation_writes: true,
  zero_schema_or_database_create: true,
  zero_relation_ownership: true,
  restricted_login_role: true,
  zero_privileged_role_membership: true,
};

describe('live public database boundary verifier', () => {
  it('accepts only the complete public-reader boundary', async () => {
    const query = vi.fn().mockResolvedValue({ rows: [enforcedBoundary], rowCount: 1 });
    await expect(assertPublicDatabaseBoundary({ query }, 'runtime@example.iam')).resolves.toBeUndefined();
    expect(query).toHaveBeenCalledOnce();
    expect(query.mock.calls[0][1]).toEqual([
      'runtime@example.iam',
      [
        'public_record_catalog',
        'public_claim_evidence',
        'public_financial_records',
        'public_beneficiary_records',
      ],
    ]);
  });

  it('fails closed when any privilege assertion is false', async () => {
    const query = vi.fn().mockResolvedValue({
      rows: [{ ...enforcedBoundary, zero_base_table_select: false }],
      rowCount: 1,
    });
    await expect(assertPublicDatabaseBoundary({ query }, 'runtime@example.iam')).rejects.toThrow(
      'Public database boundary verification failed.',
    );
  });
});
