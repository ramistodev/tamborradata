import Link from 'next/link';
import { Years } from './components/Years';

export function Header() {
  return (
    <header className="w-full max-w-7xl h-14 px-3 fixed z-20 mt-5 select-none">
      <nav className="w-full h-full flex items-center justify-start px-4 border overflow-x-auto hide-scrollbar rounded backdrop-saturate-200 border-(--color-border) bg-(--color-bg-secondary)/80">
        <ul className="flex gap-6">
          <li>
            <Link
              href="/"
              className="px-4 py-2 border text-(--color-text) font-semibold rounded hover:opacity-90 border-(--color-border) hover:border-transparent transition-all hover:bg-(--color-primary)"
            >
              Tamborradata
            </Link>
          </li>
          <Years />
        </ul>
      </nav>
    </header>
  );
}
