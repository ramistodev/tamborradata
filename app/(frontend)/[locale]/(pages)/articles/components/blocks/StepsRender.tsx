import { stepStatus, type StepsBlock, type StepStatus } from '../../types/article.types';
import { BlockFigure } from './BlockFigure';

const STATUS_STYLES = {
  [stepStatus.neutral]: {
    marker: 'border-border-strong bg-bg-secondary',
    tag: 'border-border-strong',
    symbol: null,
  },
  [stepStatus.success]: {
    marker: 'border-border-success bg-bg-success',
    tag: 'border-border-success bg-bg-success',
    symbol: '✓',
  },
  [stepStatus.danger]: {
    marker: 'border-border-danger bg-bg-danger',
    tag: 'border-border-danger bg-bg-danger',
    symbol: '✕',
  },
} as const satisfies Record<StepStatus, { marker: string; tag: string; symbol: string | null }>;

export function StepsRender({ block }: { block: StepsBlock }) {
  return (
    <BlockFigure caption={block.caption} source={block.source}>
      <ol className="flex flex-col">
        {block.steps.map((step, index) => {
          const styles = STATUS_STYLES[step.status ?? stepStatus.neutral];
          const isLast = index === block.steps.length - 1;

          return (
            <li key={step.title} className="relative flex gap-4 pb-7 last:pb-0 md:gap-5">
              {!isLast && (
                <span
                  aria-hidden="true"
                  className="absolute bottom-0 left-5 top-10 w-px -translate-x-1/2 bg-border-strong"
                />
              )}
              <span
                aria-hidden="true"
                className={`relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full border font-mono text-sm font-semibold text-text ${styles.marker}`}
              >
                {styles.symbol ?? index + 1}
              </span>
              <div className="flex min-w-0 flex-col gap-1.5 pt-1.5">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <p className="text-lg md:text-xl font-semibold tracking-tight text-text">
                    {step.title}
                  </p>
                  {step.statusLabel && (
                    <span
                      className={`rounded-full border px-2.5 py-0.5 font-mono text-xs uppercase tracking-wider text-text ${styles.tag}`}
                    >
                      {step.statusLabel}
                    </span>
                  )}
                </div>
                {step.description && (
                  <p className="text-base text-text-secondary text-pretty">{step.description}</p>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </BlockFigure>
  );
}
