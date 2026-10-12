import { useState, type KeyboardEvent, type PointerEvent } from 'react';

/**
 * Edition selected on the chart: the one closest to the pointer, or the one the arrow keys reached.
 * With `pointerEnabled` off (the compact phone layout) the pointer selects nothing: the reading
 * lives in the legend and the key figures instead. Keyboard selection always works.
 */
export function useChartHover(positions: number[], width: number, pointerEnabled: boolean) {
  const [hovered, setHovered] = useState<number | null>(null);

  function hoverNearest(event: PointerEvent<HTMLElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const pointerX = ((event.clientX - rect.left) / rect.width) * width;
    let nearest = 0;

    positions.forEach((position, index) => {
      if (Math.abs(position - pointerX) < Math.abs(positions[nearest] - pointerX)) {
        nearest = index;
      }
    });
    setHovered(nearest);
  }

  // Arrow keys walk the editions, so the chart is not mouse-only. Works in every layout.
  function handleKeyDown(event: KeyboardEvent<HTMLElement>) {
    const last = positions.length - 1;
    const next: Record<string, number | null> = {
      ArrowRight: hovered === null ? 0 : Math.min(last, hovered + 1),
      ArrowLeft: hovered === null ? last : Math.max(0, hovered - 1),
      Home: 0,
      End: last,
      Escape: null,
    };

    if (last < 0 || !(event.key in next)) {
      return;
    }

    event.preventDefault();
    setHovered(next[event.key]);
  }

  const keyboardHandlers = { onKeyDown: handleKeyDown, onBlur: () => setHovered(null) };

  // On the compact phone layout the pointer selects nothing: the reading lives in the legend.
  if (!pointerEnabled) {
    return { hovered, handlers: keyboardHandlers };
  }

  return {
    hovered,
    handlers: {
      ...keyboardHandlers,
      onPointerDown: hoverNearest,
      onPointerMove: hoverNearest,
      // `pointerleave` fires as soon as a finger lifts: keep what a touch selected until the next one.
      onPointerLeave: (event: PointerEvent<HTMLElement>) => {
        if (event.pointerType === 'mouse') {
          setHovered(null);
        }
      },
      onPointerCancel: () => setHovered(null),
    },
  };
}
