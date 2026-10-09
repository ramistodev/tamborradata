import { useRef, useState, type PointerEvent, type MouseEvent } from 'react';

// Pixels the pointer has to travel before a press stops being a click and becomes a drag.
const DRAG_THRESHOLD = 4;

/** Lets a horizontally scrollable element be scrolled by holding the mouse button and dragging. */
export function useDragScroll<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const drag = useRef({ pressed: false, moved: false, startX: 0, startScroll: 0 });
  const [isDragging, setIsDragging] = useState(false);

  function onPointerDown(event: PointerEvent<T>) {
    // Touch and pen already scroll natively; only the primary mouse button drags.
    if (event.pointerType !== 'mouse' || event.button !== 0 || !ref.current) {
      return;
    }

    drag.current = {
      pressed: true,
      moved: false,
      startX: event.clientX,
      startScroll: ref.current.scrollLeft,
    };
  }

  function onPointerMove(event: PointerEvent<T>) {
    const element = ref.current;
    const state = drag.current;

    if (!state.pressed || !element) {
      return;
    }

    const delta = event.clientX - state.startX;

    if (!state.moved) {
      if (Math.abs(delta) < DRAG_THRESHOLD) {
        return;
      }

      state.moved = true;
      setIsDragging(true);
      element.setPointerCapture(event.pointerId);
    }

    element.scrollLeft = state.startScroll - delta;
  }

  function endDrag(event: PointerEvent<T>) {
    const element = ref.current;

    if (drag.current.moved && element?.hasPointerCapture(event.pointerId)) {
      element.releasePointerCapture(event.pointerId);
    }

    drag.current.pressed = false;
    setIsDragging(false);
  }

  // A drag that ends over a child would also fire its click (selecting a tab by accident): swallow it.
  function onClickCapture(event: MouseEvent<T>) {
    if (drag.current.moved) {
      event.preventDefault();
      event.stopPropagation();
      drag.current.moved = false;
    }
  }

  return {
    ref,
    isDragging,
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp: endDrag,
      onPointerCancel: endDrag,
      onClickCapture,
    },
  };
}
