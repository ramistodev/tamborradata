import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { StatsCardFallback } from '@/app/(frontend)/[locale]/(landing)/components/stats/StatsCardFallback';
import { messagesByLocale } from '@/test/helpers/messages';
import { renderWithIntl } from '@/test/helpers/renderWithIntl';

const m = messagesByLocale.es.Landing.stats.fallback;

describe('StatsCardFallback', () => {
  it.each(['global', 'last'] as const)('renders the %s texts with the title as a level three heading', (kind) => {
    renderWithIntl(<StatsCardFallback kind={kind} />);

    expect(screen.getByText(m[kind].label)).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: m[kind].title })).toBeInTheDocument();
    expect(screen.getByText(m[kind].text)).toBeInTheDocument();
  });

  it.each(['global', 'last'] as const)('links the %s card to the statistics index', (kind) => {
    renderWithIntl(<StatsCardFallback kind={kind} />);

    expect(screen.getByRole('link', { name: m.cta })).toHaveAttribute('href', '/statistics');
  });
});
