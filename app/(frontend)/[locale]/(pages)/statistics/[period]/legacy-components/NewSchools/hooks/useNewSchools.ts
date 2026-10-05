import { useYears } from '../../../legacy-hooks/useYears';

export function useNewSchools() {
  const { stats } = useYears();
  const newSchoolsStats = stats?.newSchoolsByYear || [];

  return {
    newSchoolsStats,
  };
}
