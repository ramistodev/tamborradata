import { screen, within } from '@testing-library/react';
import { createTranslator } from 'next-intl';
import { describe, expect, it } from 'vitest';
import { PressMentionsSection } from '@/app/(frontend)/[locale]/(landing)/components/press-mentions/PressMentionsSection';
import { pressArticle } from '@/app/(frontend)/[locale]/(landing)/components/press-mentions/pressArticle';
import { messagesByLocale } from '@/test/helpers/messages';
import { renderWithIntl } from '@/test/helpers/renderWithIntl';

const m = messagesByLocale.es.Landing;
const t = createTranslator({
  locale: 'es',
  messages: messagesByLocale.es,
  namespace: 'Landing.press',
} as never);

describe('PressMentionsSection', () => {
  it('renders the title as a level two heading', () => {
    renderWithIntl(<PressMentionsSection />);

    expect(screen.getByRole('heading', { level: 2, name: m.press.title })).toBeInTheDocument();
  });

  it('names the publication in the description', () => {
    renderWithIntl(<PressMentionsSection />);

    expect(screen.getByText(t('description', { publication: 'El Diario Vasco' }))).toBeInTheDocument();
  });

  it('links to the original article in a new tab', () => {
    renderWithIntl(<PressMentionsSection />);

    const link = screen.getByRole('link', { name: /Abrir el artículo original/ });

    expect(link).toHaveAttribute('href', pressArticle.url);
    expect(link).toHaveAttribute('target', '_blank');
    expect(within(link).getByText(m.common.newTab)).toBeInTheDocument();
  });

  it('renders the newspaper clipping', () => {
    renderWithIntl(<PressMentionsSection />);

    expect(screen.getByRole('heading', { level: 3, name: pressArticle.headline })).toBeInTheDocument();
  });
});
