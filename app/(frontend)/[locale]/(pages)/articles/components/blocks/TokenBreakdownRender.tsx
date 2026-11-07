import { tokenRole, type TokenBreakdownBlock, type TokenRole } from '../../types/article.types';
import { BlockFigure } from './BlockFigure';

const ROLE_STYLES = {
  [tokenRole.given]: { tile: 'border-accent bg-accent-glow', label: 'text-accent' },
  [tokenRole.surname]: {
    tile: 'border-border-strong bg-bg-secondary',
    label: 'text-text-secondary',
  },
  [tokenRole.unknown]: {
    tile: 'border-dashed border-text-tertiary',
    label: 'text-text-tertiary',
  },
} as const satisfies Record<TokenRole, { tile: string; label: string }>;

export function TokenBreakdownRender({ block }: { block: TokenBreakdownBlock }) {
  return (
    <BlockFigure caption={block.caption} source={block.source}>
      <ul className="flex flex-wrap gap-3 md:gap-4">
        {block.tokens.map((token, index) => {
          const styles = ROLE_STYLES[token.role];

          return (
            <li
              key={`${token.text}-${index}`}
              className={`flex min-w-28 flex-col items-center gap-2 rounded-2xl border px-5 py-4 md:px-8 md:py-6 ${styles.tile}`}
            >
              <span className="text-2xl md:text-4xl font-bold tracking-tight text-text">
                {token.text}
              </span>
              <span className={`font-mono text-xs uppercase tracking-widest ${styles.label}`}>
                {token.label}
              </span>
            </li>
          );
        })}
      </ul>
    </BlockFigure>
  );
}
