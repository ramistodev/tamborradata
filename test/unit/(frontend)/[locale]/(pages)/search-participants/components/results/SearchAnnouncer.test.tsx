import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, screen } from '@testing-library/react';
import { createTranslator } from 'next-intl';
import { SearchAnnouncer } from '@/app/(frontend)/[locale]/(pages)/search-participants/components/results/SearchAnnouncer';
import { makeParticipantsResponse, makeParticipation, makeSchool } from '@/test/fixtures/participants';
import { messagesByLocale } from '@/test/helpers/messages';
import { renderWithIntl } from '@/test/helpers/renderWithIntl';

const m = messagesByLocale.es;
const tStatus = createTranslator({ locale: 'es', messages: m, namespace: 'Search.status' } as never);
const tResults = createTranslator({ locale: 'es', messages: m, namespace: 'Search.results' } as never);

type Props = Parameters<typeof SearchAnnouncer>[0];

const baseProps: Props = {
  search: { participant: 'Ane Garcia Lopez', schoolKey: 'sk' },
  records: undefined,
  isFetching: false,
  isError: false,
  retryAfterSeconds: null,
};

function advance(ms: number): void {
  act(() => {
    vi.advanceTimersByTime(ms);
  });
}

function region(): HTMLElement {
  return screen.getByRole('status');
}

describe('SearchAnnouncer', () => {
  beforeEach(() => {
    vi.useFakeTimers({ now: new Date('2026-03-10T12:00:00.000Z') });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders a polite atomic live region', () => {
    renderWithIntl(<SearchAnnouncer {...baseProps} search={null} />);

    expect(region()).toHaveAttribute('aria-live', 'polite');
    expect(region()).toHaveAttribute('aria-atomic', 'true');
  });

  it('stays empty when there is no search', () => {
    renderWithIntl(<SearchAnnouncer {...baseProps} search={null} isFetching />);

    advance(500);

    expect(region()).toBeEmptyDOMElement();
  });

  it('announces the loading message only after the delay', () => {
    renderWithIntl(<SearchAnnouncer {...baseProps} isFetching />);

    advance(149);
    expect(region()).toBeEmptyDOMElement();

    advance(1);
    expect(region()).toHaveTextContent(m.Search.results.loading);
  });

  it('announces the rate limit with the minutes to wait', () => {
    renderWithIntl(<SearchAnnouncer {...baseProps} isError retryAfterSeconds={120} />);

    advance(150);

    const rl = m.Search.status.rateLimited;
    expect(region()).toHaveTextContent(
      `${rl.title}. ${tStatus('rateLimited.description', { minutes: 2 })}`,
    );
  });

  it('announces the generic error', () => {
    renderWithIntl(<SearchAnnouncer {...baseProps} isError />);

    advance(150);

    const e = m.Search.status.error;
    expect(region()).toHaveTextContent(`${e.title}. ${e.description}`);
  });

  it.each([
    ['an empty list', []],
    ['undefined records', undefined],
  ])('announces that nothing was found for %s', (_name, records) => {
    renderWithIntl(<SearchAnnouncer {...baseProps} records={records} />);

    advance(150);

    const n = m.Search.status.noResults;
    expect(region()).toHaveTextContent(`${n.title}. ${n.description}`);
  });

  it('announces the number of records and participations', () => {
    const records = [
      makeParticipantsResponse({
        nameKey: 'a',
        school: makeSchool({ canonicalName: 'Ikastola Uno' }),
        participations: [makeParticipation({ year: 2024 }), makeParticipation({ year: 2023 })],
      }),
      makeParticipantsResponse({
        nameKey: 'b',
        school: makeSchool({ canonicalName: 'Ikastola Dos' }),
        participations: [makeParticipation({ year: 2022 })],
      }),
    ];
    renderWithIntl(<SearchAnnouncer {...baseProps} records={records} />);

    advance(150);

    expect(region()).toHaveTextContent(
      tResults('announce', {
        records: 2,
        participations: 3,
        participant: 'Ane Garcia Lopez',
        school: 'Ikastola Uno',
      }),
    );
  });

  it('announces an identical search again after emptying the region', () => {
    const { rerender } = renderWithIntl(<SearchAnnouncer {...baseProps} isFetching />);
    advance(150);
    expect(region()).toHaveTextContent(m.Search.results.loading);

    rerender(
      <SearchAnnouncer {...baseProps} search={{ participant: 'Ane Garcia Lopez', schoolKey: 'sk' }} isFetching />,
    );

    expect(region()).toBeEmptyDOMElement();

    advance(150);

    expect(region()).toHaveTextContent(m.Search.results.loading);
  });
});
