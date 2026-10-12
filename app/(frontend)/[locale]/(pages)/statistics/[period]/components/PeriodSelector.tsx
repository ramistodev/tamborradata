'use client';
import { useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { PeriodResponse } from '../../../../../../types/api/period.types';
import { Link, usePathname } from '../../../../../i18n/navigation';
import { sortPeriods } from '../../../../lib/sortPeriods';
import { withMissingYears } from '../utils/withMissingYears';
import { scrollToActiveElement } from '../utils/scrollToActiveElement';
import { DragScroll } from '../../../../components/ui';

/** Horizontal list of period links; years without an edition are shown as small dots. */
export function PeriodSelector({ periods }: { periods: PeriodResponse[] }) {
  const container = useRef<HTMLDivElement>(null);
  const activePeriod = useRef<HTMLLIElement>(null);
  const t = useTranslations('Statistics.periodSelector');
  const pathname = usePathname();
  const items = withMissingYears(sortPeriods(periods));

  useEffect(() => {
    scrollToActiveElement(container.current, activePeriod.current);
  }, []);

  return (
    <nav aria-label={t('label')}>
      <DragScroll ref={container} className="overflow-x-auto scrollbar-none py-1">
        <ul className="flex flex-nowrap items-start gap-5">
          {items.map((item) => {
            if (item.type === 'missing') {
              return (
                <li
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
              <li
                ref={isActive ? activePeriod : null}
                key={period.publicSlug}
                className={`shrink-0 px-2 py-1 border border-border rounded-md select-none ${isActive ? 'bg-accent-dim text-white cursor-default border-accent-dim' : 'text-text-secondary border-border hover:text-text'}`}
              >
                <Link
                  href={href}
                  onDragStart={(event) => event.preventDefault()}
                  aria-current={isActive ? 'page' : undefined}
                  className={`font-mono text-base block text-nowrap whitespace-nowrap transition-colors rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent ${isActive ? 'cursor-default' : ''}`}
                >
                  {period.publicSlug}
                </Link>
              </li>
            );
          })}
        </ul>
      </DragScroll>
    </nav>
  );
}
