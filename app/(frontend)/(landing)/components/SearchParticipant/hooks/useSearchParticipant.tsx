import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';

export function useSearchParticipant() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  // Refs para los elementos a observar
  const headerRef = useRef(null);
  const inputRef = useRef(null);
  const cardsRef = useRef(null);

  // Detectar si están en vista los elementos para animaciones
  const isHeaderInView = useInView(headerRef, {
    once: true,
    amount: 1.0,
  });

  const isInputInView = useInView(inputRef, {
    once: true,
    amount: 1.0,
  });

  const isCardsInView = useInView(cardsRef, {
    once: true,
    amount: isMobile ? 0.5 : 1.0,
  });

  return {
    headerRef,
    inputRef,
    cardsRef,
    isHeaderInView,
    isInputInView,
    isCardsInView,
  };
}
