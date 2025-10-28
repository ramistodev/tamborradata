import { ArrowDown, ArrowUp } from '@/app/(frontend)/icons/icons';
import { useTopNames } from '../hooks/useTopNames';
import { LoadingTable } from '@/app/(frontend)/components/LoadingTable';
import { TopName } from '../../../types/types';

export function TopNamesTable({ data }: { data: TopName[] }) {
  const { stats, hasMore, loading, tableRef, showMore, showLess } = useTopNames(data);

  if (!stats || stats.length === 0 || !Array.isArray(stats[0].public_data)) {
    return null;
  }

  return (
    <>
      <table
        ref={tableRef}
        className="w-full sm:w-[400px] md:w-[450px] xl:w-[650px] border border-[#bebebe] dark:border-[#2c3e66]"
      >
        <thead>
          <tr>
            <th className="text-sm border-b border-[#bebebe] dark:border-[#2c3e66] text-center p-2 sm:text-md">
              #
            </th>
            <th className="text-sm border-b border-[#bebebe] dark:border-[#2c3e66] text-left p-2">
              Nombre
            </th>
            <th className="text-sm border-b border-[#bebebe] dark:border-[#2c3e66] text-left p-2">
              Apariciones
            </th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(stats[0].public_data) &&
            stats[0].public_data.map((stat, index) => (
              <tr
                key={stat.name}
                className={index % 2 === 0 ? 'bg-[#f9f9f9] dark:bg-[#1e2b44]' : ''}
              >
                <td className="p-2 text-center text-sm">{index + 1}</td>
                <td className="p-2 text-sm">{stat.name}</td>
                <td className="p-2 text-sm">{stat.count}</td>
              </tr>
            ))}
          {loading && <LoadingTable rows={3} />}
        </tbody>
      </table>
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
