import { useParams } from 'next/navigation';

export function usePeriod() {
  const { period }: { period: string } = useParams();

  return {
    period,
  };
}
