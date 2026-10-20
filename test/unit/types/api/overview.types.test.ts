import { describe, expect, it } from 'vitest';
import { overviewScope } from '@/app/types/api/overview.types';

describe('overviewScope', () => {
  it('declares the overview scopes shared by the API and the pages', () => {
    expect(overviewScope).toEqual({ both: 'both', global: 'global', last: 'last' });
  });
});
