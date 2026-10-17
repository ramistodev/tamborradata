'use client';
import { useFormatter } from 'next-intl';
import { OverviewResponse } from '../../../../types/api/overview.types';
import { useHero } from '../hooks/useHero';
import { Caret } from './Caret';
import { useOverviewMetric } from '../hooks/useOverviewMetric';

export function Hero({ overview }: { overview: OverviewResponse | null }) {
  const { description, overviewRef } = useHero();
  const { overviewMetrics } = useOverviewMetric({ overview, ref: overviewRef });
  const globalPeriod = overviewMetrics?.globalPeriod;

  return (
    <section className="w-full min-h-[calc(100dvh-var(--header-h)-1px)] flex flex-col items-start justify-center gap-4 pt-10 lg:pt-10">
      <div className="flex flex-col items-start gap-4 lg:gap-6">
        <div className="flex flex-col items-start justify-between gap-2 sm:gap-3 lg:gap-4">
          <h1 className="text-[40px] sm:text-7xl lg:text-9xl font-extrabold">Tamborradata</h1>
          <p className="text-xl sm:text-2xl lg:text-4xl h-15 sm:h-20 font-title text-accent font-semibold">
            {description}
            <Caret />
          </p>
        </div>
        <div className="flex flex-col items-start w-full max-w-2xl">
          <p className="text-lg sm:text-xl text-text-secondary text-balance">
            Tamborradata reúne las listas de participantes de la Tamborrada Infantil de Donostia
            desde 2008 y las convierte en estadísticas, evolución por colegios y un buscador para
            encontrar a cualquiera.
          </p>
        </div>
      </div>
      <div className="w-full flex flex-col items-start gap-4 pt-10">
        {globalPeriod && (
          <div ref={overviewRef} className="w-full flex flex-col">
            <span className="w-full border border-border mb-5 lg:mb-10" />
            <div className="w-full max-w-xl lg:max-w-3xl flex flex-col items-start gap-2">
              <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-x-5 gap-y-6">
                <ShowMetric wide value={globalPeriod.totalParticipations} label="Participaciones" />
                <ShowMetric value={globalPeriod.editionsCount} label="Ediciones" />
                <ShowMetric value={globalPeriod.totalSchools} label="Colegios" />
              </div>
              <div>
                <p className="font-mono text-sm text-text-secondary text-balance">
                  <span>
                    {globalPeriod.startYear} - {globalPeriod.endYear}
                  </span>
                  <span aria-hidden="true">{' · '}</span>
                  <span>Nombre mas repetido {globalPeriod.topName.label}</span>
                  <span aria-hidden="true">{' · '}</span>
                  <span className="wrap-break-word">Apellido {globalPeriod.topSurname.label}</span>
                  <span aria-hidden="true">{' · '}</span>
                  <span>Colegio {globalPeriod.topSchool.label}</span>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function ShowMetric({
  wide = false,
  value,
  label,
}: {
  wide?: boolean;
  value: number;
  label: string;
}) {
  const formatter = useFormatter();
  return (
    <div className={`flex flex-col items-start gap-1 ${wide ? 'col-span-2' : 'col-span-1'}`}>
      <span className="text-4xl sm:text-5xl lg:text-6xl font-mono font-semibold tabular-nums">
        {formatter.number(value)}
      </span>
      <span className="text-base lg:text-lg text-text-secondary uppercase font-mono">{label}</span>
    </div>
  );
}
