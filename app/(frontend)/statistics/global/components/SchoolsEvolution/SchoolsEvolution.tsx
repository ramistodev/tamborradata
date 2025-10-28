import ReactMarkdown from 'react-markdown';
import { useSchoolsEvolution } from './hooks/useSchoolsEvolution';
import { SchoolsEvolutionTable } from './components/SchoolsEvolutionTable';
import { SchoolsEvolutionChart } from './components/SchoolsEvolutionChart';
import { SchoolEvolution } from '../../types/types';

export function SchoolsEvolution({ data }: { data: SchoolEvolution[] }) {
  const { stats, chartData, chart, showChart } = useSchoolsEvolution(data);

  if (!stats || stats.length === 0 || !stats[0]) {
    return null;
  }

  return (
    <section className="w-full">
      <h2 className="text-2xl font-bold">
        Top Colegios —{' '}
        <span className="text-sm rounded p-1 bg-[#2c3e66] dark:bg-[#d9e2f5] text-white dark:text-black">
          {stats[0].category}
        </span>
      </h2>
      <article className="flex flex-col items-start justify-center py-5 relative overflow-hidden xl:overflow-visible">
        {chart && chartData ? (
          <SchoolsEvolutionChart data={chartData} showChart={showChart} />
        ) : null}
        <SchoolsEvolutionTable data={data} showChart={showChart} />
      </article>
      <div className="w-full text-sm sm:text-md md:text-base flex flex-col gap-3">
        <ReactMarkdown>{stats[0].summary}</ReactMarkdown>
      </div>
    </section>
  );
}
