import ReactMarkdown from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';
import { useNewSchools } from './hooks/useNewSchools';
import { hasData } from '@/app/(frontend)/helpers/hasData';
import { NewSchoolsTable } from './components/NewSchoolsTable';

export function NewSchools() {
  const TotalParticipantsHook = useNewSchools();
  const { stats } = TotalParticipantsHook;

  if (!hasData(stats)) return null;

  return (
    <section className="w-full">
      <h2 className="text-lg md:text-2xl font-bold">
        Colegios nuevos —{' '}
        <span className="text-sm rounded p-1 bg-(--color-primary)">{stats[0].category}</span>
      </h2>
      <article className="flex flex-col items-start justify-center py-5 relative">
        <NewSchoolsTable {...TotalParticipantsHook} />
      </article>
      <div className="w-full text-sm sm:text-md md:text-base flex flex-col gap-3">
        <ReactMarkdown rehypePlugins={[rehypeSanitize]}>{stats[0].summary}</ReactMarkdown>
      </div>
    </section>
  );
}
