'use client';
import { motion } from 'framer-motion';
import { useContact } from './hooks/useContact';
import { MailIcon } from '../../icons/icons';
import Link from 'next/link';

export function Contact() {
  const { headerRef, isHeaderInView } = useContact();

  return (
    <section className="w-full min-h-screen max-w-6xl mx-auto px-4 py-16 flex flex-col items-center justify-center gap-4 md:gap-8">
      {/* HEADER */}
      <motion.div
        ref={headerRef}
        initial={{ opacity: 0 }}
        animate={isHeaderInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl mb-8"
      >
        <h2 className="text-3xl sm:text-4xl md:text-5xl text-(--eye-catching-text) text-center text-balance font-bold mb-4 leading-tight">
          Contacta con Tamborradata
        </h2>
        <p className="text-base md:text-xl text-balance text-(--color-text-secondary) text-center leading-relaxed">
          ¿Tienes una propuesta, una colaboración, preguntas sobre Tamborradata o alguna otra cosa?
          Puedes enviarme un email al siguiente correo electrónico.
        </p>
      </motion.div>

      {/* EMAIL BUTTON */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center gap-3 px-6 py-3 rounded-xl bg-(--eye-catching-text) text-(--color-text) font-semibold shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
      >
        <Link
          href="mailto:contact@tamborradata.com"
          className="flex items-center justify-center gap-3 w-full h-full"
        >
          <MailIcon />
          <span>contact@tamborradata.com</span>
        </Link>
      </motion.div>
    </section>
  );
}
