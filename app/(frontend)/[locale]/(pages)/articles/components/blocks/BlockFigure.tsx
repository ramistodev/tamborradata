import type { ReactNode } from 'react';

type BlockFigureProps = {
  caption?: string;
  source?: string;
  children: ReactNode;
};

export function BlockFigure({ caption, source, children }: BlockFigureProps) {
  return (
    <figure className="flex min-w-0 flex-col gap-5">
      {children}
      {(caption || source) && (
        <figcaption className="flex flex-col gap-1 border-t border-border pt-3">
          {caption && <span className="text-sm text-text-secondary text-pretty">{caption}</span>}
          {source && <span className="font-mono text-xs text-text-tertiary">{source}</span>}
        </figcaption>
      )}
    </figure>
  );
}
