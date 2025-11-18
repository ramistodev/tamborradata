import { useEffect, useState } from 'react';
import { fetchStatistics } from '../../logic/fetchStatistics';
import { GlobalStats } from '../types/types';
import { useGlobalContext } from '../context/useGlobalContext';
import { fetchSysStatus } from '@/app/(frontend)/services/fetchSysStatus';

export function useGlobal() {
  const { setStatistics } = useGlobalContext();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const isDev = process.env.NODE_ENV === 'development';

  useEffect(() => {
    setIsLoading(true);
    const month = new Date().getMonth();
    const day = new Date().getDate();

    const loadData = () => {
      fetchStatistics<GlobalStats>('global')
        .then((stats) => {
          if (!stats) {
            setStatistics(null);
          } else {
            setStatistics(stats);
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    };

    if (isDev || month === 0 || (month === 1 && day <= 20)) {
      // Primero verificar el sistema
      fetchSysStatus()
        .then((status) => {
          if (status && status.is_updating) {
            setIsUpdating(true);
            setIsLoading(false);
          } else {
            setIsUpdating(false);
            loadData();
          }
        })
        .catch(() => {
          // Error al verificar, asumir que no está actualizando
          setIsUpdating(false);
          loadData();
        });
    } else {
      // Fuera de fechas críticas, cargar directamente
      setIsUpdating(false);
      loadData();
    }
  }, []);

  return {
    isLoading,
    isUpdating,
  };
}
