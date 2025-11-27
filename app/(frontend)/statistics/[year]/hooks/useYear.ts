import { useEffect, useState } from 'react';
import { fetchStatistics } from '../../logic/fetchStatistics';
import { Statistics } from '../types/types';
import { useYearContext } from '../context/useYearContext';

export function useYear() {
  const { setStatistics, year } = useYearContext();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  useEffect(() => {
    if (!year || isNaN(Number(year))) {
      setStatistics(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    fetchStatistics<Statistics>(year.toString())
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
  }, [year, setStatistics]);

  return { year, isLoading, isUpdating };
}
