import { screen } from '@testing-library/react';
import { createTranslator, useTranslations } from 'next-intl';
import { describe, expect, it, vi } from 'vitest';
import { LOCALES, messagesByLocale } from '@/test/helpers/messages';
import { renderWithIntl } from '@/test/helpers/renderWithIntl';

vi.mock('next-intl/server', async () =>
  (await import('@/test/helpers/nextIntlServerMock')).nextIntlServerModule(),
);

function Probe() {
  const t = useTranslations('Footer');
  return <p>{t('openSource')}</p>;
}

describe('next-intl under Vitest', () => {
  it('createTranslator resolves a known es key', () => {
    const t = createTranslator({
      locale: 'es',
      messages: messagesByLocale.es,
      namespace: 'Footer',
    } as never) as (key: string) => string;

    expect(t('openSource')).toBe(messagesByLocale.es.Footer.openSource);
    expect(t('openSource')).toBe('Código abierto en GitHub');
  });

  it.each(LOCALES)('renders a client component with useTranslations in %s', (locale) => {
    renderWithIntl(<Probe />, { locale });

    expect(screen.getByText(messagesByLocale[locale].Footer.openSource)).toBeInTheDocument();
  });

  it('serves translations and formatting through the mocked next-intl/server', async () => {
    const { getFormatter, getLocale, getTranslations } = await import('next-intl/server');
    const t = await getTranslations('Footer');
    const format = await getFormatter();

    expect(await getLocale()).toBe('es');
    expect(t('openSource')).toBe('Código abierto en GitHub');
    expect(format.number(12345.5)).toBe('12.345,5');
  });

  it('imports i18n/seo with next-intl/server mocked', async () => {
    const seo = await import('@/app/(frontend)/i18n/seo');

    expect(typeof seo.getAlternates).toBe('function');
  });
});
