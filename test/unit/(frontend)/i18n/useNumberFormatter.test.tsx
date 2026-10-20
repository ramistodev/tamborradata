import { describe, expect, it } from 'vitest';
import { useNumberFormatter } from '@/app/(frontend)/i18n/useNumberFormatter';
import { renderHookWithIntl } from '@/test/helpers/renderWithIntl';

describe('useNumberFormatter', () => {
  it('formats Spanish, English, and Basque with stable grouping', () => {
    const es = renderHookWithIntl(() => useNumberFormatter(), { locale: 'es' });
    const en = renderHookWithIntl(() => useNumberFormatter(), { locale: 'en' });
    const eu = renderHookWithIntl(() => useNumberFormatter(), { locale: 'eu' });

    expect(es.result.current.format(1234)).toBe('1.234');
    expect(es.result.current.format(1234.5)).toBe('1.234,5');
    expect(en.result.current.format(1234)).toBe('1,234');
    expect(eu.result.current.format(1234)).toBe('1.234');
  });

  it('merges explicit options over defaults', () => {
    const percent = renderHookWithIntl(
      () => useNumberFormatter({ style: 'percent', maximumFractionDigits: 2 }),
      { locale: 'es' },
    );
    const ungrouped = renderHookWithIntl(() => useNumberFormatter({ useGrouping: false }), { locale: 'es' });
    const compact = renderHookWithIntl(() => useNumberFormatter({ notation: 'compact' }), { locale: 'en' });

    expect(percent.result.current.format(0.1943)).toMatch(/^19,43\s%$/);
    expect(ungrouped.result.current.format(1234)).toBe('1234');
    expect(compact.result.current.format(1500)).toBe('1.5K');
  });

  it('reuses formatters for equal locale and options pairs', () => {
    const options = { maximumFractionDigits: 2 };
    const first = renderHookWithIntl(() => useNumberFormatter(options), { locale: 'es' });
    const formatter = first.result.current;
    first.rerender();
    const second = renderHookWithIntl(() => useNumberFormatter({ maximumFractionDigits: 2 }), { locale: 'es' });
    const english = renderHookWithIntl(() => useNumberFormatter(options), { locale: 'en' });

    expect(first.result.current).toBe(formatter);
    expect(second.result.current).toBe(formatter);
    expect(english.result.current).not.toBe(formatter);
  });
});
