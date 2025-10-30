/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { fetchStatistics } from '../../logic/fetchStatistics';
import { GlobalStats } from '../types/types';
import { useYearContext } from '../context/useYearContext';
import { useParams } from 'next/navigation';

export function useYear() {
  const { setStatistics } = useYearContext();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { year } = useParams();

  useEffect(() => {
    if (!year || isNaN(Number(year))) {
      setStatistics(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    fetchStatistics<GlobalStats>(year.toString())
      .then((stats) => {
        if (!stats) {
          setStatistics(null);
        } else {
          setStatistics(stats);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return { year, isLoading };
}
