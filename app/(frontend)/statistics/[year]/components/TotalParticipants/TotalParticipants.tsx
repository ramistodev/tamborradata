import ReactMarkdown from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';
import { useTotalParticipants } from './hooks/useTotalParticipants';
import { hasData } from '@/app/(frontend)/helpers/hasData';
import { TotalParticipantsTable } from './components/TotalParticipantsTable';

export function TotalParticipants() {
  const totalParticipantsHook = useTotalParticipants();
  const { totalParticipantsStats } = totalParticipantsHook;

  if (!hasData(totalParticipantsStats)) return null;

  return (
    <section className="w-full">
      <h2 className="text-lg md:text-2xl font-bold">
        Participantes totales —{' '}
        <span className="text-sm rounded p-1 bg-(--color-primary)">
          {totalParticipantsStats[0].category}
        </span>
      </h2>
      <article className="flex flex-col items-start justify-center py-5 relative">
        <TotalParticipantsTable {...totalParticipantsHook} />
      </article>
      <div className="w-full text-sm sm:text-md md:text-base flex flex-col gap-3">
        <ReactMarkdown rehypePlugins={[rehypeSanitize]}>
          {totalParticipantsStats[0].summary}
        </ReactMarkdown>
      </div>
    </section>
  );
}
