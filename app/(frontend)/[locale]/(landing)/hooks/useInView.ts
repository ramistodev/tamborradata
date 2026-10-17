import { useEffect, useState } from 'react';

export function useInView({
  ref,
  threshold = 0.2,
}: {
  ref: React.RefObject<HTMLDivElement | null>;
  threshold?: number;
}) {
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold }
    );
    observer.observe(element);

    return () => observer.disconnect();
  }, [ref, threshold]);

  return { isInView };
}
