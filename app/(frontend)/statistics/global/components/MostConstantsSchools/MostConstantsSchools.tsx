import ReactMarkdown from 'react-markdown';
import { MostConstantSchoolTable } from './components/MostConstantsSchoolsTable';
import { useMostConstantsSchools } from './hooks/useMostConstantsSchools';
import { hasData } from '@/app/(frontend)/helpers/hasData';

export function MostConstantsSchools() {
  const MostConstantsSchoolsHook = useMostConstantsSchools();
  const { stats } = MostConstantsSchoolsHook;

  if (!hasData(stats)) return null;

  return (
    <section className="w-full">
      <h2 className="text-lg md:text-2xl font-bold">
        Colegios Más Activos —{' '}
        <span className="text-sm rounded p-1 bg-(--color-primary)">{stats[0].category}</span>
      </h2>
      <article className="flex flex-col items-start justify-center py-5 relative">
        <MostConstantSchoolTable {...MostConstantsSchoolsHook} />
      </article>
      <div className="w-full text-sm sm:text-md md:text-base flex flex-col gap-3">
        <ReactMarkdown>{stats[0].summary}</ReactMarkdown>
      </div>
    </section>
  );
}
