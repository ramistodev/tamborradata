import { act, fireEvent, screen, within } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SeriesChart } from '@/app/(frontend)/[locale]/(pages)/statistics/[period]/components/renders/Series/components/SeriesChart';
import { makeSeriesPoint } from '@/test/fixtures/statistics';
import { messagesByLocale } from '@/test/helpers/messages';
import { MockResizeObserver } from '@/test/helpers/observers';
import { renderWithIntl } from '@/test/helpers/renderWithIntl';

const m = messagesByLocale.es.Statistics.layout;
const point = (entity: 'a' | 'b', year: number, value: number) =>
  makeSeriesPoint({
    entityKey: entity,
    entityLabel: `Line ${entity.toUpperCase()}`,
    dimensionKey: String(year),
    dimensionOrder: year,
    value,
  });
const twoLines = () => [
  point('a', 2022, 10),
  point('a', 2023, 20),
  point('a', 2024, 15),
  point('b', 2023, 5),
  point('b', 2024, 30),
];
const oneLine = () => [point('a', 2022, 10), point('a', 2023, 20), point('a', 2024, 15)];

function setup(data = twoLines()) {
  return renderWithIntl(<SeriesChart label="Trends" data={data} />);
}

const group = () => screen.getByRole('group', { name: 'Trends' });
const tooltip = (container: HTMLElement) => container.querySelector('div.pointer-events-none');

describe('SeriesChart', () => {
  beforeEach(() => {
    class TestPointerEvent extends MouseEvent {
      pointerType: string;
      pointerId: number;
      constructor(type: string, init: PointerEventInit = {}) {
        super(type, init);
        this.pointerType = init.pointerType ?? '';
        this.pointerId = init.pointerId ?? 0;
      }
    }
    vi.stubGlobal('PointerEvent', TestPointerEvent);
  });

  describe('structure', () => {
    it('renders a focusable group named after the label and described by the hint', () => {
      setup();

      expect(group()).toHaveAttribute('tabindex', '0');
      expect(group()).toHaveAccessibleDescription(m.chartHint);
    });

    it('draws a decorative svg with one line path per line', () => {
      const { container } = setup();

      const svg = container.querySelector('svg');

      expect(svg).toHaveAttribute('aria-hidden', 'true');
      expect(svg?.querySelectorAll('path.series-draw')).toHaveLength(2);
    });

    it('exposes every line and edition in a table for screen readers', () => {
      setup();

      const table = screen.getByRole('table', { name: 'Trends' });

      expect(within(table).getAllByRole('columnheader').map((header) => header.textContent).sort()).toEqual([
        'Line A',
        'Line B',
      ]);
      expect(within(table).getAllByRole('rowheader').map((header) => header.textContent)).toEqual([
        '2022',
        '2023',
        '2024',
      ]);
    });

    it('shows the legend and no summary with several lines', () => {
      setup();

      expect(screen.getByRole('list', { name: m.legendLabel })).toBeInTheDocument();
      expect(screen.queryByText(m.seriesLatest)).not.toBeInTheDocument();
    });

    it('shows the summary and the markers and no legend with a single line', () => {
      const { container } = setup(oneLine());

      expect(screen.getByText(m.seriesLatest)).toBeInTheDocument();
      expect(screen.getByText(m.seriesPeak)).toBeInTheDocument();
      expect(container.querySelector('circle.series-pulse')).not.toBeNull();
      expect(screen.queryByRole('list', { name: m.legendLabel })).not.toBeInTheDocument();
    });

    it('renders nothing with fewer than two editions', () => {
      const { container } = setup([point('a', 2022, 10)]);

      expect(container).toBeEmptyDOMElement();
    });

    it('renders nothing without lines', () => {
      const { container } = setup([]);

      expect(container).toBeEmptyDOMElement();
    });
  });

  describe('keyboard', () => {
    it('announces the first edition on ArrowRight and shows the tooltip', async () => {
      const { user, container } = setup();
      act(() => group().focus());

      await user.keyboard('{ArrowRight}');

      expect(screen.getByRole('status')).toHaveTextContent('2022: Line A 10');
      expect(tooltip(container)).toHaveAttribute('aria-hidden', 'true');
      expect(tooltip(container)).toHaveTextContent('2022');
    });

    it('lists every line of the edition in the announcement, biggest first', async () => {
      const { user } = setup();
      act(() => group().focus());

      await user.keyboard('{ArrowRight}{ArrowRight}{ArrowRight}');

      expect(screen.getByRole('status')).toHaveTextContent('2024: Line B 30, Line A 15');
    });

    it('clears the announcement and the tooltip on Escape', async () => {
      const { user, container } = setup();
      act(() => group().focus());
      await user.keyboard('{ArrowRight}');

      await user.keyboard('{Escape}');

      expect(screen.getByRole('status')).toBeEmptyDOMElement();
      expect(tooltip(container)).toBeNull();
    });
  });

  describe('pointer', () => {
    it('shows the tooltip of the edition nearest to the pointer', () => {
      const { container } = setup();
      vi.spyOn(group(), 'getBoundingClientRect').mockReturnValue({ left: 0, width: 640 } as DOMRect);

      fireEvent.pointerMove(group(), { clientX: 331, pointerType: 'mouse' });

      expect(tooltip(container)).toHaveTextContent('2023');
    });

    it('hides the tooltip when the mouse leaves', () => {
      const { container } = setup();
      vi.spyOn(group(), 'getBoundingClientRect').mockReturnValue({ left: 0, width: 640 } as DOMRect);
      fireEvent.pointerMove(group(), { clientX: 331, pointerType: 'mouse' });

      fireEvent.pointerLeave(group(), { pointerType: 'mouse' });

      expect(tooltip(container)).toBeNull();
    });
  });

  describe('legend', () => {
    it('hides a line when its chip is pressed', async () => {
      const { user, container } = setup();

      await user.click(screen.getByRole('button', { name: 'Line A' }));

      expect(screen.getByRole('button', { name: 'Line A' })).toHaveAttribute('aria-pressed', 'false');
      expect(container.querySelectorAll('svg path.series-draw')).toHaveLength(1);
    });
  });

  describe('compact layout', () => {
    function compact() {
      act(() => MockResizeObserver.instances[0].trigger(400));
    }

    it('shows the latest value in each legend chip', () => {
      setup();

      compact();

      expect(within(screen.getByRole('button', { name: /^Line A/ })).getByText('15')).toBeInTheDocument();
      expect(within(screen.getByRole('button', { name: /^Line B/ })).getByText('30')).toBeInTheDocument();
    });

    it('does not show a tooltip for the pointer', () => {
      const { container } = setup();
      compact();
      vi.spyOn(group(), 'getBoundingClientRect').mockReturnValue({ left: 0, width: 400 } as DOMRect);

      fireEvent.pointerMove(group(), { clientX: 200, pointerType: 'mouse' });

      expect(tooltip(container)).toBeNull();
    });

    it('still shows the tooltip for the keyboard', async () => {
      const { user, container } = setup();
      compact();
      act(() => group().focus());

      await user.keyboard('{ArrowRight}');

      expect(tooltip(container)).toHaveTextContent('2022');
      expect(screen.getByRole('status')).toHaveTextContent('2022: Line A 10');
    });
  });
});
