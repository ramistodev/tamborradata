import type { ValuesCategory } from '../../../../../../../types/api/statistics.types';
import { ValueRender } from '../renders/Value';

/** The key figures of a family: one card per values category, all visible at once (no tabs). */
export function ValuesGrid({ categories }: { categories: ValuesCategory[] }) {
  if (categories.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(15rem,1fr))] gap-3">
      {categories.map((category) => (
        <ValueRender key={category.category} category={category} />
      ))}
    </div>
  );
}
