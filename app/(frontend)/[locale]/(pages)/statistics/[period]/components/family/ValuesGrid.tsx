import { useTranslations } from 'next-intl';
import type { ValuesCategory } from '../../../../../../../types/api/statistics.types';
import { DragScroll } from '../../../../../components/ui';
import { ValueRender } from '../renders/Value';

/** The key figures of a family: one card per values category, all visible at once (no tabs). */
export function ValuesGrid({ categories }: { categories: ValuesCategory[] }) {
  const t = useTranslations('Statistics.layout');

  if (categories.length === 0) {
    return null;
  }

  return (
    <article>
      <div className="flex justify-start">
        <DragScroll
          role="region"
          aria-label={t('keyFigures')}
          tabIndex={0}
          className="flex gap-3 rounded-xl scrollbar-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent sm:gap-4"
        >
          {categories.map((category) => (
            <ValueRender key={category.category} category={category} />
          ))}
        </DragScroll>
      </div>
    </article>
  );
}
