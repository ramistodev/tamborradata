import ReactMarkdown from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';
import { useTopNames } from './hooks/useTopNames';
import { TopNamesTable } from './components/TopNamesTable';
import { hasData } from '@/app/(frontend)/helpers/hasData';
import dynamic from 'next/dynamic';
import { LoadingChart } from '@/app/(frontend)/statistics/components/loaders/LoadingChart';

const TopNamesChart = dynamic(
  () => import('./components/TopNamesChart').then((mod) => mod.TopNamesChart),
  { ssr: false, loading: () => <LoadingChart /> }
);

export function TopNames() {
  const topNamesHook = useTopNames();
  const { topNamesStats, chart, showChart } = topNamesHook;

  if (!hasData(topNamesStats)) return null;

  return (
    <section className="w-full">
      <h2 className="text-lg md:text-2xl font-bold">
        Nombres mas repetidos —{' '}
        <span className="text-sm rounded p-1 bg-(--color-primary)">
          {topNamesStats[0].category}
        </span>
      </h2>
      <article className="flex flex-col items-start justify-center py-5 relative">
        <button
          onClick={showChart}
          className="hidden md:block py-1 px-3 mb-3 rounded bg-(--color-primary) cursor-pointer hover:opacity-80"
        >
          {chart ? 'Ver tabla' : 'Ver gráfico'}
        </button>
        {chart ? <TopNamesChart {...topNamesHook} /> : <TopNamesTable {...topNamesHook} />}
      </article>
      <div className="w-full text-sm sm:text-md md:text-base flex flex-col gap-3">
        <ReactMarkdown rehypePlugins={[rehypeSanitize]}>{topNamesStats[0].summary}</ReactMarkdown>
      </div>
    </section>
  );
}
