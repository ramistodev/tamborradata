import { useYears } from '../../../hooks/useYears';

export function useNewSchools() {
  const { stats } = useYears();
  const newSchoolsStats = stats?.newSchoolsByYear || [];

  return {
    newSchoolsStats,
  };
}
