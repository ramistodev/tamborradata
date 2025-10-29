import { GlobalStats } from '../types/types';
import { GlobalContext } from './GlobalContext';
import { useState } from 'react';

export function GlobalProvider({ children }: { children: React.ReactNode }) {
  const [statistics, setStatistics] = useState<GlobalStats | null>(null);
  // const [isLoading, setIsLoading] = useState<boolean>(true);

  return (
    <GlobalContext.Provider value={{ statistics, setStatistics }}>
      {children}
    </GlobalContext.Provider>
  );
}
