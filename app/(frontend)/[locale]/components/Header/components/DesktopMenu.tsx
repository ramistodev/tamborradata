'use client';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/app/(frontend)/i18n/navigation';
import { PeriodResponse } from '../../../../../types/api/period.types';
import { StatisticsMenu } from './StatisticsMenu';
import { LanguageSwitcher } from './LanguageSwitcher';

export function DesktopMenu({ periods }: { periods: PeriodResponse[] }) {
  const t = useTranslations('Header');
  const pathname = usePathname();

  return (
    <>
      {/* Brand */}
      <div className="absolute top-1/2 left-5 -translate-y-1/2 ">
        <Link
          href="/"
          aria-current={pathname.length === 1 ? 'page' : undefined}
          className={`rounded-sm font-mono text-base lg:text-lg font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${pathname.length === 1 ? 'text-accent cursor-default' : 'hover:text-accent-dim'}`}
        >
          Tamborradata
        </Link>
      </div>

      <StatisticsMenu periods={periods} />

      <div className="absolute top-1/2 right-5 -translate-y-1/2">
        <LanguageSwitcher />
      </div>
    </>
  );
}
