import type { CSSProperties } from 'react';
import type { WaffleChartBlock } from '../../types/article.types';
import { BlockFigure } from './BlockFigure';

export function WaffleChartRender({ block }: { block: WaffleChartBlock }) {
  const total = Math.max(0, Math.floor(block.total));
  const filled = Math.min(Math.max(0, Math.floor(block.filled)), total);
  const columns = Math.max(1, Math.floor(block.columns));
  const size = { '--waffle-size': `${columns * 3}rem` } as CSSProperties;

  return (
    <BlockFigure caption={block.caption} source={block.source}>
      <div
        className="flex flex-col gap-6 lg:grid lg:grid-cols-[var(--waffle-size)_minmax(0,1fr)] lg:items-center lg:gap-12"
        style={size}
      >
        <div
          {...(block.label
            ? { 'aria-hidden': true }
            : { role: 'img', 'aria-label': `${filled} / ${total}` })}
          className="grid w-full max-w-(--waffle-size) gap-1.5 sm:gap-2.5"
          style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
        >
          {Array.from({ length: total }, (_, index) => (
            <span
              key={index}
              aria-hidden="true"
              className={`aspect-square rounded-full ${
                index < filled ? 'bg-(--chart-3)' : 'border border-text-tertiary'
              }`}
            />
          ))}
        </div>
        {block.label && (
          <p className="max-w-md text-xl md:text-3xl font-medium leading-snug tracking-tight text-text text-balance">
            {block.label}
          </p>
        )}
      </div>
    </BlockFigure>
  );
}
