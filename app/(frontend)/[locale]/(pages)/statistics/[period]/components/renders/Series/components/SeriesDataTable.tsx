import { useNumberFormatter } from '../../../../../../../../i18n/useNumberFormatter';
import type { Dimension, Line } from '../types';

type SeriesDataTableProps = { caption: string; dimensions: Dimension[]; lines: Line[] };

/** The chart's numbers as a table only screen readers see: the SVG alone says nothing to them. */
export function SeriesDataTable({ caption, dimensions, lines }: SeriesDataTableProps) {
  const format = useNumberFormatter();

  return (
    <table className="sr-only">
      <caption>{caption}</caption>
      <thead>
        <tr>
          <td />
          {lines.map((line) => (
            <th key={line.key} scope="col">
              {line.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {dimensions.map((dimension) => (
          <tr key={dimension.key}>
            <th scope="row">{dimension.key}</th>
            {lines.map((line) => {
              const value = line.values.get(dimension.key);

              return <td key={line.key}>{value === undefined ? '—' : format.format(value)}</td>;
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
