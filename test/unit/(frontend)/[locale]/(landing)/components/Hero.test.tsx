import { act, screen } from '@testing-library/react';
import { createFormatter, createTranslator } from 'next-intl';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Hero } from '@/app/(frontend)/[locale]/(landing)/components/Hero';
import { MockIntersectionObserver } from '@/test/helpers/observers';
import { installMatchMedia } from '@/test/helpers/matchMedia';
import { messagesByLocale } from '@/test/helpers/messages';
import { renderWithIntl } from '@/test/helpers/renderWithIntl';
import { makeGlobalOverview, makeLastOverview, makeOverviewResponse } from '@/test/fixtures/overview';

const m = messagesByLocale.es;
const t = createTranslator({ locale: 'es', messages: m, namespace: 'Landing.hero' } as never);
const format = createFormatter({ locale: 'es' } as never);

function advance(totalMs: number, stepMs = 2) {
  for (let elapsed = 0; elapsed < totalMs; elapsed += stepMs) {
    act(() => {
      vi.advanceTimersByTime(stepMs);
    });
  }
}

function startCounters() {
  const observer = MockIntersectionObserver.instances.find((io) => io.observed.size > 0);
  if (!observer) throw new Error('no observer is watching the metrics');

  act(() => observer.trigger(true));
  act(() => {
    vi.advanceTimersByTime(1000);
  });
}

function visibleValue(label: string) {
  return screen.getByText(label).parentElement!.querySelector('[aria-hidden="true"]')?.textContent;
}

function screenReaderValue(label: string) {
  return screen.getByText(label).parentElement!.querySelector('.sr-only')?.textContent;
}

function typewriterText() {
  return screen.getByRole('heading', { level: 1 }).parentElement!.querySelector('p > span[aria-hidden="true"]')!
    .textContent;
}

describe('Hero', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('title and typewriter', () => {
    it('renders the site name as the level one heading', () => {
      renderWithIntl(<Hero overview={makeOverviewResponse()} />);

      expect(screen.getByRole('heading', { level: 1, name: 'Tamborradata' })).toBeInTheDocument();
    });

    it('keeps the first phrase for screen readers', () => {
      renderWithIntl(<Hero overview={makeOverviewResponse()} />);

      const phrase = screen.getByText(m.Landing.hero.phrases.names, { selector: '.sr-only' });

      expect(phrase).toBeInTheDocument();
    });

    it('types the first phrase from an empty line', () => {
      renderWithIntl(<Hero overview={makeOverviewResponse()} />);

      expect(typewriterText()).toBe('');

      advance(1000);

      expect(typewriterText()).toBe(m.Landing.hero.phrases.names);
    });
  });

  describe('description', () => {
    it('quotes the first year of the overview', () => {
      renderWithIntl(<Hero overview={makeOverviewResponse()} />);

      expect(screen.getByText(t('description', { startYear: '2000' }))).toBeInTheDocument();
    });

    it('falls back to a text without years when there is no overview', () => {
      renderWithIntl(<Hero overview={null} />);

      expect(screen.getByText(m.Landing.hero.descriptionFallback)).toBeInTheDocument();
    });
  });

  describe('metrics', () => {
    it('shows the three labels', () => {
      renderWithIntl(<Hero overview={makeOverviewResponse()} />);

      expect(screen.getByText(m.Landing.hero.metrics.participations)).toBeInTheDocument();
      expect(screen.getByText(m.Landing.hero.metrics.editions)).toBeInTheDocument();
      expect(screen.getByText(m.Landing.hero.metrics.schools)).toBeInTheDocument();
    });

    it('starts the animated values at zero and keeps the final numbers for screen readers', () => {
      renderWithIntl(<Hero overview={makeOverviewResponse()} />);

      expect(visibleValue(m.Landing.hero.metrics.participations)).toBe('0');
      expect(visibleValue(m.Landing.hero.metrics.editions)).toBe('0');
      expect(visibleValue(m.Landing.hero.metrics.schools)).toBe('0');
      expect(screenReaderValue(m.Landing.hero.metrics.participations)).toBe(format.number(52340));
      expect(screenReaderValue(m.Landing.hero.metrics.participations)).toBe('52.340');
      expect(screenReaderValue(m.Landing.hero.metrics.editions)).toBe('26');
      expect(screenReaderValue(m.Landing.hero.metrics.schools)).toBe('87');
    });

    it('counts up to the final numbers once the metrics are in view', () => {
      renderWithIntl(<Hero overview={makeOverviewResponse()} />);

      startCounters();

      expect(visibleValue(m.Landing.hero.metrics.participations)).toBe('52.340');
      expect(visibleValue(m.Landing.hero.metrics.editions)).toBe('26');
      expect(visibleValue(m.Landing.hero.metrics.schools)).toBe('87');
    });

    it('does not count while the metrics are out of view', () => {
      renderWithIntl(<Hero overview={makeOverviewResponse()} />);

      act(() => {
        vi.advanceTimersByTime(1000);
      });

      expect(visibleValue(m.Landing.hero.metrics.participations)).toBe('0');
    });
  });

  describe('summary line', () => {
    it('shows the covered years and the top name, surname and school', () => {
      renderWithIntl(<Hero overview={makeOverviewResponse()} />);

      expect(screen.getByText('2000 - 2025')).toBeInTheDocument();
      expect(screen.getByText(t('summary.topName', { name: 'Ane' }))).toBeInTheDocument();
      expect(screen.getByText(t('summary.topSurname', { surname: 'Garcia' }))).toBeInTheDocument();
      expect(screen.getByText(t('summary.topSchool', { school: 'Ikastola Test' }))).toBeInTheDocument();
    });
  });

  describe('without global data', () => {
    it.each([
      ['a null overview', null],
      ['an overview with only the last period', { lastPeriod: makeLastOverview() }],
    ])('renders no metric labels with %s', (_name, overview) => {
      renderWithIntl(<Hero overview={overview} />);

      expect(screen.queryByText(m.Landing.hero.metrics.participations)).not.toBeInTheDocument();
      expect(screen.queryByText(m.Landing.hero.metrics.editions)).not.toBeInTheDocument();
      expect(screen.queryByText(m.Landing.hero.metrics.schools)).not.toBeInTheDocument();
    });
  });

  describe('with reduced motion', () => {
    beforeEach(() => {
      installMatchMedia({ '(prefers-reduced-motion: reduce)': true });
    });

    it('shows the first phrase at once', () => {
      renderWithIntl(<Hero overview={makeOverviewResponse()} />);

      expect(typewriterText()).toBe(m.Landing.hero.phrases.names);
    });

    it('shows the final numbers without any trigger', () => {
      renderWithIntl(<Hero overview={{ globalPeriod: makeGlobalOverview() }} />);

      expect(visibleValue(m.Landing.hero.metrics.participations)).toBe('52.340');
      expect(visibleValue(m.Landing.hero.metrics.editions)).toBe('26');
      expect(visibleValue(m.Landing.hero.metrics.schools)).toBe('87');
    });
  });
});
