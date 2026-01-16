import { useInView } from 'framer-motion';
import { useRef } from 'react';

export function usePressMentions() {
  const headerRef = useRef(null);
  const imageRef = useRef(null);
  const pressLinkRef = useRef(null);

  const isHeaderInView = useInView(headerRef, {
    once: true,
    amount: 1.0,
  });

  const isImageInView = useInView(imageRef, {
    once: true,
    amount: 0.1,
  });

  const isPressLinkInView = useInView(pressLinkRef, {
    once: true,
    amount: 1.0,
  });

  return {
    headerRef,
    isHeaderInView,
    imageRef,
    isImageInView,
    pressLinkRef,
    isPressLinkInView,
  };
}
