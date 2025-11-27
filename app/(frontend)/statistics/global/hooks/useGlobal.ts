import { useEffect, useState } from 'react';
import { fetchStatistics } from '../../logic/fetchStatistics';
import { Statistics } from '../types/types';
import { useGlobalContext } from '../context/useGlobalContext';

export function useGlobal() {
  const { setStatistics } = useGlobalContext();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  useEffect(() => {
    setIsLoading(true);

    fetchStatistics<Statistics>('global')
      .then((stats) => {
        setIsUpdating(stats.isUpdating);

        if (!stats.statistics) {
          setStatistics(null);
        } else {
          setStatistics(stats.statistics);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return {
    isLoading,
    isUpdating,
  };
}
