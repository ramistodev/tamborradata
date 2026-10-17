'use client';
import { useEffect, useState } from 'react';

// A text cursor blinks about once a second: on for half of it, off for the other half
const BLINK_MS = 530;

/**
 * A typing caret. Solid while `blinking` is false; when it is true it turns on and off, hard, like
 * the cursor of a focused text field. Remount it (with a `key`) when `blinking` changes so it always
 * starts visible. Tailwind has no on/off animation, so the toggle is state, and only this leaf
 * re-renders.
 */
export function Caret() {
  const [on, setOn] = useState(true);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const id = setInterval(() => setOn((prev) => !prev), BLINK_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <span
      aria-hidden="true"
      className={`ml-1 inline-block h-[0.95em] w-0.75 bg-accent align-[-0.1em] ${on ? 'opacity-100' : 'opacity-0'}`}
    />
  );
}
