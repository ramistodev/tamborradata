'use client';
import { motion } from 'framer-motion';

export default function SearchPage() {
  return (
    <main className="flex flex-col items-center justify-center w-full h-full gap-4">
      <div className="p-5 w-full max-w-[1000px] flex flex-col items-center justify-evenly gap-3 pt-20">
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
          }}
          transition={{
            opacity: { duration: 0.6, ease: 'linear' },
          }}
          className="text-2xl sm:text-3xl md:text-5xl text-(--eye-catching-text) text-balance text-center font-bold mb-4"
        >
          Consulta tu nombre en la mayor base de datos de la Tamborrada Infantil
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
          }}
          transition={{
            opacity: { duration: 0.4, ease: 'linear', delay: 0.2 },
          }}
          className="text-xl text-balance text-center text-(--color-text-secondary) md:text-2xl"
        >
          Busca tu nombre y descubre en qué años participaste, qué colegio representaste y tu
          presencia en la Tamborrada Infantil desde 2018.
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
          }}
          transition={{
            opacity: { duration: 0.4, ease: 'linear', delay: 0.4 },
          }}
          className="text-sm text-balance md:text-base  text-(--color-text-secondary) text-center italic"
        >
          Datos desde 2018 · Más de 30.000 registros · Actualizado en enero 2025
        </motion.p>
      </div>
    </main>
  );
}
