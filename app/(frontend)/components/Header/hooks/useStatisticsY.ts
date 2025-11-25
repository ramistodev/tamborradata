import { useEffect, useState } from 'react';
import { fetchYears } from '@/app/(frontend)/services/fetchYears';

export function useStatisticsY() {
  const [years, setYears] = useState<number[]>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setIsLoading(true);
    fetchYears()
      .then((fetchedYears) => {
        const yearsNumbers = fetchedYears.filter((y) => y !== 'global').map((year) => Number(year));
        setYears(yearsNumbers);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return {
    years,
    isLoading,
  };
}
