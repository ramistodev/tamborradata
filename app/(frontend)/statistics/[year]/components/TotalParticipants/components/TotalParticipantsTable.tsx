import { useTotalParticipants } from '../hooks/useTotalParticipants';

export function TotalParticipantsTable({
  totalParticipantsStats,
}: ReturnType<typeof useTotalParticipants>) {
  return (
    <>
      <table
        className="w-full sm:w-[400px] md:w-[450px] xl:w-[650px] border border-(--color-border)"
        role="table"
        aria-label="Tabla de participantes totales del año"
      >
        <thead>
          <tr>
            <th
              className="w-18 text-sm border-b border-(--color-border) text-center p-2"
              scope="col"
            >
              Año
            </th>
            <th className="text-sm border-b border-(--color-border) text-left p-2" scope="col">
              Participantes
            </th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(totalParticipantsStats[0].public_data) &&
            totalParticipantsStats[0].public_data.map((stat, index) => (
              <tr key={stat.year} className={index % 2 === 0 ? 'bg-(--color-table)' : ''}>
                <td className="p-2 text-sm text-center">{stat.year}</td>
                <td className="p-2 text-sm">{stat.count}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </>
  );
}
