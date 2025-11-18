import ReactMarkdown from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';
import { hasData } from '@/app/(frontend)/helpers/hasData';
import { useCommonNamesBySchool } from './hooks/useCommonNamesBySchool';
import { CommonNamesBySchoolTable } from './components/CommonNamesBySchoolTable';

export function CommonNamesBySchool() {
  const CommonNameHook = useCommonNamesBySchool();
  const { stats } = CommonNameHook;

  if (!hasData(stats)) return null;

  return (
    <section className="w-full">
      <h2 className="text-lg md:text-2xl font-bold">
        Nombres más comunes entre colegios —{' '}
        <span className="text-sm rounded p-1 bg-(--color-primary)">{stats[0].category}</span>
      </h2>
      <article className="flex flex-col items-start justify-center py-5 relative">
        <CommonNamesBySchoolTable {...CommonNameHook} />
      </article>
      <div className="w-full text-sm sm:text-md md:text-base flex flex-col gap-3">
        <ReactMarkdown rehypePlugins={[rehypeSanitize]}>{stats[0].summary}</ReactMarkdown>
      </div>
    </section>
  );
}
