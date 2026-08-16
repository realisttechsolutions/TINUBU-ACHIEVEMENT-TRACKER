// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { isStagingEnvironment } from '@/lib/deployment/environment';
import robots from '@/app/robots';

describe('staging deployment safety', () => {
  it('recognizes only the explicit staging environment', () => {
    expect(isStagingEnvironment({ NEXT_PUBLIC_APP_ENV: 'staging' })).toBe(true);
    expect(isStagingEnvironment({ NEXT_PUBLIC_APP_ENV: 'production' })).toBe(false);
    expect(isStagingEnvironment({})).toBe(false);
  });

  it('disallows every crawler path in staging', () => {
    const previous = process.env.NEXT_PUBLIC_APP_ENV;
    process.env.NEXT_PUBLIC_APP_ENV = 'staging';
    try {
      expect(robots()).toEqual({ rules: { userAgent: '*', disallow: '/' } });
    } finally {
      if (previous === undefined) delete process.env.NEXT_PUBLIC_APP_ENV;
      else process.env.NEXT_PUBLIC_APP_ENV = previous;
    }
  });
});
