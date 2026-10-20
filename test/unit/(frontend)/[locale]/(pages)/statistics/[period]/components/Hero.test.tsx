import { createTranslator } from 'next-intl';
import { screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Hero } from '@/app/(frontend)/[locale]/(pages)/statistics/[period]/components/Hero';
import { makePeriodList } from '@/test/fixtures/period';
import { makeStatisticsMeta } from '@/test/fixtures/statistics';
import { messagesByLocale } from '@/test/helpers/messages';
import { renderWithIntl } from '@/test/helpers/renderWithIntl';

vi.mock('@/app/(frontend)/[locale]/(pages)/statistics/[period]/utils/scrollToActiveElement', () => ({
  scrollToActiveElement: vi.fn(),
}));

const m = messagesByLocale.es;
const t = createTranslator({ locale: 'es', messages: m, namespace: 'Statistics' });
const overview = [
  { category: 'totalParticipants', metricKey: 'participant_count', valueNumeric: 1234 },
] as never;
const intro = { section: 'periodIntro', summary: 'Intro **text**' } as const;
const globalMeta = makeStatisticsMeta({ period: 'global', periodKind: 'global' });

function renderHero(overrides: Partial<Parameters<typeof Hero>[0]> = {}) {
  return renderWithIntl(
    <Hero periods={makePeriodList()} periodData={makeStatisticsMeta()} overview={overview} intro={intro} {...overrides} />,
  );
}

describe('Hero', () => {
  it('renders a focusable hero section', () => {
    const { container } = renderHero();

    const section = container.querySelector('section#hero');

    expect(section).not.toBeNull();
    expect(section).toHaveAttribute('tabindex', '-1');
  });

  it('shows the year eyebrow for a year period', () => {
    renderHero();

    expect(screen.getByText(m.Statistics.hero.eyebrowYear)).toBeInTheDocument();
  });

  it('shows the global eyebrow for the global period', () => {
    renderHero({ periodData: globalMeta });

    expect(screen.getByText(t('hero.eyebrowGlobal', { period: 'global' }))).toBeInTheDocument();
    expect(screen.queryByText(m.Statistics.hero.eyebrowYear)).not.toBeInTheDocument();
  });

  it('renders the desktop and mobile titles of a year inside the h1', () => {
    renderHero();

    const heading = screen.getByRole('heading', { level: 1 });

    expect(heading).toHaveAttribute('id', 'year-page-title');
    expect(heading).toHaveTextContent(t('period.title', { period: '2024' }));
    expect(heading).toHaveTextContent(t('hero.titleYear', { period: '2024' }));
  });

  it('renders the global titles for the global period', () => {
    renderHero({ periodData: globalMeta });

    const heading = screen.getByRole('heading', { level: 1 });

    expect(heading).toHaveTextContent(t('period.title', { period: 'global' }));
    expect(heading).toHaveTextContent(t('hero.titleGlobal'));
  });

  it('includes the publish date, the period selector and the overview', () => {
    const { container } = renderHero();

    expect(container.querySelector('time')).not.toBeNull();
    expect(screen.getByRole('navigation', { name: m.Statistics.periodSelector.label })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Resumen · 2024' })).toBeInTheDocument();
  });

  it('renders the intro markdown', () => {
    const { container } = renderHero();

    expect(within(container).getByText('text').tagName).toBe('STRONG');
  });

  it('renders no markdown paragraph for an empty intro', () => {
    const { container } = renderHero({ intro: { section: 'periodIntro', summary: '' } });

    expect(container.querySelector('p')).toBeNull();
  });
});
