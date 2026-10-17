import { useTranslations } from 'next-intl';
import { StatsCardLink } from './StatsCardLink';
import { StatsCardTone, statsCardTones } from './statsCardTone';

type StatsCardKind = 'global' | 'last';

const tones: Record<StatsCardKind, StatsCardTone> = {
  global: 'surface',
  last: 'accent',
};

/** Generic card shown in place of a stats card when its data (`globalPeriod` / `lastPeriod`) is missing. */
export function StatsCardFallback({ kind }: { kind: StatsCardKind }) {
  const t = useTranslations('Landing.stats.fallback');
  const tone = tones[kind];
  const styles = statsCardTones[tone];

  return (
    <article className={`flex h-full flex-col gap-5 rounded-3xl p-6 sm:p-10 ${styles.card}`}>
      <div className="flex flex-col gap-3">
        <span className={`font-mono text-xs uppercase tracking-wider ${styles.muted}`}>
          {t(`${kind}.label`)}
        </span>
        <h3 className="font-title text-3xl font-extrabold tracking-tight text-balance sm:text-4xl">
          {t(`${kind}.title`)}
        </h3>
        <p className={`text-lg ${styles.muted}`}>{t(`${kind}.text`)}</p>
      </div>

      <StatsCardLink tone={tone} label={t('cta')} href="/statistics" />
    </article>
  );
}
