import { createTranslator } from 'next-intl';
import { screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { PeriodSelector } from '@/app/(frontend)/[locale]/(pages)/statistics/[period]/components/PeriodSelector';
import { scrollToActiveElement } from '@/app/(frontend)/[locale]/(pages)/statistics/[period]/utils/scrollToActiveElement';
import { makeGlobalPeriod, makePeriod, makePeriodList } from '@/test/fixtures/period';
import { messagesByLocale } from '@/test/helpers/messages';
import { navigationState } from '@/test/helpers/nextNavigation';
import { renderWithIntl } from '@/test/helpers/renderWithIntl';

vi.mock('@/app/(frontend)/[locale]/(pages)/statistics/[period]/utils/scrollToActiveElement', () => ({
  scrollToActiveElement: vi.fn(),
}));

const m = messagesByLocale.es;
const t = createTranslator({
  locale: 'es',
  messages: m,
  namespace: 'Statistics.periodSelector',
});

describe('PeriodSelector', () => {
  it('renders a labelled navigation', () => {
    renderWithIntl(<PeriodSelector periods={makePeriodList()} />);

    expect(screen.getByRole('navigation', { name: m.Statistics.periodSelector.label })).toBeInTheDocument();
  });

  it('lists the periods in order with their statistics links and no gap markers', () => {
    const { container } = renderWithIntl(<PeriodSelector periods={makePeriodList()} />);

    const links = screen.getAllByRole('link');

    expect(links.map((link) => link.textContent)).toEqual(['global', '2025', '2024', '2023']);
    expect(links.map((link) => link.getAttribute('href'))).toEqual([
      '/statistics/global',
      '/statistics/2025',
      '/statistics/2024',
      '/statistics/2023',
    ]);
    expect(container.querySelectorAll('li[aria-hidden="true"]')).toHaveLength(0);
  });

  it('shows one gap marker for a missing year between two editions', () => {
    const periods = [makeGlobalPeriod(), makePeriod({ periodKey: '2025', publicSlug: '2025' }), makePeriod({ periodKey: '2023', publicSlug: '2023' })];
    const { container } = renderWithIntl(<PeriodSelector periods={periods} />);

    const markers = container.querySelectorAll('li[aria-hidden="true"]');
    const items = [...container.querySelectorAll('li')];

    expect(markers).toHaveLength(1);
    expect(markers[0]).toHaveAttribute('title', t('missingEdition', { year: 2024 }));
    expect(items.map((item) => item.textContent)).toEqual(['global', '2025', '', '2023']);
  });

  it('marks only the link of the current pathname as the current page', () => {
    navigationState.pathname = '/statistics/2024';
    renderWithIntl(<PeriodSelector periods={makePeriodList()} />);

    const current = screen.getAllByRole('link').filter((link) => link.hasAttribute('aria-current'));

    expect(current).toHaveLength(1);
    expect(current[0]).toHaveTextContent('2024');
    expect(current[0]).toHaveAttribute('aria-current', 'page');
  });

  it('centers the active item once on mount', () => {
    navigationState.pathname = '/statistics/2024';
    renderWithIntl(<PeriodSelector periods={makePeriodList()} />);

    const activeItem = screen.getByRole('link', { name: '2024' }).closest('li');

    expect(scrollToActiveElement).toHaveBeenCalledTimes(1);
    expect(scrollToActiveElement).toHaveBeenCalledWith(
      expect.any(HTMLElement),
      activeItem,
    );
    expect(within(screen.getByRole('navigation')).getByRole('list').parentElement).toBe(
      vi.mocked(scrollToActiveElement).mock.calls[0][0],
    );
  });

  it('prefixes the links with the locale outside the default one', () => {
    renderWithIntl(<PeriodSelector periods={makePeriodList()} />, { locale: 'en' });

    const hrefs = screen.getAllByRole('link').map((link) => link.getAttribute('href'));

    expect(hrefs).toEqual([
      '/en/statistics/global',
      '/en/statistics/2025',
      '/en/statistics/2024',
      '/en/statistics/2023',
    ]);
  });
});
