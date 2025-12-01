'use client';

import { ExclamationIcon } from '@/app/(frontend)/icons/icons';

export function UpdatingPage() {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center gap-4">
      <ExclamationIcon />
      <h4 className="text-base text-balance md:text-xl font-bold text-center">
        La página se está actualizando...
      </h4>
      <p className="text-sm text-balance text-center text-(--color-text-secondary)">
        Visita la página dentro de un rato para ver las estadísticas actualizadas.
      </p>
    </div>
  );
}
