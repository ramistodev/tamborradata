import { ChevronDown, ChevronUp } from '@/app/(frontend)/icons/icons';
import { useNewNames } from '../hooks/useNewNames';
import { LoadingTable } from '@/app/(frontend)/statistics/components/loaders/LoadingTable';

export function NewNamesTable({
  newNamesStats,
  hasMore,
  isLoading,
  tableRef,
  showMore,
  showLess,
}: ReturnType<typeof useNewNames>) {
  return (
    <>
      <table
        ref={tableRef}
        className="w-full sm:w-[400px] md:w-[450px] xl:w-[650px] border border-(--color-border)"
        role="table"
        aria-label="Tabla de nombres nuevos del año"
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
              Nombre
            </th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(newNamesStats[0].public_data) &&
            newNamesStats[0].public_data.map((name, index) => (
              <tr key={name} className={index % 2 === 0 ? 'bg-(--color-table)' : ''}>
                <td className="p-2 text-center text-sm">{index + 1}</td>
                <td className="p-2 text-sm">{name}</td>
              </tr>
            ))}
          {isLoading && <LoadingTable rows={2} />}
        </tbody>
      </table>
      {hasMore ? (
        <button
          className="flex items-center justify-center gap-2 cursor-pointer my-1 text-(--color-text-secondary)"
          onClick={showMore}
          aria-label="Mostrar más nombres nuevos"
        >
          <ChevronDown /> mostrar más
        </button>
      ) : (
        <button
          className="flex items-center justify-center gap-2 cursor-pointer my-1 text-(--color-text-secondary)"
          onClick={showLess}
          aria-label="Mostrar menos nombres nuevos"
        >
          <ChevronUp /> mostrar menos
        </button>
      )}
    </>
  );
}
