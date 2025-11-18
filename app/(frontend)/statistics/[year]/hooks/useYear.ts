import { useEffect, useState } from 'react';
import { fetchStatistics } from '../../logic/fetchStatistics';
import { GlobalStats } from '../types/types';
import { useYearContext } from '../context/useYearContext';
import { fetchSysStatus } from '@/app/(frontend)/services/fetchSysStatus';

export function useYear() {
  const { setStatistics, year } = useYearContext();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const isDev = process.env.NODE_ENV === 'development';

  useEffect(() => {
    if (!year || isNaN(Number(year))) {
      setStatistics(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const month = new Date().getMonth();
    const day = new Date().getDate();

    const loadData = () => {
      fetchStatistics<GlobalStats>(year.toString())
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
  }, [year, setStatistics]);

  return { year, isLoading, isUpdating };
}
