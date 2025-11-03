import Link from 'next/link';
import { useHeader } from '../hooks/useHeader';
import { YearsLoading } from '@/app/(frontend)/loaders/YearsLoading';
import { useParams } from 'next/navigation';
import { hasData } from '@/app/(frontend)/helpers/hasData';

export function Years() {
  const { years, isLoading } = useHeader();
  const params = useParams();

  if (!hasData(years)) return null;

  return (
    <>
      <li>
        <Link
          href="/"
          className="px-4 py-2 border text-(--color-text) font-semibold rounded hover:opacity-90 border-(--color-border) hover:border-transparent transition-all hover:bg-(--color-primary)"
        >
          Tamborradata
        </Link>
      </li>
      <li>
        <Link
          href={`/statistics/global`}
          className={`px-2 py-1 rounded font-semibold ${
            params.year
              ? 'hover:bg-(--color-loading)'
              : 'bg-(--color-primary) text-(--color-text) cursor-default'
          }`}
        >
          Global
        </Link>
      </li>
      {isLoading ? (
        <YearsLoading />
      ) : (
        years?.map((year) => (
          <li key={year}>
            <Link
              href={`/statistics/${year}`}
              className={`px-2 py-1 rounded ${
                params.year === String(year)
                  ? 'bg-(--color-primary) text-(--color-text) cursor-default'
                  : 'hover:bg-(--color-loading) '
              }`}
            >
              {year}
            </Link>
          </li>
        ))
      )}
    </>
  );
}
