import { describe, expect, it, vi } from 'vitest';
import {
  decodeRankCursor,
  decodeSeriesCursor,
  encodeRankCursor,
  encodeSeriesCursor,
} from '@/app/(backend)/lib/encript';
import { ValidationError } from '@/app/(backend)/lib/errors';
import { importFresh } from '@/test/helpers/freshImport';

const rankGlobal = { version: 1, variant: 'global-rank', statisticId: 's', lastId: 'l', rank: 5 } as const;
const rankGrouped = {
  version: 1,
  variant: 'school-grouped-rank',
  statisticId: 's',
  groupSchoolId: 'g',
} as const;
const series = { version: 1, statisticId: 's', lastEntityKey: 'ane' } as const;

const INVALID = new ValidationError("The 'cursor' parameter is not valid");

const encodeRaw = (payload: unknown) => encodeRankCursor(payload as never);
const encodeRawSeries = (payload: unknown) => encodeSeriesCursor(payload as never);

const decoders = [
  ['decodeRankCursor', decodeRankCursor],
  ['decodeSeriesCursor', decodeSeriesCursor],
] as const;

function flipChar(token: string, index = 20): string {
  return token.slice(0, index) + (token[index] === 'A' ? 'B' : 'A') + token.slice(index + 1);
}

describe('encript', () => {
  describe('round trips', () => {
    it('restores a global rank cursor', () => {
      expect(decodeRankCursor(encodeRankCursor(rankGlobal))).toEqual(rankGlobal);
    });

    it('restores a school grouped rank cursor', () => {
      expect(decodeRankCursor(encodeRankCursor(rankGrouped))).toEqual(rankGrouped);
    });

    it('restores a series cursor', () => {
      expect(decodeSeriesCursor(encodeSeriesCursor(series))).toEqual(series);
    });

    it('keeps unicode values', () => {
      const unicode = { ...series, lastEntityKey: 'ñandú' };

      expect(decodeSeriesCursor(encodeSeriesCursor(unicode))).toEqual(unicode);
    });
  });

  describe('randomness and format', () => {
    it('produces a different token on every encode', () => {
      const first = encodeRankCursor(rankGlobal);
      const second = encodeRankCursor(rankGlobal);

      expect(first).not.toBe(second);
      expect(decodeRankCursor(first)).toEqual(rankGlobal);
      expect(decodeRankCursor(second)).toEqual(rankGlobal);
    });

    it('produces a base64url token made of IV, auth tag and ciphertext', () => {
      const token = encodeRankCursor(rankGlobal);

      expect(token).toMatch(/^[A-Za-z0-9_-]+$/);
      expect(Buffer.from(token, 'base64url').length).toBe(
        28 + Buffer.byteLength(JSON.stringify(rankGlobal))
      );
    });
  });

  describe('tampering', () => {
    it('rejects a rank token with a modified byte', () => {
      const flipped = flipChar(encodeRankCursor(rankGlobal));

      expect(() => decodeRankCursor(flipped)).toThrow(INVALID);
    });

    it('rejects a series token with a modified byte', () => {
      const flipped = flipChar(encodeSeriesCursor(series));

      expect(() => decodeSeriesCursor(flipped)).toThrow(INVALID);
    });
  });

  describe('malformed tokens', () => {
    const tokens = [
      '',
      'a+b/=',
      'has space',
      Buffer.alloc(28).toString('base64url'),
      Buffer.alloc(12).toString('base64url'),
      'A'.repeat(100),
    ];

    describe.each(decoders)('%s', (_name, decode) => {
      it.each(tokens)('rejects the token "%s"', (token) => {
        expect(() => decode(token)).toThrow(INVALID);
      });
    });
  });

  describe('wrong secret', () => {
    async function encodeWithOtherSecret() {
      vi.stubEnv('SIGNATURE_SECRET', 'another-secret-0123456789abcdef');

      return importFresh(() => import('@/app/(backend)/lib/encript'));
    }

    it('rejects a rank token signed with another secret', async () => {
      const other = await encodeWithOtherSecret();
      const token = other.encodeRankCursor(rankGlobal);

      expect(() => decodeRankCursor(token)).toThrow(INVALID);
    });

    it('rejects a series token signed with another secret', async () => {
      const other = await encodeWithOtherSecret();
      const token = other.encodeSeriesCursor(series);

      expect(() => decodeSeriesCursor(token)).toThrow(INVALID);
    });
  });

  describe('non-object plaintext', () => {
    describe.each(decoders)('%s', (_name, decode) => {
      it.each([
        ['an array', [1]],
        ['null', null],
      ])('rejects a token holding %s', (_label, value) => {
        expect(() => decode(encodeRaw(value))).toThrow(INVALID);
      });
    });
  });

  describe('rank payload validation', () => {
    it.each([
      ['a wrong version', { ...rankGlobal, version: 2 }],
      ['a missing statisticId', { version: 1, variant: 'global-rank', lastId: 'l', rank: 5 }],
      ['an unknown variant', { version: 1, variant: 'unknown', statisticId: 's' }],
      ['a global rank without rank', { version: 1, variant: 'global-rank', statisticId: 's', lastId: 'l' }],
      ['a global rank with a string rank', { ...rankGlobal, rank: '5' }],
      ['a global rank with a numeric lastId', { ...rankGlobal, lastId: 7 }],
      ['a grouped rank without groupSchoolId', { version: 1, variant: 'school-grouped-rank', statisticId: 's' }],
      ['a grouped rank with a numeric groupSchoolId', { ...rankGrouped, groupSchoolId: 3 }],
      ['a series payload', series],
    ])('rejects %s', (_label, payload) => {
      expect(() => decodeRankCursor(encodeRaw(payload))).toThrow(INVALID);
    });

    it('accepts a grouped rank and returns exactly the payload', () => {
      expect(decodeRankCursor(encodeRaw(rankGrouped))).toEqual(rankGrouped);
    });
  });

  describe('series payload validation', () => {
    it.each([
      ['a wrong version', { ...series, version: 2 }],
      ['a missing statisticId', { version: 1, lastEntityKey: 'ane' }],
      ['a missing lastEntityKey', { version: 1, statisticId: 's' }],
      ['a numeric lastEntityKey', { ...series, lastEntityKey: 5 }],
    ])('rejects %s', (_label, payload) => {
      expect(() => decodeSeriesCursor(encodeRawSeries(payload))).toThrow(INVALID);
    });

    it('rejects a rank token', () => {
      expect(() => decodeSeriesCursor(encodeRankCursor(rankGlobal))).toThrow(INVALID);
    });
  });
});
