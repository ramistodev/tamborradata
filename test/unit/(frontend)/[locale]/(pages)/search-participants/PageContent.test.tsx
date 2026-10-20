import { describe, expect, it, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { PageContent } from '@/app/(frontend)/[locale]/(pages)/search-participants/PageContent';
import { makeOverviewResponse } from '@/test/fixtures/overview';
import { messagesByLocale } from '@/test/helpers/messages';
import { createTestQueryClient } from '@/test/helpers/queryClient';
import { renderWithIntl } from '@/test/helpers/renderWithIntl';

vi.mock('@/app/(frontend)/[locale]/services/fetchParticipants', () => ({ fetchParticipants: vi.fn() }));

const m = messagesByLocale.es.Search;

const schools = [
  { school: 'Escuela Uno', schoolKey: 's1' },
  { school: 'Escuela Dos', schoolKey: 's2' },
];

function renderPage(props: Partial<Parameters<typeof PageContent>[0]> = {}) {
  return renderWithIntl(<PageContent schools={schools} overview={makeOverviewResponse()} {...props} />, {
    queryClient: createTestQueryClient(),
  });
}

describe('PageContent', () => {
  it('renders the hero, the search form, the overview and the FAQ', () => {
    renderPage();

    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    expect(screen.getByRole('search', { name: m.form.ariaLabel })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: m.overview.title })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: m.faq.title })).toBeInTheDocument();
  });

  it('replaces the form with the unavailable panel when the schools failed to load', () => {
    renderPage({ schools: null });

    expect(
      screen.getByRole('heading', { level: 3, name: m.status.schoolsUnavailable.title }),
    ).toBeInTheDocument();
    expect(screen.queryByRole('search')).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: m.overview.title })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: m.faq.title })).toBeInTheDocument();
  });

  it('omits the overview and uses the fallback years question when the overview is missing', () => {
    renderPage({ overview: null });

    expect(screen.queryByRole('region', { name: m.overview.title })).not.toBeInTheDocument();
    expect(screen.getByRole('region', { name: m.faq.title })).toBeInTheDocument();
    expect(screen.getByText(m.faq.items.yearsFallback.answer)).toBeInTheDocument();
  });
});
