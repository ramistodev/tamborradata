import { useEffect, useMemo, useRef, useState } from 'react';
import { chartLayout, DEFAULT_LAYOUT } from '../lib/chartLayout';

/** Layout that follows the width of the element `ref` is attached to. */
export function useChartLayout() {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState<number | null>(null);

  useEffect(() => {
    const element = ref.current;

    if (!element) {
      return;
    }

    const observer = new ResizeObserver(([entry]) => {
      const nextWidth = Math.round(entry.contentRect.width);

      // A hidden tab panel measures 0: keep the last layout until it is visible again.
      if (nextWidth > 0) {
        setWidth(nextWidth);
      }
    });

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  const layout = useMemo(() => (width === null ? DEFAULT_LAYOUT : chartLayout(width)), [width]);

  return { ref, layout };
}
