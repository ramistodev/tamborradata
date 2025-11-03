'use client';
import Link from 'next/link';
import { useExploreStatistics } from './hooks/useExploreStatistics';
import { motion } from 'framer-motion';
import { ArrowRight } from '../../icons/icons';

export function ExploreStatistics() {
  const {
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
  } = useExploreStatistics();

  return (
    <section className="w-full min-h-screen max-w-6xl mx-auto px-4 py-16 flex flex-col items-center justify-center gap-8">
      {/* Header */}
      <motion.div
        ref={headerRef}
        initial={{ opacity: 0, y: 30 }}
        animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8"
      >
        <h2 className="text-2xl sm:text-3xl md:text-5xl text-(--eye-catching-text) font-bold mb-4">
          Explora las estadísticas
        </h2>
        <p className="text-lg md:text-xl text-(--color-text-secondary) text-center max-w-3xl leading-relaxed">
          Descubre la evolución de la Tamborrada Infantil: colegios, nombres y participación desde
          2018.
        </p>
      </motion.div>

      {/* Notificaciones dinámicas */}
      {(newData || comingData) && (
        <motion.div
          ref={notificationsRef}
          initial={{ opacity: 0, y: -20 }}
          animate={isNotificationsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-4xl"
        >
          {newData && (
            <motion.div
              ref={notificationsRef}
              initial={{ scale: 0.5 }}
              animate={isNotificationsInView ? { scale: 1 } : { scale: 0.5 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="relative overflow-hidden bg-(--eye-catching-text) text-white p-6 rounded-2xl shadow-lg mb-4"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
              <div className="relative z-10 flex items-center gap-4">
                <div className="text-4xl">🎉</div>
                <div>
                  <h3 className="text-xl font-bold">¡Nuevos datos disponibles!</h3>
                  <p className="text-white/80">
                    Los datos de {currentYear} ya están listos para explorar
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {comingData && (
            <motion.div
              ref={notificationsRef}
              initial={{ scale: 0.5 }}
              animate={isNotificationsInView ? { scale: 1 } : { scale: 0.5 }}
              transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
              className="relative overflow-hidden bg-(--color-bg-thirdary) text-white p-6 rounded-2xl shadow-lg mb-4"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
              <div className="relative z-10 flex items-center gap-4">
                <div className="text-4xl">⏳</div>
                <div>
                  <h3 className="text-xl font-bold">Próximamente {currentYear}</h3>
                  <p className="text-white/80">
                    Las estadísticas del próximo año estarán disponibles el 20 de enero
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8 mt-4 md:mt-8 w-full max-w-5xl">
        {/* Card Estadísticas Globales */}
        <motion.div
          ref={cardsRef}
          whileHover={{ scale: 1.02, y: -5 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 30 }}
          animate={isCardsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          <Link
            href="/statistics/global"
            className="block p-8 bg-(--color-bg-secondary) rounded-2xl hover:bg-(--color-bg-thirdary) transition-all duration-300 shadow-lg group border border-(--color-border)"
          >
            <div className="flex items-start gap-4">
              <div className="text-5xl group-hover:scale-110 transition-transform duration-300">
                📊
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-3 text-(--color-text) group-hover:text-(--eye-catching-text) transition-colors">
                  Estadísticas globales
                </h3>
                <p className="text-(--color-text-secondary) text-lg leading-relaxed">
                  Un vistazo general a todos los años de la Tamborrada Infantil. Tendencias,
                  evolución y datos históricos.
                </p>
                <div className="mt-4 flex items-center text-(--eye-catching-text) font-semibold">
                  Ver estadísticas globales
                  <ArrowRight />
                </div>
              </div>
            </div>
          </Link>
        </motion.div>

        <motion.div
          ref={cardsRef}
          whileHover={{ scale: 1.02, y: -5 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 30 }}
          animate={isCardsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          <Link
            href={`/statistics/${isNewData ? currentYear : currentYear - 1}`}
            className="block p-8 bg-(--color-bg-secondary) rounded-2xl hover:bg-(--color-bg-thirdary) transition-all duration-300 shadow-lg group border border-(--color-border) relative overflow-hidden"
          >
            {newData && (
              <div className="absolute top-4 right-4 bg-(--eye-catching-text) text-white text-xs font-bold px-3 py-1 rounded-full">
                NUEVO
              </div>
            )}
            <div className="flex items-start gap-4">
              <div className="text-5xl group-hover:scale-110 transition-transform duration-300">
                📅
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-3 text-(--color-text) group-hover:text-(--eye-catching-text) transition-colors">
                  Últimas estadísticas ({isNewData ? currentYear : currentYear - 1})
                </h3>
                <p className="text-(--color-text-secondary) text-lg leading-relaxed">
                  Mira los datos más recientes: colegios, nombres y apellidos más comunes del último
                  año.
                </p>
                <div className="mt-4 flex items-center text-(--eye-catching-text) font-semibold">
                  Ver datos de {isNewData ? currentYear : currentYear - 1}
                  <ArrowRight />
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 w-full max-w-4xl">
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
