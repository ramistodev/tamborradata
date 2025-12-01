import ReactMarkdown from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';
import { useGlobal } from '../../hooks/useGlobal';
import { hasData } from '@/app/(frontend)/helpers/hasData';

export function NamesSurnamesDiversity() {
  const { stats } = useGlobal();

  const names = stats.namesDiversity;
  const surnames = stats.surnamesDiversity;

  if (hasData(names) && hasData(surnames)) return null;

  return (
    <section className="w-full">
      <section className="w-full">
        <h2 className="text-lg md:text-2xl mb-5 font-bold">
          Diversidad de nombres y apellidos —{' '}
          <span className="text-sm rounded p-1 bg-(--color-primary)">
            {names[0].category} + {surnames[0].category}
          </span>
        </h2>
        <article className="flex items-center justify-evenly bg-(--color-bg-secondary) p-2 rounded-lg border border-(--color-border) my-5">
          <div className="flex flex-col gap-3 items-center bg-(--color-bg) rounded-md border border-(--color-border) p-2 md:p-5">
            <p className="text-xs sm:text-sm md:text-md font-semibold text-(--color-text-thirdary)">
              Nombres únicos
            </p>
            <span className="text-lg md:text-2xl font-bold text-(--color-text)">
              {names[0].public_data}
            </span>
          </div>
          <div className="flex flex-col gap-3 items-center bg-(--color-bg) rounded-md border border-(--color-border) p-2 md:p-5">
            <p className="text-xs sm:text-sm md:text-md font-semibold text-(--color-text-thirdary)">
              Apellidos únicos
            </p>
            <span className="text-lg md:text-2xl font-bold text-(--color-text)">
              {surnames[0].public_data}
            </span>
          </div>
        </article>
        <div className="w-full text-sm sm:text-md md:text-base flex flex-col gap-3">
          {names[0].summary && (
            <ReactMarkdown rehypePlugins={[rehypeSanitize]}>{names[0].summary}</ReactMarkdown>
          )}
          {surnames[0].summary && (
            <ReactMarkdown rehypePlugins={[rehypeSanitize]}>{surnames[0].summary}</ReactMarkdown>
          )}
        </div>
      </section>
    </section>
  );
}
