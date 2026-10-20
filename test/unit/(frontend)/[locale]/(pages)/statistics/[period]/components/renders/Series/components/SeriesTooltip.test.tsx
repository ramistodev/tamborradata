import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SeriesTooltip } from '@/app/(frontend)/[locale]/(pages)/statistics/[period]/components/renders/Series/components/SeriesTooltip';
import type { TooltipEntry } from '@/app/(frontend)/[locale]/(pages)/statistics/[period]/components/renders/Series/lib/stats';
import type { Line } from '@/app/(frontend)/[locale]/(pages)/statistics/[period]/components/renders/Series/types';
import { renderWithIntl } from '@/test/helpers/renderWithIntl';

const lineA: Line = { key: 'a', label: 'Line A', color: 'red', values: new Map() };
const lineB: Line = { key: 'b', label: 'Line B', color: 'blue', values: new Map() };
const entry = (line: Line, value: number, change: number | null): TooltipEntry => ({ line, value, change });

function renderTooltip(props: Partial<Parameters<typeof SeriesTooltip>[0]> = {}) {
  return renderWithIntl(
    <SeriesTooltip
      dimensionKey="2024"
      x={320}
      width={640}
      entries={[entry(lineB, 30, 0.5), entry(lineA, 15, null)]}
      {...props}
    />,
  );
}

const card = (container: HTMLElement) => container.firstElementChild as HTMLElement;

describe('SeriesTooltip', () => {
  it('shows the edition and one row per entry with label and value', () => {
    renderTooltip();

    const rows = screen.getAllByRole('listitem', { hidden: true });

    expect(screen.getByText('2024')).toBeInTheDocument();
    expect(rows).toHaveLength(2);
    expect(rows[0]).toHaveTextContent('Line B');
    expect(rows[0]).toHaveTextContent('30');
    expect(rows[1]).toHaveTextContent('Line A');
    expect(rows[1]).toHaveTextContent('15');
  });

  it('is hidden from assistive technology', () => {
    const { container } = renderTooltip();

    expect(card(container)).toHaveAttribute('aria-hidden', 'true');
  });

  it('formats a positive change as a signed percentage', () => {
    renderTooltip({ entries: [entry(lineA, 20, 1)] });

    expect(screen.getByText(/^\+100\s%$/)).toBeInTheDocument();
  });

  it('formats a negative change as danger', () => {
    renderTooltip({ entries: [entry(lineA, 15, -0.25)] });

    const change = screen.getByText(/^[-−]25\s%$/);

    expect(change).toHaveClass('text-text-danger');
  });

  it('colors a positive change as success', () => {
    renderTooltip({ entries: [entry(lineA, 20, 1)] });

    expect(screen.getByText(/^\+100\s%$/)).toHaveClass('text-text-success');
  });

  it('renders no percentage when the change is null', () => {
    renderTooltip({ entries: [entry(lineA, 15, null)] });

    expect(screen.getByRole('listitem', { hidden: true }).textContent).not.toMatch(/%/);
  });

  it('renders nothing without entries', () => {
    const { container } = renderTooltip({ entries: [] });

    expect(container).toBeEmptyDOMElement();
  });

  describe('position', () => {
    it('places the card at the x position as a percentage of the width', () => {
      const { container } = renderTooltip({ x: 320, width: 640 });

      expect(card(container).style.left).toBe('50%');
    });

    it('opens to the right of the cursor near the left edge', () => {
      const { container } = renderTooltip({ x: 100, width: 640 });

      expect(card(container).style.left).toBe(`${(100 / 640) * 100}%`);
      expect(card(container).style.transform).toBe('translateX(8px)');
    });

    it('opens to the left of the cursor near the right edge', () => {
      const { container } = renderTooltip({ x: 600, width: 640 });

      expect(card(container).style.transform).toBe('translateX(calc(-100% - 8px))');
    });

    it('is centered on the cursor in the middle', () => {
      const { container } = renderTooltip({ x: 320, width: 640 });

      expect(card(container).style.transform).toBe('translateX(-50%)');
    });
  });
});
