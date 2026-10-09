import { Skeleton } from '../../../../../components/ui';

/** Placeholder rows with the same layout as a ranking row, shown while the next page loads. */
export function RankSkeleton({ rows }: { rows: number }) {
  return (
    <>
      {Array.from({ length: rows }, (_, index) => (
        <li
          key={index}
          aria-hidden="true"
          className="flex items-center justify-between gap-3 sm:gap-4 rounded-md px-1.5 py-1.5"
        >
          <Skeleton className="h-3 w-4 shrink-0" />
          <div className="flex-1">
            <Skeleton className="h-3.5 w-1/3" />
            <Skeleton className="mt-1.25 h-1 w-full rounded-full" />
          </div>
          <Skeleton className="h-3 w-7 shrink-0" />
        </li>
      ))}
    </>
  );
}
