import { useInView } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

export function useExploreStatistics() {
  const [newData, setNewData] = useState(false);
  const [comingData, setComingData] = useState(false);
  const [isNewData, setIsNewData] = useState(true);
  const years = new Date().getFullYear() - 2018 - 1;
  const currentYear = new Date().getFullYear();

  const headerRef = useRef(null);
  const notificationsRef = useRef(null);
  const cardsRef = useRef(null);
  const statsRef = useRef(null);

  // Detectar si están en vista
  const isHeaderInView = useInView(headerRef, {
    once: true,
    amount: 1.0,
  });
  const isNotificationsInView = useInView(notificationsRef, {
    once: true,
    amount: 1.0,
  });
  const isCardsInView = useInView(cardsRef, {
    once: true,
    amount: 0.6,
  });
  const isStatsInView = useInView(statsRef, {
    once: true,
    amount: 1.0,
  });

  useEffect(() => {
    const dateNow = new Date();
    const currentMonth = dateNow.getMonth(); // Enero es 0, Febrero es 1, etc.
    const day = dateNow.getDate();

    if (currentMonth === 0 && day > 20) {
      setComingData(true);
    }

    if ((currentMonth === 0 && day >= 20) || (currentMonth === 1 && day <= 20)) {
      setNewData(true);
    }

    if ((currentMonth >= 0 && day >= 20) || currentMonth !== 0) {
      setIsNewData(true);
    } else {
      setIsNewData(false);
    }
  }, []);

  return {
    isNewData,
    newData,
    comingData,
    years,
    currentYear,
    isHeaderInView,
    isNotificationsInView,
    isCardsInView,
    isStatsInView,
    headerRef,
    notificationsRef,
    cardsRef,
    statsRef,
  };
}
