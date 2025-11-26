import { ChevronDown, ChevronUp } from '@/app/(frontend)/icons/icons';
import { LoadingTable } from '@/app/(frontend)/statistics/components/loaders/LoadingTable';
import { useSchoolsEvolution } from '../hooks/useSchoolsEvolution';

export function SchoolsEvolutionTable({
  stats,
  hasMore,
  loading,
  tableRef,
  tableYears,
  showMore,
  showLess,
  showChart,
}: ReturnType<typeof useSchoolsEvolution>) {
  return (
    <>
      <div className="w-full overflow-x-auto hide-scrollbar">
        <table
          ref={tableRef}
          className="w-[650px] xl:w-[720px] border border-(--color-border)"
          role="table"
          aria-label="Tabla de evolución de colegios por año"
        >
          <thead>
            <tr>
              <th
                className="w-12 text-sm border-b border-(--color-border) text-center p-2 sm:text-md"
                scope="col"
              >
                #
              </th>
              <th
                className="w-49 text-sm border-b border-(--color-border) text-left p-2"
                scope="col"
              >
                Colegio
              </th>
              {tableYears.map((year) => (
                <th
                  key={year}
                  className="text-sm border-b border-(--color-border) text-left p-2"
                  scope="col"
                >
                  {year}
                </th>
              ))}
              <th className="text-sm border-b border-(--color-border) text-left p-2" scope="col">
                Total
              </th>
              <th
                className="text-sm border-b border-(--color-border) text-left p-2 xl:table-cell hidden"
                scope="col"
              >
                Ver graficas
              </th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(stats[0].public_data) &&
              stats[0].public_data.map((stat, index) => (
                <tr key={stat.school} className={index % 2 === 0 ? 'bg-(--color-table)' : ''}>
                  <td className="p-2 text-center text-sm">{index + 1}</td>
                  <td className="p-2 text-sm">{stat.school}</td>
                  {tableYears.map((y) => {
                    const found = stat.years.find((yearData) => yearData.year === y);
                    return (
                      <td key={y} className="p-2 text-sm">
                        {found ? found.count : 0}
                      </td>
                    );
                  })}
                  <td className="p-2 text-sm">{stat.total}</td>
                  <td className="p-2 text-sm text-center hidden xl:table-cell">
                    <button
                      onClick={() => showChart(stat)}
                      className="w-[90px] p-1 rounded bg-(--color-primary) cursor-pointer hover:opacity-80"
                      aria-label={`Ver gráfica de ${stat.school}`}
                    >
                      Ver grafica
                    </button>
                  </td>
                </tr>
              ))}
            {loading && <LoadingTable rows={11} />}
          </tbody>
        </table>
      </div>
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
