export function CompaniesLoading() {
  return (
    <div className="flex flex-wrap pb-5 max-h-96 overflow-x-auto hide-scrollbar">
      {Array.from({ length: 20 }, (_, index) => (
        <div
          key={`loading-${index}`}
          className="w-full lg:w-1/2 text-sm text-left px-3 py-2 border-b border-(--color-border)"
        >
          <div className="h-4 bg-(--color-loading) animate-pulse rounded w-3/4"></div>
        </div>
      ))}
    </div>
  );
}
