'use client';

import { useCallback, type HTMLAttributes, type Ref } from 'react';
import { useDragScroll } from './useDragScroll';

type DragScrollProps = HTMLAttributes<HTMLDivElement> & {
  /** Reaches the scroll container; it is merged with the one the drag behaviour needs. */
  ref?: Ref<HTMLDivElement>;
};

/**
 * Horizontal scroll container that can also be dragged with the mouse (hold the button and move).
 * Touch keeps its native scrolling. A drag never triggers the click of the children it ends over.
 */
export function DragScroll({
  ref: forwardedRef,
  className = '',
  children,
  ...props
}: DragScrollProps) {
  const { ref, isDragging, handlers } = useDragScroll<HTMLDivElement>();

  const setRefs = useCallback(
    (node: HTMLDivElement | null) => {
      ref.current = node;

      if (typeof forwardedRef === 'function') {
        forwardedRef(node);
      } else if (forwardedRef) {
        forwardedRef.current = node;
      }
    },
    [ref, forwardedRef]
  );

  return (
    <div
      ref={setRefs}
      className={`overflow-x-auto ${
        isDragging ? 'cursor-grabbing select-none *:cursor-grabbing' : ''
      } ${className}`}
      {...handlers}
      {...props}
    >
      {children}
    </div>
  );
}
