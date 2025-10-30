import { useTotalParticipants } from '../hooks/useTotalParticipants';

export function TotalParticipantsTable({
  stats,
  tableRef,
}: ReturnType<typeof useTotalParticipants>) {
  return (
    <>
      <table
        ref={tableRef}
        className="w-full sm:w-[400px] md:w-[450px] xl:w-[650px] border border-(--color-border)"
      >
        <thead>
          <tr>
            <th className="text-sm border-b border-(--color-border) text-center p-2 sm:text-md">
              #
            </th>
            <th className="text-sm border-b border-(--color-border) text-left p-2">Año</th>
            <th className="text-sm border-b border-(--color-border) text-left p-2">
              Participantes
            </th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(stats[0].public_data) &&
            stats[0].public_data.map((stat, index) => (
              <tr
                key={stat.year}
                className={index % 2 === 0 ? 'bg-[#f9f9f9] dark:bg-[#1e2b44]' : ''}
              >
                <td className="p-2 text-center text-sm">{index + 1}</td>
                <td className="p-2 text-sm">{stat.year}</td>
                <td className="p-2 text-sm">{stat.count}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </>
  );
}
