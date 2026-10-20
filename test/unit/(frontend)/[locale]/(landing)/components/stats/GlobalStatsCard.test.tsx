import { screen } from '@testing-library/react';
import { createFormatter, createTranslator } from 'next-intl';
import { describe, expect, it } from 'vitest';
import { GlobalStatsCard } from '@/app/(frontend)/[locale]/(landing)/components/stats/GlobalStatsCard';
import { messagesByLocale } from '@/test/helpers/messages';
import { renderWithIntl } from '@/test/helpers/renderWithIntl';
import { makeGlobalOverview } from '@/test/fixtures/overview';

const m = messagesByLocale.es;
const t = createTranslator({ locale: 'es', messages: m, namespace: 'Landing.stats.global' } as never);
const format = createFormatter({ locale: 'es' } as never);
const count = (n: number) => format.number(n, { useGrouping: 'always' });

describe('GlobalStatsCard', () => {
  it('renders the label with the covered years', () => {
    renderWithIntl(<GlobalStatsCard period={makeGlobalOverview()} />);

    expect(screen.getByText(t('label', { startYear: '2000', endYear: '2025' }))).toBeInTheDocument();
  });

  it('renders the grouped participations and the summary', () => {
    renderWithIntl(<GlobalStatsCard period={makeGlobalOverview()} />);

    expect(screen.getByText(count(52340))).toBeInTheDocument();
    expect(screen.getByText(t('summary', { editions: 26, schools: 87 }))).toBeInTheDocument();
  });

  it('reads the final figures to assistive technology when finalPeriod differs', () => {
    const { container } = renderWithIntl(
      <GlobalStatsCard
        period={makeGlobalOverview({ totalParticipations: 100 })}
        finalPeriod={makeGlobalOverview()}
      />,
    );

    expect(screen.getByText(count(100))).toBeInTheDocument();
    expect(container.querySelector('.sr-only')?.textContent).toBe(
      `${count(52340)} ${t('summary', { editions: 26, schools: 87 })}`,
    );
  });

  it('shows the note without gaps', () => {
    renderWithIntl(<GlobalStatsCard period={makeGlobalOverview()} />);

    expect(screen.getByText(t('note', { hasGaps: 'no', missingYears: '' }))).toBeInTheDocument();
  });

  it('names the missing years in the note', () => {
    renderWithIntl(<GlobalStatsCard period={makeGlobalOverview({ missingYears: [2021] })} />);

    const note = t('note', {
      hasGaps: 'yes',
      missingYears: format.list(['2021'], { style: 'long', type: 'conjunction' }),
    });

    expect(screen.getByText(note)).toBeInTheDocument();
    expect(note).toContain('2021');
  });

  it('links to the global statistics', () => {
    renderWithIntl(<GlobalStatsCard period={makeGlobalOverview()} />);

    expect(screen.getByRole('link', { name: m.Landing.stats.global.cta })).toHaveAttribute(
      'href',
      '/statistics/global',
    );
  });

  it('lists the top name, surname and school', () => {
    renderWithIntl(<GlobalStatsCard period={makeGlobalOverview()} />);

    expect(screen.getByText('Ane')).toBeInTheDocument();
    expect(screen.getByText('Garcia')).toBeInTheDocument();
    expect(screen.getByText('Ikastola Test')).toBeInTheDocument();
  });
});
