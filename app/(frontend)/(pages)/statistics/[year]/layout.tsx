'use client';
import { notFound } from 'next/navigation';
import { ErrorPage } from '../components/ErrorPage';
import { LoadingPage } from '../components/loaders/LoadingPage';
import { StatsWrapper } from '../components/StatsWrapper';
import { UpdatingPage } from '../components/UpdatingPage';
import { useYears } from './hooks/useYears';

export default function YearLayout({ children }: { children: React.ReactNode }) {
  const { isLoading, isError, error, isUpdating } = useYears();

  if (isUpdating) return <UpdatingPage />;

  if (isError) {
    const err = error as any;

    // 404 desde el backend -> Redirigir a la pagina 404 real de Next
    if (err?.status === 404) return notFound();

    // Cualquier otro error -> pagina de error general
    return <ErrorPage />;
  }

  return <StatsWrapper>{isLoading ? <LoadingPage /> : children}</StatsWrapper>;
}
