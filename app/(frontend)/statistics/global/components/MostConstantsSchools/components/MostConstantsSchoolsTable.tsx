import { ArrowDown, ArrowUp } from '@/app/(frontend)/icons/icons';
import { useMostConstantsSchools } from '../hooks/useMostConstantsSchools';
import { LoadingTable } from '@/app/(frontend)/loaders/LoadingTable';

export function MostConstantSchoolTable({
  stats,
  loading,
  hasMore,
  tableRef,
  showMore,
  showLess,
}: ReturnType<typeof useMostConstantsSchools>) {
  if (!stats || stats.length === 0 || !Array.isArray(stats[0].public_data)) {
    return null;
  }

  return (
    <>
      <table
        ref={tableRef}
        className="w-full sm:w-[400px] md:w-[450px] xl:w-[650px] border border-(--color-border)"
        role="table"
        aria-label="Tabla de colegios más constantes"
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
              Años Activos
            </th>
            <th className="text-sm border-b border-(--color-border) text-left p-2" scope="col">
              Total
            </th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(stats[0].public_data) &&
            stats[0].public_data.map((stat, index) => (
              <tr key={stat.school} className={index % 2 === 0 ? 'bg-(--color-table)' : ''}>
                <td className="p-2 text-center text-sm">{index + 1}</td>
                <td className="p-2 text-sm">{stat.school}</td>
                <td className="p-2 text-sm">
                  {stat.yearsActive.map((year) => year.year).join(', ')}
                </td>
                <td className="p-2 text-sm">{stat.yearsActive.map((year) => year.year).length}</td>
              </tr>
            ))}
          {loading && <LoadingTable rows={4} />}
        </tbody>
      </table>
      {hasMore ? (
        <button
          className="flex items-center justify-center gap-2 cursor-pointer my-1 text-(--color-text-secondary)"
          onClick={showMore}
          aria-label="Mostrar más colegios constantes"
        >
          <ArrowDown /> mostrar más
        </button>
      ) : (
        <button
          className="flex items-center justify-center gap-2 cursor-pointer my-1 text-(--color-text-secondary)"
          onClick={showLess}
          aria-label="Mostrar menos colegios constantes"
        >
          <ArrowUp /> mostrar menos
        </button>
      )}
    </>
  );
}
