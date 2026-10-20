import { screen, within } from '@testing-library/react';
import { createTranslator } from 'next-intl';
import { describe, expect, it } from 'vitest';
import { StatisticsMenu } from '@/app/(frontend)/[locale]/components/Header/components/StatisticsMenu';
import { makePeriodList } from '@/test/fixtures/period';
import { messagesByLocale } from '@/test/helpers/messages';
import { navigationState } from '@/test/helpers/nextNavigation';
import { renderWithIntl } from '@/test/helpers/renderWithIntl';

const m = messagesByLocale.es;

function getMenuButton(name: string = m.Header.statistics) {
  return screen.getByRole('button', { name });
}

function getPeriodLinks(listName: string = m.Header.statisticsOptions) {
  return within(screen.getByRole('list', { name: listName })).getAllByRole('link');
}

describe('StatisticsMenu', () => {
  it('renders a collapsed button that controls the panel', () => {
    renderWithIntl(<StatisticsMenu periods={makePeriodList()} />);

    const button = getMenuButton();
    const panel = document.getElementById(button.getAttribute('aria-controls') ?? '');

    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(panel).not.toBeNull();
    expect(panel).toContainElement(screen.getByRole('list', { name: m.Header.statisticsOptions }));
  });

  it('lists the periods with global first', () => {
    renderWithIntl(<StatisticsMenu periods={makePeriodList()} />);

    const links = getPeriodLinks();

    expect(links.map((link) => link.textContent)).toEqual(['global', '2025', '2024', '2023']);
    expect(links.map((link) => link.getAttribute('href'))).toEqual([
      '/statistics/global',
      '/statistics/2025',
      '/statistics/2024',
      '/statistics/2023',
    ]);
  });

  it('moves global first and keeps the other periods in their given order', () => {
    const [global, y2025, y2024, y2023] = makePeriodList();

    renderWithIntl(<StatisticsMenu periods={[y2023, y2025, global, y2024]} />);

    expect(getPeriodLinks().map((link) => link.textContent)).toEqual(['global', '2023', '2025', '2024']);
  });

  it('shows the number of periods', () => {
    renderWithIntl(<StatisticsMenu periods={makePeriodList()} />);

    const t = createTranslator({ locale: 'es', messages: m, namespace: 'Header' } as never) as unknown as (
      key: string,
      values: Record<string, number>,
    ) => string;

    expect(screen.getByText(t('periodsCount', { count: 4 }))).toBeInTheDocument();
  });

  // The keyboard is used on purpose: a mouse click also hovers the button, and hovering opens the menu
  it('toggles aria-expanded when the button is activated', async () => {
    const { user } = renderWithIntl(<StatisticsMenu periods={makePeriodList()} />);

    getMenuButton().focus();
    await user.keyboard('{Enter}');

    expect(getMenuButton()).toHaveAttribute('aria-expanded', 'true');

    await user.keyboard('{Enter}');

    expect(getMenuButton()).toHaveAttribute('aria-expanded', 'false');
  });

  it('closes the menu when a period link is clicked', async () => {
    const { user } = renderWithIntl(<StatisticsMenu periods={makePeriodList()} />);

    getMenuButton().focus();
    await user.keyboard('{Enter}');

    expect(getMenuButton()).toHaveAttribute('aria-expanded', 'true');

    await user.click(getPeriodLinks()[1]);

    expect(getMenuButton()).toHaveAttribute('aria-expanded', 'false');
  });

  it('marks only the current period link as the current page', () => {
    navigationState.pathname = '/statistics/2024';

    renderWithIntl(<StatisticsMenu periods={makePeriodList()} />);

    const current = getPeriodLinks().filter((link) => link.getAttribute('aria-current') === 'page');

    expect(current.map((link) => link.textContent)).toEqual(['2024']);
  });

  it('marks no period link as current outside the statistics pages', () => {
    renderWithIntl(<StatisticsMenu periods={makePeriodList()} />);

    expect(getPeriodLinks().filter((link) => link.hasAttribute('aria-current'))).toHaveLength(0);
  });

  it('links to the search page and marks it as current on that page', () => {
    navigationState.pathname = '/search-participants';

    renderWithIntl(<StatisticsMenu periods={makePeriodList()} />);

    const search = screen.getByRole('link', { name: m.Header.search });

    expect(search).toHaveAttribute('href', '/search-participants');
    expect(search).toHaveAttribute('aria-current', 'page');
  });

  it('does not mark the search link as current elsewhere', () => {
    renderWithIntl(<StatisticsMenu periods={makePeriodList()} />);

    expect(screen.getByRole('link', { name: m.Header.search })).not.toHaveAttribute('aria-current');
  });

  it('localizes the hrefs and the texts for en', () => {
    const header = messagesByLocale.en.Header;

    renderWithIntl(<StatisticsMenu periods={makePeriodList()} />, { locale: 'en' });

    expect(getMenuButton(header.statistics)).toBeInTheDocument();
    expect(getPeriodLinks(header.statisticsOptions).map((link) => link.getAttribute('href'))).toEqual([
      '/en/statistics/global',
      '/en/statistics/2025',
      '/en/statistics/2024',
      '/en/statistics/2023',
    ]);
    expect(screen.getByRole('link', { name: header.search })).toHaveAttribute('href', '/en/search-participants');
  });
});
