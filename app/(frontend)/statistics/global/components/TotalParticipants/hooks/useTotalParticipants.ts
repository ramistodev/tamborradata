import { useRef, useState } from 'react';
import { useGlobalContext } from '../../../context/useGlobalContext';

export function useTotalParticipants() {
  const { statistics } = useGlobalContext();
  const stats = statistics?.totalParticipants || [];
  const [chart, setChart] = useState(false);
  const tableRef = useRef<HTMLTableElement | null>(null);

  function showChart() {
    setChart((prev) => !prev);
  }

  return {
    stats,
    tableRef,
    chart,
    showChart,
  };
}
