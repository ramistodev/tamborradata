'use client';

import { useTranslations } from 'next-intl';
import { SeriesChart } from './components/SeriesChart';
import { SeriesCategory } from '../../../../../../../../types/api/statistics.types';

/**
 * Chart of one series category. It is meant to live inside a `CategoryGroup`, which already provides
 * the tab, the title and the description, so there is nothing else around the chart.
 */
export function SeriesRender({ category }: { category: SeriesCategory }) {
  const tCategory = useTranslations('Statistics.categories');

  return <SeriesChart label={tCategory(`${category.category}.title`)} data={category.data} />;
}
