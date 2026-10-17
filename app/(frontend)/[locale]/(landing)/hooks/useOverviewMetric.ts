import { useMemo } from 'react';
import { OverviewResponse } from '../../../../types/api/overview.types';
import { useAnimatedProgress } from './useAnimatedProgress';
import { useInView } from './useInView';

const METRICS_DURATION = 1000;

export function useOverviewMetric({
  overview,
  ref,
}: {
  overview: OverviewResponse | null;
  ref: React.RefObject<HTMLDivElement | null>;
}) {
  const { isInView } = useInView({ ref });
  const { progress } = useAnimatedProgress({ active: isInView, duration: METRICS_DURATION });

  const globalPeriod = overview?.globalPeriod;
  const lastPeriod = overview?.lastPeriod;

  const overviewMetrics = useMemo<OverviewResponse | null>(() => {
    const metrics: OverviewResponse = {};

    if (globalPeriod) {
      metrics.globalPeriod = {
        publicSlug: globalPeriod.publicSlug,
        startYear: globalPeriod.startYear,
        endYear: globalPeriod.endYear,
        totalParticipations: Math.round(globalPeriod.totalParticipations * progress),
        totalSchools: Math.round(globalPeriod.totalSchools * progress),
        editionsCount: Math.round(globalPeriod.editionsCount * progress),
        missingYears: globalPeriod.missingYears,
        lastPublishedAt: globalPeriod.lastPublishedAt,
        topName: globalPeriod.topName,
        topSurname: globalPeriod.topSurname,
        topSchool: globalPeriod.topSchool,
      };
    }
    if (lastPeriod) {
      metrics.lastPeriod = {
        publicSlug: lastPeriod.publicSlug,
        year: lastPeriod.year,
        totalParticipations: Math.round(lastPeriod.totalParticipations * progress),
        totalSchools: Math.round(lastPeriod.totalSchools * progress),
        growthRate: lastPeriod.growthRate,
        lastPublishedAt: lastPeriod.lastPublishedAt,
        topName: lastPeriod?.topName,
        topSurname: lastPeriod?.topSurname,
        topSchool: lastPeriod?.topSchool,
      };
    }

    return metrics;
  }, [progress, globalPeriod, lastPeriod]);

  return { overviewMetrics };
}
