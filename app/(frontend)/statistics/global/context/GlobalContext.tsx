'use client';
import { createContext } from 'react';
import { GlobalStats } from '../types/types';

export interface GlobalContext {
  statistics: GlobalStats | null;
  setStatistics: React.Dispatch<React.SetStateAction<GlobalStats | null>>;
}

export const GlobalContext = createContext<GlobalContext | null>(null);
