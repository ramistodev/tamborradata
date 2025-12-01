'use client';

import { ExclamationIcon } from '@/app/(frontend)/icons/icons';

export function ErrorPage() {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center gap-4">
      <ExclamationIcon />
      <h4 className="text-base text-balance md:text-xl font-bold text-center text-(--color-error)">
        Error al cargar las estadísticas
      </h4>
      <p className="text-sm text-balance text-center text-(--color-text-secondary)">
        Hubo un problema al cargar los datos. Por favor, intenta recargar la página o vuelve más
        tarde.
      </p>
    </div>
  );
}
