import { useTotalParticipants } from '../hooks/useTotalParticipants';

export function TotalParticipantsTable({ tableData }: ReturnType<typeof useTotalParticipants>) {
  return (
    <>
      <table
        className="w-full sm:w-[400px] md:w-[450px] xl:w-[650px] border border-(--color-border)"
        role="table"
        aria-label="Tabla de participantes totales por año"
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
              Año
            </th>
            <th className="text-sm border-b border-(--color-border) text-left p-2" scope="col">
              Participantes
            </th>
          </tr>
        </thead>
        <tbody>
          {tableData &&
            tableData.map((stat, index) => (
              <tr key={stat.year} className={index % 2 === 0 ? 'bg-(--color-table)' : ''}>
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
