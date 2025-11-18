'use client';
import { motion } from 'framer-motion';
import { useOpenSource } from './hooks/useOpenSource';
import { GithubIcon } from '../../icons/icons';
import Link from 'next/link';

export function OpenSource() {
  const { headerRef, cardRef, isHeaderInView, isCardInView, githubURL } = useOpenSource();

  return (
    <section className="w-full min-h-screen max-w-6xl mx-auto px-4 py-16 flex flex-col items-center justify-center gap-4 md:gap-8">
      {/* HEADER */}
      <motion.div
        ref={headerRef}
        initial={{ opacity: 0, y: 20 }}
        animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-(--eye-catching-text)">
          Proyecto de Código Abierto
        </h2>
        <p className="text-base md:text-xl text-(--color-text-secondary) mt-4 max-w-3xl mx-auto leading-relaxed">
          Tamborradata es un proyecto abierto y transparente. Puedes explorar el código, aprender de
          él, contribuir con mejoras y ayudar a construir la mayor base de datos y plataforma de
          análisis sobre la Tamborrada Infantil.
        </p>
      </motion.div>

      {/* CARD */}
      <motion.div
        ref={cardRef}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={isCardInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-xl rounded-2xl p-6 bg-linear-to-br from-(--eye-catching-text) via-(--color-primary) to-(--color-bg-thirdary) border border-(--color-border)"
      >
        <div className="flex flex-col gap-6">
          <div>
            <h3 className="text-xl md:text-2xl font-semibold">¿Quieres ver el código?</h3>
            <p className="text-base mt-2 leading-relaxed">
              El código de la web está disponible públicamente. Puedes revisarlo, aprender de él o
              contribuir con mejoras. Aprecio cualquier ayuda que empuje este proyecto hacia
              adelante.
            </p>
          </div>

          {/* BOTÓN */}
          <motion.div
            className="rounded-lg border border-(--color-border) bg-(--color-table) cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              href={githubURL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 px-5 py-3 text-(--color-text)"
            >
              <GithubIcon />
              <span className="font-semibold text-base">Ver repositorio en GitHub</span>
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {/* DISCLAIMER */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={isHeaderInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="text-(--color-text-secondary) text-center text-sm max-w-lg"
      >
        El pipeline que genera y procesa los datos permanece privado por razones de seguridad y
        protección de datos, pero la parte pública del proyecto está completamente abierta.
      </motion.p>
    </section>
  );
}
