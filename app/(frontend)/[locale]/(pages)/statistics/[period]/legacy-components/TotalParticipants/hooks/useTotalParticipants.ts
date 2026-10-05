import { useYears } from '../../../legacy-hooks/useYears';

export function useTotalParticipants() {
  const { stats } = useYears();
  const totalParticipantsStats = stats?.totalParticipantsByYear || [];

  return {
    totalParticipantsStats,
  };
}
