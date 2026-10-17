'use client';
import { useRef } from 'react';
import { useTranslations } from 'next-intl';
import { OverviewResponse } from '../../../../../types/api/overview.types';
import { useOverviewMetric } from '../../hooks/useOverviewMetric';
import { GlobalStatsCard } from './GlobalStatsCard';
import { LastStatsCard } from './LastStatsCard';
import { StatsCardFallback } from './StatsCardFallback';

export function StatsSection({ overview }: { overview: OverviewResponse | null }) {
  const t = useTranslations('Landing.stats');
  const cardsRef = useRef<HTMLDivElement>(null);
  const { overviewMetrics } = useOverviewMetric({ overview, ref: cardsRef });

  // The figures count up, so the cards come from `overviewMetrics`; the texts use the real period
  const period = overview?.globalPeriod;
  const globalPeriod = overviewMetrics?.globalPeriod;
  const lastPeriod = overviewMetrics?.lastPeriod;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-4">
        <div className=" w-full max-w-xs sm:max-w-xl">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-balance">
            {period ? t('title', { startYear: String(period.startYear) }) : t('titleFallback')}
          </h2>
        </div>
        <p className="text-sm sm:text-lg lg:text-xl text-text-secondary text-balance">
          {period
            ? t('description', {
                startYear: String(period.startYear),
                endYear: String(period.endYear),
              })
            : t('descriptionFallback')}
        </p>
      </div>

      {/* STATS CARDS */}
      <div ref={cardsRef} className="grid grid-cols-1 gap-5 pt-4 lg:grid-cols-2">
        {globalPeriod ? (
          <GlobalStatsCard period={globalPeriod} finalPeriod={period} />
        ) : (
          <StatsCardFallback kind="global" />
        )}
        {lastPeriod ? (
          <LastStatsCard period={lastPeriod} finalPeriod={overview?.lastPeriod} />
        ) : (
          <StatsCardFallback kind="last" />
        )}
      </div>
    </div>
  );
}
