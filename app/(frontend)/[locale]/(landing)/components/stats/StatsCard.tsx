import type { ReactNode } from 'react';
import { StatsCardLink } from './StatsCardLink';
import { StatsCardTone, statsCardTones } from './statsCardTone';

interface StatsCardProps {
  tone: StatsCardTone;
  label: string;
  /** Already formatted (and animated) by the caller. */
  value: string;
  summary: string;
  badge?: ReactNode;
  timeline?: ReactNode;
  /** The block about the top name, surname and school. */
  children?: ReactNode;
  note?: ReactNode;
  cta: { label: string; href: string };
}

/** Shared shell of the landing stats cards: the caller decides what goes in each slot. */
export function StatsCard({
  tone,
  label,
  value,
  summary,
  badge,
  timeline,
  children,
  note,
  cta,
}: StatsCardProps) {
  const styles = statsCardTones[tone];

  return (
    <article className={`flex h-full flex-col gap-5 rounded-3xl p-6 sm:p-10 ${styles.card}`}>
      <div className="flex flex-col gap-2">
        <span className={`font-mono text-xs uppercase tracking-wider ${styles.muted}`}>
          {label}
        </span>
        <span className="font-title text-5xl font-extrabold truncate leading-none tracking-tighter tabular-nums sm:text-8xl">
          {value}
        </span>
        <p className={`text-lg ${styles.muted}`}>{summary}</p>
      </div>

      {badge}
      {timeline}

      {children}

      {note && <p className={`text-sm ${styles.note}`}>{note}</p>}

      <StatsCardLink tone={tone} label={cta.label} href={cta.href} />
    </article>
  );
}
