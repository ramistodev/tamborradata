import Link from 'next/link';
import { useHeader } from '../hooks/useHeader';
import { LoadingYears } from '@/app/(frontend)/loaders/LoadingYears';
import { usePathname } from 'next/navigation';
import { hasData } from '@/app/(frontend)/helpers/hasData';

export function Years() {
  const { years, isLoading } = useHeader();
  const pathname = usePathname();

  if (!hasData(years) && !isLoading) return null;

  return (
    <>
      <li>
        {pathname === '/statistics/global' ? (
          <span className="px-2 py-1 rounded font-semibold bg-(--color-primary) text-(--color-text) cursor-default">
            Global
          </span>
        ) : (
          <Link
            href={`/statistics/global`}
            className="px-2 py-1 rounded font-semibold hover:bg-(--color-loading)"
          >
            Global
          </Link>
        )}
      </li>
      {isLoading ? (
        <LoadingYears />
      ) : (
        years?.map((year) => (
          <li key={year}>
            {pathname === `/statistics/${year}` ? (
              <span className="px-2 py-1 rounded bg-(--color-primary) text-(--color-text) cursor-default">
                {year}
              </span>
            ) : (
              <Link
                href={`/statistics/${year}`}
                className="px-2 py-1 rounded hover:bg-(--color-loading)"
              >
                {year}
              </Link>
            )}
          </li>
        ))
      )}
    </>
  );
}
