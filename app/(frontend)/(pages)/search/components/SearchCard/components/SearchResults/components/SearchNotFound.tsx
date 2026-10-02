export function SearchNotFound() {
  return (
    <div className="flex flex-col items-center gap-4 p-6 bg-(--color-bg-secondary) rounded-lg border border-(--color-border)">
      <div className="flex flex-col gap-2 text-center">
        <h3 className="text-lg font-semibold text-(--color-text)">No se encontraron resultados</h3>
        <p className="text-sm text-balance max-w-md">
          No hay registros que coincidan con el nombre y compañía proporcionados. Verifica que los
          datos sean correctos o intenta con otra búsqueda.
        </p>
      </div>
      <div className="flex flex-col gap-1 text-xs text-(--color-text-secondary) text-center mt-2">
        <p>Asegúrate de escribir el nombre completo</p>
        <p>Verifica que la compañía sea la correcta</p>
      </div>
    </div>
  );
}
