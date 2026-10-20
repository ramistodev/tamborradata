import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { DivergingValue, RankBar } from '@/app/(frontend)/[locale]/(pages)/statistics/[period]/components/renders/RankBar';
import { renderWithIntl } from '@/test/helpers/renderWithIntl';

function bar(props: Partial<Parameters<typeof RankBar>[0]> = {}) {
  const { container } = render(
    <RankBar value={50} maxAbsValue={100} isHighlighted isDiverging={false} {...props} />,
  );
  return container;
}

describe('RankBar', () => {
  describe('plain bar', () => {
    it('is hidden from assistive technology', () => {
      expect(bar().firstElementChild).toHaveAttribute('aria-hidden', 'true');
    });

    it('sizes the inner bar relative to the maximum', () => {
      expect(bar({ value: 50, maxAbsValue: 100 }).querySelector<HTMLElement>(':scope > div > div')?.style.width).toBe('50%');
    });

    it('enforces a minimum width of 2 percent', () => {
      expect(bar({ value: 1, maxAbsValue: 1000 }).querySelector<HTMLElement>(':scope > div > div')?.style.width).toBe('2%');
    });

    it('collapses to 0 percent when the maximum is 0', () => {
      expect(bar({ value: 0, maxAbsValue: 0 }).querySelector<HTMLElement>(':scope > div > div')?.style.width).toBe('0%');
    });

    it('uses the accent color for highlighted rows', () => {
      const inner = bar({ isHighlighted: true }).querySelector(':scope > div > div');

      expect(inner).toHaveClass('bg-accent');
      expect(inner).not.toHaveClass('bg-accent-dim');
    });

    it('uses the dim accent color for the other rows', () => {
      expect(bar({ isHighlighted: false }).querySelector(':scope > div > div')).toHaveClass('bg-accent-dim');
    });
  });

  describe('diverging bar', () => {
    it('is hidden from assistive technology', () => {
      expect(bar({ isDiverging: true }).firstElementChild).toHaveAttribute('aria-hidden', 'true');
    });

    it('grows to the right for positive values up to half the track', () => {
      const inner = bar({ isDiverging: true, value: 100, maxAbsValue: 100 }).querySelector<HTMLElement>(':scope > div > div');

      expect(inner?.style.width).toBe('50%');
      expect(inner).toHaveClass('left-1/2', 'bg-text-success');
    });

    it('grows to the left for negative values', () => {
      const inner = bar({ isDiverging: true, value: -50, maxAbsValue: 100 }).querySelector<HTMLElement>(':scope > div > div');

      expect(inner?.style.width).toBe('25%');
      expect(inner).toHaveClass('right-1/2', 'bg-text-danger');
    });

    it.each([
      ['a zero value', 0, 100],
      ['a zero maximum', 10, 0],
    ])('renders no inner bar for %s', (_name, value, maxAbsValue) => {
      const container = bar({ isDiverging: true, value, maxAbsValue });

      expect(container.querySelector(':scope > div > div')).toBeNull();
    });
  });
});

describe('DivergingValue', () => {
  it.each([
    [25, /^\+25\s%$/, 'text-text-success'],
    [-13.33, /^[-−]13,33\s%$/, 'text-text-danger'],
    [0, /^0\s%$/, 'text-text-secondary'],
  ])('formats %s as a signed percentage with its tone', (value, pattern, tone) => {
    const { container } = renderWithIntl(<DivergingValue value={value} />);

    const span = container.querySelector('span');

    expect(span?.textContent).toMatch(pattern);
    expect(span).toHaveClass(tone);
  });
});
