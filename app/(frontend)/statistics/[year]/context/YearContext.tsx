import { createContext } from 'react';
import { GlobalStats } from '../types/types';

export interface YearContextType {
  statistics: GlobalStats | null;
  setStatistics: React.Dispatch<React.SetStateAction<GlobalStats | null>>;
}

export const YearContext = createContext<YearContextType | null>(null);
