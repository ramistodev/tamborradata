'use client';
import { useId } from 'react';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/app/(frontend)/i18n/navigation';
import { PeriodResponse } from '../../../../../types/api/period.types';
import { Icons } from '@/app/(frontend)/[locale]/components';
import { useStatisticsMenu } from '../hooks/useStatisticsMenu';
import { sortPeriods } from '../utils/sortPeriods';

const focusRing =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent';

export function StatisticsMenu({ periods }: { periods: PeriodResponse[] }) {
  const t = useTranslations('Header');
  const pathname = usePathname();
  const panelId = useId();
  const { isOpen, close, toggle, buttonRef, containerProps } = useStatisticsMenu();

  const isStatisticsPage = pathname.includes('/statistics');
  const sortedPeriods = sortPeriods(periods);

  return (
    <div className="flex gap-10">
      <div {...containerProps}>
        <button
          ref={buttonRef}
          type="button"
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={toggle}
          className={`flex items-center gap-1.5 rounded-sm font-mono text-base lg:text-lg transition-colors font-medium cursor-pointer hover:text-accent ${focusRing} ${isStatisticsPage || isOpen ? 'text-accent' : ''}`}
        >
          {t('statistics')}
          {/* One chevron that turns upside down when open, so it reads as a dropdown */}
          <span
            className={`opacity-70 transition-transform duration-200 motion-reduce:transition-none ${isOpen ? 'rotate-180' : ''}`}
          >
            <Icons.ChevronDown className="size-4" />
          </span>
        </button>

        <div
          id={panelId}
          className={`absolute top-full left-0 w-full justify-center bg-bg/85 backdrop-blur-md z-999 border-border border-b border-t animate-drop-in motion-reduce:animate-none py-4 ${isOpen ? 'flex' : 'hidden'}`}
        >
          <div className="w-2/3 flex flex-col gap-2 relative">
            <div className="flex items-center justify-between font-mono text-xs text-text-secondary">
              <span className="uppercase">
                <span aria-hidden="true">{'// '}</span>
                {t('periodsLabel')}
              </span>
              <span>{t('periodsCount', { count: sortedPeriods.length })}</span>
            </div>
            <ul
              aria-label={t('statisticsOptions')}
              className="flex flex-wrap items-start gap-5 px-6"
            >
              {sortedPeriods.map((period) => {
                const href = `/statistics/${period.publicSlug}`;
                return (
                  <li
                    key={period.publicSlug}
                    className="text-text-secondary hover:text-text px-2 py-1 border border-border rounded-md"
                  >
                    <Link
                      href={href}
                      onClick={close}
                      aria-current={pathname.includes(href) ? 'page' : undefined}
                      className={`font-mono text-base block text-nowrap whitespace-nowrap transition-colors rounded-sm ${focusRing} ${pathname === href ? 'text-accent cursor-default' : ''}`}
                    >
                      {period.publicSlug}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>

      {/* Search */}
      <Link
        href="/search"
        aria-current={pathname.includes('/search') ? 'page' : undefined}
        className={`rounded-sm font-mono text-base lg:text-lg transition-colors font-medium ${focusRing} ${pathname.includes('/search') ? 'text-accent cursor-default' : 'hover:text-accent'}`}
      >
        {t('search')}
      </Link>
    </div>
  );
}
