'use client';
import { useFormatter, useTranslations } from 'next-intl';
import type { TopEntry } from '../../../../../types/api/overview.types';
import { StatsCardTone, statsCardTones } from './statsCardTone';

interface StatsCardTopsProps {
  tone: StatsCardTone;
  topName: TopEntry;
  topSurname: TopEntry;
  topSchool: TopEntry;
}

/** The most repeated name, surname and school as a small ledger: label, name and count per row. */
export function StatsCardTops({ tone, topName, topSurname, topSchool }: StatsCardTopsProps) {
  // The labels are the ones of the search page, so they are translated and reviewed once
  const t = useTranslations('Search.topStats');
  const format = useFormatter();
  const styles = statsCardTones[tone];

  const rows = [
    { label: t('name'), entry: topName },
    { label: t('surname'), entry: topSurname },
    { label: t('school'), entry: topSchool },
  ];

  return (
    <dl className={`flex flex-col divide-y ${styles.divider}`}>
      {rows.map(({ label, entry }) => (
        <div key={label} className="flex flex-col gap-1 py-3 first:pt-0 last:pb-0">
          <dt
            className={`font-mono text-[10px] sm:text-xs uppercase tracking-wider ${styles.muted}`}
          >
            {label}
          </dt>
          <dd className="flex items-baseline justify-between gap-4">
            <span
              className={`min-w-0 font-title text-lg font-semibold wrap-break-word sm:text-2xl ${styles.strong}`}
            >
              {entry.label}
            </span>
            <span className={`shrink-0 font-mono text-sm tabular-nums ${styles.count}`}>
              {format.number(entry.count, { useGrouping: 'always' })}
            </span>
          </dd>
        </div>
      ))}
    </dl>
  );
}
