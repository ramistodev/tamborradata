import { beforeEach, describe, expect, it, vi } from 'vitest';
import { screen, within } from '@testing-library/react';
import type { UserEvent } from '@testing-library/user-event';
import { createTranslator } from 'next-intl';
import { SearchSection } from '@/app/(frontend)/[locale]/(pages)/search-participants/components/SearchSection';
import { RateLimitedError } from '@/app/(frontend)/[locale]/lib/errors';
import { fetchParticipants } from '@/app/(frontend)/[locale]/services/fetchParticipants';
import { makeParticipantsResponse, makeParticipation } from '@/test/fixtures/participants';
import { messagesByLocale } from '@/test/helpers/messages';
import { createTestQueryClient } from '@/test/helpers/queryClient';
import { renderWithIntl } from '@/test/helpers/renderWithIntl';

vi.mock('@/app/(frontend)/[locale]/services/fetchParticipants', () => ({ fetchParticipants: vi.fn() }));

const m = messagesByLocale.es;
const tResults = createTranslator({ locale: 'es', messages: m, namespace: 'Search.results' } as never);
const tSummary = createTranslator({ locale: 'es', messages: m, namespace: 'Search.results.summary' } as never);
const tRateLimited = createTranslator({
  locale: 'es',
  messages: m,
  namespace: 'Search.status.rateLimited',
} as never);

const schools = [
  { school: 'Escuela Uno', schoolKey: 's1' },
  { school: 'Escuela Dos', schoolKey: 's2' },
];

const records = () => [
  makeParticipantsResponse({ name: 'Ane Garcia Lopez' }),
  makeParticipantsResponse({
    nameKey: 'ane garcia',
    name: 'Ane Garcia',
    matchType: 'compatible',
    participations: [makeParticipation({ year: 2023, url: null })],
  }),
];

function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((done) => {
    resolve = done;
  });
  return { promise, resolve };
}

function renderSection(value: typeof schools | null = schools) {
  return renderWithIntl(<SearchSection schools={value} />, { queryClient: createTestQueryClient() });
}

const nameInput = () => screen.getByRole('textbox', { name: m.Search.form.name.ariaLabel });
const schoolTrigger = () => screen.getByRole('button', { name: m.Search.form.school.ariaLabel });
const submitButton = () => screen.getByRole('button', { name: m.Search.form.submit });
const resultsRegion = () => screen.getByRole('region', { name: m.Search.results.title });

async function selectSchool(user: UserEvent, label = 'Escuela Uno') {
  await user.click(schoolTrigger());
  await user.click(screen.getByRole('option', { name: label }));
}

async function fill(user: UserEvent) {
  await user.type(nameInput(), 'Ane Garcia Lopez');
  await selectSchool(user);
}

