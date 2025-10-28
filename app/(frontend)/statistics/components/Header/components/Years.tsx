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
          className={`px-4 py-2 border text-[#1e1e1e] font-semibold rounded dark:text-[#f2f5fa] hover:opacity-90 ${
            params.year
              ? 'border-[#bebebe] dark:border-[#2c3e66]'
              : 'bg-[#789cff] dark:bg-[#0f47af] border-transparent'
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
              className={`px-2 py-1 rounded hover:bg-[#d9e2f5] dark:hover:bg-[#2c3e66] ${
                params.year === String(year)
                  ? 'bg-[#789cff] text-[#1e1e1e] font-semibold dark:bg-[#0f47af] dark:text-[#f2f5fa]'
                  : ''
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
