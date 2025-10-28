'use client';
import { useParams } from 'next/navigation';

export default function YearPage() {
  const { year } = useParams();

  return (
    <main className="flex flex-col items-center justify-center w-full h-full">
      <h1>Estadísticas de {year}</h1>
    </main>
  );
}
