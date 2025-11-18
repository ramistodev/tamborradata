export function LoadingChart({ absolute = false }: { absolute?: boolean }) {
  if (absolute) {
    return (
      <div className="fixed inset-0 z-999 flex items-center justify-center p-4 backdrop-blur-sm bg-[#00000040] bg-opacity-50">
        <div className="relative w-[800px] h-[400px] bg-white rounded-2xl px-3 py-10 select-none">
          <div className="w-full h-full flex flex-col gap-4">
            {/* Título del gráfico skeleton */}
            <div className="flex items-center justify-between">
              <div className="w-32 h-5 bg-(--color-loading) animate-pulse rounded"></div>
              <div className="w-24 h-5 bg-(--color-loading) animate-pulse rounded"></div>
            </div>

            {/* Área del gráfico - barras verticales simuladas */}
            <div className="flex-1 flex items-end justify-around gap-2 px-4">
              {Array.from({ length: 8 }, (_, index) => {
                const heights = [60, 80, 45, 90, 70, 55, 85, 65];
                return (
                  <div
                    key={`bar-${index}`}
                    className="flex-1 bg-(--color-loading) animate-pulse rounded-t"
                    style={{
                      height: `${heights[index]}%`,
                      animationDelay: `${index * 100}ms`,
                    }}
                  ></div>
                );
              })}
            </div>

            {/* Eje X skeleton */}
            <div className="flex justify-around gap-2 px-4">
              {Array.from({ length: 8 }, (_, index) => (
                <div
                  key={`label-${index}`}
                  className="flex-1 h-3 bg-(--color-loading) animate-pulse rounded"
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-60 md:h-80 lg:h-96 flex items-center justify-center bg-(--color-bg-secondary) rounded-lg border border-(--color-border)">
      <div className="w-full h-full p-6 flex flex-col gap-4">
        {/* Título del gráfico skeleton */}
        <div className="flex items-center justify-between">
          <div className="w-32 h-5 bg-(--color-loading) animate-pulse rounded"></div>
          <div className="w-24 h-5 bg-(--color-loading) animate-pulse rounded"></div>
        </div>

        {/* Área del gráfico - barras verticales simuladas */}
        <div className="flex-1 flex items-end justify-around gap-2 px-4">
          {Array.from({ length: 8 }, (_, index) => {
            // Alturas variadas para simular un gráfico realista
            const heights = [60, 80, 45, 90, 70, 55, 85, 65];
            return (
              <div
                key={`bar-${index}`}
                className="flex-1 bg-(--color-loading) animate-pulse rounded-t"
                style={{
                  height: `${heights[index]}%`,
                  animationDelay: `${index * 100}ms`,
                }}
              ></div>
            );
          })}
        </div>

        {/* Eje X skeleton */}
        <div className="flex justify-around gap-2 px-4">
          {Array.from({ length: 8 }, (_, index) => (
            <div
              key={`label-${index}`}
              className="flex-1 h-3 bg-(--color-loading) animate-pulse rounded"
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
}
