import ReactMarkdown from 'react-markdown';
import { useTopSurnames } from './hooks/useTopSurnames';
import { TopSurnamesTable } from './components/TopSurnamesTable';
import { hasData } from '@/app/(frontend)/helpers/hasData';
import dynamic from 'next/dynamic';
import { LoadingChart } from '@/app/(frontend)/loaders/LoadingChart';

const TopSurnamesChart = dynamic(
  () => import('./components/TopSurnamesChart').then((mod) => mod.TopSurnamesChart),
  { ssr: false, loading: () => <LoadingChart /> }
);

export function TopSurnames() {
  const TopSurnamesHook = useTopSurnames();
  const { stats, chart, showChart } = TopSurnamesHook;

  if (!hasData(stats)) return null;

  return (
    <section className="w-full">
      <h2 className="text-lg md:text-2xl font-bold">
        Apellidos mas repetidos —{' '}
        <span className="text-sm rounded p-1 bg-(--color-primary)">{stats[0].category}</span>
      </h2>
      <article className="flex flex-col items-start justify-center py-5">
        <span
          onClick={showChart}
          className="hidden md:block py-1 px-3 mb-3 rounded bg-(--color-primary) cursor-pointer hover:opacity-80"
        >
          {chart ? 'Ver tabla' : 'Ver gráfico'}
        </span>
        {chart ? (
          <TopSurnamesChart {...TopSurnamesHook} />
        ) : (
          <TopSurnamesTable {...TopSurnamesHook} />
        )}
      </article>
      <div className="w-full text-sm sm:text-md md:text-base flex flex-col gap-3">
        <ReactMarkdown>{stats[0].summary}</ReactMarkdown>
      </div>
    </section>
  );
}
