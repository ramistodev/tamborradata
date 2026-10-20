import { describe, expect, it } from 'vitest';
import { categoryDescriptions, statisticCategories } from '@/app/types/statistics';

describe('categoryDescriptions', () => {
  it('describes every category and nothing else', () => {
    const described = new Set(Object.keys(categoryDescriptions));
    const expected = new Set<string>(Object.values(statisticCategories));

    expect({
      missing: [...expected].filter((category) => !described.has(category)),
      extra: [...described].filter((category) => !expected.has(category)),
    }).toEqual({ missing: [], extra: [] });
  });

  it('uses non-empty trimmed strings', () => {
    const offenders = Object.entries<string>(categoryDescriptions)
      .filter(([, text]) => typeof text !== 'string' || text === '' || text !== text.trim())
      .map(([category]) => category);

    expect(offenders).toEqual([]);
  });
});
