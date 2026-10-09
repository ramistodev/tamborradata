import { useEffect, useRef, useState } from 'react';
import { scrollToActiveElement } from '../utils/scrollToActiveElement';

const OBSERVER_MARGIN = '-140px 0px -60% 0px';

export function useActiveChapter(chapterIds: string[]) {
  const [activeId, setActiveId] = useState(chapterIds[0]);
  const containerRef = useRef<HTMLUListElement>(null);
  const activeRef = useRef<HTMLLIElement>(null);
  const idsKey = chapterIds.join(',');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const topmost = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];

        if (topmost) setActiveId(topmost.target.id);
      },
      { rootMargin: OBSERVER_MARGIN }
    );

    idsKey.split(',').forEach((id) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, [idsKey]);

  // Runs after the render that moved `activeRef` to the new item, whether the change came from
  // scrolling the page or from clicking a link.
  useEffect(() => {
    scrollToActiveElement(containerRef.current, activeRef.current, 'smooth');
  }, [activeId]);

  return { activeId, containerRef, activeRef };
}
