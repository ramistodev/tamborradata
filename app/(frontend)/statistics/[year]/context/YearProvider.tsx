import { ReactElement, useState } from 'react';
import { YearContext } from './YearContext';
import { GlobalStats } from '../types/types';

export function YearProvider({ children }: { children: ReactElement }) {
  const [statistics, setStatistics] = useState<GlobalStats | null>(null);

  return (
    <YearContext.Provider
      value={{
        statistics,
        setStatistics,
      }}
    >
      {children}
    </YearContext.Provider>
  );
}
