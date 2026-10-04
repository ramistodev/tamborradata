'use client';
import { motion } from 'framer-motion';
import { Desktop } from './components/Desktop';
import { useHeader } from './hooks/useHeader';
import { useHeaderFadeIn } from './hooks/useHeaderFadeIn';
import { Mobile } from './components/Mobile';

export function Header() {
  const { isMobile } = useHeader();
  const { isVisible } = useHeaderFadeIn();

  return (
    <motion.header
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.3 }}
      role="banner"
      className="w-full fixed z-500 bg-(--color-header)"
    >
      {isMobile ? <Mobile /> : <Desktop />}
    </motion.header>
  );
}
