import { useTranslations } from 'next-intl';
import type { PeriodResponse } from '../../../../../../types/api/period.types';
import type { EditorialTemplate } from '../../../../../../types/api/statistics.types';
import { CLOSING_CHAPTER_ID } from '../utils/chapters';
import { BackToTop } from './BackToTop';
import { PeriodNeighbors } from './PeriodNeighbors';
import { SummaryParagraphs } from './SummaryParagraphs';

type ClosingProps = {
  periods: PeriodResponse[];
  /** Public slug of the period being shown. */
  currentPeriod: string;
  outro: EditorialTemplate;
};

/** End of the page: the summary, the way to the neighbour editions and a way back to the top. */
export function Closing({ periods, currentPeriod, outro }: ClosingProps) {
  const t = useTranslations('Statistics.closing');
  const tChapter = useTranslations('Statistics.chapters');
  const hasSummary = Boolean(outro.summary && outro.section);

  return (
    <section
      id={CLOSING_CHAPTER_ID}
      tabIndex={-1}
      aria-labelledby={`${CLOSING_CHAPTER_ID}-title`}
      className="flex scroll-mt-32 flex-col gap-6 border-t border-border px-3 pt-8 pb-10 focus:outline-none sm:px-5"
    >
      <h2 id={`${CLOSING_CHAPTER_ID}-title`} className="sr-only">
        {tChapter('closing')}
      </h2>
      <SummaryParagraphs p={outro} />
      <PeriodNeighbors periods={periods} currentPeriod={currentPeriod} />
      <div className="flex justify-center">
        <BackToTop />
      </div>
    </section>
  );
}
