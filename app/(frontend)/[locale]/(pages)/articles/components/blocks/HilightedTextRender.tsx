import type { HilightedTextBlock } from '../../types/article.types';
import { RichText } from './RichText';

export function HilightedTextRender({ block }: { block: HilightedTextBlock }) {
  return (
    <div className="flex max-w-180 flex-col gap-3 border-l-2 border-accent py-1 pl-5 md:pl-6">
      {block.caption && (
        <span className="font-mono text-xs uppercase tracking-widest text-accent">
          {block.caption}
        </span>
      )}
      <p className="text-xl md:text-3xl font-medium leading-snug tracking-tight text-text text-balance">
        <RichText text={block.content} />
      </p>
      {block.source && <span className="font-mono text-xs text-text-tertiary">{block.source}</span>}
    </div>
  );
}
