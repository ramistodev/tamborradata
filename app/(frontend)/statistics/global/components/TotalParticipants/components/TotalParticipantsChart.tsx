import { ResponsiveLine } from '@nivo/line';
import { useTotalParticipants } from '../hooks/useTotalParticipants';
import { useMemo } from 'react';

export function TotalParticipantsChart({ stats }: ReturnType<typeof useTotalParticipants>) {
  // Normalizar a la forma que espera ResponsiveLine
  const fromatedData = useMemo(
    () => [
      {
        id: 'count',
        data:
          stats[0].public_data.map((d) => ({ x: String(d.year), y: Number(d.count ?? 0) })) || [],
      },
    ],
    [stats]
  );

  // Calcula min/max del eje Y con padding
  const { yMin, yMax, tickValues } = useMemo(() => {
    const values: number[] = fromatedData[0].data?.map((d) => Number(d.y)) || [];
    const max = Math.max(0, ...values);
    const pad = Math.max(20, Math.ceil(max * 0.1));
    const min = 0;
    const hardMax = max + pad;

    const divisions = 5;
    const step = Math.max(1, Math.ceil(hardMax / divisions));
    const ticks: number[] = [];
    for (let t = min; t <= hardMax; t += step) ticks.push(t);

    return { yMin: min, yMax: hardMax, tickValues: ticks };
  }, [fromatedData]);

  return (
    <div
      className="w-full h-[400px] bg-white rounded-2xl p-3 select-none"
      role="img"
      aria-label="Gráfico de líneas mostrando la evolución de participantes totales por año"
    >
      <ResponsiveLine
        data={fromatedData || []}
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
          tickValues,
          format: (v) => `${v}`,
        }}
        yFormat=">-.0f"
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
          tooltip: {
            container: {
              background: 'white',
              color: 'black',
              fontSize: 12,
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              padding: '8px 12px',
            },
          },
        }}
        tooltip={({ point }) => (
          <div className="bg-white px-3 py-2 rounded-lg shadow-lg border border-gray-200">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: point.color }} />
              <span className="text-sm font-semibold text-gray-900">Año {point.data.x}</span>
            </div>
            <div className="text-base font-bold text-blue-600">{point.data.y}</div>
          </div>
        )}
        gridYValues={tickValues}
      />
    </div>
  );
}
