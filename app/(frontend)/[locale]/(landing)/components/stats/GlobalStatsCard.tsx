'use client';
import { useFormatter } from 'next-intl';
import type { OverviewResponse } from '../../../../../types/api/overview.types';
import { StatsCard } from './StatsCard';
import { StatsCardTops } from './StatsCardTops';
import { YearsTimeline } from './YearsTimeline';

type GlobalPeriod = NonNullable<OverviewResponse['globalPeriod']>;

const TONE = 'surface';

export function GlobalStatsCard({ period }: { period: GlobalPeriod }) {
  const format = useFormatter();
  const count = (value: number) => format.number(value, { useGrouping: 'always' });

  const missing = period.missingYears.map(String);
  const missingNote =
    missing.length > 0
      ? ` Aún no hay datos de ${format.list(missing, { style: 'long', type: 'conjunction' })}.`
      : '';

  return (
    <StatsCard
      tone={TONE}
      label={`Histórico · ${period.startYear}-${period.endYear}`}
      value={count(period.totalParticipations)}
      summary={`participaciones repartidas en ${count(period.editionsCount)} ediciones y ${count(period.totalSchools)} colegios.`}
      timeline={
        <YearsTimeline
          startYear={period.startYear}
          endYear={period.endYear}
          missingYears={period.missingYears}
          tone={TONE}
        />
      }
      note={`Una participación es un registro en una edición: una misma persona puede sumar varias.${missingNote}`}
      cta={{ label: 'Ver historia completa', href: `/statistics/${period.publicSlug}` }}
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
