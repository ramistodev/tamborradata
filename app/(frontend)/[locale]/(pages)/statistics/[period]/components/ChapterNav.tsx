'use client';
import { useTranslations } from 'next-intl';
import { StatisticFamily } from '../../../../../../types/api/statistics.types';
import { useChapterNav } from '../hooks/useChapterNav';

/** Sticky bar under the header that jumps to each chapter and highlights the one being read. */
export function ChapterNav({ families }: { families: StatisticFamily[] }) {
  const { jumpTo, containerRef, activeRef, chapterIds, activeId } = useChapterNav({ families });
  const t = useTranslations('Statistics.chapters');

  return (
    <nav
      aria-label={t('ariaLabel')}
      className="sticky top-14.25 md:top-15.25 z-40 border-b border-border backdrop-blur-md px-5 md:px-10"
    >
      <ul ref={containerRef} className="flex gap-3 overflow-x-auto scrollbar-none">
        {chapterIds.map((id) => {
          const isActive = id === activeId;

          return (
            <li ref={isActive ? activeRef : null} key={id}>
              <a
                href={`#${id}`}
                onClick={(event) => jumpTo(event, id)}
                aria-current={isActive ? 'location' : undefined}
                className={`inline-flex py-4 px-3 items-center text-xs whitespace-nowrap transition-colors ${
                  isActive
                    ? 'border-accent border-b font-semibold text-text'
                    : 'border-transparent text-text-secondary hover:text-text'
                }`}
              >
                {t(id)}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
