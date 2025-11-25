'use client';
import './(frontend)/globals.css';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect } from 'react';

export default function NotFound() {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <div className="relative w-full">
      <div className="absolute -top-1/2 left-1/2 transform -translate-x-1/2 translate-y-1/2 flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="z-10 flex flex-col items-center text-center px-6"
        >
          {/* Número 404 grande */}
          <motion.h1
            initial={{ opacity: 0, scale: 0.3 }}
            animate={{
              opacity: 1,
              scale: [0.3, 1.1, 1],
              color: ['var(--color-text)', '#09f', 'var(--color-text)'],
            }}
            transition={{
              opacity: { duration: 0.6, ease: 'easeOut' },
              scale: { duration: 1.2, ease: 'backOut' },
              color: { repeat: Infinity, duration: 4, ease: 'easeInOut', delay: 1.5 },
            }}
            className="text-[8rem] font-extrabold drop-shadow-lg"
          >
            404
          </motion.h1>

          {/* Mensajes */}
          <motion.h2
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.6, ease: 'easeOut' }}
            className="text-3xl font-semibold text-gray-800 dark:text-gray-100 mb-3"
          >
            ¡Ups... página no encontrada!
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.2, duration: 0.8, ease: 'easeOut' }}
            className="text-(--color-text-secondary) max-w-md mb-10 leading-relaxed"
          >
            Parece que la página que buscas no existe o ha sido movida. Pero no te preocupes, puedes
            volver a la página principal.
          </motion.p>

          {/* Botón de vuelta */}
          <motion.div
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.8, duration: 0.6, ease: 'backOut' }}
            className="transition hover:scale-110"
          >
            <Link
              href="/"
              className="inline-block px-8 py-3 rounded-full font-medium text-white bg-linear-to-r from-blue-600 to-blue-800 dark:from-blue-500 dark:to-blue-700 shadow-lg hover:shadow-xl transition-all"
            >
              Volver al inicio
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
