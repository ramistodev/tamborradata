import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ValuesGrid } from '@/app/(frontend)/[locale]/(pages)/statistics/[period]/components/family/ValuesGrid';
import { makeStatisticValue, makeValuesCategory } from '@/test/fixtures/statistics';
import { messagesByLocale } from '@/test/helpers/messages';
import { renderWithIntl } from '@/test/helpers/renderWithIntl';

const m = messagesByLocale.es;

describe('ValuesGrid', () => {
  it('renders nothing without categories', () => {
    const { container } = renderWithIntl(<ValuesGrid categories={[]} />);

    expect(container).toBeEmptyDOMElement();
  });

  it('renders a focusable key figures region with one card per category in order', () => {
    const categories = [
      makeValuesCategory('totalParticipants', [makeStatisticValue('participant_count', 1234)]),
      makeValuesCategory('participantsWithMultipleNames', [makeStatisticValue('participants_with_multiple_names', 50)]),
    ];
    renderWithIntl(<ValuesGrid categories={categories} />);

    const region = screen.getByRole('region', { name: m.Statistics.layout.keyFigures });
    const headings = screen.getAllByRole('heading', { level: 3 });

    expect(region).toHaveAttribute('tabindex', '0');
    expect(headings.map((heading) => heading.textContent)).toEqual([
      m.Statistics.categories.totalParticipants.title,
      m.Statistics.categories.participantsWithMultipleNames.title,
    ]);
  });
});
