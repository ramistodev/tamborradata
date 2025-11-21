'use client';
import Link from 'next/link';
import { Hero } from './components/Hero/Hero';
import { SearchCard } from './components/SearchCard/SearchCard';
import { ArrowLeft } from '../icons/icons';
import { motion } from 'framer-motion';
import { FAQs } from './components/FAQs/FAQs';

export function SearchPageContent() {
  return (
    <main className="relative flex flex-col items-center justify-center w-full h-full gap-4">
      {/* BACK TO HOME */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
        }}
        transition={{
          opacity: { duration: 0.4, ease: 'linear' },
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Volver al inicio"
        className="absolute top-7 left-1/2 transform -translate-x-1/2 rounded bg-(--eye-catching-text) cursor-pointer hover:opacity-80 flex items-center gap-2 text-center"
      >
        <Link href="/" className="flex text-sm items-center justify-center gap-2 py-2 px-3">
          <ArrowLeft /> Volver al inicio
        </Link>
      </motion.div>
      {/* CONTENT */}
      <section className="w-full min-h-screen max-w-6xl mx-auto px-4 pb-16 p flex flex-col items-center justify-between gap-8">
        <Hero />
        <SearchCard />
        <motion.p
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
          }}
          transition={{
            opacity: { duration: 0.4, ease: 'linear', delay: 0.9 },
          }}
          className="text-sm sm:text-base text-center text-(--color-text-secondary) max-w-3xl leading-relaxed"
        >
          Tu participación también forma parte de la historia reciente de la Tamborrada Infantil.
          Aquí puedes consultar tus apariciones tal y como fueron publicadas oficialmente desde
          2018.{' '}
        </motion.p>
      </section>
      <FAQs />
    </main>
  );
}
