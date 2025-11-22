'use client';
import { motion } from 'framer-motion';
import { useSearchParticipant } from './hooks/useSearchParticipant';
import { SearchIcon } from '../../icons/icons';
import { useSearchInput } from './hooks/useSearchInput';

export function SearchParticipant() {
  const { inputValue, onChange, onBlur, onEnterPress, onFocusIn } = useSearchInput();
  const { headerRef, inputRef, cardsRef, isHeaderInView, isInputInView, isCardsInView } =
    useSearchParticipant();

  return (
    <section className="w-full min-h-screen max-w-6xl mx-auto px-4 py-16 flex flex-col items-center justify-center gap-8 md:gap-12">
      {/* HEADER */}
      <motion.div
        ref={headerRef}
        initial={{ opacity: 0 }}
        animate={isHeaderInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl"
      >
        <h2 className="text-3xl sm:text-4xl md:text-5xl text-(--eye-catching-text) text-center text-balance font-bold mb-4 leading-tight">
          Busca tu nombre en Tamborradata
        </h2>
        <p className="text-base md:text-xl text-balance text-(--color-text-secondary) text-center leading-relaxed">
          ¿Participaste en la Tamborrada Infantil? Busca tu nombre y recupera tu historial.
        </p>
      </motion.div>

      {/* SEARCH INPUT */}
      <motion.div
        ref={inputRef}
        initial={{ opacity: 0 }}
        animate={isInputInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="w-full flex flex-col max-w-3xl items-center justify-between gap-4"
      >
        <p className="text-sm md:text-base text-balance text-(--color-text-secondary) text-center leading-relaxed max-w-3xl px-2">
          Descubre cuántas veces has participado en la Tamborrada Infantil
        </p>
        <div className="w-full flex items-center justify-between px-3 py-2 sm:px-4 sm:py-3 border border-(--color-border) bg-(--color-bg-secondary) text-(--color-text) rounded-lg focus-within:ring-1 focus-within:ring-(--eye-catching-text) focus-within:border-(--eye-catching-text) transition">
          <input
            type="text"
            autoComplete="off"
            autoCapitalize="words"
            enterKeyHint="search"
            autoCorrect="off"
            aria-label="Buscar participante, escribe tu nombre y presiona Enter"
            placeholder="Introduce tu nombre..."
            value={inputValue}
            onChange={(event) => onChange(event.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') onEnterPress();
            }}
            onFocus={(event) => onFocusIn(event.currentTarget)}
            onBlur={() => onBlur()}
            className="w-full focus:outline-none"
          />
          <SearchIcon />
        </div>
      </motion.div>

      <motion.div
        ref={cardsRef}
        initial={{ opacity: 0 }}
        animate={isCardsInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.2, delay: 0.2 }}
        className="w-full flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4 lg:gap-8"
      >
        <div className="w-full max-w-sm p-4 bg-(--color-bg-secondary) border border-(--color-border) rounded-xl">
          <motion.div
            initial={{ opacity: 0 }}
            animate={isCardsInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="w-full h-full"
          >
            <h3 className="text-lg font-semibold text-balance text-(--color-text-primary) mb-2">
              Datos actualizados cada año
            </h3>
            <p className="text-sm text-(--color-text-secondary)">
              La base de datos se amplía automáticamente con cada nueva edición de la Tamborrada
              Infantil.
            </p>
          </motion.div>
        </div>
        <div className="w-full max-w-sm p-4 bg-(--color-bg-secondary) border border-(--color-border) rounded-xl">
          <motion.div
            initial={{ opacity: 0 }}
            animate={isCardsInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="w-full h-full"
          >
            <h3 className="text-lg font-semibold text-balance text-(--color-text-primary) mb-2">
              Historial desde 2018
            </h3>
            <p className="text-sm text-(--color-text-secondary)">
              Consulta tus participaciones registradas desde el inicio de la digitalización.
            </p>
          </motion.div>
        </div>
        <div className="w-full max-w-sm p-4 bg-(--color-bg-secondary) border border-(--color-border) rounded-xl">
          <motion.div
            initial={{ opacity: 0 }}
            animate={isCardsInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="w-full h-full"
          >
            <h3 className="text-lg font-semibold text-balance text-(--color-text-primary) mb-2">
              Sin necesidad de registrarse
            </h3>
            <p className="text-sm text-(--color-text-secondary)">
              Usa el buscador libremente. Sin cookies ni registros.
            </p>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
