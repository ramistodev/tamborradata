import type { HeadingBlock } from '../../types/article.types';

export function HeadingRender({ block }: { block: HeadingBlock }) {
  return (
    <h2 className="max-w-180 text-3xl md:text-5xl font-bold tracking-tight text-text text-balance">
      {block.content}
    </h2>
  );
}
