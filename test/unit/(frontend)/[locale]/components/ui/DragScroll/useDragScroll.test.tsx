import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useDragScroll } from '@/app/(frontend)/[locale]/components/ui/DragScroll/useDragScroll';

function Harness({ onChildClick = vi.fn() }: { onChildClick?: () => void }) {
  const { ref, isDragging, handlers } = useDragScroll<HTMLDivElement>();
  return <div ref={ref} data-testid="s" data-dragging={String(isDragging)} {...handlers}><button onClick={onChildClick}>child</button></div>;
}

const pointer = (clientX: number, overrides = {}) => ({
  pointerType: 'mouse', button: 0, clientX, pointerId: 1, ...overrides,
});

describe('useDragScroll', () => {
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

  it('starts dragging at exactly four pixels and scrolls from the press position', () => {
    render(<Harness />);
    const element = screen.getByTestId('s');
    Object.defineProperty(element, 'scrollLeft', { configurable: true, writable: true, value: 200 });
    fireEvent.pointerDown(element, pointer(100));
    fireEvent.pointerMove(element, pointer(96));
    expect(element).toHaveAttribute('data-dragging', 'true');
    expect(element.setPointerCapture).toHaveBeenCalledWith(1);
    expect(element.scrollLeft).toBe(204);
    fireEvent.pointerMove(element, pointer(90));
    expect(element.scrollLeft).toBe(210);
    fireEvent.pointerMove(element, pointer(120));
    expect(element.scrollLeft).toBe(180);
  });

  it('does not drag below the threshold', () => {
    render(<Harness />);
    const element = screen.getByTestId('s');
    Object.defineProperty(element, 'scrollLeft', { configurable: true, writable: true, value: 200 });
    fireEvent.pointerDown(element, pointer(100));
    fireEvent.pointerMove(element, pointer(97));
    expect(element).toHaveAttribute('data-dragging', 'false');
    expect(element.scrollLeft).toBe(200);
  });

  it.each(['pointerUp', 'pointerCancel'] as const)('ends dragging on %s', (eventName) => {
    render(<Harness />);
    const element = screen.getByTestId('s');
    vi.mocked(element.hasPointerCapture).mockReturnValue(true);
    fireEvent.pointerDown(element, pointer(100));
    fireEvent.pointerMove(element, pointer(90));
    fireEvent[eventName](element, pointer(90));
    expect(element).toHaveAttribute('data-dragging', 'false');
    expect(element.releasePointerCapture).toHaveBeenCalledWith(1);
  });

  it('ignores touch pointers and secondary mouse buttons', () => {
    render(<Harness />);
    const element = screen.getByTestId('s');
    Object.defineProperty(element, 'scrollLeft', { configurable: true, writable: true, value: 200 });
    fireEvent.pointerDown(element, pointer(100, { pointerType: 'touch' }));
    fireEvent.pointerMove(element, pointer(80, { pointerType: 'touch' }));
    fireEvent.pointerDown(element, pointer(100, { button: 2 }));
    fireEvent.pointerMove(element, pointer(80, { button: 2 }));
    expect(element).toHaveAttribute('data-dragging', 'false');
    expect(element.scrollLeft).toBe(200);
  });

  it('swallows only the first child click after a drag', () => {
    const onChildClick = vi.fn();
    render(<Harness onChildClick={onChildClick} />);
    const element = screen.getByTestId('s');
    const child = screen.getByRole('button', { name: 'child' });
    fireEvent.pointerDown(element, pointer(100));
    fireEvent.pointerMove(element, pointer(90));
    fireEvent.pointerUp(element, pointer(90));
    fireEvent.click(child);
    expect(onChildClick).not.toHaveBeenCalled();
    fireEvent.click(child);
    expect(onChildClick).toHaveBeenCalledOnce();
  });

  it('allows a normal click without dragging', () => {
    const onChildClick = vi.fn();
    render(<Harness onChildClick={onChildClick} />);
    fireEvent.click(screen.getByRole('button', { name: 'child' }));
    expect(onChildClick).toHaveBeenCalledOnce();
  });
});
