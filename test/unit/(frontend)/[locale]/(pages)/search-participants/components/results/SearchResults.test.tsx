import { describe, expect, it, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { createTranslator } from 'next-intl';
import { SearchResults } from '@/app/(frontend)/[locale]/(pages)/search-participants/components/results/SearchResults';
import { makeParticipantsResponse, makeParticipation, makeSchool } from '@/test/fixtures/participants';
import { messagesByLocale } from '@/test/helpers/messages';
import { renderWithIntl } from '@/test/helpers/renderWithIntl';

const m = messagesByLocale.es;
const t = createTranslator({
  locale: 'es',
  messages: m,
  namespace: 'Search.results.summary',
} as never);

type Props = Parameters<typeof SearchResults>[0];

function props(overrides: Partial<Props> = {}): Props {
  return {
    search: { participant: 'Ane Garcia Lopez', schoolKey: 'sk' },
    records: undefined,
    isFetching: false,
    isError: false,
    retryAfterSeconds: null,
    onRetry: vi.fn(),
    onClear: vi.fn(),
    ...overrides,
  };
}

function heading(name: string) {
  return screen.queryByRole('heading', { level: 3, name });
}

describe('SearchResults', () => {
  it('shows the prompt when there is no search', () => {
    renderWithIntl(<SearchResults {...props({ search: null })} />);

    expect(heading(m.Search.status.prompt.title)).toBeInTheDocument();
  });

  it('shows only the skeleton while fetching, even with an error', () => {
    const { container } = renderWithIntl(<SearchResults {...props({ isFetching: true, isError: true })} />);

    expect(container.querySelector('[aria-busy="true"]')).not.toBeNull();
    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
  });

  it.each([
    ['without a generic error', false],
    ['together with a generic error', true],
  ])('shows the rate limit panel %s', (_name, isError) => {
    renderWithIntl(<SearchResults {...props({ retryAfterSeconds: 120, isError })} />);

    expect(heading(m.Search.status.rateLimited.title)).toBeInTheDocument();
    expect(heading(m.Search.status.error.title)).not.toBeInTheDocument();
  });

  it('shows the error panel and retries through onRetry', async () => {
    const onRetry = vi.fn();
    const { user } = renderWithIntl(<SearchResults {...props({ isError: true, onRetry })} />);

    expect(heading(m.Search.status.error.title)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: m.Search.status.error.retry }));

    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it.each([
    ['an empty list', []],
    ['undefined records', undefined],
  ])('shows the no results panel for %s', (_name, records) => {
    renderWithIntl(<SearchResults {...props({ records })} />);

    expect(heading(m.Search.status.noResults.title)).toBeInTheDocument();
  });

  describe('with records', () => {
    const records = [
      makeParticipantsResponse({
        nameKey: 'ane garcia lopez',
        name: 'Ane Garcia Lopez',
        school: makeSchool({ canonicalName: 'Ikastola Uno' }),
        participations: [makeParticipation({ year: 2024 }), makeParticipation({ year: 2023 })],
      }),
      makeParticipantsResponse({
        nameKey: 'ane garcia',
        name: 'Ane Garcia',
        matchType: 'compatible',
        school: makeSchool({ canonicalName: 'Ikastola Dos' }),
        participations: [makeParticipation({ year: 2022 })],
      }),
    ];

    it('shows the summary with the totals and the school of the first record', () => {
      const { container } = renderWithIntl(<SearchResults {...props({ records })} />);

      const text = container.textContent ?? '';
      expect(text).toContain(t('records', { count: 2 }));
      expect(text).toContain(t('participations', { count: 3 }));
      expect(text).toContain(t('query', { participant: 'Ane Garcia Lopez', school: 'Ikastola Uno' }));
    });

    it('renders one article per record', () => {
      renderWithIntl(<SearchResults {...props({ records })} />);

      expect(screen.getAllByRole('article')).toHaveLength(2);
      expect(screen.getByRole('article', { name: 'Ane Garcia Lopez' })).toBeInTheDocument();
      expect(screen.getByRole('article', { name: 'Ane Garcia' })).toBeInTheDocument();
    });

    it('calls onClear from the summary button', async () => {
      const onClear = vi.fn();
      const { user } = renderWithIntl(<SearchResults {...props({ records, onClear })} />);

      await user.click(screen.getByRole('button', { name: m.Search.results.summary.clear }));

      expect(onClear).toHaveBeenCalledTimes(1);
    });
  });
});
