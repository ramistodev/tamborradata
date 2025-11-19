'use client';
import { Participants } from '../types/types';
import { SearchContext } from './SearchContext';
import { useState } from 'react';

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [participants, setParticipants] = useState<Participants[] | null>(null);
  const [alert, setAlert] = useState<string | null>(null);
  // const [isLoading, setIsLoading] = useState<boolean>(true);

  return (
    <SearchContext.Provider value={{ participants, setParticipants, alert, setAlert }}>
      {children}
    </SearchContext.Provider>
  );
}
