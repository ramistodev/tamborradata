import { describe, expect, it } from 'vitest';
import { screen, within } from '@testing-library/react';
import { createTranslator } from 'next-intl';
import { ParticipantCard } from '@/app/(frontend)/[locale]/(pages)/search-participants/components/results/ParticipantCard';
import { makeParticipantsResponse, makeParticipation, makeSchool } from '@/test/fixtures/participants';
import { messagesByLocale } from '@/test/helpers/messages';
import { renderWithIntl } from '@/test/helpers/renderWithIntl';

const m = messagesByLocale.es;
const t = createTranslator({
  locale: 'es',
  messages: m,
  namespace: 'Search.results.card',
} as never);

const record = makeParticipantsResponse({
  name: 'Ane Garcia Lopez',
  school: makeSchool({ canonicalName: 'Ikastola Test' }),
  participations: [
    makeParticipation({ year: 2024, url: 'https://example.org/2024' }),
    makeParticipation({ year: 2022, url: null }),
  ],
});

describe('ParticipantCard', () => {
  it('renders an article named by a level 3 heading with the record name', () => {
    renderWithIntl(<ParticipantCard record={record} />);

    const article = screen.getByRole('article', { name: 'Ane Garcia Lopez' });
    expect(within(article).getByRole('heading', { level: 3, name: 'Ane Garcia Lopez' })).toBeInTheDocument();
  });

  it('shows the exact match label for an exact record', () => {
    renderWithIntl(<ParticipantCard record={makeParticipantsResponse({ matchType: 'exact' })} />);

    expect(screen.getByText(m.Search.results.card.exact)).toBeInTheDocument();
    expect(screen.queryByText(m.Search.results.card.compatible)).not.toBeInTheDocument();
  });

  it('shows the compatible match label for a compatible record', () => {
    renderWithIntl(<ParticipantCard record={makeParticipantsResponse({ matchType: 'compatible' })} />);

    expect(screen.getByText(m.Search.results.card.compatible)).toBeInTheDocument();
    expect(screen.queryByText(m.Search.results.card.exact)).not.toBeInTheDocument();
  });

  it('shows the school name', () => {
    renderWithIntl(<ParticipantCard record={record} />);

    expect(screen.getByText('Ikastola Test')).toBeInTheDocument();
  });

  it('lists the participations in the given order under a list named by the count', () => {
    renderWithIntl(<ParticipantCard record={record} />);

    const list = screen.getByRole('list', { name: t('count', { count: 2 }) });
    const items = within(list).getAllByRole('listitem');
    expect(items).toHaveLength(2);
    expect(items[0]).toHaveTextContent('2024');
    expect(items[1]).toHaveTextContent('2022');
  });

  it('is described by the match and school paragraphs', () => {
    renderWithIntl(<ParticipantCard record={record} />);

    const article = screen.getByRole('article');
    const ids = (article.getAttribute('aria-describedby') ?? '').split(' ');
    expect(ids).toHaveLength(2);
    const texts = ids.map((id) => document.getElementById(id)?.textContent);
    expect(texts).toEqual([m.Search.results.card.exact, 'Ikastola Test']);
  });

  it('shows the no source text for a participation without url', () => {
    renderWithIntl(<ParticipantCard record={record} />);

    expect(screen.getByText(m.Search.results.row.noSource)).toBeInTheDocument();
  });
});
