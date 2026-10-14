'use client';
import { useTranslations } from 'next-intl';
import { Icons } from '../../../../components/Icons';

/** Scrolls back to the top of the page, where the hero and the period selector are. */
export function BackToTop() {
  const t = useTranslations('Statistics.closing');

  function scrollToTop() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'instant' : 'smooth' });
  }

  return (
    <button
      type="button"
      onClick={scrollToTop}
      className="group inline-flex cursor-pointer items-center gap-2 font-mono text-xs text-text-secondary transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:text-sm"
    >
      <span className="transition-transform group-hover:-translate-y-0.5 motion-reduce:transition-none">
        <Icons.ArrowUp className="size-3.5" />
      </span>
      {t('backToTop')}
    </button>
  );
}
