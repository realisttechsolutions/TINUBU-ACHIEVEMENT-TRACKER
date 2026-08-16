// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { executeParameterizedQuery } from '@/server/db/pool';

describe('Cloud SQL query failure boundary', () => {
  it('returns a stable failure without leaking driver details', async () => {
    const client = { query: async () => { throw new Error('credential-shaped private detail'); } };
    await expect(executeParameterizedQuery(client as never, 'SELECT $1', ['safe'])).rejects.toThrow('Cloud SQL query failed.');
    try {
      await executeParameterizedQuery(client as never, 'SELECT $1', ['safe']);
    } catch (error) {
      expect((error as Error).message).not.toContain('credential-shaped');
    }
  });
});
