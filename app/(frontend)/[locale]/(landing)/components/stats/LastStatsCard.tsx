'use client';
import { useFormatter, useTranslations } from 'next-intl';
import type { OverviewResponse } from '../../../../../types/api/overview.types';
import { StatsCard } from './StatsCard';
import { StatsCardTops } from './StatsCardTops';
import { statsCardTones } from './statsCardTone';

type LastPeriod = NonNullable<OverviewResponse['lastPeriod']>;

const TONE = 'accent';

/** `period` counts up; `finalPeriod` has the real figures, which assistive technology reads instead. */
export function LastStatsCard({
  period,
  finalPeriod = period,
}: {
  period: LastPeriod;
  finalPeriod?: LastPeriod;
}) {
  const t = useTranslations('Landing.stats.last');
  const format = useFormatter();
  const count = (value: number) => format.number(value, { useGrouping: 'always' });

  // The backend sends percentages as 2.89, not 0.0289
  const growth =
    period.growthRate === null
      ? null
      : format.number(period.growthRate / 100, {
          style: 'percent',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
          signDisplay: 'exceptZero',
        });

  return (
    <StatsCard
      tone={TONE}
      label={t('label')}
      value={count(period.totalParticipations)}
      summary={t('summary', { schools: period.totalSchools })}
      finalText={`${count(finalPeriod.totalParticipations)} ${t('summary', {
        schools: finalPeriod.totalSchools,
      })}`}
      badge={
        growth && (
          <span
            className={`w-fit rounded-full px-3 py-1.5 font-mono text-xs ${statsCardTones[TONE].badge}`}
          >
            <span aria-hidden="true">
              {period.growthRate! > 0 ? '▲' : period.growthRate! < 0 ? '▼' : '='}
            </span>{' '}
            {t('growth', { change: growth })}
          </span>
        )
      }
      cta={{
        label: t('cta', { year: String(period.year) }),
        href: `/statistics/${period.publicSlug}`,
      }}
    >
      <StatsCardTops
        tone={TONE}
        topName={period.topName}
        topSurname={period.topSurname}
        topSchool={period.topSchool}
      />
    </StatsCard>
  );
}
