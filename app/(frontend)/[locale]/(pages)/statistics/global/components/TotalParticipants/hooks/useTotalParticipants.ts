import { useMemo, useState } from 'react';
import { TotalParticipantData } from '../../../types/types';
import { useGlobal } from '../../../hooks/useGlobal';

export function useTotalParticipants() {
  const { stats } = useGlobal();
  const totalParticipants = stats?.totalParticipants || [];
  const [chart, setChart] = useState(false);

  function showChart() {
    setChart((prev) => !prev);
  }

  const tableData: TotalParticipantData[] = useMemo(() => {
    return Array.from(totalParticipants?.[0]?.public_data).sort((a, b) => b.year - a.year);
  }, [totalParticipants]);

  return {
    totalParticipants,
    chart,
    showChart,
    tableData,
  };
}
