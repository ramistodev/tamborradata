import { act, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useChartLayout } from '@/app/(frontend)/[locale]/(pages)/statistics/[period]/components/renders/Series/hooks/useChartLayout';
import { MockResizeObserver } from '@/test/helpers/observers';

function Harness() {
  const { ref, layout } = useChartLayout();
  return <div ref={ref} data-testid="h" data-width={layout.width} data-compact={String(layout.compact)} />;
}

describe('useChartLayout', () => {
  it('starts with the default layout and observes its element', () => {
    render(<Harness />);
    const element = screen.getByTestId('h');
    expect(element).toHaveAttribute('data-width', '640');
    expect(element).toHaveAttribute('data-compact', 'false');
    expect(MockResizeObserver.instances).toHaveLength(1);
    expect(MockResizeObserver.instances[0].observed.has(element)).toBe(true);
  });

  it('rounds measurements, switches layouts, and retains the last nonzero width', () => {
    render(<Harness />);
    const element = screen.getByTestId('h');
    const observer = MockResizeObserver.instances[0];
    act(() => observer.trigger(400));
    expect(element).toHaveAttribute('data-width', '400');
    expect(element).toHaveAttribute('data-compact', 'true');
    act(() => observer.trigger(0));
    expect(element).toHaveAttribute('data-width', '400');
    act(() => observer.trigger(400.6));
    expect(element).toHaveAttribute('data-width', '401');
    act(() => observer.trigger(100));
    expect(element).toHaveAttribute('data-width', '240');
    act(() => observer.trigger(800));
    expect(element).toHaveAttribute('data-width', '640');
    expect(element).toHaveAttribute('data-compact', 'false');
  });

  it('disconnects on unmount', () => {
    const { unmount } = render(<Harness />);
    const observer = MockResizeObserver.instances[0];
    unmount();
    expect(observer.observed.size).toBe(0);
  });
});
