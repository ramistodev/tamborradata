import { describe, expect, it } from 'vitest';
import {
  arrayLengths,
  flattenMessages,
  icuSignature,
  LOCALES,
  messagesByLocale,
} from '@/test/helpers/messages';

describe('messages helpers', () => {
  describe('icuSignature', () => {
    it.each([
      ['plain text', []],
      ['{name}', ['name']],
      ['Hi {name}, <b>{count, plural, one {# x} other {# xs}}</b>', ['<b>', 'count', 'name']],
      ['{a, plural, one {{b, select, x {X} other {Y}}} other {#}}', ['a', 'b']],
      ['Hay datos.{hasGaps, select, yes { No hay datos de {missingYears}.} other {}}', ['hasGaps', 'missingYears']],
      ['<accent>Tamborrada</accent> y <highlight>#</highlight>', ['<accent>', '<highlight>']],
      ['a<br/>b', ['<br>']],
      ["It''s {name}", ['name']],
      ["'{notAnArg}' {real}", ['real']],
      ['a < b', []],
      ['{x} {x}', ['x']],
      ['{n, number, percent}', ['n']],
    ])('extracts the signature from %s', (message, expected) => {
      expect(icuSignature(message as string)).toEqual(expected);
    });

    it('throws for unbalanced braces', () => {
      expect(() => icuSignature('{x')).toThrow(/Unbalanced braces/);
    });
  });

  describe('flattenMessages', () => {
    it('flattens nested objects and arrays', () => {
      expect(flattenMessages({ a: { b: 'x', c: ['y', 'z'] }, d: 'w' })).toEqual({
        'a.b': 'x',
        'a.c.0': 'y',
        'a.c.1': 'z',
        d: 'w',
      });
    });

    it('reports a non-string leaf as empty', () => {
      expect(flattenMessages({ a: 1 })).toEqual({ a: '' });
    });

    it('returns an empty object for an empty tree', () => {
      expect(flattenMessages({})).toEqual({});
    });
  });

  describe('arrayLengths', () => {
    it('returns array paths and lengths', () => {
      expect(arrayLengths({ a: { b: 'x', c: ['y', 'z'] }, d: 'w' })).toEqual({ 'a.c': 2 });
    });

    it('returns an empty object when there are no arrays', () => {
      expect(arrayLengths({ a: 'x' })).toEqual({});
    });

    it('includes nested array paths', () => {
      expect(arrayLengths({ k: [['a'], ['b', 'c']] })).toEqual({ k: 2, 'k.0': 1, 'k.1': 2 });
    });
  });

  it('exports the supported locales and their messages', () => {
    expect(LOCALES).toEqual(['es', 'en', 'eu']);
    expect(Object.keys(messagesByLocale).sort()).toEqual(['en', 'es', 'eu']);
  });
});
