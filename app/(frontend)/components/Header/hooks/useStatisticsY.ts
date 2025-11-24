import { useEffect, useState } from 'react';
import { fetchYears } from '@/app/(frontend)/services/fetchYears';
import { usePathname } from 'next/navigation';

export function useStatisticsY() {
  const pathname = usePathname();
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
    pathname,
    isLoading,
  };
}
