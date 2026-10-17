import { getFormatter } from 'next-intl/server';
import { Link } from '@/app/(frontend)/i18n/navigation';
import { Icons } from '../../../components/Icons';
import type { OverviewResponse } from '../../../../../types/api/overview.types';
import { ExampleResultCard } from './ExampleResultCard';
import { SearchSteps } from './SearchSteps';

const STEPS = [
  {
    title: 'Escribe nombre y dos apellidos',
    description: 'Si tiene nombre compuesto, vale con uno solo.',
  },
  {
    title: 'Elige el colegio',
    description: 'Evita mezclar a personas con el mismo nombre.',
  },
  {
    title: 'Consulta sus años y fuentes',
    description: 'Cada edición enlaza a la noticia o lista donde figura.',
  },
];

export async function SearchParticipantsSection({
  overview,
}: {
  overview: OverviewResponse | null;
}) {
  const format = await getFormatter();
  const total = overview?.globalPeriod?.totalParticipations;
  // Without the overview the sentence still reads well, it just does not quote a figure
  const searchScope =
    total === undefined
      ? 'todas las participaciones'
      : `${format.number(total, { useGrouping: 'always' })} participaciones`;

  return (
    <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
      <div className="flex flex-col items-start gap-6">
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-balance">
          ¿En qué años salió tu hijo o hija en la Tamborrada?
        </h2>
        <p className="text-sm sm:text-lg lg:text-xl text-text-secondary text-balance">
          Busca por nombre y apellidos entre {searchScope} y descubre en qué ediciones aparece, con
          el enlace a la fuente original de cada año.
        </p>

        <SearchSteps steps={STEPS} />

        <Link
          href="/search-participants"
          className="inline-flex w-fit items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-bg transition-opacity duration-200 hover:opacity-85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent motion-reduce:transition-none"
        >
          Ir al buscador
          <Icons.ArrowRight className="size-4" />
        </Link>
      </div>

      <ExampleResultCard />
    </div>
  );
}
