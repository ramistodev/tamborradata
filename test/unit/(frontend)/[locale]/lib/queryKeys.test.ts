import { describe, expect, it } from 'vitest';
import { queryKeys } from '@/app/(frontend)/[locale]/lib/queryKeys';

describe('queryKeys', () => {
  describe('participants', () => {
    it('builds the key from participant and school key', () => {
      expect(queryKeys.participants('Ane Garcia', 'sk')).toEqual([
        'participants',
        'Ane Garcia',
        'sk',
      ]);
    });

    it('gives deep-equal keys for equal arguments', () => {
      expect(queryKeys.participants('Ane', 'sk')).toEqual(queryKeys.participants('Ane', 'sk'));
    });

    it.each([
      ['participant', queryKeys.participants('Other', 'sk')],
      ['schoolKey', queryKeys.participants('Ane', 'other')],
    ])('changes the key when the %s changes', (_name, changed) => {
      expect(changed).not.toEqual(queryKeys.participants('Ane', 'sk'));
    });
  });

  describe('category', () => {
    it('builds the key from category, period and limit', () => {
      expect(queryKeys.category('topNames', '2024', 10)).toEqual([
        'category',
        'topNames',
        '2024',
        10,
      ]);
    });

    it('keeps an undefined slot when the limit is missing', () => {
      const key = queryKeys.category('topNames', '2024');

      expect(key).toEqual(['category', 'topNames', '2024', undefined]);
      expect(key).toHaveLength(4);
    });

    it('gives deep-equal keys for equal arguments', () => {
      expect(queryKeys.category('topNames', '2024', 10)).toEqual(
        queryKeys.category('topNames', '2024', 10)
      );
    });

    it.each([
      ['category', queryKeys.category('topSchools', '2024', 10)],
      ['period', queryKeys.category('topNames', '2023', 10)],
      ['limit', queryKeys.category('topNames', '2024', 20)],
    ])('changes the key when the %s changes', (_name, changed) => {
      expect(changed).not.toEqual(queryKeys.category('topNames', '2024', 10));
    });
  });
});
