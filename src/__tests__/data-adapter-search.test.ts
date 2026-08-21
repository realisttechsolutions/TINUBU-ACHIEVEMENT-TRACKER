import { beforeEach, afterEach, describe, expect, it } from 'vitest';
import { dataAdapter, hydrateDataAdapter } from '@/adapters/dataAdapter';
import { testPublicSnapshot } from '@/__tests__/testFixtures';

describe('public data adapter search routes', () => {
  beforeEach(() => hydrateDataAdapter(testPublicSnapshot));
  afterEach(() => hydrateDataAdapter(null));

  it('maps project, policy and programme results to their public record pages', () => {
    const project = dataAdapter.getProjects()[0];
    const policy = dataAdapter.getPolicies()[0];
    const programme = dataAdapter.getProgrammes()[0];

    expect(dataAdapter.searchGlobal(project.title).find((result) => result.id === project.id)?.url)
      .toBe(`/projects/${project.slug}`);
    expect(dataAdapter.searchGlobal(policy.title).find((result) => result.id === policy.id)?.url)
      .toBe(`/policies/${policy.slug}`);
    expect(dataAdapter.searchGlobal(programme.title).find((result) => result.id === programme.id)?.url)
      .toBe(`/programmes/${programme.slug}`);
  });
});
