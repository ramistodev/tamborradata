import { ResponsiveBar } from '@nivo/bar';
import { useTopSchools } from '../hooks/useTopShools';

export function TopSchoolsChart({ topSchoolsStats }: ReturnType<typeof useTopSchools>) {
  return (
    <div
      className="w-full h-[400px] bg-white rounded-2xl p-3 select-none"
      role="img"
      aria-label="Gráfico de barras mostrando los 15 colegios con más participantes"
    >
      <ResponsiveBar
        data={topSchoolsStats[0].public_data.slice(0, 15).map((item) => ({ ...item })) || []}
        keys={['count']}
        indexBy="school"
        margin={{ top: 20, right: 30, bottom: 50, left: 60 }}
        padding={0.3}
        colors={({ index }) => (index >= 3 ? '#09ffff' : '#09f')}
        borderRadius={5}
        borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
        axisBottom={{
          tickRotation: -70,
        }}
        labelSkipHeight={12}
        labelTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
        tooltip={({ indexValue, value }) => (
          <div
            style={{
              background: '#ffffff',
              color: '#000000',
              width: 'max-content',
              padding: '8px 15px',
              borderRadius: '6px',
              fontSize: 12,
              boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
            }}
          >
            <strong>{indexValue}</strong>: {value}
          </div>
        )}
        animate={true}
        theme={{
          text: {
            fill: 'black',
            fontSize: 14,
          },
        }}
      />
    </div>
  );
}
