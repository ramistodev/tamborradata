import { StatsCardLink } from './StatsCardLink';
import { StatsCardTone, statsCardTones } from './statsCardTone';

type StatsCardKind = 'global' | 'last';

const cards: Record<
  StatsCardKind,
  { tone: StatsCardTone; label: string; title: string; text: string }
> = {
  global: {
    tone: 'surface',
    label: 'Histórico',
    title: 'La Tamborrada, edición a edición',
    text: 'Participaciones, colegios y los nombres más repetidos de todas las ediciones que reúne Tamborradata.',
  },
  last: {
    tone: 'accent',
    label: 'Última edición',
    title: 'La edición más reciente',
    text: 'Cuánta gente participó, de qué colegios y qué nombres se repiten más.',
  },
};

/** Generic card shown in place of a stats card when its data (`globalPeriod` / `lastPeriod`) is missing. */
export function StatsCardFallback({ kind }: { kind: StatsCardKind }) {
  const { tone, label, title, text } = cards[kind];
  const styles = statsCardTones[tone];

  return (
    <article className={`flex h-full flex-col gap-5 rounded-3xl p-6 sm:p-10 ${styles.card}`}>
      <div className="flex flex-col gap-3">
        <span className={`font-mono text-xs uppercase tracking-wider ${styles.muted}`}>
          {label}
        </span>
        <h3 className="font-title text-3xl font-extrabold tracking-tight text-balance sm:text-4xl">
          {title}
        </h3>
        <p className={`text-lg ${styles.muted}`}>{text}</p>
      </div>

      <StatsCardLink tone={tone} label="Ver estadísticas" href="/statistics" />
    </article>
  );
}
