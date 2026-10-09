import { useMemo, useState } from 'react';
import type { StatisticSeriesPoint } from '../../../../../../../../../types/api/statistics.types';
import { buildChart } from '../lib/buildChart';
import { createScales } from '../lib/createScales';

/**
 * Chart of one series plus what the user can do with it: hide lines (the scale follows the lines
 * that stay) and focus one (the legend highlights it and dims the rest).
 */
export function useSeriesChart(data: StatisticSeriesPoint[], label: string) {
  const chart = useMemo(() => buildChart(data, label), [data, label]);
  const [hiddenKeys, setHiddenKeys] = useState<ReadonlySet<string>>(new Set());
  const [focusedKey, setFocusedKey] = useState<string | null>(null);

  const visibleLines = useMemo(
    () => chart.lines.filter((line) => !hiddenKeys.has(line.key)),
    [chart.lines, hiddenKeys]
  );
  const scales = useMemo(
    () => createScales(chart.dimensions, visibleLines),
    [chart.dimensions, visibleLines]
  );

  function toggleLine(key: string) {
    setHiddenKeys((current) => {
      const next = new Set(current);

      if (next.has(key)) {
        next.delete(key);
        return next;
      }

      // The last visible line cannot be hidden: an empty chart says nothing.
      const visibleCount = chart.lines.filter((line) => !current.has(line.key)).length;

      if (visibleCount > 1) {
        next.add(key);
        // A hidden line has nothing to highlight, and keeping the focus would dim all the others.
        setFocusedKey(null);
      }

      return next;
    });
  }

  return { chart, visibleLines, scales, hiddenKeys, toggleLine, focusedKey, setFocusedKey };
}
