'use client';
import { useFormatter, useTranslations } from 'next-intl';
import type { OverviewResponse } from '../../../../../types/api/overview.types';
import { StatsCard } from './StatsCard';
import { StatsCardTops } from './StatsCardTops';
import { YearsTimeline } from './YearsTimeline';

type GlobalPeriod = NonNullable<OverviewResponse['globalPeriod']>;

const TONE = 'surface';

/** `period` counts up; `finalPeriod` has the real figures, which assistive technology reads instead. */
export function GlobalStatsCard({
  period,
  finalPeriod = period,
}: {
  period: GlobalPeriod;
  finalPeriod?: GlobalPeriod;
}) {
  const t = useTranslations('Landing.stats.global');
  const format = useFormatter();
  // 'always': Spanish skips the thousands separator on 4-digit numbers (5149) by default
  const count = (value: number) => format.number(value, { useGrouping: 'always' });

  const missingYears = period.missingYears.map(String);

  return (
    <StatsCard
      tone={TONE}
      label={t('label', { startYear: String(period.startYear), endYear: String(period.endYear) })}
      value={count(period.totalParticipations)}
      summary={t('summary', { editions: period.editionsCount, schools: period.totalSchools })}
      finalText={`${count(finalPeriod.totalParticipations)} ${t('summary', {
        editions: finalPeriod.editionsCount,
        schools: finalPeriod.totalSchools,
      })}`}
      timeline={
        <YearsTimeline
          startYear={period.startYear}
          endYear={period.endYear}
          missingYears={period.missingYears}
          tone={TONE}
        />
      }
      note={t('note', {
        hasGaps: missingYears.length > 0 ? 'yes' : 'no',
        missingYears: format.list(missingYears, { style: 'long', type: 'conjunction' }),
      })}
      cta={{ label: t('cta'), href: `/statistics/${period.publicSlug}` }}
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
