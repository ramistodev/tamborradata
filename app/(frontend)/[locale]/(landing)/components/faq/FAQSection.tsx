import { useFormatter, useTranslations } from 'next-intl';
import type { OverviewResponse } from '../../../../../types/api/overview.types';
import { FAQs } from '../../../components/ui';
import { buildLandingFaqs } from './faqs';

export function FAQSection({ overview }: { overview: OverviewResponse | null }) {
  const t = useTranslations('Landing.faq');
  const tItems = useTranslations('Landing.faq.items');
  const format = useFormatter();

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
      <div className="flex flex-col gap-6 lg:sticky lg:top-28 lg:self-start">
        <h2 className="text-4xl font-extrabold tracking-tight text-balance sm:text-5xl lg:text-6xl">
          {t('title')}
        </h2>
        {/* Decorative: an outlined question mark behind the heading */}
        <span
          aria-hidden="true"
          className="hidden font-title text-[14rem] leading-none font-extrabold text-transparent select-none [-webkit-text-stroke:1px_var(--border-strong)] lg:block"
        >
          ?
        </span>
      </div>

      <FAQs items={buildLandingFaqs(tItems, format, overview)} />
    </div>
  );
}
