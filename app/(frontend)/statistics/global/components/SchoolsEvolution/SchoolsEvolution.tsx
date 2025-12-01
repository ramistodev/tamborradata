import ReactMarkdown from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';
import { useSchoolsEvolution } from './hooks/useSchoolsEvolution';
import { SchoolsEvolutionTable } from './components/SchoolsEvolutionTable';
import { hasData } from '@/app/(frontend)/helpers/hasData';
import dynamic from 'next/dynamic';
import { LoadingChart } from '@/app/(frontend)/statistics/components/loaders/LoadingChart';

const SchoolsEvolutionChart = dynamic(
  () => import('./components/SchoolsEvolutionChart').then((mod) => mod.SchoolsEvolutionChart),
  { ssr: false, loading: () => <LoadingChart absolute={true} /> }
);

export function SchoolsEvolution() {
  const schoolsEvolutionHook = useSchoolsEvolution();
  const { schoolsEvolution, chart, chartData } = schoolsEvolutionHook;

  if (!hasData(schoolsEvolution)) return null;

  return (
    <section className="w-full">
      <h2 className="text-lg md:text-2xl font-bold">
        Evolución de los colegios —{' '}
        <span className="text-sm rounded p-1 bg-(--color-primary)">
          {schoolsEvolution[0].category}
        </span>
      </h2>
      <article className="flex flex-col items-start justify-center py-5 relative overflow-hidden xl:overflow-visible">
        {chart && chartData ? <SchoolsEvolutionChart {...schoolsEvolutionHook} /> : null}
        <SchoolsEvolutionTable {...schoolsEvolutionHook} />
      </article>

      <div className="w-full text-sm sm:text-md md:text-base flex flex-col gap-3">
        <ReactMarkdown rehypePlugins={[rehypeSanitize]}>
          {schoolsEvolution[0].summary}
        </ReactMarkdown>
      </div>
    </section>
  );
}
