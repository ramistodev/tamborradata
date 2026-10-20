import { act, renderHook } from '@testing-library/react';
import type { KeyboardEvent } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { useChartHover } from '@/app/(frontend)/[locale]/(pages)/statistics/[period]/components/renders/Series/hooks/useChartHover';

const at = (clientX: number, rectWidth = 640, pointerType = 'mouse') => ({
  currentTarget: { getBoundingClientRect: () => ({ left: 0, width: rectWidth }) }, clientX, pointerType,
}) as never;
const key = (value: string) =>
  ({ key: value, preventDefault: vi.fn() }) as unknown as KeyboardEvent<HTMLElement>;

type HoverResult = ReturnType<typeof useChartHover>;
type PointerHandlers = Extract<HoverResult['handlers'], { onPointerMove: unknown }>;
const pointerHandlers = (result: { current: HoverResult }) => result.current.handlers as PointerHandlers;

function setup(pointer = true, positions = [46, 331, 616]) {
  return renderHook(() => useChartHover(positions, 640, pointer));
}

describe('useChartHover', () => {
  it('selects the nearest pointer position with container scaling', () => {
    const { result } = setup();
    for (const [event, expected] of [[at(300), 1], [at(10), 0], [at(630), 2], [at(150, 320), 1]] as const) {
      act(() => pointerHandlers(result).onPointerMove(event));
      expect(result.current.hovered).toBe(expected);
    }
    act(() => pointerHandlers(result).onPointerDown(at(10)));
    expect(result.current.hovered).toBe(0);
  });

  it('clears mouse leave and cancel but retains a touch selection', () => {
    const { result } = setup();
    act(() => pointerHandlers(result).onPointerMove(at(300)));
    act(() => pointerHandlers(result).onPointerLeave(at(0, 640, 'touch')));
    expect(result.current.hovered).toBe(1);
    act(() => pointerHandlers(result).onPointerLeave(at(0)));
    expect(result.current.hovered).toBeNull();
    act(() => pointerHandlers(result).onPointerMove(at(300)));
    act(() => pointerHandlers(result).onPointerCancel());
    expect(result.current.hovered).toBeNull();
  });

  it('navigates, bounds, and clears keyboard selection', () => {
    const { result } = setup();
    for (const [pressed, expected] of [
      ['ArrowRight', 0], ['ArrowRight', 1], ['ArrowRight', 2], ['ArrowRight', 2],
      ['Home', 0], ['ArrowLeft', 0], ['End', 2], ['Escape', null], ['ArrowLeft', 2],
    ] as const) {
      const event = key(pressed);
      act(() => result.current.handlers.onKeyDown(event));
      expect(result.current.hovered).toBe(expected);
      expect(event.preventDefault).toHaveBeenCalledOnce();
    }
    const ignored = key('a');
    act(() => result.current.handlers.onKeyDown(ignored));
    expect(ignored.preventDefault).not.toHaveBeenCalled();
    act(() => result.current.handlers.onBlur());
    expect(result.current.hovered).toBeNull();
  });

  it('ignores arrows without positions', () => {
    const { result } = setup(true, []);
    const event = key('ArrowRight');
    act(() => result.current.handlers.onKeyDown(event));
    expect(result.current.hovered).toBeNull();
    expect(event.preventDefault).not.toHaveBeenCalled();
  });

  it('exposes pointer handlers only when enabled while keeping keyboard support', () => {
    const disabled = setup(false);
    expect(Object.keys(disabled.result.current.handlers).sort()).toEqual(['onBlur', 'onKeyDown']);
    act(() => disabled.result.current.handlers.onKeyDown(key('ArrowRight')));
    expect(disabled.result.current.hovered).toBe(0);
    const enabled = setup(true);
    expect(Object.keys(enabled.result.current.handlers).sort()).toEqual([
      'onBlur', 'onKeyDown', 'onPointerCancel', 'onPointerDown', 'onPointerLeave', 'onPointerMove',
    ]);
  });
});
