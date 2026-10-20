import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useOverviewMetric } from '@/app/(frontend)/[locale]/(landing)/hooks/useOverviewMetric';
import { makeLastOverview, makeOverviewResponse } from '@/test/fixtures/overview';
import { installMatchMedia } from '@/test/helpers/matchMedia';
import { MockIntersectionObserver } from '@/test/helpers/observers';

describe('useOverviewMetric', () => {
  it('exposes an empty object for a null overview', () => {
    const ref = { current: document.createElement('div') };

    const { result } = renderHook(() => useOverviewMetric({ overview: null, ref }));

    expect(result.current.overviewMetrics).toEqual({});
  });

  it('passes metadata through and animates numeric totals after intersection', () => {
    vi.useFakeTimers();
    const overview = makeOverviewResponse();
    const ref = { current: document.createElement('div') };
    const { result } = renderHook(() => useOverviewMetric({ overview, ref }));

    expect(result.current.overviewMetrics?.globalPeriod).toMatchObject({
      totalParticipations: 0,
      totalSchools: 0,
      editionsCount: 0,
      missingYears: overview.globalPeriod?.missingYears,
      topName: overview.globalPeriod?.topName,
      publicSlug: overview.globalPeriod?.publicSlug,
      lastPublishedAt: overview.globalPeriod?.lastPublishedAt,
    });
    act(() => MockIntersectionObserver.instances[0].trigger(true));
    act(() => vi.advanceTimersByTime(500));
    expect(result.current.overviewMetrics?.globalPeriod).toMatchObject({
      totalParticipations: 26170,
      totalSchools: 44,
      editionsCount: 13,
    });
    act(() => vi.advanceTimersByTime(500));
    expect(result.current.overviewMetrics?.globalPeriod).toMatchObject({
      totalParticipations: 52340,
      totalSchools: 87,
      editionsCount: 26,
    });
    expect(result.current.overviewMetrics?.lastPeriod).toMatchObject({
      totalParticipations: 2100,
      totalSchools: 60,
      growthRate: 5,
    });
  });

  it('omits a missing global period', () => {
    const ref = { current: document.createElement('div') };
    const { result } = renderHook(() =>
      useOverviewMetric({ overview: { lastPeriod: makeLastOverview() }, ref }),
    );

    expect(result.current.overviewMetrics).not.toHaveProperty('globalPeriod');
    expect(result.current.overviewMetrics).toHaveProperty('lastPeriod');
  });

  it('shows full values immediately with reduced motion', () => {
    installMatchMedia({ '(prefers-reduced-motion: reduce)': true });
    const ref = { current: document.createElement('div') };

    const { result } = renderHook(() => useOverviewMetric({ overview: makeOverviewResponse(), ref }));

    expect(result.current.overviewMetrics?.globalPeriod).toMatchObject({
      totalParticipations: 52340,
      totalSchools: 87,
      editionsCount: 26,
    });
  });
});
