import ReactMarkdown from 'react-markdown';
import { hasData } from '@/app/(frontend)/helpers/hasData';
import { useCommonNameBySchool } from './hook/useCommonNameBySchool';
import { CommonNameBySchoolTable } from './components/CommonNameBySchoolTable';

export function CommonNameBySchool() {
  const CommonNameHook = useCommonNameBySchool();
  const { stats } = CommonNameHook;

  if (!hasData(stats)) return null;

  return (
    <section className="w-full">
      <h2 className="text-lg md:text-2xl font-bold">
        Nombres mas comunes entre colegios —{' '}
        <span className="text-sm rounded p-1 bg-(--color-primary)">{stats[0].category}</span>
      </h2>
      <article className="flex flex-col items-start justify-center py-5 relative">
        <CommonNameBySchoolTable {...CommonNameHook} />
      </article>
      <div className="w-full text-sm sm:text-md md:text-base flex flex-col gap-3">
        <ReactMarkdown>{stats[0].summary}</ReactMarkdown>
      </div>
    </section>
  );
}
