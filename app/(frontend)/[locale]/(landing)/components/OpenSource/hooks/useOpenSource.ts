import { useInView } from 'framer-motion';
import { useRef } from 'react';

export function useOpenSource() {
  const headerRef = useRef<HTMLDivElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);

  const isHeaderInView = useInView(headerRef, {
    once: true,
    amount: 1.0,
  });

  const isCardInView = useInView(cardRef, {
    once: true,
    amount: 1.0,
  });

  const githubURL = 'https://github.com/ramistodev/tamborradata';

  return {
    headerRef,
    cardRef,
    isHeaderInView,
    isCardInView,
    githubURL,
  };
}
