import { useInView } from 'framer-motion';
import { useRef } from 'react';

export function useContact() {
  const headerRef = useRef(null);

  const isHeaderInView = useInView(headerRef, {
    once: true,
    amount: 1.0,
  });

  return {
    headerRef,
    isHeaderInView,
  };
}
