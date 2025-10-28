'use client';
import { useMemo } from 'react';
import { Year } from '../../../types/types';
import { ResponsiveLine } from '@nivo/line';
import { CloseIcon } from '@/app/(frontend)/icons/icons';

export function SchoolsEvolutionChart({
  data,
  showChart,
}: {
  data: Year[];
  showChart: () => void;
}) {
  // Normalizar a la forma que espera ResponsiveLine
  const fromatedData = useMemo(
    () => [
      {
        id: 'count',
        data: data.map((d) => ({ x: String(d.year), y: Number(d.count ?? 0) })),
      },
    ],
    [data]
  );

  // Calcula min/max del eje Y con padding
  const { yMin, yMax, tickValues } = useMemo(() => {
    const values = data.map((d) => Number(d.count ?? 0));
    const max = Math.max(0, ...values);
    // padding: usa +20 como pediste o 10% del máximo (lo que sea mayor)
    const pad = Math.max(20, Math.ceil(max * 0.1));
    const min = 0;
    const hardMax = max + pad;

    // genera ticks “bonitos”: ~5–6 divisiones
    const divisions = 5;
    const step = Math.max(1, Math.ceil(hardMax / divisions));
    const ticks: number[] = [];
    for (let t = min; t <= hardMax; t += step) ticks.push(t);

    return { yMin: min, yMax: hardMax, tickValues: ticks };
  }, [data]);

  return (
    <div className="fixed inset-0 z-999 flex items-center justify-center p-4 bg-[#00000080] bg-opacity-50">
      <div className="relative w-[800px] h-[400px] bg-white rounded-2xl px-3 py-10">
        <button
          className="absolute top-3 right-3 p-2 rounded-full 
          hover:bg-gray-800 transition-colors cursor-pointer"
          onClick={() => showChart()}
        >
          <CloseIcon />
        </button>
        <ResponsiveLine
          data={fromatedData}
          margin={{ top: 20, right: 30, bottom: 60, left: 60 }}
          xScale={{ type: 'point' }}
          yScale={{
            type: 'linear',
            stacked: false,
            min: yMin,
            max: yMax,
            nice: false,
          }}
          axisBottom={{
            tickRotation: 0,
            legend: 'Year',
            legendOffset: 46,
            legendPosition: 'middle',
          }}
          axisLeft={{
            legend: 'Count',
            legendOffset: -50,
            legendPosition: 'middle',
            tickValues, // <- controla los ticks del eje Y
            format: (v) => `${v}`, // fuerza enteros en labels
          }}
          yFormat=">-.0f" // <- y en tooltip/labels, formato entero
          colors={['#2c3e66']}
          pointSize={8}
          pointColor={{ theme: 'background' }}
          pointBorderWidth={2}
          pointBorderColor="#2c3e66"
          enableSlices="x"
          useMesh
          enablePoints
          enableArea={false}
          animate
          theme={{
            text: { fill: 'black', fontSize: 12 },
            tooltip: { container: { fontSize: 12 } },
          }}
          tooltip={({ point }) => (
            <div className="bg-white p-2 rounded shadow">
              <strong>{point.data.xFormatted ?? point.data.x}</strong>:{' '}
              {point.data.yFormatted ?? point.data.y}
            </div>
          )}
          gridYValues={tickValues} // cuadrícula alineada con los ticks
        />
      </div>
    </div>
  );
}
