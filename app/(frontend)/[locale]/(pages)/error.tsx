'use client'; // Error boundaries must be Client Components

import { useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '../../i18n/navigation';
import { Icons } from '../components/Icons';
import { Button, buttonStyles } from '../components/ui';

/**
 * Fallback of every page under `(pages)` (landing, search, statistics) when something unexpected
 * fails while rendering (the backend, the database...). A missing period is not handled here:
 * `handleServiceError` turns it into a 404. The site header and footer stay in place, because an
 * `error.tsx` does not wrap the layout above it.
 */
export default function PagesError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  const t = useTranslations('ErrorPage');
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
    <div className="flex w-full flex-1 items-center justify-center px-4 py-16 sm:px-5">
      <section className="flex w-full max-w-xl animate-drop-in flex-col items-center gap-6 rounded-2xl border border-border-danger bg-bg-danger text-center motion-reduce:animate-none px-4 py-3 sm:px-6 sm:py-5">
        <div className="flex w-full justify-between items-center gap-3">
          <p className="font-mono text-xs tracking-widest text-text-danger uppercase">
            {t('kicker')}
          </p>
          <div aria-hidden="true" className="text-text-danger">
            <Icons.ExclamationCircle className="size-5" />
          </div>
        </div>

        <div className="flex flex-col items-start gap-3">
          <span
            ref={titleRef}
            tabIndex={-1}
            className="text-xl sm:text-2xl uppercase font-mono font-bold text-text-danger focus:outline-none"
          >
            {t('title')}
          </span>
          <p className="max-w-prose leading-relaxed text-text-secondary text-sm sm:text-base text-justify font-mono">
            {t('description')}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          {/* `retry` asks the server for the data again; `reset` would only clear the error state */}
          <Button variant="danger" onClick={() => retry()}>
            <Icons.RetryIcon className="size-4" />
            {t('retry')}
          </Button>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-lg border font-sans tracking-[-0.01em] cursor-pointer transition-[opacity,transform,color,border-color] duration-200 motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50 aria-disabled:cursor-not-allowed aria-disabled:opacity-50 border-accent text-accent hover:opacity-70 px-5.25 py-2.75 text-sm"
          >
            {t('back')}
          </Link>
        </div>

        {error.digest && (
          <p className="font-mono text-xs text-text-danger">
            {t('digest', { digest: error.digest })}
          </p>
        )}
      </section>
    </div>
  );
}
