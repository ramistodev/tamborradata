import { fireEvent, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { SeriesLegend } from '@/app/(frontend)/[locale]/(pages)/statistics/[period]/components/renders/Series/components/SeriesLegend';
import { buildChart } from '@/app/(frontend)/[locale]/(pages)/statistics/[period]/components/renders/Series/lib/buildChart';
import { makeSeriesPoint } from '@/test/fixtures/statistics';
import { messagesByLocale } from '@/test/helpers/messages';
import { renderWithIntl } from '@/test/helpers/renderWithIntl';

const m = messagesByLocale.es;
const point = (entity: 'a' | 'b', year: number, value: number) =>
  makeSeriesPoint({
    entityKey: entity,
    entityLabel: `Line ${entity.toUpperCase()}`,
    dimensionKey: String(year),
    dimensionOrder: year,
    value,
  });
const data = [point('a', 2022, 10), point('a', 2023, 20), point('a', 2024, 15), point('b', 2023, 5), point('b', 2024, 30)];
const chart = buildChart(data, 'Fallback', 10);

function setup(props: Partial<Parameters<typeof SeriesLegend>[0]> = {}) {
  const onToggle = vi.fn();
  const onFocus = vi.fn();
  const view = renderWithIntl(
    <SeriesLegend
      lines={chart.lines}
      dimensions={chart.dimensions}
      hiddenKeys={new Set()}
      showLatest={false}
      onToggle={onToggle}
      onFocus={onFocus}
      {...props}
    />,
  );
  return { ...view, onToggle, onFocus };
}

describe('SeriesLegend', () => {
  it('renders a named list with one button per line', () => {
    setup();

    const list = screen.getByRole('list', { name: m.Statistics.layout.legendLabel });
    const buttons = within(list).getAllByRole('button');

    expect(buttons.map((button) => button.textContent)).toEqual(chart.lines.map((line) => line.label));
  });

  it('marks visible lines as pressed and hidden lines as not pressed', () => {
    setup({ hiddenKeys: new Set(['a']) });

    expect(screen.getByRole('button', { name: 'Line A' })).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByRole('button', { name: 'Line B' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('toggles a line on click', async () => {
    const { user, onToggle } = setup();

    await user.click(screen.getByRole('button', { name: 'Line A' }));

    expect(onToggle).toHaveBeenCalledWith('a');
  });

  it('highlights a line while the pointer is over its chip', () => {
    const { onFocus } = setup();
    const button = screen.getByRole('button', { name: 'Line A' });

    fireEvent.pointerEnter(button);
    expect(onFocus).toHaveBeenLastCalledWith('a');

    fireEvent.pointerLeave(button);
    expect(onFocus).toHaveBeenLastCalledWith(null);
  });

  it('highlights a line while its chip has keyboard focus', () => {
    const { onFocus } = setup();
    const button = screen.getByRole('button', { name: 'Line B' });

    fireEvent.focus(button);
    expect(onFocus).toHaveBeenLastCalledWith('b');

    fireEvent.blur(button);
    expect(onFocus).toHaveBeenLastCalledWith(null);
  });

  it('adds the latest value to each chip when showLatest is true', () => {
    setup({ showLatest: true });

    expect(within(screen.getByRole('button', { name: /^Line A/ })).getByText('15')).toBeInTheDocument();
    expect(within(screen.getByRole('button', { name: /^Line B/ })).getByText('30')).toBeInTheDocument();
  });

  it('shows only the label when showLatest is false', () => {
    setup({ showLatest: false });

    expect(screen.getByRole('button', { name: 'Line A' })).toHaveTextContent(/^Line A$/);
  });
});
