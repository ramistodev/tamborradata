'use client';
import { createContext } from 'react';
import { GlobalStats } from '../types/types';

export interface YearContextType {
  statistics: GlobalStats | null;
  setStatistics: React.Dispatch<React.SetStateAction<GlobalStats | null>>;
  year: string;
}

export const YearContext = createContext<YearContextType | null>(null);
