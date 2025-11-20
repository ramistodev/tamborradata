'use client';
import { ArrowDown } from '@/app/(frontend)/icons/icons';
import { AnimatePresence, motion } from 'framer-motion';
import { useFAQs } from './hooks/useFAQs';

export function FAQs() {
  const { headerRef, isHeaderInView, faqs, toggleItem, openItems } = useFAQs();

  return (
    <section className="w-full min-h-screen max-w-6xl mx-auto px-4 py-16 flex flex-col items-center justify-center gap-8">
      <motion.div
        ref={headerRef}
        initial={{ opacity: 0 }}
        animate={isHeaderInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <h2 className="text-3xl sm:text-4xl md:text-5xl text-(--eye-catching-text) text-center font-bold mb-4">
          Preguntas frecuentes
        </h2>
        <p className="text-base md:text-xl text-(--color-text-secondary) text-center max-w-3xl leading-relaxed">
          Encuentra aquí la información esencial sobre cómo funciona el buscador de participantes y
          cómo interpretar los resultados.
        </p>
      </motion.div>
      {faqs.map((faq) => {
        return (
          <div
            key={faq.id}
            className="w-full bg-(--eye-catching-text) overflow-hidden rounded-md cursor-pointer"
            onClick={() => toggleItem(faq.id)}
          >
            <div className="flex justify-between p-4">
              <h3 className="text-lg md:text-xl font-bold">{faq.question}</h3>
              <motion.div
                className="flex items-center justify-center"
                animate={{ rotate: openItems[faq.id] ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ArrowDown />
              </motion.div>
            </div>
            <AnimatePresence>
              {openItems[faq.id] && (
                <motion.div
                  className="bg-(--color-bg-secondary)"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{
                    height: {
                      type: 'spring',
                      stiffness: 300,
                      damping: 30,
                    },
                    opacity: { duration: 0.2 },
                  }}
                  style={{ overflow: 'hidden' }}
                >
                  <div className="p-5">
                    <p>{faq.answer}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </section>
  );
}
