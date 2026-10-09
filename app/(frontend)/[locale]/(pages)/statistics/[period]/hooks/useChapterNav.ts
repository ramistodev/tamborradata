import { MouseEvent } from 'react';
import { useActiveChapter } from './useActiveChapter';
import { OVERVIEW_CHAPTER_ID } from '../utils/chapters';
import { StatisticFamily } from '../../../../../../types/api/statistics.types';
import { CategoryFamilies } from '../../../../../../types/statistics';

export function useChapterNav({ families }: { families: StatisticFamily[] }) {
  const chapterIds: (typeof OVERVIEW_CHAPTER_ID | CategoryFamilies)[] = [
    OVERVIEW_CHAPTER_ID,
    ...families.map((family) => family.family),
  ];
  const { activeId, containerRef, activeRef } = useActiveChapter(chapterIds);

  function jumpTo(event: MouseEvent<HTMLAnchorElement>, id: string) {
    event.preventDefault();
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
  }
  return { jumpTo, containerRef, activeRef, chapterIds, activeId };
}
