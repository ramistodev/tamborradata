import { useEffect, useState } from 'react';
import { fetchStatistics } from '../logic/fetchStatistics';
import { GlobalStats } from '../types/types';

export function useGlobal() {
  const [stats, setStats] = useState<GlobalStats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchStatistics('global').then((stats) => {
      setStats(stats);
      setIsLoading(false);
    });
  }, []);

  return {
    stats,
    isLoading,
  };
}
