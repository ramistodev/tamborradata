import { useFormatter, useTranslations } from 'next-intl';
import type { OverviewResponse } from '../../../../../types/api/overview.types';
import { FAQs } from '../../../components/ui';
import { buildFaqs } from '../data/faqs';

type FAQSectionProps = {
  period: OverviewResponse['globalPeriod'];
};

const TITLE_ID = 'search-faq-title';

export function FAQSection({ period }: FAQSectionProps) {
  const t = useTranslations('Search.faq');
  const tItems = useTranslations('Search.faq.items');
  const format = useFormatter();

  if (!period) return null;

  return (
    <section aria-labelledby={TITLE_ID} className="flex flex-col gap-6 sm:gap-9">
      <div className="flex flex-col gap-1 sm:gap-2 px-3 sm:px-4 py-2 sm:py-3 border-b border-border">
        {/* Same words as the heading right below it, so it is not read out */}
        <span aria-hidden="true" className="text-xs font-mono uppercase text-accent">
          {t('kicker')}
        </span>
        <h2 id={TITLE_ID} className="text-2xl sm:text-3xl font-bold text-text">
          {t('title')}
        </h2>
      </div>
      <FAQs items={buildFaqs(tItems, format, period)} />
    </section>
  );
}
