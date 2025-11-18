import { useNewSchools } from '../hooks/useNewSchools';

export function NewSchoolsTable({ stats }: ReturnType<typeof useNewSchools>) {
  return (
    <>
      <table
        className="w-full sm:w-[400px] md:w-[450px] xl:w-[650px] border border-(--color-border)"
        role="table"
        aria-label="Tabla de colegios nuevos del año"
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
              Colegios
            </th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(stats[0].public_data) &&
            stats[0].public_data.map((stat, index) => (
              <tr key={stat.school} className={index % 2 === 0 ? 'bg-(--color-table)' : ''}>
                <td className="p-2 text-sm text-center">{index + 1}</td>
                <td className="p-2 text-sm">{stat.school}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </>
  );
}
