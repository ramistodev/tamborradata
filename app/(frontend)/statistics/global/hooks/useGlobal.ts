/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { fetchStatistics } from '../../logic/fetchStatistics';
import { GlobalStats } from '../types/types';
import { useGlobalContext } from '../context/useGlobalContext';

export function useGlobal() {
  const { setStatistics } = useGlobalContext();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchStatistics<GlobalStats>('global')
      .then((stats) => {
        setStatistics(stats);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return {
    isLoading,
  };
}
