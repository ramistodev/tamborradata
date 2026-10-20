import { screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { FamilyLayout } from '@/app/(frontend)/[locale]/(pages)/statistics/[period]/components/family/FamilyLayout';
import {
  makeFamily,
  makeRanksCategory,
  makeSeriesCategory,
  makeSeriesPoint,
  makeStatisticValue,
  makeValuesCategory,
} from '@/test/fixtures/statistics';
import { messagesByLocale } from '@/test/helpers/messages';
import { navigationState } from '@/test/helpers/nextNavigation';
import { createTestQueryClient } from '@/test/helpers/queryClient';
import { renderWithIntl } from '@/test/helpers/renderWithIntl';

vi.mock('@/app/(frontend)/[locale]/services/fetchCategory', () => ({ fetchCategory: vi.fn() }));
vi.mock('@/app/(frontend)/[locale]/(pages)/statistics/[period]/utils/scrollToActiveElement', () => ({
  scrollToActiveElement: vi.fn(),
}));

const m = messagesByLocale.es.Statistics;
const groups = m.layout.groups;

const trendPoints = () => [
  makeSeriesPoint({ entityKey: 'a', entityLabel: 'Ane', dimensionKey: '2022', dimensionOrder: 2022, value: 10 }),
  makeSeriesPoint({ entityKey: 'a', entityLabel: 'Ane', dimensionKey: '2023', dimensionOrder: 2023, value: 20 }),
  makeSeriesPoint({ entityKey: 'b', entityLabel: 'Maite', dimensionKey: '2022', dimensionOrder: 2022, value: 5 }),
  makeSeriesPoint({ entityKey: 'b', entityLabel: 'Maite', dimensionKey: '2023', dimensionOrder: 2023, value: 30 }),
];

function setup(family: ReturnType<typeof makeFamily>) {
  navigationState.params = { period: '2024' };
  return renderWithIntl(<FamilyLayout family={family} />, { queryClient: createTestQueryClient() });
}

describe('FamilyLayout', () => {
  it('groups ranking categories as tabs and shows the values as key figures', () => {
    setup(
      makeFamily('names', [
        makeRanksCategory('topNames'),
        makeRanksCategory('newNames'),
        makeValuesCategory('participantsWithMultipleNames', [
          makeStatisticValue('participants_with_multiple_names', 50),
        ]),
      ]),
    );

    const rankings = screen.getByRole('tablist', { name: groups.rankings });

    expect(within(rankings).getAllByRole('tab')).toHaveLength(2);
    expect(screen.getByRole('region', { name: m.layout.keyFigures })).toBeInTheDocument();
    expect(screen.queryByRole('tablist', { name: groups.series })).not.toBeInTheDocument();
    expect(screen.queryByText(groups.series)).not.toBeInTheDocument();
    expect(screen.queryByText(groups.tables)).not.toBeInTheDocument();
  });

  it('renders the series group before the rankings group', () => {
    setup(
      makeFamily('names', [
        makeRanksCategory('topNames'),
        makeSeriesCategory('nameTrends', trendPoints(), 'global'),
      ]),
    );

    const series = screen.getByText(groups.series);
    const rankings = screen.getByText(groups.rankings);

    expect(series.compareDocumentPosition(rankings) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(screen.getByRole('group', { name: m.categories.nameTrends.title })).toBeInTheDocument();
  });

  it('renders a tables group containing a table for a data table category', () => {
    setup(makeFamily('schools', [makeRanksCategory('commonNameBySchool')]));

    expect(screen.getByText(groups.tables)).toBeInTheDocument();
    expect(screen.getByRole('table', { name: m.categories.commonNameBySchool.title })).toBeInTheDocument();
  });

  it('does not render categories without data', () => {
    setup(makeFamily('names', [makeRanksCategory('topNames'), makeRanksCategory('newNames', [])]));

    expect(screen.getByRole('heading', { level: 3, name: m.categories.topNames.title })).toBeInTheDocument();
    expect(screen.queryByText(m.categories.newNames.title)).not.toBeInTheDocument();
    expect(screen.queryByRole('tablist')).not.toBeInTheDocument();
  });
});
