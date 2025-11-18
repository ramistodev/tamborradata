import { useYearContext } from '../../../context/useYearContext';

export function useNewSchools() {
  const { statistics } = useYearContext();
  const stats = statistics?.newSchoolsByYear || [];

  return {
    stats,
  };
}
