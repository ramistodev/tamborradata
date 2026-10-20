import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useSeriesChart } from '@/app/(frontend)/[locale]/(pages)/statistics/[period]/components/renders/Series/hooks/useSeriesChart';
import { chartLayout } from '@/app/(frontend)/[locale]/(pages)/statistics/[period]/components/renders/Series/lib/chartLayout';
import type { StatisticSeriesPoint } from '@/app/types/api/statistics.types';

const data: StatisticSeriesPoint[] = [
  { entityKey: 'a', entityLabel: 'A', metricKey: 'count', dimensionKey: '2023', dimensionOrder: 2023, value: 5 },
  { entityKey: 'a', entityLabel: 'A', metricKey: 'count', dimensionKey: '2024', dimensionOrder: 2024, value: 10 },
  { entityKey: 'b', entityLabel: 'B', metricKey: 'count', dimensionKey: '2023', dimensionOrder: 2023, value: 50 },
  { entityKey: 'b', entityLabel: 'B', metricKey: 'count', dimensionKey: '2024', dimensionOrder: 2024, value: 100 },
];

describe('useSeriesChart', () => {
  it('sorts leading lines and rescales to visible data', () => {
    const { result } = renderHook(() => useSeriesChart(data, 'Count', chartLayout(1000)));
    expect(result.current.chart.lines.map((line) => line.key)).toEqual(['b', 'a']);
    expect(result.current.visibleLines.map((line) => line.key)).toEqual(['b', 'a']);
    expect(result.current.scales.ticks).toEqual([0, 50, 100]);
    act(() => result.current.toggleLine('b'));
    expect(result.current.hiddenKeys).toEqual(new Set(['b']));
    expect(result.current.visibleLines.map((line) => line.key)).toEqual(['a']);
    expect(result.current.scales.ticks).toEqual([0, 5, 10]);
    act(() => result.current.toggleLine('b'));
    expect(result.current.hiddenKeys).toEqual(new Set());
  });

  it('prevents hiding the last visible line', () => {
    const { result } = renderHook(() => useSeriesChart(data, 'Count', chartLayout(1000)));
    act(() => result.current.toggleLine('b'));
    act(() => result.current.toggleLine('a'));
    expect(result.current.hiddenKeys).toEqual(new Set(['b']));
  });

  it('clears focus only when hiding a line', () => {
    const { result } = renderHook(() => useSeriesChart(data, 'Count', chartLayout(1000)));
    act(() => result.current.setFocusedKey('a'));
    act(() => result.current.toggleLine('b'));
    expect(result.current.focusedKey).toBeNull();
    act(() => result.current.setFocusedKey('a'));
    act(() => result.current.toggleLine('b'));
    expect(result.current.focusedKey).toBe('a');
  });

  it('memoizes the chart until data, label, or max lines changes', () => {
    const desktop = chartLayout(1000);
    const { result, rerender } = renderHook(
      ({ layout }) => useSeriesChart(data, 'Count', layout),
      { initialProps: { layout: desktop } },
    );
    const chart = result.current.chart;
    rerender({ layout: { ...desktop } });
    expect(result.current.chart).toBe(chart);
    rerender({ layout: chartLayout(300) });
    expect(result.current.chart).not.toBe(chart);
    expect(chartLayout(300).maxLines).toBe(4);
  });
});
