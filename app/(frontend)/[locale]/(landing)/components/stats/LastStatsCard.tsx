'use client';
import { useFormatter } from 'next-intl';
import type { OverviewResponse } from '../../../../../types/api/overview.types';
import { StatsCard } from './StatsCard';
import { StatsCardTops } from './StatsCardTops';
import { statsCardTones } from './statsCardTone';

type LastPeriod = NonNullable<OverviewResponse['lastPeriod']>;

const TONE = 'accent';

export function LastStatsCard({ period }: { period: LastPeriod }) {
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
      label="Última edición"
      value={count(period.totalParticipations)}
      summary={`participaciones en ${count(period.totalSchools)} colegios.`}
      badge={
        growth && (
          <span
            className={`w-fit rounded-full px-3 py-1.5 font-mono text-xs ${statsCardTones[TONE].badge}`}
          >
            <span aria-hidden="true">
              {period.growthRate! > 0 ? '▲' : period.growthRate! < 0 ? '▼' : '='}
            </span>{' '}
            {growth} frente al año anterior
          </span>
        )
      }
      cta={{ label: `Ver edición ${period.year}`, href: `/statistics/${period.publicSlug}` }}
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
