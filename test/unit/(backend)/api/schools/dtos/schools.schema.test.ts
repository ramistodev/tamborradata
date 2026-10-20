import { describe, expect, it } from 'vitest';
import { checkSchoolsParams } from '@/app/(backend)/api/schools/dtos/schools.schema';
import { ValidationError } from '@/app/(backend)/lib/errors';

describe('checkSchoolsParams', () => {
  it.each([null, '', '   '])('returns no query for %j', (query) => {
    expect(checkSchoolsParams(query)).toEqual({});
  });

  it('trims the query', () => {
    expect(checkSchoolsParams(' ikas ')).toEqual({ query: 'ikas' });
  });

  it('accepts exactly 100 characters', () => {
    const query = 'a'.repeat(100);

    expect(checkSchoolsParams(query)).toEqual({ query });
  });

  it('trims before checking the length', () => {
    expect(checkSchoolsParams('a'.repeat(100) + '  ')).toEqual({ query: 'a'.repeat(100) });
  });

  it('rejects 101 characters', () => {
    expect(() => checkSchoolsParams('a'.repeat(101))).toThrow(
      new ValidationError("The 'query' parameter must be at most 100 characters")
    );
  });
});
