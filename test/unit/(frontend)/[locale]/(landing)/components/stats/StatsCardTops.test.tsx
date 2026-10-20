import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { StatsCardTops } from '@/app/(frontend)/[locale]/(landing)/components/stats/StatsCardTops';
import { messagesByLocale } from '@/test/helpers/messages';
import { renderWithIntl } from '@/test/helpers/renderWithIntl';
import { makeTopEntry } from '@/test/fixtures/overview';

const m = messagesByLocale.es.Search.topStats;

function renderTops() {
  return renderWithIntl(
    <StatsCardTops
      tone="surface"
      topName={makeTopEntry({ label: 'Ane', count: 1200 })}
      topSurname={makeTopEntry({ label: 'Garcia', count: 85 })}
      topSchool={makeTopEntry({ label: 'Ikastola Test', count: 12345 })}
    />,
  );
}

describe('StatsCardTops', () => {
  it('renders a description list with the three terms in order', () => {
    renderTops();

    expect(screen.getAllByRole('term').map((term) => term.textContent)).toEqual([
      m.name,
      m.surname,
      m.school,
    ]);
  });

  it('pairs each term with its entry label and grouped count', () => {
    renderTops();

    expect(screen.getAllByRole('definition').map((definition) => definition.textContent)).toEqual([
      'Ane1.200',
      'Garcia85',
      'Ikastola Test12.345',
    ]);
  });

  it('formats a four digit count with the thousands separator', () => {
    renderTops();

    expect(screen.getByText('1.200')).toBeInTheDocument();
  });
});
