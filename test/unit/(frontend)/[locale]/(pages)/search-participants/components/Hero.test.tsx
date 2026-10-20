import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import { Hero } from '@/app/(frontend)/[locale]/(pages)/search-participants/components/Hero';
import { LOCALES, messagesByLocale } from '@/test/helpers/messages';
import { renderWithIntl } from '@/test/helpers/renderWithIntl';

const m = messagesByLocale.es.Search.hero;

describe('Hero', () => {
  it('renders the first title line inside the h1', () => {
    renderWithIntl(<Hero />);

    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent(m.titleLine1);
  });

  it('renders the second title line with the accent word in a highlighted span', () => {
    renderWithIntl(<Hero />);

    const heading = screen.getByRole('heading', { level: 1 });
    const secondLine = heading.children[1];
    expect(secondLine).toHaveTextContent('de la Tamborrada Infantil');
    const accent = secondLine.querySelector('span');
    expect(accent).toHaveTextContent('Tamborrada');
    expect(accent).toHaveClass('text-accent');
  });

  it('renders the description and the about paragraphs', () => {
    renderWithIntl(<Hero />);

    expect(screen.getByText(m.description).tagName).toBe('P');
    expect(screen.getByText(m.about).tagName).toBe('P');
  });

  it.each(LOCALES)('renders the %s texts without missing messages', (locale) => {
    const messages = messagesByLocale[locale].Search.hero;

    renderWithIntl(<Hero />, { locale });

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(messages.titleLine1);
    expect(screen.getByText(messages.description)).toBeInTheDocument();
  });
});
