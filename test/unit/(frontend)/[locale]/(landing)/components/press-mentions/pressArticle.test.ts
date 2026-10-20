import { describe, expect, it } from 'vitest';

import { pressArticle } from '@/app/(frontend)/[locale]/(landing)/components/press-mentions/pressArticle';

describe('pressArticle', () => {
  it.each(Object.entries(pressArticle))('has a non-empty string in %s', (_key, value) => {
    expect(typeof value).toBe('string');
    expect(value.length).toBeGreaterThan(0);
  });

  it('links to the host over https', () => {
    expect(pressArticle.url.startsWith('https://')).toBe(true);
    expect(pressArticle.url).toContain(pressArticle.host);
  });

  it('has a valid ISO calendar date', () => {
    expect(new Date(pressArticle.isoDate).toISOString().slice(0, 10)).toBe(pressArticle.isoDate);
  });

  it('keeps the Spanish source data as plain text, not as message keys', () => {
    expect(pressArticle.publication).toBe('El Diario Vasco');
    expect(pressArticle.headline).toBe('Tamborradata.com, la fiesta en datos');
    expect(pressArticle.author).toBe('Jorge F. Mendiola');
  });
});
