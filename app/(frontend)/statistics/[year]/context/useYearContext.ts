'use client';
import { useContext } from 'react';
import { YearContext } from './YearContext';

export function useYearContext() {
  const context = useContext(YearContext);

  if (!context) throw new Error('useYeaarContext must be used within a YearProvider');

  return context;
}
