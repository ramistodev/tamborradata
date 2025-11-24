import Link from 'next/link';
import { useStatisticsY } from '../hooks/useStatisticsY';

export function Desktop() {
  const { years, pathname } = useStatisticsY();

  return (
    <>
      <nav className="relative flex w-full items-center justify-center gap-7 lg:gap-15 py-4 px-6 bg-(--color-header)">
        <Link
          href="/"
          className={`absolute -left-15 lg:left-0 top-1/2 translate-x-1/2 -translate-y-1/2 text-2xl font-semibold transition-colors ${pathname.length === 1 ? 'text-(--eye-catching-text) cursor-default' : 'hover:text-(--eye-catching-text)'}`}
        >
          Tamborradata
        </Link>
        <div className="relative group">
          <p
            className={`text-lg lg:text-xl text-(--color-text-secondary) transition-colors font-medium cursor-default ${pathname.includes('/statistics') ? 'text-(--eye-catching-text) cursor-default' : 'group-hover:text-(--eye-catching-text)'}`}
          >
            Estadísticas
          </p>
          <div className="absolute top-full opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-opacity z-999">
            <ul className="grid grid-cols-[repeat(auto-fit,minmax(70px,1fr))] gap-2 bg-(--color-header) border border-(--color-border) rounded-lg mt-2 py-2 px-4 shadow-[0_0_15px_0px_var(--color-border)] w-[500px]">
              <li>
                <Link
                  href={`/statistics/global`}
                  className={`text-lg block px-4 py-2 text-(--color-text-secondary) hover:text-(--eye-catching-text) transition-colors ${pathname === '/statistics/global' ? 'text-(--eye-catching-text)' : ''}`}
                >
                  Global
                </Link>
              </li>
              {years?.map((year: number) => (
                <li key={year}>
                  <Link
                    href={`/statistics/${year}`}
                    className={`text-lg block px-4 py-2 text-(--color-text-secondary) hover:text-(--eye-catching-text) transition-colors ${pathname === `/statistics/${year}` ? 'text-(--eye-catching-text) cursor-default' : ''}`}
                  >
                    {year}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <Link
          href="/search"
          className={`text-lg lg:text-xl text-(--color-text-secondary) transition-colors font-medium ${pathname.includes('/search') ? 'text-(--eye-catching-text) cursor-default' : 'hover:text-(--eye-catching-text)'}`}
        >
          Buscar participante
        </Link>
        <span className="absolute top-full h-3 bg-linear-to-b from-(--color-header) to-transparent w-full"></span>
      </nav>
    </>
  );
}