describe('SearchSection', () => {
  beforeEach(() => {
    vi.mocked(fetchParticipants).mockReset();
  });

  describe('without schools', () => {
    it.each([
      ['null', null],
      ['an empty list', []],
    ])('shows the unavailable panel instead of the form for %s', (_name, value) => {
      renderSection(value);

      expect(
        screen.getByRole('heading', { level: 3, name: m.Search.status.schoolsUnavailable.title }),
      ).toBeInTheDocument();
      expect(screen.queryByRole('search')).not.toBeInTheDocument();
    });
  });

  describe('initial render', () => {
    it('shows the form, the prompt and the results region without searching', () => {
      renderSection();

      expect(screen.getByRole('search', { name: m.Search.form.ariaLabel })).toBeInTheDocument();
      expect(
        screen.getByRole('heading', { level: 3, name: m.Search.status.prompt.title }),
      ).toBeInTheDocument();
      expect(resultsRegion()).toBeInTheDocument();
      expect(fetchParticipants).not.toHaveBeenCalled();
    });
  });

  describe('validation on submit', () => {
    it('focuses the name input and does not search when the form is empty', async () => {
      const { user } = renderSection();

      await user.click(submitButton());

      expect(fetchParticipants).not.toHaveBeenCalled();
      expect(nameInput()).toHaveFocus();
      expect(
        screen.getByRole('heading', { level: 3, name: m.Search.status.prompt.title }),
      ).toBeInTheDocument();
    });

    it('focuses the name input when the name has only two words even with a school', async () => {
      const { user } = renderSection();

      await user.type(nameInput(), 'Ane Garcia');
      await selectSchool(user);
      await user.click(submitButton());

      expect(fetchParticipants).not.toHaveBeenCalled();
      expect(nameInput()).toHaveFocus();
    });

    it('focuses the school trigger when the name is valid and there is no school', async () => {
      const { user } = renderSection();

      await user.type(nameInput(), 'Ane Garcia Lopez');
      await user.click(submitButton());

      expect(fetchParticipants).not.toHaveBeenCalled();
      expect(schoolTrigger()).toHaveFocus();
    });
  });

  describe('happy path', () => {
    it('searches once, shows the skeleton while pending and then the results', async () => {
      const pending = deferred<ReturnType<typeof records>>();
      vi.mocked(fetchParticipants).mockReturnValue(pending.promise);
      const { user } = renderSection();

      await fill(user);

      expect(submitButton()).toHaveFocus();

      await user.click(submitButton());

      expect(fetchParticipants).toHaveBeenCalledTimes(1);
      expect(fetchParticipants).toHaveBeenCalledWith({
        participant: 'Ane Garcia Lopez',
        schoolKey: 's1',
        signal: expect.any(AbortSignal),
      });
      expect(resultsRegion().querySelector('[aria-busy="true"]')).not.toBeNull();

      pending.resolve(records());

      expect(await screen.findAllByRole('article')).toHaveLength(2);
      expect(resultsRegion().querySelector('[aria-busy="true"]')).toBeNull();
      expect(resultsRegion().textContent).toContain(tSummary('records', { count: 2 }));
      expect(screen.getByRole('heading', { level: 3, name: 'Ane Garcia Lopez' })).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 3, name: 'Ane Garcia' })).toBeInTheDocument();
      expect(screen.getByText(m.Search.results.card.exact)).toBeInTheDocument();
      expect(screen.getByText(m.Search.results.card.compatible)).toBeInTheDocument();
      expect(screen.getAllByRole('link')).toHaveLength(1);
      expect(screen.getByRole('link')).toHaveAttribute('href', 'https://example.org/2024');
      expect(screen.getByText(m.Search.results.row.noSource)).toBeInTheDocument();

      const announcement = tResults('announce', {
        records: 2,
        participations: 2,
        participant: 'Ane Garcia Lopez',
        school: 'Ikastola Test',
      });
      const liveRegion = within(resultsRegion()).getByRole('status');
      expect(await within(liveRegion).findByText(announcement)).toBeInTheDocument();
    });
  });

  describe('clear', () => {
    it('goes back to the prompt and empties the form', async () => {
      vi.mocked(fetchParticipants).mockResolvedValue(records() as never);
      const { user } = renderSection();

      await fill(user);
      await user.click(submitButton());
      await user.click(await screen.findByRole('button', { name: m.Search.results.summary.clear }));

      expect(
        screen.getByRole('heading', { level: 3, name: m.Search.status.prompt.title }),
      ).toBeInTheDocument();
      expect(nameInput()).toHaveValue('');
      expect(schoolTrigger()).toHaveTextContent(m.Search.form.school.placeholder);
    });
  });

  describe('outcomes', () => {
    it('shows the no results panel for an empty list', async () => {
      vi.mocked(fetchParticipants).mockResolvedValue([]);
      const { user } = renderSection();

      await fill(user);
      await user.click(submitButton());

      expect(
        await screen.findByRole('heading', { level: 3, name: m.Search.status.noResults.title }),
      ).toBeInTheDocument();
    });

    it('shows the error panel and searches again when retrying', async () => {
      vi.mocked(fetchParticipants).mockRejectedValue(new Error('x'));
      const { user } = renderSection();

      await fill(user);
      await user.click(submitButton());

      expect(
        await screen.findByRole('heading', { level: 3, name: m.Search.status.error.title }),
      ).toBeInTheDocument();

      vi.mocked(fetchParticipants).mockResolvedValueOnce(records() as never);
      await user.click(screen.getByRole('button', { name: m.Search.status.error.retry }));

      expect(await screen.findAllByRole('article')).toHaveLength(2);
      expect(fetchParticipants).toHaveBeenCalledTimes(2);
    });

    it('shows the rate limit panel with the countdown and a disabled retry button', async () => {
      vi.mocked(fetchParticipants).mockRejectedValue(new RateLimitedError(120));
      const { user } = renderSection();

      await fill(user);
      await user.click(submitButton());

      expect(
        await screen.findByRole('heading', { level: 3, name: m.Search.status.rateLimited.title }),
      ).toBeInTheDocument();
      expect(
        screen.getByText(tRateLimited('countdown', { minutes: 2, seconds: 0 })),
      ).toBeInTheDocument();
      expect(screen.getByRole('button', { name: m.Search.status.rateLimited.retry })).toBeDisabled();
    });
  });

  describe('repeated search', () => {
    it('does not fetch again when the identical search is submitted twice', async () => {
      vi.mocked(fetchParticipants).mockResolvedValue(records() as never);
      const { user } = renderSection();

      await fill(user);
      await user.click(submitButton());
      expect(await screen.findAllByRole('article')).toHaveLength(2);

      await user.click(submitButton());

      expect(fetchParticipants).toHaveBeenCalledTimes(1);
      expect(screen.getAllByRole('article')).toHaveLength(2);
    });
  });
});
