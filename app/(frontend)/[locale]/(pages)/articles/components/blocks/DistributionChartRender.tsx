import { getFormatter } from 'next-intl/server';
import type { DistributionChartBlock } from '../../types/article.types';
import { BlockFigure } from './BlockFigure';

export async function DistributionChartRender({ block }: { block: DistributionChartBlock }) {
  const format = await getFormatter();
  const max = Math.max(...block.buckets.map((bucket) => bucket.value), 0) || 1;
  const hasHighlight = block.buckets.some((bucket) => bucket.highlighted);
  const columns = { gridTemplateColumns: `repeat(${block.buckets.length}, minmax(0, 1fr))` };

  return (
    <BlockFigure caption={block.caption} source={block.source}>
      <div>
        <div className="grid h-60 items-end gap-2 pt-8 md:gap-4" style={columns}>
          {block.buckets.map((bucket) => {
            const emphasized = !hasHighlight || bucket.highlighted;

            return (
              <div key={bucket.label} className="flex h-full items-end justify-center">
                <div
                  className={`relative w-full max-w-20 min-h-1 rounded-t-md ${emphasized ? 'bg-accent' : 'bg-accent-dim opacity-50'}`}
                  style={{ height: `${Math.max(2, (bucket.value / max) * 100)}%` }}
                >
                  <span
                    className={`absolute bottom-full left-1/2 mb-1.5 -translate-x-1/2 font-mono text-xs md:text-sm font-semibold text-text ${
                      bucket.highlighted ? '' : 'max-sm:sr-only'
                    }`}
                  >
                    {format.number(bucket.value)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-2 grid gap-2 border-t border-border pt-2 md:gap-4" style={columns}>
          {block.buckets.map((bucket) => (
            <span
              key={bucket.label}
              className="text-center font-mono text-[11px] md:text-xs text-text-tertiary wrap-break-word"
            >
              {bucket.label}
            </span>
          ))}
        </div>
      </div>
    </BlockFigure>
  );
}
