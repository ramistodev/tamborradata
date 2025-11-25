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
    </div>
  );
}
