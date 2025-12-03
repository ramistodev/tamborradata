import Link from 'next/link';
import { useHeader } from '../hooks/useHeader';
import { ChevronRight } from '@/app/(frontend)/icons/icons';
import { AnimatePresence, motion } from 'framer-motion';
import { useMobileMenu } from '../hooks/useMobileMenu';
import { useStatisticsY } from '../../../hooks/useStatisticsY';
import { useState } from 'react';

export function MobileMenu(headerState: ReturnType<typeof useHeader>) {
  const { pathname, menuOpen, setMenuOpen, firstItemRef } = headerState;
  const { yearsShow, toggleYearsShow } = useMobileMenu();
  const { years } = useStatisticsY();
  const [listOverflow, setListOverflow] = useState<'hidden' | 'visible'>('hidden');

  return (
    <>
      <motion.nav
        role="dialog"
        id="mobile-nav"
        aria-modal="true"
        aria-label="Menú de navegación"
        initial={{
          right: '-100%',
        }}
        animate={{
          right: menuOpen ? '0' : '-100%',
        }}
        transition={{ duration: 0.3 }}
        className="absolute top-0 right-0 w-2/3 h-screen flex flex-col bg-(--color-header) pt-20 z-999"
      >
        {/* Close Button */}
        <button
          onClick={() => setMenuOpen(false)}
          ref={firstItemRef}
          aria-label="Cerrar menú de navegación"
          className="absolute top-5 left-4 cursor-pointer bg-transparent border-none p-0"
        >
          <ChevronRight />
        </button>

        <div className="flex flex-col items-start gap-6 overflow-y-auto flex-1 pb-10 hide-scrollbar px-6">
          {/* Title */}
          <Link
            href="/"
            aria-current={pathname.length === 1 ? 'page' : undefined}
            onClick={() => setMenuOpen(false)}
            className={`text-xl font-semibold transition-colors ${pathname.length === 1 ? 'text-(--eye-catching-text) cursor-default' : 'hover:text-(--eye-catching-text)'}`}
          >
            Tamborradata
          </Link>

          {/* Search */}
          <Link
            href="/search"
            aria-current={pathname.includes('/search') ? 'page' : undefined}
            onClick={() => setMenuOpen(false)}
            className={`text-lg lg:text-xl transition-colors font-medium ${pathname.includes('/search') ? 'text-(--eye-catching-text) cursor-default' : 'hover:text-(--eye-catching-text)'}`}
          >
            Buscar participante
          </Link>

          {/* Statistics */}
          <button
            aria-expanded={yearsShow}
            aria-label="Mostrar opciones de estadísticas"
            onClick={() => toggleYearsShow()}
            className={`text-lg lg:text-xl transition-colors font-medium cursor-pointer ${pathname.includes('/statistics') ? 'text-(--eye-catching-text) cursor-default' : 'hover:text-(--eye-catching-text)'}`}
          >
            Estadísticas
          </button>

          {/* Years */}
          <AnimatePresence>
            {yearsShow && (
              <motion.ul
                key="stats"
                role="menu"
                aria-label="Opciones de estadísticas"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                onAnimationStart={() => setListOverflow('hidden')}
                onAnimationComplete={() => setListOverflow('visible')}
                style={{ overflow: listOverflow }}
                className="w-full h-full flex flex-col items-start gap-3 pl-4 border-l border-(--color-border)"
              >
                <li>
                  <Link
                    href={`/statistics/global`}
                    aria-current={pathname.includes('/statistics/global') ? 'page' : undefined}
                    onClick={() => {
                      toggleYearsShow();
                      setMenuOpen(false);
                    }}
                    className={`text-lg block hover:text-(--eye-catching-text) transition-colors ${pathname === '/statistics/global' ? 'text-(--eye-catching-text)' : ''}`}
                  >
                    Global
                  </Link>
                </li>
                {years?.map((year) => (
                  <li key={year}>
                    <Link
                      href={`/statistics/${year}`}
                      aria-current={pathname.includes(`/statistics/${year}`) ? 'page' : undefined}
                      onClick={() => {
                        toggleYearsShow();
                        setMenuOpen(false);
                      }}
                      className={`text-lg block hover:text-(--eye-catching-text) transition-colors ${pathname === `/statistics/${year}` ? 'text-(--eye-catching-text) cursor-default' : ''}`}
                    >
                      {year}
                    </Link>
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>

        {/* Gradient Overlay */}
        <span className="absolute right-full top-0 h-screen w-2 bg-linear-to-l from-(--color-header) to-transparent"></span>
      </motion.nav>

      {/* Backdrop */}
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={() => setMenuOpen(false)}
          className="fixed inset-0 backdrop-blur-sm z-400"
        />
      )}
    </>
  );
}
