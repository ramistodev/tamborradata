import { useFormatter, useTranslations } from 'next-intl';
import { StatisticFamily } from '../../../../../../../types/api/statistics.types';
import { CHAPTER_ORDER } from '../../utils/chapters';
import { SummaryParagraphs } from '../SummaryParagraphs';
import { FamilyLayout } from './FamilyLayout';

export function FamilyRender({ family }: { family: StatisticFamily }) {
  const t = useTranslations(`Statistics.familyRender.${family.family}`);
  const format = useFormatter();

  return (
    <section id={family.family} className="flex flex-col gap-4">
      <header className="flex items-center gap-2 px-4 py-2 border-b border-border">
        <span className="font-mono text-[10px] sm:text-xs text-accent">
          {format.number(CHAPTER_ORDER[family.family], {
            minimumIntegerDigits: 2,
            useGrouping: false,
          })}
        </span>
        <h2 className="text-xl md:text-2xl font-semibold">{t('title')}</h2>
      </header>
      <SummaryParagraphs p={family.template} />
      <div>
        <FamilyLayout family={family} />
      </div>
    </section>
  );
}
