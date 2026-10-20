import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import { createTranslator } from 'next-intl';
import { TopStats } from '@/app/(frontend)/[locale]/(pages)/search-participants/components/TopStats';
import { makeTopEntry } from '@/test/fixtures/overview';
import { messagesByLocale } from '@/test/helpers/messages';
import { renderWithIntl } from '@/test/helpers/renderWithIntl';

const m = messagesByLocale.es.Search.topStats;
const t = createTranslator({ locale: 'es', messages: messagesByLocale.es, namespace: 'Search.topStats' } as never);

function renderStats() {
  return renderWithIntl(
    <TopStats
      topName={makeTopEntry({ label: 'Ane', count: 1200 })}
      topSurname={makeTopEntry({ label: 'Garcia', count: 2400 })}
      topSchool={makeTopEntry({ label: 'Ikastola Test', count: 1 })}
    />,
  );
}

describe('TopStats', () => {
  it('renders the three terms in order', () => {
    renderStats();

    expect(screen.getAllByRole('term').map((term) => term.textContent)).toEqual([m.name, m.surname, m.school]);
  });

  it('renders the label of each entry', () => {
    renderStats();

    expect(screen.getByText('Ane')).toBeInTheDocument();
    expect(screen.getByText('Garcia')).toBeInTheDocument();
    expect(screen.getByText('Ikastola Test')).toBeInTheDocument();
  });

  it('renders the count visibly formatted and hidden from assistive technology', () => {
    renderStats();

    expect(screen.getByText('1.200')).toHaveAttribute('aria-hidden', 'true');
    expect(screen.getByText('2.400')).toHaveAttribute('aria-hidden', 'true');
  });

  it('renders a screen reader text with the pluralised count', () => {
    renderStats();

    const text = screen.getByText(t('count', { count: 1200 }));
    expect(text).toHaveClass('sr-only');
    expect(screen.getByText(t('count', { count: 1 }))).toHaveClass('sr-only');
  });
});
