import { Skeleton } from '../../../../../components/ui';

/** Placeholder rows with the same layout as a table row, shown while the next page loads. */
export function DataTableSkeleton({ rows }: { rows: number }) {
  return (
    <>
      {Array.from({ length: rows }, (_, index) => (
        <tr key={index} aria-hidden="true">
          <td className="border-b border-border px-3 py-2">
            <Skeleton className="h-3.5 w-2/3" />
          </td>
          <td className="border-b border-border px-3 py-2">
            <Skeleton className="h-3.5 w-1/3" />
          </td>
          <td className="border-b border-border px-3 py-2">
            <Skeleton className="ml-auto h-3.5 w-7" />
          </td>
        </tr>
      ))}
    </>
  );
}
