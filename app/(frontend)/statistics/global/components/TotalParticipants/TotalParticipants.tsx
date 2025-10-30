import ReactMarkdown from 'react-markdown';
import { useTotalParticipants } from './hooks/useTotalParticipants';
import { hasData } from '@/app/(frontend)/helpers/hasData';
import { TotalParticipantsTable } from './components/TotalParticipantsTable';
import dynamic from 'next/dynamic';
import { LoadingChart } from '@/app/(frontend)/loaders/LoadingChart';

const TotalParticipantsChart = dynamic(
  () => import('./components/TotalParticipantsChart').then((mod) => mod.TotalParticipantsChart),
  { ssr: false, loading: () => <LoadingChart /> }
);

export function TotalParticipants() {
  const TotalParticipantsHook = useTotalParticipants();
  const { stats, chart, showChart } = TotalParticipantsHook;

  if (!hasData(stats)) return null;

  return (
    <section className="w-full">
      <h2 className="text-lg md:text-2xl font-bold">
        Participantes totales —{' '}
        <span className="text-sm rounded p-1 bg-(--color-primary)">{stats[0].category}</span>
      </h2>
      <article className="flex flex-col items-start justify-center py-5 relative">
        <span
          onClick={showChart}
          className="hidden md:block py-1 px-3 mb-3 rounded bg-(--color-primary) cursor-pointer hover:opacity-80"
        >
          {chart ? 'Ver tabla' : 'Ver gráfico'}
        </span>
        {chart ? (
          <TotalParticipantsChart {...TotalParticipantsHook} />
        ) : (
          <TotalParticipantsTable {...TotalParticipantsHook} />
        )}
      </article>
      <div className="w-full text-sm sm:text-md md:text-base flex flex-col gap-3">
        <ReactMarkdown>{stats[0].summary}</ReactMarkdown>
      </div>
    </section>
  );
}
