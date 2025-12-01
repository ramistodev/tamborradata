import { ChevronDown, ChevronUp } from '@/app/(frontend)/icons/icons';
import { useCommonNameBySchool } from '../hooks/useCommonNameBySchool';
import { LoadingTable } from '@/app/(frontend)/statistics/components/loaders/LoadingTable';

export function CommonNameBySchoolTable({
  commonNameBySchool,
  hasMore,
  isLoading,
  tableRef,
  showMore,
  showLess,
}: ReturnType<typeof useCommonNameBySchool>) {
  return (
    <>
      <table
        ref={tableRef}
        className="w-full sm:w-[400px] md:w-[450px] xl:w-[650px] border border-(--color-border)"
        role="table"
        aria-label="Tabla de nombres más comunes por colegio"
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
              Nombre
            </th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(commonNameBySchool[0].public_data) &&
            commonNameBySchool[0].public_data.map((stat, index) => (
              <tr key={stat.school} className={index % 2 === 0 ? 'bg-(--color-table)' : ''}>
                <td className="p-2 text-center text-sm">{index + 1}</td>
                <td className="p-2 text-sm">{stat.school}</td>
                <td className="p-2 text-sm">{stat.name}</td>
              </tr>
            ))}
          {isLoading && <LoadingTable rows={3} />}
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
