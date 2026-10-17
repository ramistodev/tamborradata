export type StatsCardTone = 'surface' | 'accent';

/** Every class is written out in full: Tailwind cannot see classes built from variables. */
export const statsCardTones: Record<
  StatsCardTone,
  {
    card: string;
    muted: string;
    strong: string;
    count: string;
    note: string;
    cta: string;
    badge: string;
    bar: string;
    divider: string;
  }
> = {
  surface: {
    card: 'border border-border bg-bg-secondary text-text',
    muted: 'text-text-secondary',
    strong: 'text-text',
    count: 'text-accent',
    note: 'text-text-tertiary',
    cta: 'border border-border text-text hover:border-accent hover:text-accent',
    badge: 'bg-bg text-text-secondary',
    bar: 'bg-accent',
    divider: 'divide-border',
  },
  accent: {
    card: 'bg-accent text-bg',
    muted: 'text-bg/85',
    strong: 'text-bg',
    count: 'text-bg/85',
    note: 'text-bg/85',
    cta: 'bg-bg text-accent hover:opacity-85',
    badge: 'bg-text/25 text-bg',
    bar: 'bg-bg/50',
    divider: 'divide-bg/20',
  },
};
