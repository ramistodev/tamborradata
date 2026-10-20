import { act, screen, within } from '@testing-library/react';
import { createTranslator } from 'next-intl';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { StatsSection } from '@/app/(frontend)/[locale]/(landing)/components/stats/StatsSection';
import { MockIntersectionObserver } from '@/test/helpers/observers';
import { messagesByLocale } from '@/test/helpers/messages';
import { renderWithIntl } from '@/test/helpers/renderWithIntl';
import { makeGlobalOverview, makeLastOverview, makeOverviewResponse } from '@/test/fixtures/overview';

const m = messagesByLocale.es;
const t = createTranslator({ locale: 'es', messages: m, namespace: 'Landing.stats' } as never);

function startCounters() {
  const observer = MockIntersectionObserver.instances.find((io) => io.observed.size > 0);
  if (!observer) throw new Error('no observer is watching the cards');

  act(() => observer.trigger(true));
  act(() => {
    vi.advanceTimersByTime(1000);
  });
}

describe('StatsSection', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('with the default overview', () => {
    it('renders the title and the description with the covered years', () => {
      renderWithIntl(<StatsSection overview={makeOverviewResponse()} />);

      expect(
        screen.getByRole('heading', { level: 2, name: t('title', { startYear: '2000' }) }),
      ).toBeInTheDocument();
      expect(screen.getByText(t('description', { startYear: '2000', endYear: '2025' }))).toBeInTheDocument();
    });

    it('starts the global card at zero while its screen reader text has the final figure', () => {
      renderWithIntl(<StatsSection overview={makeOverviewResponse()} />);

      const [globalCard] = screen.getAllByRole('article');

      expect(within(globalCard).getByText('0')).toBeInTheDocument();
      expect(globalCard.querySelector('.sr-only')).toHaveTextContent('52.340');
    });

    it('counts both cards up to the final figures once in view', () => {
      renderWithIntl(<StatsSection overview={makeOverviewResponse()} />);

      startCounters();

      const [globalCard, lastCard] = screen.getAllByRole('article');

      expect(within(globalCard).getByText('52.340')).toBeInTheDocument();
      expect(within(lastCard).getByText('2.100')).toBeInTheDocument();
    });
  });

  describe('without data', () => {
    it('renders the fallback texts and both fallback cards for a null overview', () => {
      renderWithIntl(<StatsSection overview={null} />);

      expect(screen.getByRole('heading', { level: 2, name: m.Landing.stats.titleFallback })).toBeInTheDocument();
      expect(screen.getByText(m.Landing.stats.descriptionFallback)).toBeInTheDocument();
      expect(
        screen.getByRole('heading', { level: 3, name: m.Landing.stats.fallback.global.title }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole('heading', { level: 3, name: m.Landing.stats.fallback.last.title }),
      ).toBeInTheDocument();
    });

    it('shows the global card and the last fallback card with only the global period', () => {
      renderWithIntl(<StatsSection overview={{ globalPeriod: makeGlobalOverview() }} />);

      const [globalCard, lastCard] = screen.getAllByRole('article');

      expect(
        within(globalCard).getByRole('link', { name: m.Landing.stats.global.cta }),
      ).toBeInTheDocument();
      expect(
        within(lastCard).getByRole('heading', { level: 3, name: m.Landing.stats.fallback.last.title }),
      ).toBeInTheDocument();
    });

    it('shows the global fallback card and the last card with only the last period', () => {
      renderWithIntl(<StatsSection overview={{ lastPeriod: makeLastOverview() }} />);

      const [globalCard, lastCard] = screen.getAllByRole('article');

      expect(
        within(globalCard).getByRole('heading', { level: 3, name: m.Landing.stats.fallback.global.title }),
      ).toBeInTheDocument();
      expect(
        within(lastCard).getByRole('link', { name: t('last.cta', { year: '2025' }) }),
      ).toBeInTheDocument();
    });
  });
});
