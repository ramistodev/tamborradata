'use client';
import { NotFound } from '../../404';
import { useYearContext } from './context/useYearContext';
import { YearProvider } from './context/YearProvider';
import { useYear } from './hook/useYear';

export default function YearPage() {
  return (
    <YearProvider>
      <YearPageContent />
    </YearProvider>
  );
}

function YearPageContent() {
  const { statistics } = useYearContext();
  const { year, isLoading } = useYear();

  if (!statistics || !isLoading) {
    return <NotFound />;
  }

  return (
    <main className="flex flex-col items-center justify-center w-full h-full">
      <h1>Estadísticas de {year}</h1>
    </main>
  );
}
