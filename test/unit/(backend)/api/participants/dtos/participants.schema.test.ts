import { describe, expect, it } from 'vitest';
import { checkParams } from '@/app/(backend)/api/participants/dtos/participants.schema';
import { ValidationError } from '@/app/(backend)/lib/errors';

describe('participants checkParams', () => {
  describe('body shape', () => {
    it.each([null, 'str', undefined, 42])('rejects the body %j', (body) => {
      expect(() => checkParams(body)).toThrow(
        new ValidationError('The request body must be a JSON object')
      );
    });

    it.each([[[]], [{}], [{ participant: 1, schoolKey: 'x' }], [{ participant: 'a b c' }]])(
      'rejects the body %j with non-string parameters',
      (body) => {
        expect(() => checkParams(body)).toThrow(
          new ValidationError("Parameters 'participant' and 'schoolKey' must be strings")
        );
      }
    );
  });

  describe('required values', () => {
    it.each([
      { participant: '', schoolKey: 'x' },
      { participant: 'a b c', schoolKey: '' },
    ])('rejects the body %j with an empty parameter', (body) => {
      expect(() => checkParams(body)).toThrow(
        new ValidationError("Parameters like 'participant' and 'schoolKey' are required")
      );
    });

    it('rejects a whitespace-only schoolKey', () => {
      expect(() => checkParams({ participant: 'a b c', schoolKey: '   ' })).toThrow(
        new ValidationError("The 'schoolKey' parameter cannot be empty")
      );
    });
  });

  describe('participant length', () => {
    it('rejects 121 characters', () => {
      expect(() => checkParams({ participant: 'a '.repeat(60) + 'a', schoolKey: 'x' })).toThrow(
        new ValidationError("The 'participant' parameter cannot be longer than 120 characters")
      );
    });

    it('accepts exactly 120 characters', () => {
      const result = checkParams({ participant: 'a '.repeat(59) + 'aa', schoolKey: 'x' });

      expect(result.tokens).toHaveLength(60);
    });
  });

  describe('minimum words', () => {
    it.each(['Ana Maria', '   ', 'one'])('rejects "%s"', (participant) => {
      expect(() => checkParams({ participant, schoolKey: 'x' })).toThrow(
        new ValidationError("The 'participant' parameter must contain at least three words")
      );
    });

    it('accepts exactly three words', () => {
      expect(checkParams({ participant: 'a b c', schoolKey: 'x' }).tokens).toEqual(['a', 'b', 'c']);
    });
  });

  describe('normalization', () => {
    it('removes accents, lowercases and trims the school key', () => {
      expect(
        checkParams({ participant: '  ÁNA   María\tGarcía ', schoolKey: ' ikastola ' })
      ).toEqual({ tokens: ['ana', 'maria', 'garcia'], schoolKey: 'ikastola' });
    });

    it('normalizes a Basque name', () => {
      expect(checkParams({ participant: 'Iñaki Etxeberria Ruiz', schoolKey: 'x' }).tokens).toEqual([
        'inaki',
        'etxeberria',
        'ruiz',
      ]);
    });

    it('ignores extra properties', () => {
      expect(checkParams({ participant: 'a b c', schoolKey: 'x', extra: true })).toStrictEqual({
        tokens: ['a', 'b', 'c'],
        schoolKey: 'x',
      });
    });
  });
});
