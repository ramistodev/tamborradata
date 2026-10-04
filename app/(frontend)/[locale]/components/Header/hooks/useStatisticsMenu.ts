import { useCallback, useEffect, useRef, useState } from 'react';
import type { FocusEvent, PointerEvent } from 'react';

// Grace period so the menu doesn't close if the pointer strays for a moment.
const CLOSE_DELAY_MS = 250;

/**
 * State of the statistics disclosure menu. One `isOpen` changed by hover (mouse only),
 * click, Escape and focus leaving the menu.
 */
export function useStatisticsMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const open = useCallback(() => {
    clearTimeout(closeTimer.current);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    clearTimeout(closeTimer.current);
    setIsOpen(false);
  }, []);

  const closeSoon = useCallback(() => {
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setIsOpen(false), CLOSE_DELAY_MS);
  }, []);

  const toggle = useCallback(() => {
    clearTimeout(closeTimer.current);
    setIsOpen((prev) => !prev);
  }, []);

  useEffect(() => () => clearTimeout(closeTimer.current), []);

  // Escape closes it, and gives the focus back to the button if it was inside the menu
  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== 'Escape') return;
      if (containerRef.current?.contains(document.activeElement)) buttonRef.current?.focus();
      close();
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, close]);

  // Hover only reacts to a mouse: on touch screens a tap fires hover + click and would
  // open and immediately close the menu.
  const containerProps = {
    ref: containerRef,
    onPointerEnter: (event: PointerEvent) => event.pointerType === 'mouse' && open(),
    onPointerLeave: (event: PointerEvent) => event.pointerType === 'mouse' && closeSoon(),
    onBlur: (event: FocusEvent<HTMLElement>) => {
      if (!event.currentTarget.contains(event.relatedTarget)) close();
    },
  };

  return { isOpen, close, toggle, buttonRef, containerProps };
}
