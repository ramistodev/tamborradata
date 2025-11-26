'use client';
import { Hero } from './components/Hero/Hero';
import { SearchCard } from './components/SearchCard/SearchCard';
import { motion } from 'framer-motion';
import { FAQs } from './components/FAQs/FAQs';

export function SearchPageContent() {
  return (
    <div className="relative flex flex-col items-center justify-center w-full h-full gap-4">
      {/* CONTENT */}
      <section className="w-full min-h-screen max-w-6xl mx-auto px-4 pb-16 p flex flex-col items-center justify-between gap-8">
        <Hero />
        <SearchCard />
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ opacity: { duration: 0.4, ease: 'linear', delay: 0.9 } }}
          className="text-sm sm:text-base text-center text-(--color-text-secondary) max-w-3xl leading-relaxed"
        >
          Cada enero se publica el listado oficial para mantener el historial al día. Introduce el
          nombre completo y la compañía para localizar participaciones y confirmar en qué años
          desfilaste, sin exponer datos personales más allá de lo publicado.
        </motion.p>
      </section>
      <FAQs />
    </div>
  );
}
