import type { ReactElement } from 'react';
import { screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import NotFound from '@/app/not-found';
import { messagesByLocale, type TestLocale } from '@/test/helpers/messages';
import { setServerLocale } from '@/test/helpers/nextIntlServerMock';
import { renderWithIntl } from '@/test/helpers/renderWithIntl';

vi.mock('next-intl/server', async () => (await import('@/test/helpers/nextIntlServerMock')).nextIntlServerModule());
vi.mock('@/app/(frontend)/[locale]/config/fonts', () => ({
  sora: { variable: 'v-sora' },
  spaceGrotesk: { variable: 'v-sg' },
  jetbrainsMono: { variable: 'v-jb' },
}));

type HtmlElement = ReactElement<{ lang: string; className: string; children: ReactElement }>;

describe('NotFound', () => {
  beforeEach(() => {
    setServerLocale('es');
  });

  it('renders an html document element with the default locale and the font classes', async () => {
    const element = (await NotFound()) as HtmlElement;

    expect(element.type).toBe('html');
    expect(element.props.lang).toBe('es');
    expect(element.props.className).toBe('v-sora v-sg v-jb');
  });

  it.each<TestLocale>(['en', 'eu'])('uses the request locale %s as the document language', async (locale) => {
    setServerLocale(locale);

    const element = (await NotFound()) as HtmlElement;

    expect(element.props.lang).toBe(locale);
  });

  it('translates the body with the request locale', async () => {
    setServerLocale('en');
    const element = (await NotFound()) as HtmlElement;

    // html > body > NextIntlClientProvider (needs a request context) > main: render the main under a test provider
    const body = element.props.children as ReactElement<{ children: ReactElement }>;
    const provider = body.props.children as ReactElement<{ children: ReactElement }>;
    const { container } = renderWithIntl(provider.props.children, { locale: 'en' });

    expect(container).toHaveTextContent(messagesByLocale.en.NotFound.title);
    expect(screen.getByRole('link', { name: messagesByLocale.en.NotFound.backHome })).toHaveAttribute(
      'href',
      '/en',
    );
  });
});
