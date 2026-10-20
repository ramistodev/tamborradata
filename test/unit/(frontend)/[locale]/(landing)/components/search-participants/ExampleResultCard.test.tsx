import { screen, within } from '@testing-library/react';
import { createTranslator } from 'next-intl';
import { describe, expect, it } from 'vitest';
import { ExampleResultCard } from '@/app/(frontend)/[locale]/(landing)/components/search-participants/ExampleResultCard';
import { messagesByLocale } from '@/test/helpers/messages';
import { renderWithIntl } from '@/test/helpers/renderWithIntl';

const m = messagesByLocale.es;
const example = m.Landing.searchParticipants.example;
const tCard = createTranslator({
  locale: 'es',
  messages: m,
  namespace: 'Search.results.card',
} as never);

describe('ExampleResultCard', () => {
  it('is a figure named by the illustrative label', () => {
    renderWithIntl(<ExampleResultCard />);

    expect(screen.getByRole('figure', { name: example.ariaLabel })).toBeInTheDocument();
  });

  it('shows the placeholder name, school, match type and caption', () => {
    renderWithIntl(<ExampleResultCard />);

    expect(screen.getByText(example.name)).toBeInTheDocument();
    expect(screen.getByText(example.school)).toBeInTheDocument();
    expect(screen.getByText(m.Search.results.card.exact)).toBeInTheDocument();
    expect(screen.getByText(example.caption)).toBeInTheDocument();
  });

  it('shows the participation count with the sources label', () => {
    renderWithIntl(<ExampleResultCard />);

    expect(screen.getByText(`${tCard('count', { count: 3 })} · ${example.sources}`)).toBeInTheDocument();
  });

  it('lists three source rows with year, host and view source text', () => {
    renderWithIntl(<ExampleResultCard />);

    const rows = screen.getAllByRole('listitem');

    expect(rows).toHaveLength(3);
    expect(rows.map((row) => within(row).getByText(/^\d{4}$/).textContent)).toEqual(['2019', '2023', '2026']);
    rows.forEach((row) => {
      expect(within(row).getByText('diariovasco.com')).toBeInTheDocument();
      expect(within(row).getByText(m.Search.results.row.viewSource)).toBeInTheDocument();
    });
  });
});
