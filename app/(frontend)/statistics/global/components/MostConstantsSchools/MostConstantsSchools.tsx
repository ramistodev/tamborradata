import ReactMarkdown from 'react-markdown';
import { MostConstantSchool } from '../../types/types';
import { MostConstantSchoolTable } from './components/MostConstantsSchoolsTable';
import { useMostConstantsSchools } from './hooks/useMostConstantsSchools';

export function MostConstantsSchools({ data }: { data: MostConstantSchool[] }) {
  const { stats } = useMostConstantsSchools(data);

  if (!stats || stats.length === 0 || !stats[0]) {
    return null;
  }
  return (
    <section className="w-full">
      <h2 className="text-2xl font-bold">
        Colegios Más Activos —{' '}
        <span className="text-sm rounded p-1 bg-[#2c3e66] dark:bg-[#d9e2f5] text-white dark:text-black">
          {stats[0].category}
        </span>
      </h2>
      <article className="flex flex-col items-start justify-center py-5 relative">
        <MostConstantSchoolTable data={data} />
      </article>
      <div className="w-full text-sm sm:text-md md:text-base flex flex-col gap-3">
        <ReactMarkdown>{stats[0].summary}</ReactMarkdown>
      </div>
    </section>
  );
}
