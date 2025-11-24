'use client';
import { motion } from 'framer-motion';
import { Desktop } from './components/Desktop';
import { useHeaderFadeIn } from './hooks/useHeaderFadeIn';

export function Header() {
  const { isVisible } = useHeaderFadeIn();

  return (
    <motion.header
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.5 }}
      className="w-full fixed z-999"
    >
      <Desktop />
    </motion.header>
  );
}
