import { fetchYears } from '@/app/(frontend)/services/fetchYears';
import { useInView } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

export function useExploreStatistics() {
  const [newData, setNewData] = useState(false);
  const [comingData, setComingData] = useState(false);
  const years = new Date().getFullYear() - 2018;
  const currentYear = new Date().getFullYear();
  const lastStatYear = useRef(currentYear);
  const isDev = process.env.NODE_ENV === 'development' ? true : false;

  // Refs para los elementos a observar
  const headerRef = useRef(null);
  const notificationsRef = useRef(null);
  const globalCardRef = useRef(null);
  const yearlyCardRef = useRef(null);
  const statsRef = useRef(null);

  // Detectar si están en vista los elementos para animaciones
  const isHeaderInView = useInView(headerRef, {
    once: true,
    amount: 1.0,
  });

  const isNotificationsInView = useInView(notificationsRef, {
    once: true,
    amount: 1.0,
  });

  const isGlobalCardInView = useInView(globalCardRef, {
    once: true,
    amount: 0.4,
  });

  const isYearlyCardInView = useInView(yearlyCardRef, {
    once: true,
    amount: 0.4,
  });

  const isStatsInView = useInView(statsRef, {
    once: true,
    amount: 0.8,
  });

  useEffect(() => {
    const dateNow = new Date();
    const month = dateNow.getMonth();
    const day = dateNow.getDate();

    // Comprobar si hay nuevos datos disponibles (o van a estarlo pronto)
    if (isDev || month === 0 || (month === 1 && day <= 20)) {
      fetchYears().then((fetchedYears) => {
        const yearsNumbers = fetchedYears.filter((y) => y !== 'global').map((year) => Number(year));
        if (yearsNumbers.includes(currentYear)) {
          setNewData(true);
          setComingData(false);
        } else if (isDev || month === 0) {
          setComingData(true);
          lastStatYear.current = currentYear - 1;
        }
      });
    }
  }, []);

  return {
    lastStatYear,
    currentYear,
    newData,
    comingData,
    years,
    isHeaderInView,
    isNotificationsInView,
    isGlobalCardInView,
    isYearlyCardInView,
    isStatsInView,
    headerRef,
    notificationsRef,
    globalCardRef,
    yearlyCardRef,
    statsRef,
  };
}
