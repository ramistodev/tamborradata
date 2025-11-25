import { useMemo, useState } from 'react';
import { useGlobalContext } from '../../../context/useGlobalContext';
import { TotalParticipantData } from '../../../types/types';

export function useTotalParticipants() {
  const { statistics } = useGlobalContext();
  const stats = statistics?.totalParticipants || [];
  const [chart, setChart] = useState(false);

  function showChart() {
    setChart((prev) => !prev);
  }

  const tableData: TotalParticipantData[] = useMemo(() => {
    return Array.from(stats[0].public_data).sort((a, b) => b.year - a.year);
  }, [stats]);

  return {
    stats,
    chart,
    showChart,
    tableData,
  };
}
