import { describe, expect, it } from 'vitest';
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

describe('errors', () => {
  describe('message based errors', () => {
    it.each([
      ValidationError,
      NotFoundError,
      UnauthorizedError,
      ForbiddenError,
      ConflictError,
      ServerError,
    ])('%s keeps its name, message and prototype chain', (ErrorClass) => {
      const error = new ErrorClass('msg');

      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(ErrorClass);
      expect(error.name).toBe(ErrorClass.name);
      expect(error.message).toBe('msg');
    });
  });

  describe('RateLimitError', () => {
    it('exposes the retry delay and builds the message from it', () => {
      const error = new RateLimitError(42);

      expect(error).toBeInstanceOf(Error);
      expect(error.name).toBe('RateLimitError');
      expect(error.retryAfterSeconds).toBe(42);
      expect(error.message).toBe('Rate limit exceeded. Please try again in 42 seconds.');
    });
  });

  describe('PeriodMovedError', () => {
    it('exposes the new slug and builds the message from it', () => {
      const error = new PeriodMovedError('2024');

      expect(error).toBeInstanceOf(Error);
      expect(error.name).toBe('PeriodMovedError');
      expect(error.slug).toBe('2024');
      expect(error.message).toBe('The period was moved to "2024".');
    });
  });

  describe('class identity', () => {
    it('keeps the classes distinct from each other', () => {
      expect(new NotFoundError('x') instanceof ValidationError).toBe(false);
      expect(new RateLimitError(1) instanceof PeriodMovedError).toBe(false);
    });
  });
});
