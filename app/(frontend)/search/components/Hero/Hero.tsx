import { motion } from 'framer-motion';

export function Hero() {
  return (
    <div className="w-full max-w-[1000px] flex flex-col items-center justify-evenly gap-3 pt-25">
      {/* HERO */}
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ opacity: { duration: 0.6, ease: 'linear' } }}
        className="text-3xl sm:text-4xl md:text-5xl text-(--eye-catching-text) text-balance text-center font-bold mb-4 leading-tight "
      >
        <span className="block md:hidden">Busca tu participación</span>
        <span className="hidden md:inline">Busca tu participación en la Tamborrada Infantil</span>
      </motion.h1>

      {/* SUBTITLE */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ opacity: { duration: 0.4, ease: 'linear', delay: 0.2 } }}
        className="text-lg text-balance md:text-2xl text-center text-(--color-text-secondary)"
      >
        Encuentra tu historial oficial: años, compañía y apariciones en la Tamborrada Infantil,
        basado en la base de más grande de la Tamborrada Infantil.
      </motion.p>

      {/* STATS */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ opacity: { duration: 0.4, ease: 'linear', delay: 0.4 } }}
        className="text-sm text-balance md:text-base text-(--color-text-secondary) text-center italic"
      >
        Base de datos histórica · Resultados publicados por El Diario Vasco · Actualizaciones cada
        enero
      </motion.p>
    </div>
  );
}
