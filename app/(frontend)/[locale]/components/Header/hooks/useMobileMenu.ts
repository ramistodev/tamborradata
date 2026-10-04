import { useCallback, useEffect, useRef, useState } from 'react';
import type { MouseEvent } from 'react';
import { useLocale } from 'next-intl';
import { usePathname } from '@/app/(frontend)/i18n/navigation';

/**
 * State of the mobile navigation: the modal <dialog> (open/close, scroll lock, closing on
 * navigation) and the statistics periods accordion.
 */
export function useMobileMenu() {
  const pathname = usePathname();
  const locale = useLocale();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [periodsShow, setPeriodsShow] = useState(false);

  const openMenu = useCallback(() => {
    dialogRef.current?.showModal();
    setMenuOpen(true);
  }, []);

  // The dialog's `close` event (see handleClose) keeps `menuOpen` in sync
  const closeMenu = useCallback(() => {
    dialogRef.current?.close();
  }, []);

  // Fired for every way of closing: Escape, closeMenu(), a click on the backdrop...
  const handleClose = useCallback(() => setMenuOpen(false), []);

  // A click on the backdrop lands on the <dialog> element itself, not on its content
  function handleDialogClick(event: MouseEvent<HTMLDialogElement>) {
    if (event.target === event.currentTarget) closeMenu();
  }

  function togglePeriodsShow() {
    setPeriodsShow((prev) => !prev);
  }

  // Lock the page scroll while the menu is open, and restore it afterwards
  useEffect(() => {
    if (!menuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [menuOpen]);

  // Navigating (a link or switching the language) closes the menu
  useEffect(() => {
    dialogRef.current?.close();
  }, [pathname, locale]);

  // The periods accordion opens by itself on statistics pages
  useEffect(() => {
    setPeriodsShow(pathname.includes('/statistics'));
  }, [pathname]);

  return {
    dialogRef,
    menuOpen,
    openMenu,
    closeMenu,
    handleClose,
    handleDialogClick,
    periodsShow,
    togglePeriodsShow,
  };
}
