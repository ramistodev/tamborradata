export function ResultsPlaceholder() {
  return (
    <div className="h-full flex flex-col justify-between gap-6">
      <div className="flex flex-col gap-5 items-center">
        {/* DESCRIPTION */}
        <p className="text-center text-(--color-text-secondary) text-balance max-w-md">
          Introduce tu nombre y selecciona tu colegio para ver tu historial completo de
          participación en la Tamborrada Infantil.
        </p>

        {/* STATS */}
        <div className="w-full max-w-sm bg-(--color-bg-secondary) rounded-lg px-4 py-3 border border-(--color-border)">
          <ul className="text-sm text-(--color-text-secondary) flex flex-col gap-1">
            <li className="flex items-start gap-2">
              <span className="text-(--eye-catching-text) font-bold">•</span>
              <span>
                Más de <span className="font-semibold text-(--color-text)">40 colegios</span>
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-(--eye-catching-text) font-bold">•</span>
              <span>
                Datos desde <span className="font-semibold text-(--color-text)">2018</span>
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-(--eye-catching-text) font-bold">•</span>
              <span>
                Información actualizada{' '}
                <span className="font-semibold text-(--color-text)">cada año</span>
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-(--eye-catching-text) font-bold">•</span>
              <span>Búsqueda rápida por nombre y colegio</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Footer */}
      <p className="text-center text-(--color-text-tertiary) text-sm italic block sm:hidden md:block">
        Tu nombre también forma parte de las estadísticas.
      </p>
    </div>
  );
}
