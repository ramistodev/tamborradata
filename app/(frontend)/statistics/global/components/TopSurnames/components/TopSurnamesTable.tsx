import { ChevronDown, ChevronUp } from '@/app/(frontend)/icons/icons';
import { useTopSurnames } from '../hooks/useTopSurnames';
import { LoadingTable } from '@/app/(frontend)/statistics/components/loaders/LoadingTable';

export function TopSurnamesTable({
  topSurnamesStats,
  isLoading,
  hasMore,
  tableRef,
  showMore,
  showLess,
}: ReturnType<typeof useTopSurnames>) {
  return (
    <>
      <table
        ref={tableRef}
        className="w-full sm:w-[400px] md:w-[450px] xl:w-[650px] border border-(--color-border)"
        role="table"
        aria-label="Tabla de apellidos más repetidos"
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
              Apellidos
            </th>
            <th className="text-sm border-b border-(--color-border) text-left p-2" scope="col">
              Apariciones
            </th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(topSurnamesStats[0].public_data) &&
            topSurnamesStats[0].public_data.map((stat, index) => (
              <tr key={stat.surname} className={index % 2 === 0 ? 'bg-(--color-table)' : ''}>
                <td className="p-2 text-center text-sm">{index + 1}</td>
                <td className="p-2 text-sm">{stat.surname}</td>
                <td className="p-2 text-sm">{stat.count}</td>
              </tr>
            ))}
          {isLoading && <LoadingTable rows={3} />}
        </tbody>
      </table>
      {hasMore ? (
        <button
          className="flex items-center justify-center gap-2 cursor-pointer my-1 text-(--color-text-secondary)"
          onClick={showMore}
          aria-label="Mostrar más apellidos"
        >
          <ChevronDown /> mostrar más
        </button>
      ) : (
        <button
          className="flex items-center justify-center gap-2 cursor-pointer my-1 text-(--color-text-secondary)"
          onClick={showLess}
          aria-label="Mostrar menos apellidos"
        >
          <ChevronUp /> mostrar menos
        </button>
      )}
    </>
  );
}
