'use client';

import { SeriesChart } from '@/app/(frontend)/[locale]/(pages)/statistics/[period]/components/renders/Series/components/SeriesChart';
import type { StatisticSeriesPoint } from '@/app/types/api/statistics.types';
import type { SeriesChartBlock } from '../../types/article.types';
import { BlockFigure } from './BlockFigure';

function toPoints(series: SeriesChartBlock['series']): StatisticSeriesPoint[] {
  const order = new Map<string, number>();

  for (const line of series) {
    for (const point of line.points) {
      const key = String(point.x);
      if (!order.has(key)) {
        order.set(key, order.size);
      }
    }
  }

  return series.flatMap((line) =>
    line.points.map((point) => ({
      entityKey: line.id,
      entityLabel: line.label,
      metricKey: line.id,
      dimensionKey: String(point.x),
      dimensionOrder: order.get(String(point.x)),
      value: point.y,
    }))
  );
}

export function SeriesChartRender({ block }: { block: SeriesChartBlock }) {
  const label = block.caption ?? block.series.map((line) => line.label).join(', ');

  return (
    <BlockFigure caption={block.caption} source={block.source}>
      <SeriesChart label={label} data={toPoints(block.series)} />
    </BlockFigure>
  );
}
