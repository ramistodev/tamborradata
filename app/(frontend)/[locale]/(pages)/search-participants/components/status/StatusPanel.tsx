import type { ReactNode } from 'react';

type StatusPanelProps = {
  icon: ReactNode;
  title: string;
  tone?: 'accent' | 'danger' | 'warning';
  action?: ReactNode;
  children: ReactNode;
};

const TONES = {
  accent: 'bg-accent/10 text-accent',
  danger: 'bg-bg-danger text-text-danger',
  warning: 'bg-bg-warning text-text-warning',
};

// Only a warning tints the whole panel, so a wait stands out from an empty or a failed search
const PANEL_TONES = {
  accent: 'border-border bg-card',
  danger: 'border-border-danger bg-bg-danger',
  warning: 'border-border-warning bg-bg-warning',
};

/**
 * Icon, title and description shown where the results go while there is nothing to list. It is
 * not a live region: `SearchAnnouncer` is the one that speaks.
 */
export function StatusPanel({ icon, title, tone = 'accent', action, children }: StatusPanelProps) {
  return (
    <div className={`flex items-start gap-4 rounded-2xl border p-5 ${PANEL_TONES[tone]}`}>
      <div
        aria-hidden="true"
        className={`grid size-10 shrink-0 place-items-center rounded-xl ${TONES[tone]}`}
      >
        {icon}
      </div>
      <div className="flex min-w-0 flex-col gap-1.5">
        <h3 className="text-base font-semibold text-text">{title}</h3>
        <p className="max-w-prose text-sm sm:text-base leading-relaxed text-text-secondary">
          {children}
        </p>
        {action && <div className="mt-2">{action}</div>}
      </div>
    </div>
  );
}
