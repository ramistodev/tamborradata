'use client'; // Error boundaries must be Client Components

import { useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '../../../../i18n/navigation';

/**
 * Fallback of the statistics pages when something unexpected fails (the backend, the database...).
 * A missing period is not handled here: `handleServiceError` turns it into a 404. The site header
 * and footer stay in place, because an `error.tsx` does not wrap the layout above it.
 */
export default function PeriodError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  const t = useTranslations('Statistics.error');
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    // The digest matches this error with the one in the server logs
    console.error(error);
  }, [error]);

  useEffect(() => {
    // The error replaces the page: move focus to its title so keyboard and screen reader users
    // land on the message instead of staying on a link that is no longer there.
    titleRef.current?.focus();
  }, []);

  return (
    <section className="flex flex-col items-start gap-4 rounded-xl border border-border bg-card p-6 sm:p-8">
      <h1 ref={titleRef} tabIndex={-1} className="text-xl font-bold focus:outline-none sm:text-2xl">
        {t('title')}
      </h1>
      <p className="max-w-prose text-sm text-text-secondary sm:text-base">{t('description')}</p>
      <div className="flex flex-wrap items-center gap-3">
        {/* `retry` asks the server for the data again; `reset` would only clear the error state */}
        <button
          type="button"
          onClick={() => retry()}
          className="cursor-pointer rounded-full bg-accent-dim px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          {t('retry')}
        </button>
        <Link
          href="/"
          className="rounded-full border border-border px-5 py-2 text-sm font-semibold text-text-secondary transition-colors hover:border-accent hover:text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          {t('back')}
        </Link>
      </div>
      {error.digest && (
        <p className="font-mono text-xs text-text-tertiary">
          {t('digest', { digest: error.digest })}
        </p>
      )}
    </section>
  );
}
