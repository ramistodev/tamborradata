import { screen, waitFor, within } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { DataTableRender } from '@/app/(frontend)/[locale]/(pages)/statistics/[period]/components/renders/DataTable';
import type { CategoryDetailResponse } from '@/app/types/api/statistics.types';
import { fetchCategory } from '@/app/(frontend)/[locale]/services/fetchCategory';
import {
  makeCategoryDetail,
  makeRanksCategory,
  makeSchoolRef,
  makeStatisticRank,
} from '@/test/fixtures/statistics';
import { messagesByLocale } from '@/test/helpers/messages';
import { navigationState } from '@/test/helpers/nextNavigation';
import { createTestQueryClient } from '@/test/helpers/queryClient';
import { renderWithIntl } from '@/test/helpers/renderWithIntl';

vi.mock('@/app/(frontend)/[locale]/services/fetchCategory', () => ({ fetchCategory: vi.fn() }));

const m = messagesByLocale.es;
const title = m.Statistics.categories.commonNameBySchool.title;

const rows = () => [
  makeStatisticRank(1, { groupSchool: makeSchoolRef({ canonicalName: 'Escuela Uno' }), entityLabel: 'Ane', value: 5 }),
  makeStatisticRank(2, { groupSchool: undefined, entityLabel: undefined, value: 3 }),
];
const category = (cursor: string | null = 'cursor-1') => makeRanksCategory('commonNameBySchool', rows(), cursor);
const page = (nextCursor: string | null) => ({
  ...makeCategoryDetail('commonNameBySchool', 'ranks', nextCursor),
  data: Array.from({ length: 10 }, (_, index) =>
    makeStatisticRank(index + 3, {
      groupSchool: makeSchoolRef({ canonicalName: `Escuela ${index + 3}`, schoolKey: `escuela-${index + 3}` }),
      entityLabel: `Nombre ${index + 3}`,
    }),
  ),
}) as unknown as CategoryDetailResponse;

function setup(value = category()) {
  return renderWithIntl(<DataTableRender category={value} />, { queryClient: createTestQueryClient() });
}

describe('DataTableRender', () => {
  beforeEach(() => {
    navigationState.params = { period: '2024' };
  });

  it('renders a focusable region named after the category with a captioned table', () => {
    setup();

    const region = screen.getByRole('region', { name: title });
    const table = within(region).getByRole('table', { name: title });

    expect(region).toHaveAttribute('tabindex', '0');
    expect(table.querySelector('caption')).toHaveTextContent(title);
  });

  it('renders the column headers', () => {
    setup();

    const headers = screen.getAllByRole('columnheader').map((header) => header.textContent);

    expect(headers).toEqual([
      m.Statistics.layout.table.commonNameBySchool.school,
      m.Statistics.layout.table.commonNameBySchool.entity,
      m.Statistics.layout.tableValue,
    ]);
  });

  it('renders the school, entity and value of a row', () => {
    setup();

    const row = screen.getByRole('rowheader', { name: 'Escuela Uno' }).closest('tr') as HTMLElement;

    expect(within(row).getByRole('cell', { name: 'Ane' })).toBeInTheDocument();
    expect(within(row).getByRole('cell', { name: '5' })).toBeInTheDocument();
  });

  it('shows a dash for a missing school and a missing entity', () => {
    setup();

    const row = screen.getByRole('rowheader', { name: '—' }).closest('tr') as HTMLElement;
    const cells = within(row).getAllByRole('cell');

    expect(cells.map((cell) => cell.textContent)).toEqual(['—', '3']);
  });

  it('is not busy when idle and offers to load more when a cursor exists', () => {
    setup();

    expect(screen.getByRole('table')).toHaveAttribute('aria-busy', 'false');
    expect(screen.getByRole('button', { name: /Mostrar más/ })).toBeInTheDocument();
  });

  it('renders nothing for a category without rows', () => {
    const { container } = setup(makeRanksCategory('commonNameBySchool', []));

    expect(container).toBeEmptyDOMElement();
  });

  it('renders nothing for a category that is not a data table', () => {
    const { container } = setup(makeRanksCategory('topNames'));

    expect(container).toBeEmptyDOMElement();
  });

  describe('load more', () => {
    it('marks the table busy and shows skeleton rows while the page is pending', async () => {
      vi.mocked(fetchCategory).mockReturnValue(new Promise(() => {}));
      const { user } = setup();

      await user.click(screen.getByRole('button', { name: /Mostrar más/ }));

      await waitFor(() => expect(screen.getByRole('table')).toHaveAttribute('aria-busy', 'true'));
      expect(screen.getByRole('table').querySelectorAll('tr[aria-hidden="true"]')).toHaveLength(10);
    });

    it('appends the fetched rows and offers to collapse', async () => {
      vi.mocked(fetchCategory).mockResolvedValue(page(null));
      const { user } = setup();

      await user.click(screen.getByRole('button', { name: /Mostrar más/ }));

      await waitFor(() => expect(screen.getByRole('rowheader', { name: 'Escuela 3' })).toBeInTheDocument());
      expect(fetchCategory).toHaveBeenCalledWith({
        period: '2024',
        category: 'commonNameBySchool',
        cursor: 'cursor-1',
        limit: 10,
        signal: expect.any(AbortSignal),
      });
      expect(screen.getAllByRole('rowheader')).toHaveLength(12);
      expect(screen.getByRole('button', { name: /Mostrar menos/ })).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /Mostrar más/ })).not.toBeInTheDocument();
    });

    it('collapses back to the initial rows', async () => {
      vi.mocked(fetchCategory).mockResolvedValue(page(null));
      const { user } = setup();
      await user.click(screen.getByRole('button', { name: /Mostrar más/ }));
      await waitFor(() => expect(screen.getAllByRole('rowheader')).toHaveLength(12));

      await user.click(screen.getByRole('button', { name: /Mostrar menos/ }));

      expect(screen.getAllByRole('rowheader')).toHaveLength(2);
    });
  });
});
