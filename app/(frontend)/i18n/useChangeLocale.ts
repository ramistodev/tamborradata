'use client';
import { useEffect, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import type { Locale } from '../../types/locale';
import { getPathname, usePathname } from './navigation';

const PENDING_HASH_KEY = 'pendingLocaleHash';

// The hash is not part of the navigation: next-intl's router forces the `/es` prefix for the default
// locale and the redirect that strips it drops the hash, and Next.js appends the hash a second time
// when it navigates to a route it already has cached. It is kept here and put back once the new
// locale has rendered. sessionStorage because the header remounts when the `[locale]` segment changes.
function savePendingHash(href: string, hash: string) {
  try {
    window.sessionStorage.setItem(PENDING_HASH_KEY, JSON.stringify({ href, hash }));
  } catch {
    // Storage blocked: the language still changes, only the hash is lost
  }
}

function restorePendingHash() {
  try {
    const stored = window.sessionStorage.getItem(PENDING_HASH_KEY);
    if (!stored) return;
    window.sessionStorage.removeItem(PENDING_HASH_KEY);

    const { href, hash } = JSON.parse(stored) as { href: string; hash: string };
    const { pathname, search } = window.location;

    // Only on the page the switch was heading to: a navigation that never finished leaves a stale entry
    if (`${pathname}${search}` !== href || window.location.hash === hash) return;

    window.history.replaceState(window.history.state, '', `${href}${hash}`);
  } catch {
    // Storage blocked or unreadable entry: nothing to restore
  }
}

// Hook para controlar el cambio de idioma sin refrescar ni navegar entre otras paginas
export function useChangeLocale() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  useEffect(restorePendingHash, [locale]);

  function changeLocale(nextLocale: Locale) {
    if (nextLocale === locale) return;

    // Read at click time so the hook doesn't need a Suspense boundary (useSearchParams would).
    const { search, hash } = window.location;
    const href = `${getPathname({ href: pathname, locale: nextLocale })}${search}`;

    if (hash) savePendingHash(href, hash);

    startTransition(() => {
      router.replace(href, { scroll: false });
    });
  }

  return { locale, changeLocale, isPending };
}
