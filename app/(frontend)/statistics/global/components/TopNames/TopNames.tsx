import { TopName } from '../../types/types';
import ReactMarkdown from 'react-markdown';
import { useTopNames } from './hooks/useTopNames';
import { TopNamesChart } from './components/TopNamesChart';
import { TopNamesTable } from './components/TopNamesTable';

export function TopNames({ data }: { data: TopName[] }) {
  const { stats, chart, showChart } = useTopNames(data);

  if (!stats || stats.length === 0 || !stats[0]) {
    return null;
  }

  return (
    <section className="w-full">
      <h2 className="text-2xl font-bold">
        Top Nombres —{' '}
        <span className="text-sm rounded p-1 bg-[#2c3e66] dark:bg-[#d9e2f5] text-white dark:text-black">
          {stats[0].category}
        </span>
      </h2>
      <article className="flex flex-col items-start justify-center py-5 relative">
        <span
          onClick={showChart}
          className="hidden md:block py-1 px-3 mb-3 rounded bg-[#2c3e66] dark:bg-[#d9e2f5] text-white dark:text-black cursor-pointer hover:opacity-80"
        >
          {chart ? 'Ver tabla' : 'Ver gráfico'}
        </span>
        {chart ? (
          <TopNamesChart data={stats[0].public_data.slice(0, 15)} />
        ) : (
          <TopNamesTable data={data} />
        )}
      </article>
      <div className="w-full text-sm sm:text-md md:text-base flex flex-col gap-3">
        <ReactMarkdown>{stats[0].summary}</ReactMarkdown>
      </div>
    </section>
  );
}
