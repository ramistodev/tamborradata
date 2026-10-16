import './(frontend)/[locale]/globals.css';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getTranslations } from 'next-intl/server';
import { Link } from './(frontend)/i18n/navigation';
import { buttonStyles } from './(frontend)/[locale]/components/ui';
import { jetbrainsMono, sora, spaceGrotesk } from './(frontend)/[locale]/config/fonts';

/**
 * The only 404 of the site: it handles `notFound()` calls and URLs that match no route. It sits
 * outside the `[locale]` layout, so it renders its own document and reads the locale from the
 * request, falling back to the default one when the URL has none.
 */
export default async function NotFound() {
  const locale = await getLocale();
  const t = await getTranslations('NotFound');

  return (
    <html
      lang={locale}
      className={`${sora.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
    >
      <body>
        <NextIntlClientProvider>
          <main className="flex w-full flex-1 items-center justify-center px-4 py-16 sm:px-5">
            <section className="flex w-full max-w-2xl animate-drop-in flex-col items-center gap-5 text-center motion-reduce:animate-none">
              <p className="font-mono text-lg font-semibold tracking-widest text-accent uppercase sm:text-xl">
                {t('kicker')}
              </p>

              <div className="relative">
                <span
                  aria-hidden="true"
                  className="font-mono text-accent text-8xl leading-none font-extrabold tracking-tighter"
                >
                  404
                </span>
              </div>

              <span className="font-mono text-2xl font-semibold text-balance text-accent sm:text-3xl">
                {t('title')}
              </span>
              <p className="max-w-md text-balance text-sm leading-relaxed text-text-secondary sm:text-base">
                {t('description')}
              </p>

              <Link href="/" className={buttonStyles({ className: 'mt-2' })}>
                {t('backHome')}
              </Link>
            </section>
          </main>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
