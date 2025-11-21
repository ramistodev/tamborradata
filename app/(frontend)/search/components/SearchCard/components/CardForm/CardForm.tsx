'use client';
import { AnimatePresence, motion } from 'framer-motion';
import { NameInput } from './components/NameInput';
import { SelectCompanies } from './components/SelectCompanies';
import { useForm } from './hooks/useForm';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

export function CardForm() {
  return (
    <Suspense>
      <CardFormInner />
    </Suspense>
  );
}

export function CardFormInner() {
  const { formSubmit, alert } = useForm();
  const searchParams = useSearchParams();
  const initialName = searchParams.get('name') || '';
  const initialCompany = searchParams.get('company') || '';

  return (
    <motion.form
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
      }}
      transition={{
        opacity: { duration: 0.4, ease: 'linear', delay: 0.7 },
      }}
      aria-label="Formulario de búsqueda"
      className="h-full flex flex-col justify-between gap-5"
      onSubmit={(e) => formSubmit(e)}
    >
      {/* HEADER */}
      <h2 id="search-card-title" className="text-xl md:text-2xl font-bold text-center">
        Buscar Participante
      </h2>
      {/* CONTENT */}
      <div className="flex flex-col gap-5">
        <NameInput defaultValue={initialName} />
        <SelectCompanies defaultValue={initialCompany} />
      </div>

      {/* ALERT MESSAGE */}
      <AnimatePresence mode="wait">
        {alert && (
          <motion.p
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: 'auto', marginTop: 0 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.3 }}
            className="text-sm text-(--color-error) font-semibold text-center overflow-hidden"
          >
            {alert}
          </motion.p>
        )}
      </AnimatePresence>

      {/* SUBMIT BUTTON */}
      <button
        type="submit"
        className="w-full bg-(--color-bg-secondary) cursor-pointer font-semibold py-2 rounded-md hover:scale-102 transition-all mt-5"
      >
        Buscar
      </button>
    </motion.form>
  );
}
