'use client';
import { AnimatePresence, motion } from 'framer-motion';
import { useNextSteps } from './hooks/useNextSteps';
import { CheckIcon, QuestionIcon } from '../../icons/icons';

export function NextSteps() {
  const {
    headerRef,
    cardRef,
    isHeaderInView,
    isCardInView,
    cards,
    indexTurn,
    setIndexTurn,
    setDisabled,
    disabled,
  } = useNextSteps();

  return (
    <section className="w-full min-h-screen max-w-6xl mx-auto px-4 py-16 flex flex-col items-center justify-center">
      {/* HEADER */}
      <motion.div
        ref={headerRef}
        initial={{ opacity: 0 }}
        animate={isHeaderInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl mb-8"
      >
        <h2 className="text-3xl sm:text-4xl md:text-5xl text-(--eye-catching-text) text-center text-balance font-bold mb-4 leading-tight">
          Próximos pasos de Tamborradata
        </h2>
        <p className="text-base md:text-xl text-balance text-(--color-text-secondary) text-center leading-relaxed">
          El futuro de Tamborradata incluye nuevas funcionalidades, análisis más profundos y
          herramientas interactivas para explorar la historia de esta tradición donostiarra.
        </p>
      </motion.div>

      {/* CARD */}
      <motion.div
        ref={cardRef}
        initial={{ opacity: 0 }}
        animate={isCardInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="relative w-full max-w-xl overflow-hidden border border-(--color-border) rounded-lg p-4 "
      >
        <div className="flex gap-0 relative rounded-lg">
          {/* DEGRADADOS LATERALES */}
          <div
            className="absolute -left-4 top-0 bottom-0 w-4 z-20 pointer-events-none"
            style={{
              background: 'linear-gradient(to right, var(--color-bg), transparent)',
            }}
          />
          <div
            className="absolute -right-4 top-0 bottom-0 w-4 z-20 pointer-events-none"
            style={{
              background: 'linear-gradient(to left, var(--color-bg), transparent)',
            }}
          />

          {/* TARJETA ANIMADA */}
          <AnimatePresence mode="sync" initial={false}>
            <motion.div
              key={indexTurn}
              initial={{ x: '105%', opacity: 1, position: 'relative' }}
              animate={{ x: 0, opacity: 1, position: 'relative' }}
              exit={{ x: '-105%', opacity: 0.3, position: 'absolute' }}
              onAnimationStart={() => setDisabled(true)}
              onAnimationComplete={() => setDisabled(false)}
              transition={{ duration: 1, ease: 'easeInOut' }}
              className="w-full flex flex-col h-[265px] sm:h-auto items-start justify-between gap-5 p-4 rounded-md bg-linear-to-br from-(--eye-catching-text) via-(--color-primary) to-(--color-bg-thirdary) border border-(--color-border)"
            >
              <div className="flex-1 flex flex-col gap-4">
                <h3 className="text-xl md:text-2xl font-semibold">{cards[indexTurn].title}</h3>
                <p className="text-sm sm:text-base md:text-lg text-(--color-text)">
                  {cards[indexTurn].description}
                </p>
              </div>
              <span className="flex items-center gap-2 text-sm md:text-base text-(--color-text) px-2 py-1 rounded bg-(--color-table)">
                {cards[indexTurn].feasible ? <CheckIcon /> : <QuestionIcon />}{' '}
                {cards[indexTurn].feasible ? 'Factible' : 'En estudio'}
              </span>
            </motion.div>
          </AnimatePresence>
        </div>
        {/* INDICADORES */}
        <div className="flex items-center justify-center">
          <div className="flex gap-4 px-5 border border-(--color-border) rounded-full mt-4 py-2">
            {cards.map((_, index) => (
              <button
                key={index}
                disabled={disabled}
                onClick={() => setIndexTurn(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === indexTurn
                    ? 'bg-(--eye-catching-text) w-8'
                    : 'bg-(--color-text-secondary) opacity-50 cursor-pointer '
                }`}
                aria-label={`Ver tarjeta ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
