import { screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { NewspaperClipping } from '@/app/(frontend)/[locale]/(landing)/components/press-mentions/NewspaperClipping';
import { pressArticle } from '@/app/(frontend)/[locale]/(landing)/components/press-mentions/pressArticle';
import { messagesByLocale } from '@/test/helpers/messages';
import { renderWithIntl } from '@/test/helpers/renderWithIntl';

const m = messagesByLocale.es.Landing;

describe('NewspaperClipping', () => {
  it('is a single link to the article that opens in a new tab', () => {
    renderWithIntl(<NewspaperClipping />);

    const links = screen.getAllByRole('link');

    expect(links).toHaveLength(1);
    expect(links[0]).toHaveAttribute('href', pressArticle.url);
    expect(links[0]).toHaveAttribute('target', '_blank');
    expect(links[0]).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('shows the publication, section, headline, author and host', () => {
    renderWithIntl(<NewspaperClipping />);

    expect(screen.getByText('El Diario Vasco')).toBeInTheDocument();
    expect(screen.getByText('Tamborrada')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: pressArticle.headline })).toBeInTheDocument();
    expect(screen.getByText('Jorge F. Mendiola')).toBeInTheDocument();
    expect(screen.getByText('diariovasco.com')).toBeInTheDocument();
  });

  it('shows the publication date in a time element', () => {
    const { container } = renderWithIntl(<NewspaperClipping />);

    const time = container.querySelector('time');

    expect(time).toHaveAttribute('datetime', '2026-01-16');
    expect(time).toHaveTextContent('16 · 01 · 2026');
  });

  it('shows the read line and the new tab text', () => {
    renderWithIntl(<NewspaperClipping />);

    const link = screen.getByRole('link');

    expect(screen.getByText(m.press.clipping.read)).toBeInTheDocument();
    expect(within(link).getByText(m.common.newTab)).toBeInTheDocument();
  });

  it('marks exactly the header and the body as Spanish', () => {
    const { container } = renderWithIntl(<NewspaperClipping />);

    expect(container.querySelectorAll('[lang="es"]')).toHaveLength(2);
  });

  it('keeps the Spanish source data and translates only the website text in English', () => {
    const { container } = renderWithIntl(<NewspaperClipping />, { locale: 'en' });
    const en = messagesByLocale.en.Landing;

    expect(container.querySelectorAll('[lang="es"]')).toHaveLength(2);
    expect(screen.getByRole('heading', { level: 3, name: pressArticle.headline })).toBeInTheDocument();
    expect(screen.getByText('Jorge F. Mendiola')).toBeInTheDocument();
    expect(screen.getByText(en.press.clipping.read)).toBeInTheDocument();
    expect(screen.getByText(en.common.newTab)).toBeInTheDocument();
  });
});
