import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

export function useHeader() {
  const pathname = usePathname();
  const firstItemRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  function handleResize() {
    setIsMobile(window.innerWidth < 768);
  }

  useEffect(() => {
    window.addEventListener('resize', handleResize);

    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : 'auto';
  }, [menuOpen]);

  useEffect(() => {
    if (menuOpen && firstItemRef.current) {
      firstItemRef.current.focus();
    }
  }, [menuOpen]);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setMenuOpen(false);
    }

    if (menuOpen) document.addEventListener('keydown', handleKey);

    return () => document.removeEventListener('keydown', handleKey);
  }, [menuOpen]);

  return { pathname, isMobile, menuOpen, setMenuOpen, firstItemRef };
}
