'use client';
import { ErrorPage } from '../components/ErrorPage';
import { LoadingPage } from '../components/loaders/LoadingPage';
import { StatsWrapper } from '../components/StatsWrapper';
import { UpdatingPage } from '../components/UpdatingPage';
import { useGlobal } from './hooks/useGlobal';

export default function GlobalLayout({ children }: { children: React.ReactNode }) {
  const { isLoading, isError, isUpdating } = useGlobal();

  if (isUpdating) return <UpdatingPage />;

  if (isError) return <ErrorPage />;

  return <StatsWrapper>{isLoading ? <LoadingPage /> : children}</StatsWrapper>;
}
