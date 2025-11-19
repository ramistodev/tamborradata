'use client';
import { createContext } from 'react';
import { Participants } from '../types/types';

export interface SearchContextType {
  participants: Participants[] | null;
  setParticipants: React.Dispatch<React.SetStateAction<Participants[] | null>>;
  alert: string | null;
  setAlert: React.Dispatch<React.SetStateAction<string | null>>;
}

export const SearchContext = createContext<SearchContextType | null>(null);
