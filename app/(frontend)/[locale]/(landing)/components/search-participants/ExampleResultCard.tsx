import { Icons } from '../../../components/Icons';

interface ExampleSource {
  year: number;
  host: string;
}

const EXAMPLE_SOURCES: ExampleSource[] = [
  { year: 2019, host: 'diariovasco.com' },
  { year: 2023, host: 'diariovasco.com' },
  { year: 2026, host: 'diariovasco.com' },
];

/**
 * Static mock of a search result, so visitors see what the search gives back before using it.
 * Nothing in it is a real person or a real link: the rows only look like the real ones.
 */
export function ExampleResultCard() {
  return (
    <figure className="flex w-full flex-col gap-3" aria-label="Ejemplo ilustrativo de un resultado">
      <div className="flex flex-col gap-5 rounded-2xl border border-border bg-bg-secondary p-6 sm:p-8 hover:border-accent hover:-rotate-1 hover:-translate-y-2 hover:shadow-lg transition-all">
        <header className="flex flex-col gap-2">
          <p className="font-mono text-xs font-semibold uppercase tracking-widest text-accent">
            Coincidencia exacta
          </p>
          <p className="font-title text-2xl font-semibold text-text sm:text-3xl">
            Nombre Apellido Apellido
          </p>
          <p className="font-mono text-xs text-text-secondary">Tu colegio</p>
        </header>

        <div className="flex flex-col gap-2">
          <p className="font-mono text-xs uppercase tracking-widest text-text-tertiary">
            {EXAMPLE_SOURCES.length} participaciones · Fuentes
          </p>
          <ul className="flex flex-col divide-y divide-border border-y border-border">
            {EXAMPLE_SOURCES.map(({ year, host }) => (
              <li key={year} className="flex items-center gap-4 py-3">
                <span className="shrink-0 font-mono text-sm font-bold text-text">{year}</span>
                <span className="min-w-0 flex-1 truncate font-mono text-xs text-text-tertiary">
                  {host}
                </span>
                <span className="flex shrink-0 items-center gap-1.5 text-xs font-semibold text-accent">
                  Ver fuente
                  <Icons.ExternalLink className="size-3.5" />
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <figcaption className="text-center text-sm text-text-tertiary">
        Ejemplo ilustrativo
      </figcaption>
    </figure>
  );
}
