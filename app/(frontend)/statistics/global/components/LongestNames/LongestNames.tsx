import ReactMarkdown from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';
import { hasData } from '@/app/(frontend)/helpers/hasData';
import { useLongestNames } from './hooks/useLongestNames';
import { LongestNamesTable } from './components/LongestNamesTable';

export function LongestNames() {
  const longestNamesHook = useLongestNames();
  const { longestNames } = longestNamesHook;

  if (!hasData(longestNames)) return null;

  return (
    <section className="w-full">
      <h2 className="text-lg md:text-2xl font-bold">
        Nombres más largos —{' '}
        <span className="text-sm rounded p-1 bg-(--color-primary)">{longestNames[0].category}</span>
      </h2>
      <article className="flex flex-col items-start justify-center py-5 relative">
        <LongestNamesTable {...longestNamesHook} />
      </article>
      <div className="w-full text-sm sm:text-md md:text-base flex flex-col gap-3">
        <ReactMarkdown rehypePlugins={[rehypeSanitize]}>{longestNames[0].summary}</ReactMarkdown>
      </div>
    </section>
  );
}
