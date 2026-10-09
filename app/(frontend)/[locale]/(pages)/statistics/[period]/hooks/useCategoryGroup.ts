import { useId, useRef, useState, type KeyboardEvent } from 'react';
import type { StatisticCategory } from '../../../../../../types/api/statistics.types';
import { scrollToActiveElement } from '../utils/scrollToActiveElement';

/** Tabs state of a category group: the active category, ids for aria and keyboard navigation. */
export function useCategoryGroup(categories: StatisticCategory[]) {
  const baseId = useId();
  const [activeKey, setActiveKey] = useState(categories[0]?.category);
  const activeIndex = Math.max(
    0,
    categories.findIndex((category) => category.category === activeKey)
  );
  const containerRef = useRef<HTMLDivElement>(null);

  const tabId = (index: number) => `${baseId}-tab-${index}`;
  const panelId = (index: number) => `${baseId}-panel-${index}`;

  function selectTab(index: number) {
    setActiveKey(categories[index]?.category);
    const tab = document.getElementById(tabId(index));
    document.getElementById(tabId(index))?.focus();
    scrollToActiveElement(containerRef.current, tab, 'smooth');
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const last = categories.length - 1;
    const targets: Record<string, number> = {
      ArrowRight: index === last ? 0 : index + 1,
      ArrowLeft: index === 0 ? last : index - 1,
      Home: 0,
      End: last,
    };
    const target = targets[event.key];

    if (target === undefined) {
      return;
    }

    event.preventDefault();
    selectTab(target);
  }

  return { activeIndex, containerRef, tabId, panelId, selectTab, handleKeyDown };
}
