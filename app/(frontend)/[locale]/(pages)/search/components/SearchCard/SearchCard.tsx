import { motion } from 'framer-motion';
import { CardForm } from './components/CardForm/CardForm';
import { SearchResults } from './components/SearchResults/SearchResults';
import { useState } from 'react';

export function SearchCard() {
  const [params, setParams] = useState<{ name: string; company: string } | null>(null);

  return (
    <>
      <motion.section
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
        }}
        transition={{
          opacity: { duration: 0.4, ease: 'linear', delay: 0.6 },
        }}
        role="region"
        aria-labelledby="search-card-title"
        className="relative flex flex-col sm:flex-row items-stretch gap-10 sm:gap-0 justify-center w-full max-w-[1000px] sm:bg-linear-to-br from-(--eye-catching-text) via-(--color-primary) to-(--color-bg-thirdary) sm:border border-(--color-border) rounded-xl"
      >
        {/* CARD FORM */}
        <div
          id="search-card-form"
          className="flex-1 w-full p-4 border border-(--color-border) sm:border-none  bg-linear-to-br from-(--eye-catching-text) via-(--color-primary) to-(--color-bg-thirdary) rounded-xl sm:rounded-none sm:bg-none"
        >
          <CardForm onSubmit={setParams} />
        </div>
        <span className="absolute top-0 left-1/2 transform -translate-x-1/2 h-full border border-(--color-border) shadow-[0_0_10px_var(--eye-catching-text)] invisible sm:visible"></span>

        {/* SEARCH RESULTS */}
        <div className="flex-1 w-full p-4 border border-(--color-border) sm:border-none bg-linear-to-br from-(--eye-catching-text) via-(--color-primary) to-(--color-bg-thirdary) rounded-xl sm:rounded-none sm:bg-none">
          <SearchResults params={params} />
        </div>
      </motion.section>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ opacity: { duration: 0.4, ease: 'linear', delay: 0.9 } }}
        className="text-sm sm:text-base text-center text-(--color-text-secondary) max-w-3xl leading-relaxed"
      >
        Cada enero se publica el listado para mantener el historial al día. Introduce el nombre
        completo y la compañía para localizar participaciones y confirmar en qué años desfilaste,
        sin exponer datos personales más allá de lo publicado.
      </motion.p>
    </>
  );
}
