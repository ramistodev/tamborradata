import { ChevronDown, ChevronUp } from '@/app/(frontend)/icons/icons';
import { LoadingTable } from '@/app/(frontend)/statistics/components/loaders/LoadingTable';
import { useTopSchools } from '../hooks/useTopShools';

export function TopSchoolsTable({
  topSchoolsStats,
  hasMore,
  isLoading,
  isFetching,
  tableRef,
  showMore,
  showLess,
}: ReturnType<typeof useTopSchools>) {
  return (
    <>
      <table
        ref={tableRef}
        className="w-full sm:w-[400px] md:w-[450px] xl:w-[650px] border border-(--color-border)"
        role="table"
        aria-label="Tabla de colegios con más participantes"
      >
        <thead>
          <tr>
            <th
              className="w-12 text-sm border-b border-(--color-border) text-center p-2 sm:text-md"
              scope="col"
            >
              #
            </th>
            <th className="text-sm border-b border-(--color-border) text-left p-2" scope="col">
              Colegio
            </th>
            <th className="text-sm border-b border-(--color-border) text-left p-2" scope="col">
              Participantes Totales
            </th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(topSchoolsStats[0].public_data) &&
            topSchoolsStats[0].public_data.map((stat, index) => (
              <tr key={stat.school} className={index % 2 === 0 ? 'bg-(--color-table)' : ''}>
                <td className="p-2 text-center text-sm">{index + 1}</td>
                <td className="p-2 text-sm">{stat.school}</td>
                <td className="p-2 text-sm">{stat.count}</td>
              </tr>
            ))}
          {(isLoading || isFetching) && <LoadingTable rows={3} />}
        </tbody>
      </table>
      {hasMore ? (
        <button
          className="flex items-center justify-center gap-2 cursor-pointer my-1 text-(--color-text-secondary)"
          onClick={showMore}
          aria-label="Mostrar más colegios"
        >
          <ChevronDown /> mostrar más
        </button>
      ) : (
        <button
          className="flex items-center justify-center gap-2 cursor-pointer my-1 text-(--color-text-secondary)"
          onClick={showLess}
          aria-label="Mostrar menos colegios"
        >
          <ChevronUp /> mostrar menos
        </button>
      )}
    </>
  );
}
