import { useTranslations } from 'next-intl';
import { PeriodResponse } from '../../../../../../types/api/period.types';
import {
  IntroOutro,
  OverviewStatistic,
  PeriodData,
} from '../../../../../../types/api/statistics.types';
import { periodKind } from '../../../../../../types/period.types';
import { OVERVIEW_CHAPTER_ID } from '../utils/chapters';
import { IntroOutroParagraphs } from './IntroOutroParagraphs';
import { OverviewCard } from './OverviewCard';
import { PeriodSelector } from './PeriodSelector';
import { PublishDates } from './PublishDates';

export function Hero({
  periods,
  periodData,
  overview,
  intro,
}: {
  periods: PeriodResponse[];
  periodData: PeriodData;
  overview: OverviewStatistic[];
  intro: IntroOutro;
}) {
  const t = useTranslations('Statistics');
  const isYear = periodData.periodKind === periodKind.year;
  const { period } = periodData;

  return (
    <section id={OVERVIEW_CHAPTER_ID} className="flex scroll-mt-32 flex-col gap-4 px-3 sm:px-5">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <span className="text-xs sm:text-sm font-mono text-accent whitespace-nowrap uppercase">
          {isYear ? t('hero.eyebrowYear') : t('hero.eyebrowGlobal', { period })}
        </span>
        <PublishDates periodData={periodData} />
      </div>
      <h1 id="year-page-title" className="text-2xl md:text-3xl font-bold">
        <span className="hidden md:block">{t('period.title', { period })}</span>
        <span className="block md:hidden">
          {isYear ? t('hero.titleYear', { period }) : t('hero.titleGlobal')}
        </span>
      </h1>
      <div className="w-full text-sm sm:text-md md:text-base flex flex-col gap-3">
        <PeriodSelector periods={periods} />
        <span className="w-full flex flex-col items-center">
          <span className="w-3/4 border border-border"></span>
        </span>
      </div>
      <div className="w-full flex flex-col gap-8">
        <OverviewCard overview={overview} periodData={periodData} />
        <IntroOutroParagraphs p={intro} />
      </div>
    </section>
  );
}
