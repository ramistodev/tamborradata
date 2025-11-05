import ReactMarkdown from 'react-markdown';
import { hasData } from '@/app/(frontend)/helpers/hasData';
import { useNewNames } from './hooks/useNewNames';
import { NewNamesTable } from './components/NewNamesTable';

export function NewNames() {
  const TopNameHook = useNewNames();
  const { stats } = TopNameHook;

  if (!hasData(stats)) return null;

  return (
    <section className="w-full">
      <h2 className="text-lg md:text-2xl font-bold">
        Nombres que aparecen por primera vez —{' '}
        <span className="text-sm rounded p-1 bg-(--color-primary)">{stats[0].category}</span>
      </h2>
      <article className="flex flex-col items-start justify-center py-5 relative">
        <NewNamesTable {...TopNameHook} />
      </article>
      <div className="w-full text-sm sm:text-md md:text-base flex flex-col gap-3">
        <ReactMarkdown>{stats[0].summary}</ReactMarkdown>
      </div>
    </section>
  );
}
