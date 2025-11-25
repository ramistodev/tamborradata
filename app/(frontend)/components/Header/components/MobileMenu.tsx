import Link from 'next/link';
import { useHeader } from '../hooks/useHeader';
import { ChevronRight } from '@/app/(frontend)/icons/icons';
import { AnimatePresence, motion } from 'framer-motion';
import { useMobileMenu } from '../hooks/useMobileMenu';
import { useStatisticsY } from '../hooks/useStatisticsY';

export function MobileMenu(headerState: ReturnType<typeof useHeader>) {
  const { pathname, menuOpen, setMenuOpen, firstItemRef } = headerState;
  const { statsShow, toggleStatsShow } = useMobileMenu();
  const { years } = useStatisticsY();

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
        className="absolute top-0 right-0 flex flex-col items-start gap-6 w-2/3 h-screen bg-(--color-header) pt-20 px-6 z-999"
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
          aria-expanded={statsShow}
          aria-label="Mostrar opciones de estadísticas"
          onClick={() => toggleStatsShow()}
          className={`text-lg lg:text-xl transition-colors font-medium cursor-pointer ${pathname.includes('/statistics') ? 'text-(--eye-catching-text) cursor-default' : 'hover:text-(--eye-catching-text)'}`}
        >
          Estadísticas
        </button>

        {/* Years */}
        <AnimatePresence>
          {statsShow && (
            <motion.ul
              key="stats"
              role="menu"
              aria-label="Opciones de estadísticas"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="w-full flex flex-col items-start gap-3 pl-4 py-2 border-l border-(--color-border) overflow-hidden"
            >
              <li>
                <Link
                  href={`/statistics/global`}
                  aria-current={pathname.includes('/statistics/global') ? 'page' : undefined}
                  onClick={() => {
                    toggleStatsShow();
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
                      toggleStatsShow();
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
