import { useEffect, useRef, useState } from 'react';

export function useAnimatedProgress({ active, duration }: { active: boolean; duration: number }) {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [makedTiks, setMakedTiks] = useState<number>(0);
  const tikDuration = 50;
  const tiksAc = makedTiks * tikDuration;
  const progress = Math.min(1, tiksAc / duration);

  useEffect(() => {
    if (!active) return;

    intervalRef.current = setInterval(() => {
      setMakedTiks((prev) => prev + 1);
    }, 50);

    return () => clearInterval(intervalRef.current as NodeJS.Timeout);
  }, [active, duration]);

  useEffect(() => {
    if (progress === 1) {
      clearInterval(intervalRef.current as NodeJS.Timeout);
    }
  }, [progress]);

  return { progress };
}
