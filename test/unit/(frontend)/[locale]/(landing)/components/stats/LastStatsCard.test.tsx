import { screen } from '@testing-library/react';
import { createFormatter, createTranslator } from 'next-intl';
import { describe, expect, it } from 'vitest';
import { LastStatsCard } from '@/app/(frontend)/[locale]/(landing)/components/stats/LastStatsCard';
import { messagesByLocale } from '@/test/helpers/messages';
import { renderWithIntl } from '@/test/helpers/renderWithIntl';
import { makeLastOverview } from '@/test/fixtures/overview';

const m = messagesByLocale.es;
const t = createTranslator({ locale: 'es', messages: m, namespace: 'Landing.stats.last' } as never);
const format = createFormatter({ locale: 'es' } as never);
const count = (n: number) => format.number(n, { useGrouping: 'always' });
const percent = (rate: number) =>
  format.number(rate / 100, {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    signDisplay: 'exceptZero',
  });

describe('LastStatsCard', () => {
  it('renders the label, the grouped participations and the summary', () => {
    renderWithIntl(<LastStatsCard period={makeLastOverview()} />);

    expect(screen.getByText(m.Landing.stats.last.label)).toBeInTheDocument();
    expect(screen.getByText(count(2100))).toBeInTheDocument();
    expect(screen.getByText(t('summary', { schools: 60 }))).toBeInTheDocument();
  });

  it('reads the final figures to assistive technology when finalPeriod differs', () => {
    const { container } = renderWithIntl(
      <LastStatsCard period={makeLastOverview({ totalParticipations: 10 })} finalPeriod={makeLastOverview()} />,
    );

    expect(screen.getByText(count(10))).toBeInTheDocument();
    expect(container.querySelector('.sr-only')?.textContent).toBe(
      `${count(2100)} ${t('summary', { schools: 60 })}`,
    );
  });

  describe('growth badge', () => {
    it('shows the up marker and the formatted change for a positive rate', () => {
      renderWithIntl(<LastStatsCard period={makeLastOverview({ growthRate: 5 })} />);

      const marker = screen.getByText('▲');

      expect(marker).toHaveAttribute('aria-hidden', 'true');
      expect(marker.parentElement?.textContent).toBe(`${marker.textContent} ${t('growth', { change: percent(5) })}`);
    });

    it('shows the down marker for a negative rate', () => {
      renderWithIntl(<LastStatsCard period={makeLastOverview({ growthRate: -2 })} />);

      const marker = screen.getByText('▼');

      expect(marker).toHaveAttribute('aria-hidden', 'true');
      expect(marker.parentElement?.textContent).toBe(`${marker.textContent} ${t('growth', { change: percent(-2) })}`);
    });

    it('shows the equals marker for a zero rate', () => {
      renderWithIntl(<LastStatsCard period={makeLastOverview({ growthRate: 0 })} />);

      const marker = screen.getByText('=');

      expect(marker).toHaveAttribute('aria-hidden', 'true');
      expect(marker.parentElement?.textContent).toBe(`${marker.textContent} ${t('growth', { change: percent(0) })}`);
    });

    it('renders no badge when the rate is null', () => {
      renderWithIntl(<LastStatsCard period={makeLastOverview({ growthRate: null })} />);

      expect(screen.queryByText('▲')).not.toBeInTheDocument();
      expect(screen.queryByText('▼')).not.toBeInTheDocument();
      expect(screen.queryByText('=')).not.toBeInTheDocument();
      expect(screen.queryByText(/frente al año anterior/)).not.toBeInTheDocument();
    });
  });

  it('links to the statistics of the last year', () => {
    renderWithIntl(<LastStatsCard period={makeLastOverview()} />);

    expect(screen.getByRole('link', { name: t('cta', { year: '2025' }) })).toHaveAttribute(
      'href',
      '/statistics/2025',
    );
  });
});
