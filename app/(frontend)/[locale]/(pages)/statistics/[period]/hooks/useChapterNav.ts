import { MouseEvent } from 'react';
import { useActiveChapter } from './useActiveChapter';
import { CHAPTER_ORDER, OVERVIEW_CHAPTER_ID } from '../utils/chapters';
import { StatisticFamily } from '../../../../../../types/api/statistics.types';

export function useChapterNav({ families }: { families: StatisticFamily[] }) {
  const chapterIds = [
    OVERVIEW_CHAPTER_ID,
    ...CHAPTER_ORDER.filter((id) => families.some((family) => family.family === id)),
  ] as const;
  const { activeId, containerRef, activeRef } = useActiveChapter([...chapterIds]);

  function jumpTo(event: MouseEvent<HTMLAnchorElement>, id: string) {
    event.preventDefault();
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
  }
  return { jumpTo, containerRef, activeRef, chapterIds, activeId };
}
