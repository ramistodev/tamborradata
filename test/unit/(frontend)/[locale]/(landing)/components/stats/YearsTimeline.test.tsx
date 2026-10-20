import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { YearsTimeline } from '@/app/(frontend)/[locale]/(landing)/components/stats/YearsTimeline';
import { statsCardTones } from '@/app/(frontend)/[locale]/(landing)/components/stats/statsCardTone';

function bars(container: HTMLElement): Element[] {
  return Array.from(container.querySelectorAll('.h-1'));
}

describe('YearsTimeline', () => {
  it('is hidden from assistive technology', () => {
    const { container } = render(
      <YearsTimeline startYear={2000} endYear={2005} missingYears={[]} tone="surface" />,
    );

    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true');
  });

  it('labels the first and last year and draws one bar per year', () => {
    const { container } = render(
      <YearsTimeline startYear={2000} endYear={2005} missingYears={[]} tone="surface" />,
    );

    expect(screen.getByText('2000')).toBeInTheDocument();
    expect(screen.getByText('2005')).toBeInTheDocument();
    expect(bars(container)).toHaveLength(6);
  });

  it('leaves the bar of a missing year without the tone color', () => {
    const { container } = render(
      <YearsTimeline startYear={2000} endYear={2005} missingYears={[2002]} tone="surface" />,
    );

    const all = bars(container);

    all.forEach((bar, index) => {
      if (index === 2) {
        expect(bar).not.toHaveClass(statsCardTones.surface.bar);
      } else {
        expect(bar).toHaveClass(statsCardTones.surface.bar);
      }
    });
  });

  it('rounds the first bar on the left and the last on the right', () => {
    const { container } = render(
      <YearsTimeline startYear={2000} endYear={2005} missingYears={[]} tone="surface" />,
    );

    const all = bars(container);

    expect(all[0]).toHaveClass('rounded-l');
    expect(all[0]).not.toHaveClass('rounded-r');
    expect(all[5]).toHaveClass('rounded-r');
    expect(all[5]).not.toHaveClass('rounded-l');
    expect(all[2]).not.toHaveClass('rounded-l');
    expect(all[2]).not.toHaveClass('rounded-r');
  });

  it('uses the bar color of the accent tone', () => {
    const { container } = render(
      <YearsTimeline startYear={2000} endYear={2005} missingYears={[]} tone="accent" />,
    );

    bars(container).forEach((bar) => expect(bar).toHaveClass(statsCardTones.accent.bar));
  });
});
