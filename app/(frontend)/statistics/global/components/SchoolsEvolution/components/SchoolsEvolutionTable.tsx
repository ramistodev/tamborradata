import { ArrowDown, ArrowUp } from '@/app/(frontend)/icons/icons';
import { LoadingTable } from '@/app/(frontend)/loaders/LoadingTable';
import { useSchoolsEvolution } from '../hooks/useSchoolsEvolution';

export function SchoolsEvolutionTable({
  stats,
  hasMore,
  loading,
  tableRef,
  years,
  showMore,
  showLess,
  showChart,
}: ReturnType<typeof useSchoolsEvolution>) {
  return (
    <>
      <div className="w-full overflow-x-auto hide-scrollbar">
        <table ref={tableRef} className="w-[650px] xl:w-[720px] border border-(--color-border)">
          <thead>
            <tr>
              <th className="w-12 text-sm border-b border-(--color-border) text-center p-2 sm:text-md">
                #
              </th>
              <th className="w-49 text-sm border-b border-(--color-border) text-left p-2">
                Colegio
              </th>
              {years.map((year) => (
                <th key={year} className="text-sm border-b border-(--color-border) text-left p-2">
                  {year}
                </th>
              ))}
              <th className="text-sm border-b border-(--color-border) text-left p-2">Total</th>
              <th className="text-sm border-b border-(--color-border) text-left p-2 xl:table-cell hidden">
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
                  {years.map((y) => {
                    const found = stat.years.find((yearData) => yearData.year === y);
                    return (
                      <td key={y} className="p-2 text-sm">
                        {found ? found.count : 0}
                      </td>
                    );
                  })}
                  <td className="p-2 text-sm">{stat.total}</td>
                  <td className="p-2 text-sm text-center hidden xl:table-cell">
                    <span
                      onClick={() => showChart(stat.years)}
                      className="w-[90px] p-1 rounded bg-(--color-primary) cursor-pointer hover:opacity-80"
                    >
                      Ver grafica
                    </span>
                  </td>
                </tr>
              ))}
            {loading && <LoadingTable rows={11} />}
          </tbody>
        </table>
      </div>
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
