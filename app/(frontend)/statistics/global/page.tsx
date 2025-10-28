'use client';
import { MostConstantsSchools } from './components/MostConstantsSchools/MostConstantsSchools';
import { SchoolsEvolution } from './components/SchoolsEvolution/SchoolsEvolution';
import { TopNames } from './components/TopNames/TopNames';
import { TopSchools } from './components/TopSchools/TopSchools';
import { TopSurnames } from './components/TopSurnames/TopSurnames';
import { useGlobal } from './hooks/useGlobal';
import { GlobalStats } from './types/types';

export default function GlobalPage() {
  const { stats, isLoading }: { stats: GlobalStats | null; isLoading: boolean } = useGlobal();

  if (isLoading) {
    return (
      <main className="flex items-center justify-center w-full h-full">
        <h1>Tamborrada Web</h1>
        <p>Loading...</p>
      </main>
    );
  }

  if (!stats) {
    return (
      <main className="flex items-center justify-center w-full h-full">
        <h1>Tamborrada Web</h1>
        <p>No statistics available</p>
      </main>
    );
  }

  return (
    <main className="w-full max-w-6xl flex flex-col items-start justify-start gap-6 p-4 sm:px-15 md:px-30 rounded-2xl border border-[#bebebe] dark:border-[#2c3e66]">
      <h1 className="text-3xl font-bold">Tamborrada Web — Estadísticas Globales</h1>
      <p>
        Este es un resumen de las estadisticas globales de la Tamborrada, contiene toda los datos de
        todos los años.
      </p>
      <TopNames data={stats.topNames} />
      <TopSurnames data={stats.topSurnames} />
      <TopSchools data={stats.topSchools} />
      <MostConstantsSchools data={stats.mostConstantSchools} />
      <SchoolsEvolution data={stats.schoolsEvolution} />
    </main>
  );
}
