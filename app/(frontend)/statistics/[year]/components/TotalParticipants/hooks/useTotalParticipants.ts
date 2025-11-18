import { useYearContext } from '../../../context/useYearContext';

export function useTotalParticipants() {
  const { statistics } = useYearContext();
  const stats = statistics?.totalParticipantsByYear || [];

  return {
    stats,
  };
}
