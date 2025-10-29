import Link from 'next/link';
import { useHeader } from '../hooks/useHeader';
import { YearsLoading } from './YearsLoading';
import { useParams } from 'next/navigation';

export function Years() {
  const { years, isLoading } = useHeader();
  const params = useParams();
  return (
    <>
      <li>
        <Link
          href="/statistics/global"
          className={`px-4 py-2 border text-(--color-text) font-semibold rounded hover:opacity-90 ${
            params.year ? 'border-(--color-border)' : 'bg-(--color-primary) border-transparent'
          }`}
        >
          Globales
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
                  ? 'bg-(--color-primary) text-(--color-text) font-semibold '
                  : 'hover:bg-(--color-loading)'
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
