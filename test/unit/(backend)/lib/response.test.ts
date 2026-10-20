import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  ConflictError,
  ForbiddenError,
  NotFoundError,
  PeriodMovedError,
  RateLimitError,
  ServerError,
  UnauthorizedError,
  ValidationError,
} from '@/app/(backend)/lib/errors';
import { handleError, res } from '@/app/(backend)/lib/response';
import { importFresh } from '@/test/helpers/freshImport';
import { logMock } from '@/test/helpers/loggerMock';
import { readJson } from '@/test/helpers/route';

vi.mock('@/app/(backend)/core/logger', async () => (await import('@/test/helpers/loggerMock')).loggerModule());

type ErrorBody = { error: string };

describe('response', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  describe('res.ok', () => {
    it('returns 200 with a JSON body and no cache-control', async () => {
      const response = res.ok({ a: 1 });

      expect(response.status).toBe(200);
      expect(response.headers.get('content-type')).toBe('application/json');
      expect(response.headers.get('cache-control')).toBeNull();
      expect(await readJson(response)).toEqual({ a: 1 });
    });

    it('merges the extra headers', () => {
      const response = res.ok({ a: 1 }, { 'X-Test': '1', 'Cache-Control': 'public' });

      expect(response.headers.get('x-test')).toBe('1');
      expect(response.headers.get('cache-control')).toBe('public');
    });
  });

  describe('res.created', () => {
    it('returns 201 with no-store', async () => {
      const response = res.created({ id: 1 });

      expect(response.status).toBe(201);
      expect(response.headers.get('cache-control')).toBe('no-store');
      expect(response.headers.get('content-type')).toBe('application/json');
      expect(await readJson(response)).toEqual({ id: 1 });
    });
  });

  describe('res.noContent', () => {
    it('returns 204 with an empty body', async () => {
      const response = res.noContent();

      expect(response.status).toBe(204);
      expect(await response.text()).toBe('');
    });
  });

  describe('error helpers in production', () => {
    it.each([
      ['validationError', () => res.validationError('x'), 400, 'Invalid request'],
      ['unauthorized', () => res.unauthorized(), 401, 'Unauthorized'],
      ['forbidden', () => res.forbidden(), 403, 'Forbidden'],
      ['notFound', () => res.notFound(), 404, 'Not found'],
      ['conflict', () => res.conflict('x'), 409, 'Conflict'],
      ['serverError', () => res.serverError(), 500, 'Internal server error'],
      ['tooManyRequests', () => res.tooManyRequests(), 429, 'Too many requests'],
    ])('%s returns the generic body', async (_name, call, status, error) => {
      const response = call();

      expect(response.status).toBe(status);
      expect(await readJson<ErrorBody>(response)).toEqual({ error });
      expect(response.headers.get('cache-control')).toBe('no-store');
      expect(response.headers.get('content-type')).toBe('application/json');
    });

    it('tooManyRequests defaults retry-after to 60', () => {
      expect(res.tooManyRequests().headers.get('retry-after')).toBe('60');
    });

    it('tooManyRequests uses the given retry-after', () => {
      expect(res.tooManyRequests('m', 7).headers.get('retry-after')).toBe('7');
    });
  });

  describe('handleError in production', () => {
    it.each([
      ['ValidationError', new ValidationError('x'), 400, 'Invalid request'],
      ['UnauthorizedError', new UnauthorizedError('x'), 401, 'Unauthorized'],
      ['ForbiddenError', new ForbiddenError('x'), 403, 'Forbidden'],
      ['NotFoundError', new NotFoundError('x'), 404, 'Not found'],
      ['ConflictError', new ConflictError('x'), 409, 'Conflict'],
      ['RateLimitError', new RateLimitError(42), 429, 'Too many requests'],
      ['PeriodMovedError', new PeriodMovedError('2024'), 404, 'Not found'],
      ['ServerError', new ServerError('x'), 500, 'Internal server error'],
    ])('maps %s to its status without logging', async (_name, error, status, message) => {
      const response = handleError('GET /x', error);

      expect(response.status).toBe(status);
      expect(await readJson<ErrorBody>(response)).toEqual({ error: message });
      expect(response.headers.get('cache-control')).toBe('no-store');
      expect(logMock).not.toHaveBeenCalled();
    });

    it('sets retry-after for a RateLimitError', () => {
      expect(handleError('GET /x', new RateLimitError(42)).headers.get('retry-after')).toBe('42');
    });

    it('logs and hides an unclassified Error', async () => {
      const response = handleError('GET /x', new Error('boom'));

      expect(response.status).toBe(500);
      expect(await readJson<ErrorBody>(response)).toEqual({ error: 'Internal server error' });
      expect(logMock).toHaveBeenCalledTimes(1);
      expect(logMock).toHaveBeenCalledWith('[GET /x] Unhandled error: boom', 'error');
    });

    it('logs a thrown string', () => {
      const response = handleError('GET /x', 'oops');

      expect(response.status).toBe(500);
      expect(logMock).toHaveBeenCalledWith('[GET /x] Unhandled error: oops', 'error');
    });

    it('logs a thrown null', () => {
      handleError('t', null);

      expect(logMock).toHaveBeenCalledWith('[t] Unhandled error: null', 'error');
    });
  });

  describe('handleError in development', () => {
    async function loadDev() {
      vi.stubEnv('NODE_ENV', 'development');

      return importFresh(async () => ({
        ...(await import('@/app/(backend)/lib/response')),
        errors: await import('@/app/(backend)/lib/errors'),
      }));
    }

    it.each([
      ['ValidationError', (e: Awaited<ReturnType<typeof loadDev>>['errors']) => new e.ValidationError('bad'), 400, 'bad'],
      ['UnauthorizedError', (e: Awaited<ReturnType<typeof loadDev>>['errors']) => new e.UnauthorizedError('u'), 401, 'u'],
      ['ForbiddenError', (e: Awaited<ReturnType<typeof loadDev>>['errors']) => new e.ForbiddenError('f'), 403, 'f'],
      ['NotFoundError', (e: Awaited<ReturnType<typeof loadDev>>['errors']) => new e.NotFoundError('nf'), 404, 'nf'],
      ['ConflictError', (e: Awaited<ReturnType<typeof loadDev>>['errors']) => new e.ConflictError('c'), 409, 'c'],
      ['ServerError', (e: Awaited<ReturnType<typeof loadDev>>['errors']) => new e.ServerError('s'), 500, 's'],
      [
        'RateLimitError',
        (e: Awaited<ReturnType<typeof loadDev>>['errors']) => new e.RateLimitError(42),
        429,
        'Rate limit exceeded. Please try again in 42 seconds.',
      ],
      [
        'PeriodMovedError',
        (e: Awaited<ReturnType<typeof loadDev>>['errors']) => new e.PeriodMovedError('2024'),
        404,
        'The period was moved to "2024".',
      ],
    ])('exposes the message of %s', async (_name, build, status, message) => {
      const { handleError: handleDev, errors } = await loadDev();

      const response = handleDev('GET /x', build(errors));

      expect(response.status).toBe(status);
      expect(await readJson<ErrorBody>(response)).toEqual({ error: message });
      expect(logMock).not.toHaveBeenCalled();
    });

    it('sets retry-after for a RateLimitError', async () => {
      const { handleError: handleDev, errors } = await loadDev();

      const response = handleDev('GET /x', new errors.RateLimitError(42));

      expect(response.headers.get('retry-after')).toBe('42');
    });

    it('still hides an unclassified Error and logs it', async () => {
      const { handleError: handleDev } = await loadDev();

      const response = handleDev('GET /x', new Error('boom'));

      expect(response.status).toBe(500);
      expect(await readJson<ErrorBody>(response)).toEqual({ error: 'Internal server error' });
      expect(logMock).toHaveBeenCalledTimes(1);
    });
  });
});
