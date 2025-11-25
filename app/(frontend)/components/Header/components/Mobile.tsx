import Link from 'next/link';
import { useHeader } from '../hooks/useHeader';
import { HamburgerIcon } from '@/app/(frontend)/icons/icons';
import { MobileMenu } from './MobileMenu';

export function Mobile() {
  const headerState = useHeader();
  const { pathname, setMenuOpen } = headerState;

  return (
    <nav
      aria-label="Navegación principal"
      className="relative flex w-full items-center justify-center gap-7 lg:gap-15 py-4 px-6 bg-(--color-header)"
    >
      {/* Title */}
      <Link
        href="/"
        aria-current={pathname.length === 1 ? 'page' : undefined}
        className={`text-xl font-semibold transition-colors ${pathname.length === 1 ? 'text-(--eye-catching-text) cursor-default' : 'hover:text-(--eye-catching-text)'}`}
      >
        Tamborradata
      </Link>

      {/* Menu Button */}
      <button
        aria-controls="mobile-nav"
        aria-label="Abrir menú de navegación"
        onClick={() => setMenuOpen(true)}
        className="absolute right-0 top-1/2 -translate-x-1/2 -translate-y-1/2 p-1 border border-(--color-border) cursor-pointer rounded-md"
      >
        <HamburgerIcon />
      </button>

      {/* Mobile Menu */}
      <MobileMenu {...headerState} />

      {/* Gradient Overlay */}
      <span className="absolute top-full w-full h-3 bg-linear-to-b from-(--color-header) to-transparent"></span>
    </nav>
  );
}
