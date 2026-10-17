import { useEffect, useRef, useState } from 'react';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

/** From 0 to 1 in `duration` ms once `active`. With reduced motion requested it is 1 right away. */
export function useAnimatedProgress({ active, duration }: { active: boolean; duration: number }) {
  const reducedMotion = usePrefersReducedMotion();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [makedTiks, setMakedTiks] = useState<number>(0);
  const tikDuration = 50;
  const tiksAc = makedTiks * tikDuration;
  const progress = reducedMotion ? 1 : Math.min(1, tiksAc / duration);

  useEffect(() => {
    if (!active || reducedMotion) return;

    intervalRef.current = setInterval(() => {
      setMakedTiks((prev) => prev + 1);
    }, 50);

    return () => clearInterval(intervalRef.current as NodeJS.Timeout);
  }, [active, duration, reducedMotion]);

  useEffect(() => {
    if (progress === 1) {
      clearInterval(intervalRef.current as NodeJS.Timeout);
    }
  }, [progress]);

  return { progress };
}
