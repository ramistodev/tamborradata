import { chipTone, type ChipListBlock, type ChipTone } from '../../types/article.types';
import { BlockFigure } from './BlockFigure';

const TONE_STYLES = {
  [chipTone.neutral]: { chip: 'border-border bg-bg-secondary', value: 'text-text-secondary' },
  [chipTone.positive]: { chip: 'border-border-success bg-bg-success', value: 'text-text' },
  [chipTone.negative]: { chip: 'border-border-danger bg-bg-danger', value: 'text-text-danger' },
} as const satisfies Record<ChipTone, { chip: string; value: string }>;

export function ChipListRender({ block }: { block: ChipListBlock }) {
  const styles = TONE_STYLES[block.tone ?? chipTone.neutral];

  return (
    <BlockFigure caption={block.caption} source={block.source}>
      <ul className="flex flex-wrap gap-2.5">
        {block.items.map((item) => (
          <li
            key={item.label}
            className={`inline-flex items-center gap-2 rounded-lg border px-3.5 py-2 text-base text-text ${styles.chip}`}
          >
            {item.label}
            {item.value !== undefined && (
              <span className={`font-mono text-sm font-semibold ${styles.value}`}>
                {item.value}
              </span>
            )}
          </li>
        ))}
      </ul>
    </BlockFigure>
  );
}
