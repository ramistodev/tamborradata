import { useEffect, useState } from 'react';
import { fetchYears } from '../logic/fetchYears';

export function useHeader() {
  const [years, setYears] = useState<number[]>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setIsLoading(true);
    fetchYears()
      .then((fetchedYears) => {
        setYears(fetchedYears);
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
