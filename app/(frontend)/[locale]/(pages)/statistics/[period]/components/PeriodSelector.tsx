'use client';
import { useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { PeriodResponse } from '../../../../../../types/api/period.types';
import { Link, usePathname } from '../../../../../i18n/navigation';
import { sortPeriods } from '../../../../components/Header/utils/sortPeriods';
import { withMissingYears } from '../utils/withMissingYears';
import { scrollToActiveElement } from '../utils/scrollToActiveElement';
import { DragScroll } from '../../../../components/ui';

/** Horizontal list of period links; years without an edition are shown as small dots. */
export function PeriodSelector({ periods }: { periods: PeriodResponse[] }) {
  const container = useRef<HTMLDivElement>(null);
  const activePeriod = useRef<HTMLSpanElement>(null);
  const t = useTranslations('Statistics.periodSelector');
  const pathname = usePathname();
  const items = withMissingYears(sortPeriods(periods));

  useEffect(() => {
    scrollToActiveElement(container.current, activePeriod.current);
  }, []);

  return (
    <DragScroll
      ref={container}
      className="flex flex-nowrap items-start gap-5 overflow-x-auto scrollbar-none pb-2"
    >
      {items.map((item) => {
        if (item.type === 'missing') {
          return (
            <span
              key={`missing-${item.year}`}
              aria-hidden="true"
              title={t('missingEdition', { year: item.year })}
              className="shrink-0 self-center -mx-1.5 size-1 rounded-full bg-text-secondary/60"
            />
          );
        }

        const { period } = item;
        const href = `/statistics/${period.publicSlug}`;
        const isActive = pathname === href;
        return (
          <span
            ref={isActive ? activePeriod : null}
            key={period.publicSlug}
            className={`shrink-0 hover:text-text px-2 py-1 border border-border rounded-md select-none ${pathname === href ? 'bg-accent text-text cursor-default border-accent' : 'text-text-secondary border-border'}`}
          >
            <Link
              href={href}
              onDragStart={(event) => event.preventDefault()}
              aria-current={pathname.includes(href) ? 'page' : undefined}
              className={`font-mono text-base block text-nowrap whitespace-nowrap transition-colors rounded-sm ${pathname === href ? 'cursor-default' : ''}`}
            >
              {period.publicSlug}
            </Link>
          </span>
        );
      })}
    </DragScroll>
  );
}
