import { MouseEvent } from 'react';
import { useActiveChapter } from './useActiveChapter';
import { CLOSING_CHAPTER_ID, HERO_CHAPTER_ID } from '../utils/chapters';
import { scrollToChapter } from '../utils/scrollToChapter';
import { StatisticFamily } from '../../../../../../types/api/statistics.types';
import { CategoryFamilies } from '../../../../../../types/statistics';

export function useChapterNav({ families }: { families: StatisticFamily[] }) {
  const chapterIds: (typeof HERO_CHAPTER_ID | typeof CLOSING_CHAPTER_ID | CategoryFamilies)[] = [
    HERO_CHAPTER_ID,
    ...families.map((family) => family.family),
    CLOSING_CHAPTER_ID,
  ];
  const { activeId, containerRef, activeRef } = useActiveChapter(chapterIds);

  function jumpTo(event: MouseEvent<HTMLAnchorElement>, id: string) {
    event.preventDefault();
    scrollToChapter(id, event.currentTarget.closest('nav'));
  }

  return { jumpTo, containerRef, activeRef, chapterIds, activeId };
}
