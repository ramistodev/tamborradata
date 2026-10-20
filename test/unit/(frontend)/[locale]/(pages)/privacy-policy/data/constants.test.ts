import { describe, expect, it } from 'vitest';

import {
  PRIVACY_POLICY_PUBLISHED,
  PRIVACY_POLICY_UPDATED,
} from '@/app/(frontend)/[locale]/(pages)/privacy-policy/data/constants';

describe('privacy policy constants', () => {
  it.each([
    ['PRIVACY_POLICY_PUBLISHED', PRIVACY_POLICY_PUBLISHED],
    ['PRIVACY_POLICY_UPDATED', PRIVACY_POLICY_UPDATED],
  ])('%s is a valid ISO string', (_name, value) => {
    expect(new Date(value).toISOString()).toBe(value);
  });

  it('never dates the last update before the first publication', () => {
    expect(PRIVACY_POLICY_UPDATED >= PRIVACY_POLICY_PUBLISHED).toBe(true);
  });
});
