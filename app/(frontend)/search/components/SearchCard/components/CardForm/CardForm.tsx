import { AnimatePresence, motion } from 'framer-motion';
import { NameInput } from './components/NameInput';
import { SelectCompany } from './components/SelectCompany';
import { useForm } from './hooks/useForm';

export function CardForm() {
  const { formSubmit, alert } = useForm();

  return (
    <form
      aria-label="Formulario de búsqueda"
      className="h-full flex flex-col justify-between gap-5"
      onSubmit={(e) => formSubmit(e)}
    >
      <h2 className="text-xl md:text-2xl font-bold text-center">Buscar Participante</h2>
      <div className="flex flex-col gap-5">
        <NameInput />
        <SelectCompany />
      </div>

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

      <button
        type="submit"
        className="w-full bg-(--color-bg-secondary) cursor-pointer font-semibold py-2 rounded-md hover:scale-102 transition-all mt-5"
      >
        Buscar
      </button>
    </form>
  );
}
