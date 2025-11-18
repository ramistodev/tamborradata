'use client';
import Link from 'next/link';
import { useExploreStatistics } from './hooks/useExploreStatistics';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, CheckIcon, ClockIcon, ChartIcon, CalendarIcon } from '../../icons/icons';

export function ExploreStatistics() {
  const {
    lastStatYear,
    currentYear,
    newData,
    comingData,
    years,
    isNotificationsInView,
    isHeaderInView,
    isGlobalCardInView,
    isYearlyCardInView,
    isStatsInView,
    notificationsRef,
    headerRef,
    globalCardRef,
    yearlyCardRef,
    statsRef,
  } = useExploreStatistics();

  return (
    <section className="w-full min-h-screen max-w-6xl mx-auto px-4 py-16 flex flex-col items-center justify-center gap-4 md:gap-8">
      {/* HEADER */}
      <motion.div
        ref={headerRef}
        initial={{ opacity: 0 }}
        animate={isHeaderInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <h2 className="text-3xl sm:text-4xl md:text-5xl text-(--eye-catching-text) text-center font-bold mb-4">
          Explora las estadísticas
        </h2>
        <p className="text-base md:text-xl text-(--color-text-secondary) text-center max-w-3xl leading-relaxed">
          Descubre la evolución de la Tamborrada Infantil: colegios, nombres y participación desde
          2018.
        </p>
      </motion.div>

      {/* NOTIFICACIONES */}
      <AnimatePresence>
        <motion.div
          ref={notificationsRef}
          initial={{ height: 0, opacity: 0 }}
          animate={
            (newData || comingData) && isNotificationsInView
              ? { height: 'auto', opacity: 1 }
              : { height: 0, opacity: 0 }
          }
          transition={{
            height: {
              duration: 0.3,
              type: 'tween',
              ease: 'linear',
              stiffness: 100,
              damping: 50,
            },
            opacity: {
              duration: 0.3,
              delay: 0.5,
              ease: 'linear',
            },
          }}
          style={{ overflow: 'hidden' }}
          className="w-full max-w-3xl select-none mb-5"
        >
          {newData && (
            <div className="bg-(--color-bg-secondary) border border-(--color-border) text-(--color-text) px-4 py-3 rounded-lg flex items-center gap-3">
              <div className="text-(--eye-catching-text)">
                <CheckIcon />
              </div>
              <div className="flex items-start justify-center md:items-center md:justify-start flex-col md:flex-row md:gap-3">
                <span className="font-medium">
                  Explora los nuevos datos de {lastStatYear.current}
                </span>
                <span className="text-(--color-text-secondary) text-sm">
                  Actualizado recientemente
                </span>
              </div>
            </div>
          )}

          {comingData && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="bg-(--color-bg-secondary) border border-(--color-border) text-(--color-text) px-4 py-3 rounded-lg flex items-center gap-3"
            >
              <div className="text-(--eye-catching-text)">
                <ClockIcon />
              </div>
              <div className="flex items-start justify-center md:items-center md:justify-start flex-col md:flex-row md:gap-3">
                <span className="font-medium">Proximamente {currentYear}</span>
                <span className="text-(--color-text-secondary) text-sm">
                  Disponible el 20 de enero
                </span>
              </div>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* TARJETAS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-8 w-full max-w-5xl ">
        <motion.article
          ref={globalCardRef}
          whileHover={{ scale: 1.02, y: -8 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0 }}
          animate={isGlobalCardInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 1, type: 'spring', stiffness: 300, damping: 20 }}
        >
          <Link
            href="/statistics/global"
            className="block p-8 rounded-2xl transition-all duration-500 shadow-xl group border border-(--color-border) relative overflow-hidden bg-linear-to-br from-(--eye-catching-text) via-(--color-primary) to-(--color-bg-thirdary)"
          >
            <div className="flex flex-col items-start justify-center gap-4 relative z-10">
              <div>
                <h3 className="flex gap-2 items-center text-xl  md:text-2xl font-bold mb-3 group-hover:scale-105 transition-transform duration-300">
                  <ChartIcon /> Estadísticas globales
                </h3>
                <p className="text-lg leading-relaxed drop-shadow-sm">
                  Un vistazo general a todos los años de la Tamborrada Infantil. Tendencias,
                  evolución y datos históricos.
                </p>
              </div>
              <div className="mt-4 flex items-center font-semibold group-hover:translate-x-4 transition-transform duration-300">
                Ver estadísticas globales
                <ArrowRight />
              </div>
            </div>
          </Link>
        </motion.article>

        <motion.article
          ref={yearlyCardRef}
          whileHover={newData ? { scale: 1.03, y: -20 } : { scale: 1.02, y: -8 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0 }}
          animate={isYearlyCardInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 1, type: 'spring', stiffness: 300, damping: 20 }}
        >
          <Link
            href={`/statistics/${lastStatYear.current || new Date().getFullYear() - 1}`}
            className={`block p-8 rounded-2xl transition-all duration-500 group border relative overflow-hidden 
              ${newData ? 'bg-linear-to-br from-(--eye-catching-text) to-(--color-bg-thirdary) shadow-[0_0px_50px_0px_var(--caption-color),0_0_0_2px_var(--eye-catching-text)] border-(--eye-catching-text)' : 'bg-linear-to-br from-(--eye-catching-text) via-(--color-primary) to-(--color-bg-thirdary) border-(--color-border) shadow-xl'}`}
          >
            {newData && (
              <>
                <div className="absolute top-2 right-2 bg-white text-(--eye-catching-text) text-xs font-bold px-3 py-1 rounded-full shadow-lg group-hover:scale-115 transition-transform duration-300">
                  NUEVO!
                </div>
              </>
            )}
            {comingData && (
              <>
                <div className="absolute top-2 right-2 bg-white text-(--eye-catching-text) text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                  Proximamente {currentYear}!
                </div>
              </>
            )}
            <div className="flex flex-col items-start justify-center gap-4 relative z-10">
              <div>
                <h3 className="flex gap-2 items-center text-xl  md:text-2xl font-bold mb-3 group-hover:scale-105 transition-transform duration-300">
                  <span>
                    <CalendarIcon />
                  </span>
                  Últimas estadísticas ({lastStatYear.current})
                </h3>
                <p className="text-lg leading-relaxed drop-shadow-sm">
                  Mira los datos más recientes: colegios, nombres y apellidos más comunes del último
                  año.
                </p>
              </div>
              <div className="mt-4 flex items-center font-semibold group-hover:translate-x-4 transition-transform duration-300">
                Ver datos de {lastStatYear.current}
                <ArrowRight />
              </div>
            </div>
          </Link>
        </motion.article>
      </div>

      {/* ESTADÍSTICAS RÁPIDAS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 w-full max-w-4xl">
        <motion.div
          ref={statsRef}
          initial={{ opacity: 0, y: 30 }}
          animate={isStatsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.3, delay: 0.0 }}
          className="text-center p-4 bg-(--color-bg-secondary) border border-(--color-border) rounded-xl"
        >
          <div className="text-3xl font-bold text-(--eye-catching-text)">2018</div>
          <div className="text-sm text-(--color-text-secondary) mt-1">Desde</div>
        </motion.div>
        <motion.div
          ref={statsRef}
          initial={{ opacity: 0, y: 30 }}
          animate={isStatsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="text-center p-4 bg-(--color-bg-secondary) border border-(--color-border) rounded-xl"
        >
          <div className="text-3xl font-bold text-(--eye-catching-text)">{years}+</div>
          <div className="text-sm text-(--color-text-secondary) mt-1">Años de datos</div>
        </motion.div>
        <motion.div
          ref={statsRef}
          initial={{ opacity: 0, y: 30 }}
          animate={isStatsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="text-center p-4 bg-(--color-bg-secondary) border border-(--color-border) rounded-xl"
        >
          <div className="text-3xl font-bold text-(--eye-catching-text)">30k+</div>
          <div className="text-sm text-(--color-text-secondary) mt-1">Participantes</div>
        </motion.div>
        <motion.div
          ref={statsRef}
          initial={{ opacity: 0, y: 30 }}
          animate={isStatsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="text-center p-4 bg-(--color-bg-secondary) border border-(--color-border) rounded-xl"
        >
          <div className="text-3xl font-bold text-(--eye-catching-text)">100%</div>
          <div className="text-sm text-(--color-text-secondary) mt-1">Automatizado</div>
        </motion.div>
      </div>
    </section>
  );
}
