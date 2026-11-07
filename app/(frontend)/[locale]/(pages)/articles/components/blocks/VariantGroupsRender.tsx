import type { VariantGroupsBlock } from '../../types/article.types';
import { BlockFigure } from './BlockFigure';

export function VariantGroupsRender({ block }: { block: VariantGroupsBlock }) {
  return (
    <BlockFigure caption={block.caption} source={block.source}>
      <ul className="grid gap-4 md:grid-cols-2">
        {block.groups.map((group) => (
          <li
            key={group.name}
            className="flex min-w-0 flex-col gap-4 rounded-2xl border border-border bg-card p-5 md:p-6"
          >
            <div className="flex items-baseline justify-between gap-3">
              <p className="text-xl md:text-2xl font-bold tracking-tight text-text">{group.name}</p>
              <span className="shrink-0 font-mono text-xs uppercase tracking-widest text-accent">
                {group.countLabel}
              </span>
            </div>
            <ul className="flex flex-wrap gap-2">
              {group.variants.map((variant) => (
                <li
                  key={variant}
                  className="rounded-lg border border-border bg-bg-secondary px-3 py-1.5 text-sm text-text-secondary wrap-break-word"
                >
                  {variant}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </BlockFigure>
  );
}
