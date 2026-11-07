import type { CompareBlock, CompareSide } from '../../types/article.types';
import { BlockFigure } from './BlockFigure';

function Side({ side, align }: { side: CompareSide; align: 'left' | 'right' }) {
  return (
    <div
      className={`flex min-w-0 flex-1 flex-col gap-3 ${align === 'right' ? 'md:text-right' : ''}`}
    >
      <span className="font-mono text-xs font-semibold uppercase tracking-widest text-text-tertiary">
        {side.label}
      </span>
      <span
        className={`font-mono text-3xl md:text-4xl font-bold leading-none tracking-tighter wrap-break-word ${
          side.highlighted ? 'text-accent' : 'text-text'
        }`}
      >
        {side.value}
      </span>
      {side.description && (
        <p className="text-base text-text-secondary text-pretty">{side.description}</p>
      )}
    </div>
  );
}

export function CompareRender({ block }: { block: CompareBlock }) {
  return (
    <BlockFigure caption={block.caption} source={block.source}>
      <div className="flex flex-col gap-6 rounded-2xl border border-border bg-card p-6 md:flex-row md:items-stretch md:gap-8 md:p-8">
        <Side side={block.left} align="left" />
        <div aria-hidden="true" className="h-px w-full bg-border md:h-auto md:w-px" />
        <Side side={block.right} align="right" />
      </div>
    </BlockFigure>
  );
}
