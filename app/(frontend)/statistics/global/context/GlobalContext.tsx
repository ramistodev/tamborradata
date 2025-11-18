'use client';
import { createContext } from 'react';
import { GlobalStats } from '../types/types';

export interface GlobalContextType {
  statistics: GlobalStats | null;
  setStatistics: React.Dispatch<React.SetStateAction<GlobalStats | null>>;
}

export const GlobalContext = createContext<GlobalContextType | null>(null);
