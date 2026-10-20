import { describe, expect, it } from 'vitest';
import { screen, within } from '@testing-library/react';
import { OverviewSection } from '@/app/(frontend)/[locale]/(pages)/search-participants/components/OverviewSection';
import { makeGlobalOverview } from '@/test/fixtures/overview';
import { messagesByLocale } from '@/test/helpers/messages';
import { renderWithIntl } from '@/test/helpers/renderWithIntl';

const m = messagesByLocale.es.Search;

describe('OverviewSection', () => {
  it('renders nothing without a global period', () => {
    const { container } = renderWithIntl(<OverviewSection globalPeriod={undefined} />);

    expect(container).toBeEmptyDOMElement();
  });

  describe('with data', () => {
    it('renders a region named by the screen reader only title', () => {
      renderWithIntl(<OverviewSection globalPeriod={makeGlobalOverview()} />);

      const region = screen.getByRole('region', { name: m.overview.title });
      expect(within(region).getByRole('heading', { level: 2, name: m.overview.title })).toHaveClass('sr-only');
    });

    it('renders the total participations as a big grouped number', () => {
      renderWithIntl(<OverviewSection globalPeriod={makeGlobalOverview()} />);

      expect(screen.getByText('52.340')).toBeInTheDocument();
    });

    it('renders the summary with the editions and schools highlighted', () => {
      const { container } = renderWithIntl(<OverviewSection globalPeriod={makeGlobalOverview()} />);

      expect(container.textContent).toContain(
        'Participaciones registradas en 26 ediciones y 87 colegios distintos.',
      );
      const highlights = [...container.querySelectorAll('span.font-bold')].map((node) => node.textContent);
      expect(highlights).toEqual(['26', '87']);
    });

    it('renders the timeline and the top stats', () => {
      renderWithIntl(<OverviewSection globalPeriod={makeGlobalOverview()} />);

      expect(screen.getByRole('img', { name: 'Ediciones de 2000 a 2025' })).toBeInTheDocument();
      expect(screen.getAllByRole('term')).toHaveLength(3);
    });
  });
});
