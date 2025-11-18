'use client';
import { useState } from 'react';
import { YearContext } from './YearContext';
import { GlobalStats } from '../types/types';

export function YearProvider({ children, year }: { children: React.ReactNode; year: string }) {
  const [statistics, setStatistics] = useState<GlobalStats | null>(null);

  return (
    <YearContext.Provider
      value={{
        statistics,
        setStatistics,
        year,
      }}
    >
      {children}
    </YearContext.Provider>
  );
}
