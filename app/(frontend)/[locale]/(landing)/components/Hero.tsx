'use client';
import { useFormatter, useTranslations } from 'next-intl';
import { OverviewResponse } from '../../../../types/api/overview.types';
import { siteName } from '../../config/constants';
import { useHero } from '../hooks/useHero';
import { Caret } from './Caret';
import { useOverviewMetric } from '../hooks/useOverviewMetric';

const PHRASE_KEYS = ['names', 'data', 'editions'] as const;

export function Hero({ overview }: { overview: OverviewResponse | null }) {
  const t = useTranslations('Landing.hero');
  const { description, overviewRef } = useHero(PHRASE_KEYS.map((key) => t(`phrases.${key}`)));
  const { overviewMetrics } = useOverviewMetric({ overview, ref: overviewRef });

  const period = overview?.globalPeriod;
  const globalPeriod = overviewMetrics?.globalPeriod;

  return (
    <section className="relative isolate w-full min-h-[calc(100dvh-var(--header-h)-1px)] flex flex-col items-start justify-center gap-4 pt-10 lg:pt-10">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-[20%] sm:top-[30%] left-1/2 -z-10 h-96 lg:h-136 w-full max-w-5xl -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(closest-side,var(--accent-glow),transparent)] "
      />
      <div className="flex flex-col items-start gap-4 lg:gap-6">
        <div className="flex flex-col items-start justify-between gap-2 sm:gap-3 lg:gap-4">
          <h1 className="text-[40px] sm:text-7xl lg:text-9xl font-extrabold">{siteName}</h1>
          <p className="text-xl sm:text-2xl lg:text-4xl min-h-15 sm:min-h-20 font-title text-accent font-semibold">
            <span className="sr-only">{t('phrases.names')}</span>
            <span aria-hidden="true">
              {description}
              <Caret />
            </span>
          </p>
        </div>
        <div className="flex flex-col items-start w-full max-w-2xl">
          <p className="text-lg sm:text-xl text-text-secondary text-balance">
            {period
              ? t('description', { startYear: String(period.startYear) })
              : t('descriptionFallback')}
          </p>
        </div>
      </div>
      <div className="w-full flex flex-col items-start gap-4 pt-10">
        {globalPeriod && (
          <div ref={overviewRef} className="w-full flex flex-col">
            <span className="w-full border border-border mb-5 lg:mb-10" />
            <div className="w-full max-w-xl lg:max-w-3xl flex flex-col items-start gap-2">
              <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-x-5 gap-y-6">
                <ShowMetric
                  wide
                  value={globalPeriod.totalParticipations}
                  finalValue={period?.totalParticipations ?? globalPeriod.totalParticipations}
                  label={t('metrics.participations')}
                />
                <ShowMetric
                  value={globalPeriod.editionsCount}
                  finalValue={period?.editionsCount ?? globalPeriod.editionsCount}
                  label={t('metrics.editions')}
                />
                <ShowMetric
                  value={globalPeriod.totalSchools}
                  finalValue={period?.totalSchools ?? globalPeriod.totalSchools}
                  label={t('metrics.schools')}
                />
              </div>
              <div>
                <p className="font-mono text-sm text-text-secondary text-balance">
                  <span>
                    {globalPeriod.startYear} - {globalPeriod.endYear}
                  </span>
                  <span aria-hidden="true">{' · '}</span>
                  <span>{t('summary.topName', { name: globalPeriod.topName.label })}</span>
                  <span aria-hidden="true">{' · '}</span>
                  <span className="wrap-break-word">
                    {t('summary.topSurname', { surname: globalPeriod.topSurname.label })}
                  </span>
                  <span aria-hidden="true">{' · '}</span>
                  <span>{t('summary.topSchool', { school: globalPeriod.topSchool.label })}</span>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

/**
 * `value` counts up, so it is hidden from assistive technology; the final figure is there instead,
 * whole, for screen readers and for whoever reads the HTML before the animation (search engines).
 */
function ShowMetric({
  wide = false,
  value,
  finalValue,
  label,
}: {
  wide?: boolean;
  value: number;
  finalValue: number;
  label: string;
}) {
  const formatter = useFormatter();
  return (
    <div className={`flex flex-col items-start gap-1 ${wide ? 'col-span-2' : 'col-span-1'}`}>
      <span
        aria-hidden="true"
        className="text-4xl sm:text-5xl lg:text-6xl font-mono font-semibold tabular-nums"
      >
        {formatter.number(value)}
      </span>
      <span className="sr-only">{formatter.number(finalValue)}</span>
      <span className="text-base lg:text-lg text-text-secondary uppercase font-mono">{label}</span>
    </div>
  );
}
