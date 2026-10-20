import { screen, within } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PageContent } from '@/app/(frontend)/[locale]/(pages)/statistics/[period]/PageContent';
import { makePeriodList } from '@/test/fixtures/period';
import { makeStatisticsResponse } from '@/test/fixtures/statistics';
import { messagesByLocale } from '@/test/helpers/messages';
import { navigationState } from '@/test/helpers/nextNavigation';
import { createTestQueryClient } from '@/test/helpers/queryClient';
import { renderWithIntl } from '@/test/helpers/renderWithIntl';

vi.mock('@/app/(frontend)/[locale]/services/fetchCategory', () => ({ fetchCategory: vi.fn() }));
vi.mock('@/app/(frontend)/[locale]/(pages)/statistics/[period]/utils/scrollToActiveElement', () => ({
  scrollToActiveElement: vi.fn(),
}));

const m = messagesByLocale.es.Statistics;

function buildStats() {
  const [participation, names, schools] = makeStatisticsResponse().families;
  return makeStatisticsResponse({ families: [schools, names, participation] });
}

function setup(stats = buildStats()) {
  navigationState.params = { period: '2024' };
  const view = renderWithIntl(<PageContent periods={makePeriodList()} stats={stats} />, {
    queryClient: createTestQueryClient(),
  });
  return { ...view, stats };
}

describe('PageContent', () => {
  beforeEach(() => {
    navigationState.pathname = '/statistics/2024';
  });

  it('renders an article labelled by the page title', () => {
    setup();

    const title = screen.getByRole('heading', { level: 1 });
    const article = screen.getByRole('article', { name: title.textContent ?? '' });

    expect(article).toHaveAttribute('aria-labelledby', 'year-page-title');
    expect(title).toHaveAttribute('id', 'year-page-title');
    expect(article).toContainElement(title);
  });

  it('lists the chapters in page order, not in response order', () => {
    setup();

    const nav = screen.getByRole('navigation', { name: m.chapters.ariaLabel });
    const links = within(nav).getAllByRole('link').map((link) => link.textContent);

    expect(links).toEqual([
      m.chapters.hero,
      m.chapters.participationDynamics,
      m.chapters.names,
      m.chapters.schools,
      m.chapters.closing,
    ]);
  });

  it('renders the family sections in page order', () => {
    const { container } = setup();

    const ids = [...container.querySelectorAll('section[id]')].map((section) => section.id);

    expect(ids).toEqual(['hero', 'participationDynamics', 'names', 'schools', 'closing']);
  });

  it('renders the intro and the outro', () => {
    setup();

    expect(screen.getByText('text').tagName).toBe('STRONG');
    expect(screen.getByText('Outro text')).toBeInTheDocument();
  });

  it('ends with a closing section that links to the neighbour editions', () => {
    const { container } = setup();

    const closing = container.querySelector('section#closing') as HTMLElement;
    const nav = within(closing).getByRole('navigation', { name: m.closing.navLabel });

    expect(within(nav).getByRole('link', { name: new RegExp(m.closing.newer) })).toHaveAttribute('href', '/statistics/2025');
    expect(within(nav).getByRole('link', { name: new RegExp(m.closing.older) })).toHaveAttribute('href', '/statistics/2023');
  });

  it('does not mutate the order of the families of the response', () => {
    const { stats } = setup();

    expect(stats.families.map((family) => family.family)).toEqual(['schools', 'names', 'participationDynamics']);
  });
});
