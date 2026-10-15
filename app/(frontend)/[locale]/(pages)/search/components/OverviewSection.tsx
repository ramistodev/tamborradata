import { useFormatter, useTranslations } from 'next-intl';
import { OverviewResponse } from '../../../../../types/api/overview.types';
import { BigStat, StatHighlight } from '../../../components/ui';
import { TopStats } from './TopStats';
import { YearsTimeline } from './YearsTimeline';

const TITLE_ID = 'search-overview-title';

export function OverviewSection({
  globalPeriod,
}: {
  globalPeriod: OverviewResponse['globalPeriod'];
}) {
  const t = useTranslations('Search.overview');
  const format = useFormatter();
  if (!globalPeriod) return null;

  return (
    <section aria-labelledby={TITLE_ID} className="flex flex-col gap-6 sm:gap-9">
      <span aria-hidden="true" className="w-full border border-border"></span>
      <h2 id={TITLE_ID} className="sr-only">
        {t('title')}
      </h2>
      <BigStat value={format.number(globalPeriod.totalParticipations, { useGrouping: 'always' })}>
        {t.rich('summary', {
          editionsCount: globalPeriod.editionsCount,
          schoolsCount: globalPeriod.totalSchools,
          highlight: (chunks) => <StatHighlight>{chunks}</StatHighlight>,
        })}
      </BigStat>

      <YearsTimeline
        startYear={globalPeriod.startYear}
        endYear={globalPeriod.endYear}
        missingYears={globalPeriod.missingYears}
      />

      <TopStats
        topName={globalPeriod.topName}
        topSurname={globalPeriod.topSurname}
        topSchool={globalPeriod.topSchool}
      />
    </section>
  );
}
