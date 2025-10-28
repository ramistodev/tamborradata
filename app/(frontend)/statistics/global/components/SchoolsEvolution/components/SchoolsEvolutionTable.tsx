import { ArrowDown, ArrowUp } from '@/app/(frontend)/icons/icons';
import { LoadingTable } from '@/app/(frontend)/components/LoadingTable';
import { useSchoolsEvolution } from '../hooks/useSchoolsEvolution';
import { SchoolEvolution, Year } from '../../../types/types';

export function SchoolsEvolutionTable({
  data,
  showChart,
}: {
  data: SchoolEvolution[];
  showChart: (data: Year[]) => void;
}) {
  const { stats, hasMore, loading, tableRef, years, showMore, showLess } =
    useSchoolsEvolution(data);

  if (!stats || stats.length === 0 || !Array.isArray(stats[0].public_data)) {
    return null;
  }

  return (
    <>
      <div className="w-full overflow-x-auto hide-scrollbar">
        <table
          ref={tableRef}
          className="w-[650px] xl:w-[720px] border border-[#bebebe] dark:border-[#2c3e66]"
        >
          <thead>
            <tr>
              <th className="text-sm border-b border-[#bebebe] dark:border-[#2c3e66] text-center p-2 sm:text-md">
                #
              </th>
              <th className="text-sm border-b border-[#bebebe] dark:border-[#2c3e66] text-left p-2">
                Colegio
              </th>
              {years.map((year) => (
                <th
                  key={year}
                  className="text-sm border-b border-[#bebebe] dark:border-[#2c3e66] text-left p-2"
                >
                  {year}
                </th>
              ))}
              <th className="text-sm border-b border-[#bebebe] dark:border-[#2c3e66] text-left p-2">
                Total
              </th>
              <th className="text-sm border-b border-[#bebebe] dark:border-[#2c3e66] text-left p-2 xl:block hidden">
                Ver graficas
              </th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(stats[0].public_data) &&
              stats[0].public_data.map((stat, index) => (
                <tr
                  key={stat.school}
                  className={index % 2 === 0 ? 'bg-[#f9f9f9] dark:bg-[#1e2b44]' : ''}
                >
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
                  <td className="p-2 text-sm text-center hidden xl:block">
                    <span
                      onClick={() => showChart(stat.years)}
                      className="w-[90px] p-1 rounded bg-[#2c3e66] dark:bg-[#d9e2f5] text-white dark:text-black cursor-pointer hover:opacity-80"
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
          className="flex items-center justify-center gap-2 cursor-pointer my-1 text-[#4f4f4f] dark:text-[#b1b1b1]"
          onClick={showMore}
        >
          <ArrowDown /> mostrar más
        </span>
      ) : (
        <span
          className="flex items-center justify-center gap-2 cursor-pointer my-1 text-[#4f4f4f] dark:text-[#b1b1b1]"
          onClick={showLess}
        >
          <ArrowUp /> mostrar menos
        </span>
      )}
    </>
  );
}
