'use client';
import { ArrowDown } from '../../icons/icons';
import { AnimatePresence, motion } from 'framer-motion';
import { useFAQs } from './hooks/useFAQs';

export function FAQs() {
  const { faqs, toggleItem, openItems } = useFAQs();

  return (
    <section className="w-full min-h-screen max-w-6xl mx-auto px-4 py-16 flex flex-col items-center justify-center gap-8">
      <h2 className="text-2xl sm:text-3xl md:text-5xl text-(--eye-catching-text) font-bold mb-4">
        Preguntas frecuentes
      </h2>
      {faqs.map((faq) => {
        return (
          <div
            key={faq.id}
            className="w-full bg-(--color-bg-thirdary) overflow-hidden rounded-md cursor-pointer"
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
