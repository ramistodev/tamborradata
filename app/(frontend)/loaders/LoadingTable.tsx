export function LoadingTable({ rows }: { rows: number }) {
  return (
    <>
      {Array.from({ length: 20 }, (_, index) => (
        <tr key={`loading-${index}`} className={index % 2 === 0 ? 'bg-(--color-table)' : ''}>
          {Array.from({ length: rows }, (_, cellIndex) => (
            <td key={`loading-cell-${cellIndex}`} className="p-2 text-sm">
              <div className="animate-pulse bg-(--color-loading) h-4 rounded w-full"></div>
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}
