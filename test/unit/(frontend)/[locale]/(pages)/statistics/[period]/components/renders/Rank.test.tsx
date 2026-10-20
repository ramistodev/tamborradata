import { screen, waitFor, within } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { RankRender } from '@/app/(frontend)/[locale]/(pages)/statistics/[period]/components/renders/Rank';
import type { CategoryDetailResponse } from '@/app/types/api/statistics.types';
import { fetchCategory } from '@/app/(frontend)/[locale]/services/fetchCategory';
import { makeCategoryDetail, makeRanksCategory, makeStatisticRank } from '@/test/fixtures/statistics';
import { messagesByLocale } from '@/test/helpers/messages';
import { navigationState } from '@/test/helpers/nextNavigation';
import { createTestQueryClient } from '@/test/helpers/queryClient';
import { renderWithIntl } from '@/test/helpers/renderWithIntl';

vi.mock('@/app/(frontend)/[locale]/services/fetchCategory', () => ({ fetchCategory: vi.fn() }));

const m = messagesByLocale.es;
const ranksOf = (from: number, n = 10) => Array.from({ length: n }, (_, index) => makeStatisticRank(from + index));
const page = (from: number, nextCursor: string | null) => ({
  ...makeCategoryDetail('topNames', 'ranks', nextCursor),
  data: ranksOf(from),
}) as unknown as CategoryDetailResponse;
const category = () => makeRanksCategory('topNames', ranksOf(1), 'cursor-1');

function setup(value = category()) {
  return renderWithIntl(<RankRender category={value} />, { queryClient: createTestQueryClient() });
}

function list() {
  return screen.getByRole('list', { name: m.Statistics.categories.topNames.title });
}

describe('RankRender', () => {
  beforeEach(() => {
    navigationState.params = { period: '2024' };
  });

  describe('rows', () => {
    it('renders an ordered list named after the category with one item per row', () => {
      setup();

      expect(list().tagName).toBe('OL');
      expect(within(list()).getAllByRole('listitem')).toHaveLength(10);
    });

    it('shows the rank, the label and the formatted value of each row', () => {
      setup();

      const first = within(list()).getAllByRole('listitem')[0];

      expect(within(first).getByText('1')).toBeInTheDocument();
      expect(within(first).getByText('Name 1')).toHaveAttribute('title', 'Name 1');
      expect(within(first).getByText('999')).toBeInTheDocument();
    });

    it('scales the bars relative to the leader', () => {
      setup();

      const items = within(list()).getAllByRole('listitem');
      const firstBar = items[0].querySelector<HTMLElement>('[aria-hidden="true"] > div');
      const lastBar = items[9].querySelector<HTMLElement>('[aria-hidden="true"] > div');

      expect(firstBar?.style.width).toBe('100%');
      expect(parseFloat(lastBar?.style.width ?? '')).toBeCloseTo(99.1, 1);
    });

    it('renders nothing for an empty category', () => {
      const { container } = setup(makeRanksCategory('topNames', []));

      expect(container).toBeEmptyDOMElement();
    });
  });

  describe('load more', () => {
    it('requests the next page with the server cursor', async () => {
      vi.mocked(fetchCategory).mockResolvedValue(page(11, null));
      const { user } = setup();

      await user.click(screen.getByRole('button', { name: /Mostrar más/ }));

      expect(fetchCategory).toHaveBeenCalledWith({
        period: '2024',
        category: 'topNames',
        cursor: 'cursor-1',
        limit: 10,
        signal: expect.any(AbortSignal),
      });
    });

    it('shows skeleton rows and marks the list busy while the page is pending', async () => {
      vi.mocked(fetchCategory).mockReturnValue(new Promise(() => {}));
      const { user } = setup();

      await user.click(screen.getByRole('button', { name: /Mostrar más/ }));

      await waitFor(() => expect(list()).toHaveAttribute('aria-busy', 'true'));
      expect(list().querySelectorAll('li[aria-hidden="true"]')).toHaveLength(10);
      expect(within(list()).getAllByRole('listitem')).toHaveLength(10);
    });

    it('appends the fetched rows and swaps show more for show less when there is no more cursor', async () => {
      vi.mocked(fetchCategory).mockResolvedValue(page(11, null));
      const { user } = setup();

      await user.click(screen.getByRole('button', { name: /Mostrar más/ }));

      await waitFor(() => expect(within(list()).getAllByRole('listitem')).toHaveLength(20));
      expect(screen.getByRole('button', { name: /Mostrar menos/ })).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /Mostrar más/ })).not.toBeInTheDocument();
    });

    it('collapses back to the first page', async () => {
      vi.mocked(fetchCategory).mockResolvedValue(page(11, null));
      const { user } = setup();
      await user.click(screen.getByRole('button', { name: /Mostrar más/ }));
      await waitFor(() => expect(within(list()).getAllByRole('listitem')).toHaveLength(20));

      await user.click(screen.getByRole('button', { name: /Mostrar menos/ }));

      expect(within(list()).getAllByRole('listitem')).toHaveLength(10);
      expect(screen.getByRole('button', { name: /Mostrar más/ })).toBeInTheDocument();
    });

    it('shows the error alert when the request fails and recovers on retry', async () => {
      vi.mocked(fetchCategory).mockRejectedValueOnce(new Error('network')).mockResolvedValueOnce(page(11, null));
      const { user } = setup();

      await user.click(screen.getByRole('button', { name: /Mostrar más/ }));

      expect(await screen.findByRole('alert')).toHaveTextContent(m.Statistics.layout.loadError);
      expect(within(list()).getAllByRole('listitem')).toHaveLength(10);

      await user.click(screen.getByRole('button', { name: m.Statistics.layout.retry }));

      await waitFor(() => expect(within(list()).getAllByRole('listitem')).toHaveLength(20));
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });

  describe('diverging category', () => {
    function divergingCategory() {
      return makeRanksCategory('schoolGrowthRate', [
        makeStatisticRank(1, { entityType: 'school', entityKey: 'a', entityLabel: 'School A', value: 25 }),
        makeStatisticRank(2, { entityType: 'school', entityKey: 'b', entityLabel: 'School B', value: -13.33 }),
      ]);
    }

    it('formats the values as signed percentages', () => {
      renderWithIntl(<RankRender category={divergingCategory()} />, { queryClient: createTestQueryClient() });

      const items = screen.getAllByRole('listitem');

      expect(within(items[0]).getByText(/^\+25\s%$/)).toBeInTheDocument();
      expect(within(items[1]).getByText(/^[-−]13,33\s%$/)).toBeInTheDocument();
    });

    it('draws the bars from the centre in the direction of the sign', () => {
      renderWithIntl(<RankRender category={divergingCategory()} />, { queryClient: createTestQueryClient() });

      const items = screen.getAllByRole('listitem');
      const positive = items[0].querySelector<HTMLElement>('div.relative > div');
      const negative = items[1].querySelector<HTMLElement>('div.relative > div');

      expect(positive?.style.width).toBe('50%');
      expect(positive).toHaveClass('left-1/2');
      expect(negative).toHaveClass('right-1/2');
      expect(parseFloat(negative?.style.width ?? '')).toBeCloseTo(26.66, 1);
    });
  });
});
