'use client';
import { useIntro } from './hooks/useIntro';
import { ArrowRight } from '../../icons/icons';
import { motion } from 'framer-motion';
import Link from 'next/link';

export function Intro() {
  const { randomPhrase } = useIntro();
  return (
    <section className="w-full h-[calc(100vh-1.25rem)] flex flex-col items-center justify-center md:p-8">
      <div className="p-10 w-full max-w-[1000px] flex flex-col items-center justify-evenly gap-5">
        {/* HEADER */}
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
          }}
          transition={{
            opacity: { duration: 0.6, ease: 'linear' },
          }}
          className="text-4xl sm:text-5xl md:text-7xl text-balance font-bold text-(--eye-catching-text) text-center leading-tight  "
        >
          La Tamborrada Infantil, vista desde los datos
        </motion.h1>

        {/* SUBHEADER */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
          }}
          transition={{
            opacity: { duration: 0.4, ease: 'linear', delay: 0.2 },
          }}
          className="text-xl text-balance md:text-2xl  text-(--color-text-secondary) text-center"
        >
          {randomPhrase}
        </motion.p>

        {/* BUTTON */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
          }}
          transition={{
            opacity: { duration: 0.6, ease: 'linear', delay: 0.6 },
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-16 rounded bg-(--eye-catching-text) cursor-pointer hover:opacity-80 flex items-center gap-2 text-center"
        >
          <Link
            href="/statistics/global"
            className="flex text-lg sm:text-2xl items-center gap-2 py-3 px-5"
          >
            Explora las estadísticas <ArrowRight />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
