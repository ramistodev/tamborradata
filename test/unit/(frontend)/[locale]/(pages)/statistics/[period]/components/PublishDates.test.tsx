import { createFormatter, createTranslator } from 'next-intl';
import { describe, expect, it } from 'vitest';
import { PublishDates } from '@/app/(frontend)/[locale]/(pages)/statistics/[period]/components/PublishDates';
import { makeStatisticsMeta } from '@/test/fixtures/statistics';
import { messagesByLocale, type TestLocale } from '@/test/helpers/messages';
import { renderWithIntl } from '@/test/helpers/renderWithIntl';

const PUBLISHED_AT = '2025-02-01T10:00:00.000Z';

function expectedDate(locale: TestLocale, iso: string): string {
  return createFormatter({ locale }).dateTime(new Date(iso), {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Europe/Madrid',
  });
}

function translator(locale: TestLocale) {
  return createTranslator({
    locale,
    messages: messagesByLocale[locale],
    namespace: 'Statistics.publishDates',
  });
}

describe('PublishDates', () => {
  it('shows the published date when the period was never modified', () => {
    const { container } = renderWithIntl(
      <PublishDates periodData={makeStatisticsMeta({ publishedAt: PUBLISHED_AT, updatedAt: PUBLISHED_AT })} />,
    );

    const time = container.querySelector('time');

    expect(time).toHaveAttribute('dateTime', PUBLISHED_AT);
    expect(time).toHaveTextContent(translator('es')('published', { date: expectedDate('es', PUBLISHED_AT) }));
    expect(time).toHaveTextContent('Publicado el 1 de febrero de 2025');
  });

  it('keeps the published text when the update is only 30 seconds later', () => {
    const updatedAt = '2025-02-01T10:00:30.000Z';
    const { container } = renderWithIntl(
      <PublishDates periodData={makeStatisticsMeta({ publishedAt: PUBLISHED_AT, updatedAt })} />,
    );

    const time = container.querySelector('time');

    expect(time).toHaveAttribute('dateTime', PUBLISHED_AT);
    expect(time).toHaveTextContent(translator('es')('published', { date: expectedDate('es', PUBLISHED_AT) }));
  });

  it('shows the updated date when the update is 5 minutes later', () => {
    const updatedAt = '2025-02-01T10:05:00.000Z';
    const { container } = renderWithIntl(
      <PublishDates periodData={makeStatisticsMeta({ publishedAt: PUBLISHED_AT, updatedAt })} />,
    );

    const time = container.querySelector('time');

    expect(time).toHaveAttribute('dateTime', updatedAt);
    expect(time).toHaveTextContent(translator('es')('updated', { date: expectedDate('es', updatedAt) }));
    expect(time).toHaveTextContent('Actualizado el 1 de febrero de 2025');
  });

  it('formats the date in the Europe/Madrid time zone', () => {
    const updatedAt = '2025-02-01T23:30:00.000Z';
    const { container } = renderWithIntl(
      <PublishDates
        periodData={makeStatisticsMeta({ publishedAt: '2025-01-01T00:00:00.000Z', updatedAt })}
      />,
    );

    const time = container.querySelector('time');

    expect(time).toHaveTextContent('Actualizado el 2 de febrero de 2025');
    expect(time).toHaveTextContent(translator('es')('updated', { date: expectedDate('es', updatedAt) }));
  });

  it.each(['en', 'eu'] as const)('uses the date formatter and messages of the %s locale', (locale) => {
    const { container } = renderWithIntl(
      <PublishDates periodData={makeStatisticsMeta({ publishedAt: PUBLISHED_AT, updatedAt: PUBLISHED_AT })} />,
      { locale },
    );

    const expected = translator(locale)('published', { date: expectedDate(locale, PUBLISHED_AT) });

    expect(container.querySelector('time')).toHaveTextContent(expected);
  });
});
