import ReactMarkdown from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';
import { MostConstantSchoolTable } from './components/MostConstantsSchoolsTable';
import { useMostConstantsSchools } from './hooks/useMostConstantsSchools';
import { hasData } from '@/app/(frontend)/helpers/hasData';

export function MostConstantsSchools() {
  const mostConstantsSchoolsHook = useMostConstantsSchools();
  const { mostConstantSchools } = mostConstantsSchoolsHook;

  if (!hasData(mostConstantSchools)) return null;

  return (
    <section className="w-full">
      <h2 className="text-lg md:text-2xl font-bold">
        Colegios más activos —{' '}
        <span className="text-sm rounded p-1 bg-(--color-primary)">
          {mostConstantSchools[0].category}
        </span>
      </h2>
      <article className="flex flex-col items-start justify-center py-5 relative">
        <MostConstantSchoolTable {...mostConstantsSchoolsHook} />
      </article>
      <div className="w-full text-sm sm:text-md md:text-base flex flex-col gap-3">
        <ReactMarkdown rehypePlugins={[rehypeSanitize]}>
          {mostConstantSchools[0].summary}
        </ReactMarkdown>
      </div>
    </section>
  );
}
