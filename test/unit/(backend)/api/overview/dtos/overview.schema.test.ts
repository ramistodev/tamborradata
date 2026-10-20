import { describe, expect, it } from 'vitest';
import { checkParams } from '@/app/(backend)/api/overview/dtos/overview.schema';
import { ValidationError } from '@/app/(backend)/lib/errors';

describe('overview checkParams', () => {
  it.each([null, ''])('defaults to both for %j', (scope) => {
    expect(checkParams(scope as never)).toBe('both');
  });

  it.each(['global', 'last', 'both'] as const)('returns "%s" unchanged', (scope) => {
    expect(checkParams(scope)).toBe(scope);
  });

  it.each(['x', 'GLOBAL'])('rejects the scope "%s"', (scope) => {
    expect(() => checkParams(scope as never)).toThrow(
      new ValidationError(`Invalid scope parameter: ${scope}`)
    );
  });
});
