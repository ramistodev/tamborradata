import { useState, type PointerEvent } from 'react';
import { WIDTH } from '../constants';

/** Index of the edition closest to the pointer (mouse, touch or pen) over the chart. */
export function useChartHover(positions: number[]) {
  const [hovered, setHovered] = useState<number | null>(null);

  function hoverNearest(event: PointerEvent<SVGSVGElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const pointerX = ((event.clientX - rect.left) / rect.width) * WIDTH;
    let nearest = 0;

    positions.forEach((position, index) => {
      if (Math.abs(position - pointerX) < Math.abs(positions[nearest] - pointerX)) {
        nearest = index;
      }
    });
    setHovered(nearest);
  }

  return {
    hovered,
    handlers: {
      onPointerDown: hoverNearest,
      onPointerMove: hoverNearest,
      // `pointerleave` fires as soon as a finger lifts: keep what a touch selected until the next one.
      onPointerLeave: (event: PointerEvent<SVGSVGElement>) => {
        if (event.pointerType === 'mouse') {
          setHovered(null);
        }
      },
      onPointerCancel: () => setHovered(null),
    },
  };
}
