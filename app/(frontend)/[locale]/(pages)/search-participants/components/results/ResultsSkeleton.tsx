import { Skeleton } from '../../../../components/ui';

const ROWS = 3;

/** Purely visual: the "searching" message comes from the live region (`SearchAnnouncer`). */
export function ResultsSkeleton() {
  return (
    <div aria-busy="true" className="flex flex-col gap-4">
      <Skeleton className="h-4 w-2/3" />
      <div className="flex max-w-md flex-col gap-4 rounded-2xl border border-border bg-card p-5">
        <Skeleton className="h-3 w-28" />
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="flex flex-col gap-3 pt-2">
          {Array.from({ length: ROWS }, (_, index) => (
            <Skeleton key={index} className="h-5 w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}
