import type { HTMLAttributes, ReactNode } from 'react';

type Tone = 'neutral' | 'accent' | 'success' | 'danger';

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: Tone;
  /** Data point shown after the label, in the mono font (a count, a delta, ...). */
  value?: ReactNode;
};

const tones: Record<Tone, string> = {
  neutral: 'border-border bg-bg-secondary',
  accent: 'border-accent/40 bg-accent-glow',
  success: 'border-success/40 bg-success/[7%]',
  danger: 'border-danger/40 bg-danger/[7%]',
};

const valueTones: Record<Tone, string> = {
  neutral: 'text-text-secondary',
  accent: 'text-accent',
  success: 'text-success',
  danger: 'text-danger',
};

export function Badge({ tone = 'neutral', value, className = '', children, ...props }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.75 rounded-lg border px-2.5 py-1.25 font-sans text-[12.5px] text-text ${tones[tone]} ${className}`}
      {...props}
    >
      {children}
      {value != null && (
        <span className={`font-mono text-[10.5px] font-semibold ${valueTones[tone]}`}>{value}</span>
      )}
    </span>
  );
}
