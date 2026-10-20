import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ValueRender } from '@/app/(frontend)/[locale]/(pages)/statistics/[period]/components/renders/Value';
import { makeStatisticValue, makeValuesCategory } from '@/test/fixtures/statistics';
import { messagesByLocale } from '@/test/helpers/messages';
import { renderWithIntl } from '@/test/helpers/renderWithIntl';

const m = messagesByLocale.es;
const diversity = m.Statistics.categories.namesDiversity;

function termValue(label: string): HTMLElement {
  const term = screen.getByText(label, { selector: 'dt' });
  return term.nextElementSibling as HTMLElement;
}

describe('ValueRender', () => {
  it('renders the category title and description', () => {
    const category = makeValuesCategory('namesDiversity', [
      makeStatisticValue('distinct_count', 200),
      makeStatisticValue('diversity_percentage', 12.34),
    ]);
    renderWithIntl(<ValueRender category={category} />);

    expect(screen.getByRole('heading', { level: 3, name: diversity.title })).toBeInTheDocument();
    expect(screen.getByText(diversity.description)).toBeInTheDocument();
  });

  it('shows the first metric in display order as the primary figure and the rest as rows', () => {
    const category = makeValuesCategory('namesDiversity', [
      makeStatisticValue('distinct_count', 200),
      makeStatisticValue('diversity_percentage', 12.34),
    ]);
    renderWithIntl(<ValueRender category={category} />);

    const primary = termValue(m.Statistics.metrics.diversity_percentage);
    const secondary = termValue(m.Statistics.metrics.distinct_count);

    expect(primary.textContent).toMatch(/^12,34\s%$/);
    expect(primary.closest('dl')).not.toBe(secondary.closest('dl'));
    expect(secondary).toHaveTextContent('200');
  });

  it('renders nothing when the category has only unknown metrics', () => {
    const category = makeValuesCategory('namesDiversity', [makeStatisticValue('window_year', 2024)]);
    const { container } = renderWithIntl(<ValueRender category={category} />);

    expect(container).toBeEmptyDOMElement();
  });

  it('capitalizes a text metric', () => {
    const category = makeValuesCategory('nameConcentration', [
      makeStatisticValue('leading_key', null, { valueText: 'ane' }),
    ]);
    renderWithIntl(<ValueRender category={category} />);

    const value = termValue(m.Statistics.metrics.leading_key);

    expect(value).toHaveTextContent('ane');
    expect(value).toHaveClass('capitalize');
  });

  it('shows a dash for a null numeric metric', () => {
    const category = makeValuesCategory('totalParticipants', [makeStatisticValue('participant_count', null)]);
    renderWithIntl(<ValueRender category={category} />);

    expect(termValue(m.Statistics.metrics.participant_count)).toHaveTextContent('—');
  });
});
