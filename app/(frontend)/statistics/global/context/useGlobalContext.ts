import { useContext } from 'react';
import { GlobalContext } from './GlobalContext';

export function useGlobalContext() {
  const context = useContext(GlobalContext);

  if (!context) {
    throw new Error('useGlobalContext must be used within a GlobalProvider');
  }

  return context;
}
