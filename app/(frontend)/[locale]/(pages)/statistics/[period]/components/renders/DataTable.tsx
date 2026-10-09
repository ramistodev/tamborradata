import { useFormatter } from 'next-intl';
import type { StatisticRank } from '@/app/types/api/statistics.types';

type DataTableRenderProps = {
  /** Ranks grouped by school (`groupSchool`), like commonNameBySchool. */
  data: StatisticRank[];
  labels: { school: string; entity: string };
};

const headerCell =
  'border-b border-border-strong px-2.5 py-2 text-left font-mono text-[9.5px] font-semibold uppercase leading-none tracking-widest text-text-tertiary whitespace-nowrap';

/** One row per school with the entity that leads it and how many times it appears. */
export function DataTableRender({ data, labels }: DataTableRenderProps) {
  const format = useFormatter();

  if (data.length === 0) {
    return null;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-[12.5px]">
        <thead>
          <tr>
            <th scope="col" className={headerCell}>
              {labels.school}
            </th>
            <th scope="col" className={headerCell}>
              {labels.entity}
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((entry, index) => (
            <tr
              key={`${entry.groupSchool?.schoolId ?? index}-${entry.entityKey ?? index}`}
              className={index % 2 === 1 ? 'bg-bg-secondary' : undefined}
            >
              <th
                scope="row"
                className="border-b border-border px-2.5 py-2 text-left font-normal text-text"
              >
                {entry.groupSchool?.canonicalName ?? '—'}
              </th>
              <td className="border-b border-border px-2.5 py-2 text-text-secondary">
                <span className="flex items-baseline justify-between gap-3">
                  {entry.entityLabel ?? '—'}
                  <span className="font-mono text-[10.5px] text-text-tertiary">
                    {format.number(entry.value)}
                  </span>
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
