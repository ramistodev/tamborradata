import { screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Landing } from '@/app/(frontend)/[locale]/(landing)/Landing';
import { messagesByLocale } from '@/test/helpers/messages';
import { renderWithIntl } from '@/test/helpers/renderWithIntl';
import { makeOverviewResponse } from '@/test/fixtures/overview';

vi.mock('@/app/(frontend)/[locale]/(landing)/components/search-participants/SearchParticipantsSection', () => ({
  SearchParticipantsSection: () => <div data-testid="search-section" />,
}));

const m = messagesByLocale.es;
const sectionNames = [
  m.Landing.sections.stats,
  m.Landing.sections.searchParticipants,
  m.Landing.sections.press,
  m.Landing.sections.openSource,
  m.Landing.sections.buyMeACoffee,
  m.Landing.sections.contact,
  m.Landing.sections.faq,
];

describe('Landing', () => {
  it('renders the site name as the level one heading', () => {
    renderWithIntl(<Landing overview={makeOverviewResponse()} />);

    expect(screen.getByRole('heading', { level: 1, name: 'Tamborradata' })).toBeInTheDocument();
  });

  it('renders the seven sections as regions in order', () => {
    renderWithIntl(<Landing overview={makeOverviewResponse()} />);

    const names = screen.getAllByRole('region').map((region) => region.getAttribute('aria-label'));

    expect(names).toEqual(sectionNames);
    expect(names).toEqual(['Estadísticas', 'Buscador', 'Prensa', 'Código abierto', 'Apoyo', 'Contacto', 'Preguntas']);
  });

  it('numbers the sections from 01 to 07', () => {
    renderWithIntl(<Landing overview={makeOverviewResponse()} />);

    const regions = screen.getAllByRole('region');

    regions.forEach((region, index) => {
      expect(within(region).getByText(`0${index + 1}`)).toBeInTheDocument();
    });
  });

  it('places the search section inside the second region', () => {
    renderWithIntl(<Landing overview={makeOverviewResponse()} />);

    const second = screen.getAllByRole('region')[1];

    expect(within(second).getByTestId('search-section')).toBeInTheDocument();
  });

  it('lists the 15 FAQ questions in the last region', () => {
    renderWithIntl(<Landing overview={makeOverviewResponse()} />);

    const faq = screen.getByRole('region', { name: m.Landing.sections.faq });

    expect(within(faq).getAllByRole('button')).toHaveLength(15);
  });

  it('renders without an overview and shows the two fallback cards', () => {
    renderWithIntl(<Landing overview={null} />);

    expect(
      screen.getByRole('heading', { level: 3, name: m.Landing.stats.fallback.global.title }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 3, name: m.Landing.stats.fallback.last.title }),
    ).toBeInTheDocument();
  });
});
