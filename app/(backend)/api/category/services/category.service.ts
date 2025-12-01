import 'server-only';
import { fetchCategory } from '../repositories/category.repo';
import { FetchStatisticsType } from '../types';

export async function getCategory(year: string, category: string): Promise<FetchStatisticsType> {
  return await fetchCategory(year, category);
}
