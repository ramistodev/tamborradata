import { screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { FamilyRender } from '@/app/(frontend)/[locale]/(pages)/statistics/[period]/components/family/FamilyRender';
import { makeFamily, makeRanksCategory } from '@/test/fixtures/statistics';
import { messagesByLocale } from '@/test/helpers/messages';
import { navigationState } from '@/test/helpers/nextNavigation';
import { createTestQueryClient } from '@/test/helpers/queryClient';
import { renderWithIntl } from '@/test/helpers/renderWithIntl';

vi.mock('@/app/(frontend)/[locale]/services/fetchCategory', () => ({ fetchCategory: vi.fn() }));
vi.mock('@/app/(frontend)/[locale]/(pages)/statistics/[period]/utils/scrollToActiveElement', () => ({
  scrollToActiveElement: vi.fn(),
}));

const m = messagesByLocale.es.Statistics;

function setup(family: ReturnType<typeof makeFamily>) {
  navigationState.params = { period: '2024' };
  return renderWithIntl(<FamilyRender family={family} />, { queryClient: createTestQueryClient() });
}

describe('FamilyRender', () => {
  it('renders a focusable section labelled by its title heading', () => {
    const { container } = setup(makeFamily('names', []));

    const section = container.querySelector('section#names');
    const heading = screen.getByRole('heading', { level: 2 });

    expect(section).toHaveAttribute('tabindex', '-1');
    expect(section).toHaveAttribute('aria-labelledby', 'names-title');
    expect(heading).toHaveAttribute('id', 'names-title');
    expect(heading).toHaveTextContent(m.familyRender.names.title);
    expect(screen.getByRole('region', { name: m.familyRender.names.title })).toBe(section);
  });

  it.each([
    ['participationDynamics', '01'],
    ['names', '02'],
    ['schoolsEvolution', '07'],
  ] as const)('shows the order badge of %s as %s', (family, badge) => {
    const { container } = setup(makeFamily(family, []));

    const order = container.querySelector('header span[aria-hidden="true"]');

    expect(order).toHaveTextContent(badge);
  });

  it('renders the family summary as markdown', () => {
    setup(makeFamily('names', [], 'Family **text**'));

    expect(screen.getByText('text').tagName).toBe('STRONG');
  });

  it('renders no markdown paragraph for an empty summary', () => {
    const { container } = setup(makeFamily('names', [], ''));

    expect(container.querySelector('p')).toBeNull();
  });

  it('lists the categories of the family in its layout', () => {
    setup(makeFamily('names', [makeRanksCategory('topNames')]));

    expect(screen.getByRole('heading', { level: 3, name: m.categories.topNames.title })).toBeInTheDocument();
    expect(screen.getByRole('list', { name: m.categories.topNames.title })).toBeInTheDocument();
  });
});
