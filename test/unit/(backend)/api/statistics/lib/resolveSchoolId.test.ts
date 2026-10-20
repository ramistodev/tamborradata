import { describe, expect, it } from 'vitest';
import {
  extractSchoolPlaceholderIds,
  resolveSchool,
  resolveSchoolIdSummary,
} from '@/app/(backend)/api/statistics/lib/resolveSchoolId';

const schools = new Map([
  ['s1', { schoolId: 's1', canonicalName: 'Escuela Uno', schoolKey: 'escuela-uno' }],
  ['s2', { schoolId: 's2', canonicalName: 'Escuela Dos', schoolKey: 'escuela-dos' }],
]);

describe('resolveSchool', () => {
  it('returns the public school without the internal id', () => {
    expect(resolveSchool('s1', schools)).toStrictEqual({
      canonicalName: 'Escuela Uno',
      schoolKey: 'escuela-uno',
    });
  });

  it('throws for an unknown id', () => {
    expect(() => resolveSchool('zzz', schools)).toThrow(new Error('Failed to resolve school ID: zzz'));
  });
});

describe('extractSchoolPlaceholderIds', () => {
  it.each([
    ['a {{school:s1}} b {{school:s2}}', ['s1', 's2']],
    ['none', []],
    ['{{school:}}', ['']],
  ])('extracts the ids from "%s"', (text, expected) => {
    expect(extractSchoolPlaceholderIds(text)).toEqual(expected);
  });
});

describe('resolveSchoolIdSummary', () => {
  it('returns text without placeholders unchanged', () => {
    expect(resolveSchoolIdSummary('plain text', schools)).toBe('plain text');
  });

  it('replaces every placeholder with the canonical name', () => {
    expect(resolveSchoolIdSummary('{{school:s1}} y {{school:s2}}', schools)).toBe(
      'Escuela Uno y Escuela Dos'
    );
  });

  it('matches the tag case-insensitively', () => {
    expect(resolveSchoolIdSummary('{{SCHOOL:s1}}', schools)).toBe('Escuela Uno');
  });

  it('gives the same result on repeated calls', () => {
    const first = resolveSchoolIdSummary('{{school:s1}}', schools);
    const second = resolveSchoolIdSummary('{{school:s1}}', schools);

    expect(second).toBe(first);
  });

  it('throws for an unknown id', () => {
    expect(() => resolveSchoolIdSummary('{{school:zzz}}', schools)).toThrow(
      new Error('Failed to resolve school ID: zzz')
    );
  });

  it('throws for an empty placeholder', () => {
    expect(() => resolveSchoolIdSummary('{{school:}}', schools)).toThrow(
      new Error('Failed to resolve school ID: ')
    );
  });
});
