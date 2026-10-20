import { describe, expect, it } from 'vitest';
import { handleServiceError } from '@/app/(frontend)/[locale]/lib/handleServiceError';
import {
  NotFoundError,
  PeriodMovedError,
  ServerError,
  ValidationError,
} from '@/app/(backend)/lib/errors';

function catchValue(fn: () => unknown): unknown {
  try {
    fn();
  } catch (error) {
    return error;
  }
  throw new Error('expected the call to throw');
}

describe('handleServiceError', () => {
  it.each([
    ['NotFoundError', new NotFoundError('x')],
    ['ValidationError', new ValidationError('x')],
  ])('maps %s to a 404', (_name, error) => {
    expect(catchValue(() => handleServiceError(error))).toMatchObject({
      digest: 'NEXT_HTTP_ERROR_FALLBACK;404',
    });
  });

  it.each([
    ['ServerError', new ServerError('boom')],
    ['a generic Error', new Error('boom')],
    ['PeriodMovedError', new PeriodMovedError('2024')],
  ])('rethrows %s unchanged', (_name, error) => {
    expect(catchValue(() => handleServiceError(error))).toBe(error);
  });

  it('rethrows a non-Error value as is', () => {
    expect(catchValue(() => handleServiceError('oops'))).toBe('oops');
  });
});
