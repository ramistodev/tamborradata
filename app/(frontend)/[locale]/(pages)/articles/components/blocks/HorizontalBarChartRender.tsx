import { getFormatter } from 'next-intl/server';
import type { HorizontalBarChartBlock } from '../../types/article.types';
import { BlockFigure } from './BlockFigure';

export async function HorizontalBarChartRender({ block }: { block: HorizontalBarChartBlock }) {
  const format = await getFormatter();
  const max = Math.max(...block.items.map((item) => item.value), 0) || 1;
  const hasHighlight = block.items.some((item) => item.highlighted);

  return (
    <BlockFigure caption={block.caption} source={block.source}>
      <ol className="flex flex-col gap-5">
        {block.items.map((item) => {
          const emphasized = !hasHighlight || item.highlighted;

          return (
            <li
              key={item.label}
              className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-4 gap-y-2"
            >
              <span
                className={`text-base md:text-lg ${emphasized ? 'font-medium text-text' : 'text-text-secondary'}`}
              >
                {item.label}
              </span>
              <span className="font-mono text-sm md:text-base font-semibold text-text">
                {format.number(item.value)}
                {block.unit}
              </span>
              <div className="col-span-2 h-2.5 overflow-hidden rounded-full bg-bg-hover">
                <div
                  className={`h-full rounded-full ${emphasized ? 'bg-accent' : 'bg-accent-dim opacity-50'}`}
                  style={{ width: `${Math.max(2, (item.value / max) * 100)}%` }}
                />
              </div>
            </li>
          );
        })}
      </ol>
    </BlockFigure>
  );
}
