'use client';
import { useTransition } from 'react';
import { useLocale } from 'next-intl';
import type { Locale } from '../../types/locale';
import { usePathname, useRouter } from './navigation';

// Hook para controlar el cambio de idioma sin refrescar ni navegar entre otras paginas
export function useChangeLocale() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function changeLocale(nextLocale: Locale) {
    if (nextLocale === locale) return;

    // Read at click time so the hook doesn't need a Suspense boundary (useSearchParams would).
    const { search, hash } = window.location;

    startTransition(() => {
      router.replace(`${pathname}${search}${hash}`, { locale: nextLocale, scroll: false });
    });
  }

  return { locale, changeLocale, isPending };
}
