'use client';
import { motion } from 'framer-motion';
import { usePressMentions } from './hooks/usePressMentions';
import Link from 'next/link';
import Image from 'next/image';

export function PressMentions() {
  const { headerRef, isHeaderInView, imageRef, isImageInView, pressLinkRef, isPressLinkInView } =
    usePressMentions();

  return (
    <section
      aria-label="Menciones en medios de comunicación"
      className="w-full max-w-6xl mx-auto px-4 py-36 flex flex-col items-center justify-center md:gap-6"
    >
      {/* HEADER */}
      <motion.div
        ref={headerRef}
        initial={{ opacity: 0, y: 20 }}
        animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.4 }}
        className="max-w-3xl mb-8"
      >
        <h2 className="text-3xl sm:text-4xl md:text-5xl text-(--eye-catching-text) text-center text-balance font-bold mb-4 leading-tight">
          Mencionado en medios
        </h2>
        <p className="text-base md:text-xl text-balance text-(--color-text-secondary) text-center leading-relaxed">
          Una ‘memoria digital’ de la Tamborrada Infantil que ya ha sido mencionada en medios.
        </p>
      </motion.div>

      {/* MENTION IN DIARIO VASCO */}
      <article className="w-full max-w-2xl flex flex-col items-center justify-center gap-8 md:gap-4 py-4">
        <motion.div
          ref={imageRef}
          initial={{ opacity: 0, scale: 0.8, y: 60, rotate: -10 }}
          animate={
            isImageInView
              ? { opacity: 1, scale: 1, y: 0, rotate: 5 }
              : { opacity: 0, scale: 0.8, y: 60, rotate: -10 }
          }
          transition={{
            opacity: { duration: 0.8, ease: 'easeOut', delay: 0.2 },
            scale: { duration: 0.8, ease: [0.34, 1.56, 0.64, 1], delay: 0.2 }, // spring-like
            y: { duration: 0.8, ease: 'easeOut', delay: 0.2 },
            rotate: { duration: 0.8, ease: [0.34, 1.56, 0.64, 1], delay: 0.2 },
          }}
          whileHover={{
            rotate: 8,
            scale: 1.06,
            y: -4,
            transition: { duration: 0.3, ease: 'easeOut' },
          }}
          className="group"
        >
          <Link
            href={
              'https://www.diariovasco.com/tamborrada/tamborradatacom-fiesta-datos-20260116073402-nt.html'
            }
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Leer artículo completo en Diario Vasco (abre en nueva ventana)"
            className="focus:outline-none focus-visible:opacity-85"
          >
            <Image
              src="/images/landing/press-clip-diario-vasco-2026.webp"
              alt="Artículo del Diario Vasco sobre: 'Tamborradata.com, la fiesta en datos'. Publicado el 16 de enero de 2026 por Jorge F. Mendiola"
              width={600}
              height={400}
              className="drop-shadow-[0px_10px_10px_black] group-hover:drop-shadow-[0px_10px_20px_black] transition-all duration-300"
            />
          </Link>
        </motion.div>

        {/* PRESS LINK */}
        <motion.div
          ref={pressLinkRef}
          initial={{ opacity: 0, y: 20 }}
          animate={isPressLinkInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-sm sm:text-xl text-(--color-text-secondary) text-balance text-center"
        >
          <Link
            href={
              'https://www.diariovasco.com/tamborrada/tamborradatacom-fiesta-datos-20260116073402-nt.html'
            }
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-(--eye-catching-text) transition-colors duration-300 focus:outline-none focus-visible:underline focus-visible:text-(--eye-catching-text)"
          >
            Diario Vasco · 16 ene 2026 · Por
            <span className="sr-only"> (abre en nueva ventana)</span>
          </Link>{' '}
          <Link
            href={'https://www.diariovasco.com/autor/jorge-f-mendiola-709.html'}
            target="_blank"
            rel="noopener noreferrer"
            className="text-(--color-text) font-bold hover:text-(--eye-catching-text) transition-colors duration-300 focus:outline-none focus-visible:underline focus-visible:text-(--eye-catching-text)"
          >
            Jorge F. Mendiola
            <span className="sr-only"> (abre en nueva ventana)</span>
          </Link>
        </motion.div>
      </article>
    </section>
  );
}
