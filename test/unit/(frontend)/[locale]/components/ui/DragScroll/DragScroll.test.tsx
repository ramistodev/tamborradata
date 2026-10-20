import { createRef } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { DragScroll } from '@/app/(frontend)/[locale]/components/ui/DragScroll/DragScroll';

const pointer = (clientX: number, overrides = {}) => ({
  pointerType: 'mouse',
  button: 0,
  clientX,
  pointerId: 1,
  ...overrides,
});

describe('DragScroll', () => {
  beforeEach(() => {
    // jsdom has no PointerEvent: this stub carries the fields React reads.
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

  it('renders its children', () => {
    render(
      <DragScroll>
        <span>tab</span>
      </DragScroll>,
    );

    expect(screen.getByText('tab')).toBeInTheDocument();
  });

  it('scrolls horizontally and applies the className', () => {
    render(<DragScroll data-testid="scroller" className="custom" />);

    const scroller = screen.getByTestId('scroller');

    expect(scroller).toHaveClass('overflow-x-auto');
    expect(scroller).toHaveClass('custom');
  });

  it('forwards role, aria-label and tabIndex', () => {
    render(<DragScroll role="tablist" aria-label="Periods" tabIndex={0} />);

    const scroller = screen.getByRole('tablist', { name: 'Periods' });

    expect(scroller).toHaveAttribute('tabindex', '0');
  });

  it('hands the element to an object ref', () => {
    const ref = createRef<HTMLDivElement>();
    render(<DragScroll ref={ref} data-testid="scroller" />);

    expect(ref.current).toBe(screen.getByTestId('scroller'));
  });

  it('hands the element to a callback ref', () => {
    const ref = vi.fn();
    render(<DragScroll ref={ref} data-testid="scroller" />);

    expect(ref).toHaveBeenCalledWith(screen.getByTestId('scroller'));
  });

  it('shows the grabbing cursor only while a mouse drag is in progress', () => {
    render(<DragScroll data-testid="scroller" />);
    const scroller = screen.getByTestId('scroller');

    fireEvent.pointerDown(scroller, pointer(100));
    fireEvent.pointerMove(scroller, pointer(110));

    expect(scroller).toHaveClass('cursor-grabbing');

    fireEvent.pointerUp(scroller, pointer(110));

    expect(scroller).not.toHaveClass('cursor-grabbing');
  });
});
