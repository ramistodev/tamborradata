import { act, fireEvent, render, renderHook, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { useStatisticsMenu } from '@/app/(frontend)/[locale]/components/Header/hooks/useStatisticsMenu';

function Harness() {
  const { containerProps, buttonRef, toggle, isOpen } = useStatisticsMenu();
  return (
    <>
      <div {...containerProps}>
        <button ref={buttonRef} onClick={toggle}>btn</button>
        <a href="#x">inside</a>
        <a href="#y">second inside</a>
      </div>
      <button>outside</button>
      <output data-testid="open">{String(isOpen)}</output>
    </>
  );
}

describe('useStatisticsMenu', () => {
  it('toggles and closes directly', () => {
    const { result } = renderHook(() => useStatisticsMenu());

    expect(result.current.isOpen).toBe(false);
    act(() => result.current.toggle());
    expect(result.current.isOpen).toBe(true);
    act(() => result.current.toggle());
    expect(result.current.isOpen).toBe(false);
    act(() => result.current.toggle());
    act(() => result.current.close());
    expect(result.current.isOpen).toBe(false);
  });

  it('opens only for mouse hover and delays mouse leave', () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useStatisticsMenu());

    act(() => result.current.containerProps.onPointerEnter({ pointerType: 'touch' } as never));
    expect(result.current.isOpen).toBe(false);
    act(() => result.current.containerProps.onPointerEnter({ pointerType: 'mouse' } as never));
    expect(result.current.isOpen).toBe(true);
    act(() => result.current.containerProps.onPointerLeave({ pointerType: 'mouse' } as never));
    act(() => vi.advanceTimersByTime(249));
    expect(result.current.isOpen).toBe(true);
    act(() => vi.advanceTimersByTime(1));
    expect(result.current.isOpen).toBe(false);
  });

  it('cancels a pending close on re-entry or toggle', () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useStatisticsMenu());
    act(() => result.current.containerProps.onPointerEnter({ pointerType: 'mouse' } as never));
    act(() => result.current.containerProps.onPointerLeave({ pointerType: 'mouse' } as never));
    act(() => vi.advanceTimersByTime(100));
    act(() => result.current.containerProps.onPointerEnter({ pointerType: 'mouse' } as never));
    act(() => vi.advanceTimersByTime(300));
    expect(result.current.isOpen).toBe(true);

    act(() => result.current.containerProps.onPointerLeave({ pointerType: 'mouse' } as never));
    act(() => result.current.toggle());
    act(() => vi.advanceTimersByTime(300));
    expect(result.current.isOpen).toBe(false);
  });

  it('responds only to Escape while open and removes the key listener after closing', () => {
    const remove = vi.spyOn(document, 'removeEventListener');
    const { result } = renderHook(() => useStatisticsMenu());
    act(() => result.current.toggle());
    act(() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' })));
    expect(result.current.isOpen).toBe(true);
    act(() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' })));
    expect(result.current.isOpen).toBe(false);
    expect(remove).toHaveBeenCalledWith('keydown', expect.any(Function));
    act(() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' })));
    expect(result.current.isOpen).toBe(false);
  });

  it('opens by click and returns focus to the trigger on Escape', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    fireEvent.click(screen.getByRole('button', { name: 'btn' }));
    expect(screen.getByTestId('open')).toHaveTextContent('true');
    await user.click(screen.getByRole('link', { name: 'inside' }));
    await user.keyboard('{Escape}');
    expect(screen.getByTestId('open')).toHaveTextContent('false');
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'btn' }));
  });

  it('closes when focus leaves the container', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    fireEvent.click(screen.getByRole('button', { name: 'btn' }));
    await user.click(screen.getByRole('link', { name: 'inside' }));
    await user.tab();
    expect(document.activeElement).toBe(screen.getByRole('link', { name: 'second inside' }));
    expect(screen.getByTestId('open')).toHaveTextContent('true');
    await user.tab();
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'outside' }));
    expect(screen.getByTestId('open')).toHaveTextContent('false');
  });

  it('closes on an explicit blur to an outside target', () => {
    render(<Harness />);
    fireEvent.click(screen.getByRole('button', { name: 'btn' }));
    fireEvent.blur(screen.getByRole('link', { name: 'inside' }), {
      relatedTarget: screen.getByRole('button', { name: 'outside' }),
    });
    expect(screen.getByTestId('open')).toHaveTextContent('false');
  });
});
