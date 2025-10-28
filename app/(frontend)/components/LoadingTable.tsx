export function LoadingTable({ rows }: { rows: number }) {
  return (
    <>
      {Array.from({ length: 20 }, (_, index) => (
        <tr
          key={`loading-${index}`}
          className={index % 2 === 0 ? 'bg-[#f9f9f9] dark:bg-[#1e2b44]' : ''}
        >
          {Array.from({ length: rows }, (_, cellIndex) => (
            <td key={`loading-cell-${cellIndex}`} className="p-2 text-sm">
              <div className="animate-pulse bg-[#d9e2f5] dark:bg-[#2c3e66] h-4 rounded w-full"></div>
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}
