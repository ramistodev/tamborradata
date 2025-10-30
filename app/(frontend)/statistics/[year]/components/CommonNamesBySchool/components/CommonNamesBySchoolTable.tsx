import { ArrowDown, ArrowUp } from '@/app/(frontend)/icons/icons';
import { useCommonNamesBySchool } from '../hooks/useCommonNamesBySchool';
import { LoadingTable } from '@/app/(frontend)/loaders/LoadingTable';

export function CommonNamesBySchoolTable({
  stats,
  hasMore,
  loading,
  tableRef,
  showMore,
  showLess,
}: ReturnType<typeof useCommonNamesBySchool>) {
  return (
    <>
      <table
        ref={tableRef}
        className="w-full sm:w-[400px] md:w-[450px] xl:w-[650px] border border-(--color-border)"
      >
        <thead>
          <tr>
            <th className="w-12 text-sm border-b border-(--color-border) text-center p-2 sm:text-md">
              #
            </th>
            <th className="text-sm border-b border-(--color-border) text-left p-2">Colegio</th>
            <th className="text-sm border-b border-(--color-border) text-left p-2">Nombre</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(stats[0].public_data) &&
            stats[0].public_data.map((stat, index) => (
              <tr key={stat.school} className={index % 2 === 0 ? 'bg-(--color-table)' : ''}>
                <td className="p-2 text-center text-sm">{index + 1}</td>
                <td className="p-2 text-sm">{stat.school}</td>
                <td className="p-2 text-sm">{stat.name}</td>
              </tr>
            ))}
          {loading && <LoadingTable rows={3} />}
        </tbody>
      </table>
      {hasMore ? (
        <span
          className="flex items-center justify-center gap-2 cursor-pointer my-1 text-(--color-text-secondary)"
          onClick={showMore}
        >
          <ArrowDown /> mostrar más
        </span>
      ) : (
        <span
          className="flex items-center justify-center gap-2 cursor-pointer my-1 text-(--color-text-secondary)"
          onClick={showLess}
        >
          <ArrowUp /> mostrar menos
        </span>
      )}
    </>
  );
}
