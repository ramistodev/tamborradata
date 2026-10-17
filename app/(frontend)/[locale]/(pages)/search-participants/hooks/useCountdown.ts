import { useEffect, useState } from 'react';

const TICK_MS = 1000;

/**
 * Whole seconds left until `totalSeconds` have passed since the first render, updated every second.
 * It measures against a fixed deadline instead of subtracting one per tick, so a throttled
 * background tab shows the right value as soon as it wakes up.
 */
export function useCountdown(totalSeconds: number): number {
  const seconds = Number.isFinite(totalSeconds) && totalSeconds > 0 ? Math.ceil(totalSeconds) : 0;
  const [deadline] = useState(() => Date.now() + seconds * 1000);
  const [remaining, setRemaining] = useState(seconds);

  useEffect(() => {
    const timer = setInterval(() => {
      const left = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));

      setRemaining(left);
      if (left === 0) clearInterval(timer);
    }, TICK_MS);

    return () => clearInterval(timer);
  }, [deadline]);

  return remaining;
}
