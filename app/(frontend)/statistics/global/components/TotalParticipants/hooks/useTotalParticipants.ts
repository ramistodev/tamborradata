import { useState } from 'react';
import { useGlobalContext } from '../../../context/useGlobalContext';

export function useTotalParticipants() {
  const { statistics } = useGlobalContext();
  const stats = statistics?.totalParticipants || [];
  const [chart, setChart] = useState(false);

  function showChart() {
    setChart((prev) => !prev);
  }

  return {
    stats,
    chart,
    showChart,
  };
}
