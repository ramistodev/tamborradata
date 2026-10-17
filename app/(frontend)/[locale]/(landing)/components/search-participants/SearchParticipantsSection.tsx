import { getFormatter, getTranslations } from 'next-intl/server';
import { Link } from '@/app/(frontend)/i18n/navigation';
import { Icons } from '../../../components/Icons';
import type { OverviewResponse } from '../../../../../types/api/overview.types';
import { ExampleResultCard } from './ExampleResultCard';
import { SearchSteps } from './SearchSteps';

const STEP_KEYS = ['name', 'school', 'sources'] as const;

export async function SearchParticipantsSection({
  overview,
}: {
  overview: OverviewResponse | null;
}) {
  const [t, format] = await Promise.all([
    getTranslations('Landing.searchParticipants'),
    getFormatter(),
  ]);
  const total = overview?.globalPeriod?.totalParticipations;

  const steps = STEP_KEYS.map((key) => ({
    title: t(`steps.${key}.title`),
    description: t(`steps.${key}.description`),
  }));

  return (
    <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
      <div className="flex flex-col items-start gap-6">
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-balance">
          {t('title')}
        </h2>
        <p className="text-sm sm:text-lg lg:text-xl text-text-secondary text-balance">
          {/* Without the overview the sentence still reads well, it just does not quote a figure */}
          {total === undefined
            ? t('descriptionFallback')
            : t('description', { total: format.number(total, { useGrouping: 'always' }) })}
        </p>

        <SearchSteps steps={steps} />

        <Link
          href="/search-participants"
          className="inline-flex w-fit items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-bg transition-opacity duration-200 hover:opacity-85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent motion-reduce:transition-none"
        >
          {t('cta')}
          <Icons.ArrowRight className="size-4" />
        </Link>
      </div>

      <ExampleResultCard />
    </div>
  );
}
