import { getFormatter } from 'next-intl/server';
import { DragScroll } from '@/app/(frontend)/[locale]/components/ui';
import type { DataTableBlock } from '../../types/article.types';
import { BlockFigure } from './BlockFigure';

export async function DataTableRender({ block }: { block: DataTableBlock }) {
  const format = await getFormatter();

  return (
    <BlockFigure caption={block.caption} source={block.source}>
      <DragScroll
        role="region"
        aria-label={block.caption ?? block.columns.join(', ')}
        tabIndex={0}
        className="rounded-lg scrollbar-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
      >
        <table className="w-full min-w-max border-collapse text-base">
          {block.caption && <caption className="sr-only">{block.caption}</caption>}
          <thead>
            <tr>
              {block.columns.map((column, index) => (
                <th
                  key={column}
                  scope="col"
                  className={`whitespace-nowrap border-b border-border-strong px-3 py-3 font-mono text-xs font-semibold uppercase tracking-wider text-text-tertiary ${
                    index === 0 ? 'text-left' : 'text-right'
                  }`}
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {block.rows.map((row, rowIndex) => (
              <tr key={rowIndex} className={rowIndex % 2 ? 'bg-bg-secondary' : undefined}>
                {row.map((cell, cellIndex) =>
                  cellIndex === 0 ? (
                    <th
                      key={cellIndex}
                      scope="row"
                      className="border-b border-border px-3 py-3 text-left font-medium text-text"
                    >
                      {cell}
                    </th>
                  ) : (
                    <td
                      key={cellIndex}
                      className="border-b border-border px-3 py-3 text-right font-mono text-sm text-text-secondary"
                    >
                      {typeof cell === 'number' ? format.number(cell) : cell}
                    </td>
                  )
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </DragScroll>
    </BlockFigure>
  );
}
