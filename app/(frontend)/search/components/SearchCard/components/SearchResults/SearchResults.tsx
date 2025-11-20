import { motion } from 'framer-motion';
import { Results } from './components/Results';

export function SearchResults() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
      }}
      transition={{
        opacity: { duration: 0.4, ease: 'linear', delay: 0.7 },
      }}
      className="h-full flex flex-col justify-start gap-6"
    >
      <h2 className="text-xl md:text-2xl font-bold text-center">Resultados de la búsqueda</h2>
      <Results />
    </motion.div>
  );
}
