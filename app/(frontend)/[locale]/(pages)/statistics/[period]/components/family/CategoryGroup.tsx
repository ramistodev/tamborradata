'use client';

import { Children } from 'react';
import { useTranslations } from 'next-intl';
import { DragScroll } from '../../../../../components/ui';
import type { StatisticCategory } from '../../../../../../../types/api/statistics.types';
import { useCategoryGroup } from '../../hooks/useCategoryGroup';

/**
 * Titled group of categories shown as tabs. `children` must be one node per category, in the same
 * order as `categories`; inactive panels stay in the DOM (`hidden`) so the page keeps all its content.
 */
export function CategoryGroup({
  title,
  categories,
  children,
}: {
  title: string;
  categories: StatisticCategory[];
  children: React.ReactNode;
}) {
  const tCategory = useTranslations('Statistics.categories');
  const { activeIndex, containerRef, tabId, panelId, selectTab, handleKeyDown } =
    useCategoryGroup(categories);
  const panels = Children.toArray(children);
  const hasTabs = categories.length > 1;

  return (
    <div className="flex flex-col gap-2 bg-card rounded-xl border border-border p-3 sm:p-4 ">
      <span className="font-mono text-xs sm:text-sm uppercase text-accent flex items-center gap-3">
        <span>{title}</span>
        <span className="size-0.5 rounded-full bg-accent" />
        <span>{categories.length}</span>
      </span>
      {hasTabs && (
        <div className="flex justify-start">
          <div
            role="tablist"
            aria-label={title}
            className="rounded-full border border-border bg-bg-secondary overflow-hidden"
          >
            <DragScroll ref={containerRef} className="flex gap-1 m-1 sm:m-2 scrollbar-none">
              {categories.map((category, index) => {
                const isActive = index === activeIndex;

                return (
                  <button
                    key={category.category}
                    id={tabId(index)}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    aria-controls={panelId(index)}
                    tabIndex={isActive ? 0 : -1}
                    onClick={() => selectTab(index)}
                    onKeyDown={(event) => handleKeyDown(event, index)}
                    className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold whitespace-nowrap transition-colors ${
                      isActive
                        ? 'bg-accent text-white'
                        : 'text-text-secondary hover:cursor-pointer hover:text-text'
                    }`}
                  >
                    {tCategory(`${category.category}.tab`)}
                  </button>
                );
              })}
            </DragScroll>
          </div>
        </div>
      )}
      {categories.map((category, index) => (
        <div
          key={category.category}
          id={panelId(index)}
          role={hasTabs ? 'tabpanel' : undefined}
          aria-labelledby={hasTabs ? tabId(index) : undefined}
          hidden={index !== activeIndex}
        >
          <div className="flex flex-col gap-1 mb-2">
            <span className="text-sm sm:text-base md:text-lg font-bold">
              {tCategory(`${category.category}.title`)}
            </span>
            <span className="text-xs sm:text-sm text-text-secondary">
              {tCategory(`${category.category}.description`)}
            </span>
          </div>
          {panels[index]}
        </div>
      ))}
    </div>
  );
}
