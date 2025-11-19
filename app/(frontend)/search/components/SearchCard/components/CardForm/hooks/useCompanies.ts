import { fetchCompanies } from '@/app/(frontend)/search/logic/fetchCompanies';
import { useEffect, useState } from 'react';

export function useCompanies() {
  const [companies, setCompanies] = useState<string[]>([]);

  useEffect(() => {
    async function fetchData() {
      const fetchedCompanies = await fetchCompanies();
      if (fetchedCompanies) {
        setCompanies(fetchedCompanies);
      }
    }

    fetchData();
  }, []);

  return {
    companies,
  };
}
