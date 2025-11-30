import { useCompaniesQuery } from '../../hooks/query/useCompaniesQuery';

export function useCompanies() {
  const { data: companies, isLoading, isFetching, isError, error } = useCompaniesQuery();

  return { companies, isLoading, isFetching, isError, error };
}
