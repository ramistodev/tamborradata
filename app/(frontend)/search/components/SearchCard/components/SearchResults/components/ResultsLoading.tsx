export function ResultsLoading() {
  return (
    <div className="flex flex-col gap-4">
      {/* HEADER */}
      <div className="grid grid-cols-[3fr_4fr_1fr] gap-4 px-4 py-2 bg-(--color-bg-secondary) rounded-lg border border-(--color-border)">
        <p className="font-semibold text-sm text-(--color-text-secondary) cursor-default">Nombre</p>
        <p className="font-semibold text-sm text-(--color-text-secondary) cursor-default">
          Compañía
        </p>
        <p className="font-semibold text-sm text-(--color-text-secondary) text-right cursor-default">
          Año
        </p>
      </div>

      {/* LOADING SKELETON ROWS */}
      <div className="flex flex-col gap-2">
        {Array.from({ length: 3 }, (_, index) => (
          <div
            key={`loading-${index}`}
            className="grid grid-cols-[3fr_4fr_1fr] items-center gap-4 px-4 py-3 bg-(--color-bg-secondary) rounded-lg border border-(--color-border)"
          >
            <div className="h-4 bg-(--color-loading) animate-pulse rounded"></div>
            <div className="h-4 bg-(--color-loading) animate-pulse rounded"></div>
            <div className="h-4 bg-(--color-loading) animate-pulse rounded ml-auto w-12"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
