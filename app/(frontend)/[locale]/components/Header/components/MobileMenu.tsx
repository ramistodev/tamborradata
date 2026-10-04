'use client';
import { useId } from 'react';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/app/(frontend)/i18n/navigation';
import { Icons } from '../../Icons';
import { PeriodResponse } from '../../../../../types/api/period.types';
import { useMobileMenu } from '../hooks/useMobileMenu';
import { sortPeriods } from '../utils/sortPeriods';
import { LanguageSwitcher } from './LanguageSwitcher';

export function MobileMenu({ periods }: { periods: PeriodResponse[] }) {
  const t = useTranslations('Header');
  const pathname = usePathname();
  const periodsId = useId();
  const {
    dialogRef,
    menuOpen,
    openMenu,
    closeMenu,
    handleClose,
    handleDialogClick,
    periodsShow,
    togglePeriodsShow,
  } = useMobileMenu();

  const isHome = pathname === '/';
  const isStatisticsPage = pathname.includes('/statistics');

  const sortedPeriods = sortPeriods(periods);

  return (
    <>
      {/* Bar: brand in the middle, hamburger on the right */}
      <div className="relative flex items-center justify-center px-6 py-4">
        <Link
          href="/"
          aria-current={isHome ? 'page' : undefined}
          className={`font-mono text-base font-semibold transition-colors ${isHome ? 'text-accent cursor-default' : 'hover:text-accent'}`}
        >
          Tamborradata
        </Link>

        <button
          type="button"
          aria-label={t('openMenu')}
          aria-haspopup="dialog"
          aria-controls="mobile-nav"
          aria-expanded={menuOpen}
          onClick={openMenu}
          className="absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer rounded-md border border-border p-2 transition-colors hover:border-accent hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          <Icons.HamburgerIcon />
        </button>
      </div>

      <dialog
        ref={dialogRef}
        id="mobile-nav"
        aria-label={t('menuLabel')}
        onClose={handleClose}
        onClick={handleDialogClick}
        className="fixed inset-y-0 right-0 left-auto m-0 h-dvh max-h-none w-2/3 max-w-none translate-x-full flex-col border-l border-border bg-bg p-0 text-text transition-[translate,overlay,display] transition-discrete duration-300 ease-out open:flex open:translate-x-0 starting:open:translate-x-full motion-reduce:transition-none backdrop:bg-black/0 backdrop:backdrop-blur-none backdrop:transition-[background-color,backdrop-filter,overlay,display] backdrop:transition-discrete backdrop:duration-300 open:backdrop:bg-black/30 open:backdrop:backdrop-blur-sm starting:open:backdrop:bg-black/0 starting:open:backdrop:backdrop-blur-none"
      >
        {/* Close button */}
        <div className="flex shrink-0 items-center px-4 pt-5 pb-3">
          <button
            type="button"
            aria-label={t('closeMenu')}
            onClick={closeMenu}
            className="cursor-pointer rounded-md p-2 transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent text-text-secondary"
          >
            <Icons.ChevronRight />
          </button>
        </div>

        <nav
          aria-label={t('menuLabel')}
          className="flex flex-1 flex-col items-start gap-6 overflow-y-auto px-6 pb-8 scrollbar-none [&::-webkit-scrollbar]:hidden"
        >
          {/* Home */}
          <Link
            href="/"
            onClick={closeMenu}
            aria-current={isHome ? 'page' : undefined}
            className={`font-mono text-xl font-semibold transition-colors ${isHome ? 'text-accent cursor-default' : 'hover:text-accent'}`}
          >
            Tamborradata
          </Link>

          {/* Search */}
          <Link
            href="/search"
            onClick={closeMenu}
            aria-current={pathname.includes('/search') ? 'page' : undefined}
            className={`font-mono text-lg font-medium transition-colors ${pathname.includes('/search') ? 'text-accent cursor-default' : 'hover:text-accent'}`}
          >
            {t('search')}
          </Link>

          {/* Statistics: accordion with the periods */}
          <div className="w-full">
            <button
              type="button"
              aria-expanded={periodsShow}
              aria-controls={periodsId}
              onClick={togglePeriodsShow}
              className={`flex cursor-pointer items-center gap-1.5 text-lg font-mono font-medium transition-colors ${isStatisticsPage ? 'text-accent' : 'hover:text-accent'}`}
            >
              {t('statistics')}
              <span
                className={`opacity-70 transition-transform duration-200 motion-reduce:transition-none ${periodsShow ? 'rotate-180' : ''}`}
              >
                <Icons.ChevronDown className="size-4" />
              </span>
            </button>

            <div
              id={periodsId}
              inert={!periodsShow}
              className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out motion-reduce:transition-none ${periodsShow ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
            >
              <div className="min-h-0 overflow-hidden">
                <ul
                  aria-label={t('statisticsOptions')}
                  className="mt-4 flex flex-col items-start gap-3 border-l border-border pl-4"
                >
                  {sortedPeriods.map((period) => {
                    const href = `/statistics/${period.publicSlug}`;
                    const isCurrent = pathname === href;

                    return (
                      <li key={period.publicSlug}>
                        <Link
                          href={href}
                          onClick={closeMenu}
                          aria-current={pathname.includes(href) ? 'page' : undefined}
                          className={`block font-mono text-lg transition-colors hover:text-accent ${isCurrent ? 'text-accent cursor-default' : ''}`}
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
        </nav>

        {/* Language, bottom and centered */}
        <div className="flex shrink-0 justify-center border-t border-border px-6 py-5">
          <LanguageSwitcher />
        </div>
      </dialog>
    </>
  );
}
