import { createTranslator } from 'next-intl';
import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PeriodNeighbors } from '@/app/(frontend)/[locale]/(pages)/statistics/[period]/components/PeriodNeighbors';
import { makePeriod, makePeriodList } from '@/test/fixtures/period';
import { messagesByLocale } from '@/test/helpers/messages';
import { renderWithIntl } from '@/test/helpers/renderWithIntl';

const m = messagesByLocale.es;
const t = createTranslator({ locale: 'es', messages: m, namespace: 'Statistics.closing' });

describe('PeriodNeighbors', () => {
  it('links to the newer and older editions around the current one', () => {
    renderWithIntl(<PeriodNeighbors periods={makePeriodList()} currentPeriod="2024" />);

    const nav = screen.getByRole('navigation', { name: m.Statistics.closing.navLabel });
    const newer = screen.getByRole('link', { name: new RegExp(m.Statistics.closing.newer) });
    const older = screen.getByRole('link', { name: new RegExp(m.Statistics.closing.older) });

    expect(nav).toContainElement(newer);
    expect(newer).toHaveAttribute('href', '/statistics/2025');
    expect(newer).toHaveTextContent(t('edition', { period: '2025' }));
    expect(older).toHaveAttribute('href', '/statistics/2023');
    expect(older).toHaveTextContent(t('edition', { period: '2023' }));
  });

  it('renders only the older link and an inert spacer for the newest edition', () => {
    const { container } = renderWithIntl(<PeriodNeighbors periods={makePeriodList()} currentPeriod="2025" />);

    const links = screen.getAllByRole('link');

    expect(links).toHaveLength(1);
    expect(links[0]).toHaveAttribute('href', '/statistics/2024');
    expect(links[0]).toHaveTextContent(m.Statistics.closing.older);
    expect(container.querySelector('nav > span[aria-hidden="true"]')).not.toBeNull();
  });

  it('renders only the newer link for the oldest edition', () => {
    const { container } = renderWithIntl(<PeriodNeighbors periods={makePeriodList()} currentPeriod="2023" />);

    const links = screen.getAllByRole('link');

    expect(links).toHaveLength(1);
    expect(links[0]).toHaveAttribute('href', '/statistics/2024');
    expect(links[0]).toHaveTextContent(m.Statistics.closing.newer);
    expect(container.querySelector('span[aria-hidden="true"]')).toBeNull();
  });

  it.each([
    ['the global period', makePeriodList(), 'global'],
    ['an unknown slug', makePeriodList(), '1999'],
    ['a list with a single year', [makePeriod()], '2024'],
  ] as const)('renders nothing for %s', (_name, periods, currentPeriod) => {
    const { container } = renderWithIntl(<PeriodNeighbors periods={[...periods]} currentPeriod={currentPeriod} />);

    expect(container).toBeEmptyDOMElement();
  });
});
