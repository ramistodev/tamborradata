export function LoadingPage() {
  return (
    <>
      {/* Título skeleton */}
      <div className="w-full md:w-3/4 h-9 bg-(--color-loading) animate-pulse rounded"></div>

      {/* Párrafo intro skeleton */}
      <div className="w-full flex flex-col gap-2">
        <div className="w-full h-4 bg-(--color-loading) animate-pulse rounded"></div>
        <div className="w-5/6 h-4 bg-(--color-loading) animate-pulse rounded"></div>
        <div className="w-4/6 h-4 bg-(--color-loading) animate-pulse rounded"></div>
      </div>

      {/* Separador */}
      <span className="w-full border border-(--color-border)"></span>

      {/* Secciones de estadísticas (8-9 bloques) */}
      {Array.from({ length: 8 }, (_, index) => (
        <div key={`section-${index}`} className="w-full flex flex-col gap-4">
          {/* Título de sección */}
          <div className="flex items-center gap-3">
            <div className="w-48 h-7 bg-(--color-loading) animate-pulse rounded"></div>
            <div className="w-24 h-6 bg-(--color-loading) animate-pulse rounded"></div>
          </div>

          {/* Tabla/contenido skeleton */}
          <div className="w-full border border-(--color-border) rounded overflow-hidden">
            {/* Header de tabla */}
            <div className="flex gap-2 p-3 border-b border-(--color-border) bg-(--color-bg)">
              <div className="w-12 h-4 bg-(--color-loading) animate-pulse rounded"></div>
              <div className="w-32 h-4 bg-(--color-loading) animate-pulse rounded"></div>
              <div className="w-24 h-4 bg-(--color-loading) animate-pulse rounded"></div>
            </div>

            {/* Filas de tabla */}
            {Array.from({ length: 5 }, (_, rowIndex) => (
              <div
                key={`row-${rowIndex}`}
                className={`flex gap-2 p-3 border-b border-(--color-border) ${
                  rowIndex % 2 === 0 ? 'bg-[#f9f9f9] dark:bg-[#1e2b44]' : ''
                }`}
              >
                <div className="w-12 h-4 bg-(--color-loading) animate-pulse rounded"></div>
                <div className="w-32 h-4 bg-(--color-loading) animate-pulse rounded"></div>
                <div className="w-24 h-4 bg-(--color-loading) animate-pulse rounded"></div>
              </div>
            ))}
          </div>

          {/* Párrafo de resumen */}
          <div className="w-full flex flex-col gap-2">
            <div className="w-full h-4 bg-(--color-loading) animate-pulse rounded"></div>
            <div className="w-11/12 h-4 bg-(--color-loading) animate-pulse rounded"></div>
            <div className="w-5/6 h-4 bg-(--color-loading) animate-pulse rounded"></div>
          </div>
        </div>
      ))}

      {/* Separador final */}
      <span className="w-full border border-(--color-border)"></span>

      {/* Párrafo outro skeleton */}
      <div className="w-full flex flex-col gap-2">
        <div className="w-full h-4 bg-(--color-loading) animate-pulse rounded"></div>
        <div className="w-5/6 h-4 bg-(--color-loading) animate-pulse rounded"></div>
        <div className="w-3/4 h-4 bg-(--color-loading) animate-pulse rounded"></div>
      </div>
    </>
  );
}
