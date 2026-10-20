import { describe, expect, it } from 'vitest';
import { screen, within } from '@testing-library/react';
import { createTranslator } from 'next-intl';
import { YearsTimeline } from '@/app/(frontend)/[locale]/(pages)/search-participants/components/YearsTimeline';
import { messagesByLocale } from '@/test/helpers/messages';
import { renderWithIntl } from '@/test/helpers/renderWithIntl';

const t = createTranslator({ locale: 'es', messages: messagesByLocale.es, namespace: 'Search.timeline' } as never);

function renderTimeline(missingYears: number[] = []) {
  return renderWithIntl(<YearsTimeline startYear={2000} endYear={2025} missingYears={missingYears} />);
}

describe('YearsTimeline', () => {
  it('renders an image named by the covered range', () => {
    renderTimeline();

    expect(
      screen.getByRole('img', { name: t('ariaLabel', { startYear: '2000', endYear: '2025' }) }),
    ).toBeInTheDocument();
  });

  it('renders the edge years and the ticks in an aria-hidden axis', () => {
    const { container } = renderTimeline();

    const axis = container.querySelector('div[aria-hidden="true"]') as HTMLElement;
    const labels = [...axis.querySelectorAll('span')].map((node) => node.textContent);
    expect(labels).toEqual(['2000', '2005', '2010', '2015', '2020', '2025']);
  });

  describe('gaps', () => {
    it('renders no bar and no caption without missing years', () => {
      const { container } = renderTimeline([]);

      expect(container.querySelector('[title]')).toBeNull();
      expect(container.querySelector('details')).toBeNull();
      expect(screen.queryByText(/Huecos/)).not.toBeInTheDocument();
    });

    it('renders one positioned bar and a caption for a single missing year', () => {
      renderTimeline([2021]);

      const bar = screen.getByTitle(t('missingYear', { year: '2021' }));
      expect(parseFloat(bar.style.left)).toBeCloseTo(80.77, 1);
      expect(screen.getByText(t('gapsCaption', { years: '2021' }))).toBeInTheDocument();
    });

    it('merges consecutive missing years into one bar', () => {
      const { container } = renderTimeline([2009, 2010]);

      const bars = container.querySelectorAll('[title]');
      expect(bars).toHaveLength(1);
      expect(bars[0]).toHaveAttribute('title', t('missingRange', { from: '2009', to: '2010' }));
    });

    it('counts the gaps inside a disclosure when there are more than six', () => {
      const missing = [2001, 2003, 2005, 2007, 2009, 2011, 2013];
      const { container } = renderTimeline(missing);

      const details = container.querySelector('details') as HTMLElement;
      expect(details.querySelector('summary')).toHaveTextContent(t('gapsCount', { count: 7 }));
      const years = new Intl.ListFormat('es', { type: 'conjunction' }).format(missing.map(String));
      expect(within(details).getByText(t('gapsCaption', { years }))).toBeInTheDocument();
    });
  });
});
