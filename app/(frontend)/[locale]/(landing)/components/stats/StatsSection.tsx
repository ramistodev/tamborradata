'use client';
import { useRef } from 'react';
import { OverviewResponse } from '../../../../../types/api/overview.types';
import { useOverviewMetric } from '../../hooks/useOverviewMetric';
import { GlobalStatsCard } from './GlobalStatsCard';
import { LastStatsCard } from './LastStatsCard';
import { StatsCardFallback } from './StatsCardFallback';

export function StatsSection({ overview }: { overview: OverviewResponse | null }) {
  const cardsRef = useRef<HTMLDivElement>(null);
  const { overviewMetrics } = useOverviewMetric({ overview, ref: cardsRef });

  const globalPeriod = overviewMetrics?.globalPeriod;
  const lastPeriod = overviewMetrics?.lastPeriod;

  // if (!globalPeriod || !lastPeriod) return null;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-4">
        <div className=" w-full max-w-xs sm:max-w-xl">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-balance">
            Desde {globalPeriod?.startYear} a hoy, edicion a edicion
          </h2>
        </div>
        <p className="text-sm sm:text-lg lg:text-xl text-text-secondary text-balance">
          Estadisticas disponibles desde {globalPeriod?.startYear} hasta {globalPeriod?.endYear}.
          Tendencias de participacion, colegios y ediciones. Los nombres, apellidos y colegios mas
          repetidos en cada edicion.
        </p>
      </div>

      {/* STATS CARDS */}
      <div ref={cardsRef} className="grid grid-cols-1 gap-5 pt-4 lg:grid-cols-2">
        {globalPeriod ? (
          <GlobalStatsCard period={globalPeriod} />
        ) : (
          <StatsCardFallback kind="global" />
        )}
        {lastPeriod ? <LastStatsCard period={lastPeriod} /> : <StatsCardFallback kind="last" />}
      </div>
    </div>
  );
}
