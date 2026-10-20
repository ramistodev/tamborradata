import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { StatsCardLink } from '@/app/(frontend)/[locale]/(landing)/components/stats/StatsCardLink';
import { statsCardTones } from '@/app/(frontend)/[locale]/(landing)/components/stats/statsCardTone';
import { renderWithIntl } from '@/test/helpers/renderWithIntl';

describe('StatsCardLink', () => {
  it('is named by its label', () => {
    renderWithIntl(<StatsCardLink tone="surface" label="See 2024" href="/statistics/2024" />);

    expect(screen.getByRole('link', { name: 'See 2024' })).toBeInTheDocument();
  });

  it('localizes the href for the default locale', () => {
    renderWithIntl(<StatsCardLink tone="surface" label="See 2024" href="/statistics/2024" />);

    expect(screen.getByRole('link')).toHaveAttribute('href', '/statistics/2024');
  });

  it('prefixes the href for the en locale', () => {
    renderWithIntl(<StatsCardLink tone="surface" label="See 2024" href="/statistics/2024" />, {
      locale: 'en',
    });

    expect(screen.getByRole('link')).toHaveAttribute('href', '/en/statistics/2024');
  });

  it('hides the arrow from assistive technology', () => {
    renderWithIntl(<StatsCardLink tone="surface" label="See 2024" href="/statistics/2024" />);

    expect(screen.getByRole('link').querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  });

  it.each(['surface', 'accent'] as const)('applies the %s cta classes', (tone) => {
    renderWithIntl(<StatsCardLink tone={tone} label="See 2024" href="/statistics/2024" />);

    expect(screen.getByRole('link').className).toContain(statsCardTones[tone].cta);
  });
});
