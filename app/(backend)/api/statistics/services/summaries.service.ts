import 'server-only';
import type { SummariesResponse } from '@/app/types/api/statistics.types';
import type { SummariesParams } from '../dtos/summaries.schema';
import { loadAllSchoolsById } from '../lib/loadAllSchoolsById';
import { getPublishedPeriod } from '../repositories/period.repo';
import { getPublishedEditorialSections } from '../repositories/editorialSections.repo';
import { resolveEditorialTemplates } from './buildStatisticsResponse';

export async function summariesService(params: SummariesParams): Promise<SummariesResponse> {
  const { publicSlug, locale } = params;
  const { runId, metaData } = await getPublishedPeriod(publicSlug);
  const [summaries, allSchoolsById] = await Promise.all([
    getPublishedEditorialSections(runId, locale),
    loadAllSchoolsById(),
  ]);

  return {
    metaData,
    locale,
    summaries: resolveEditorialTemplates(summaries, allSchoolsById),
  };
}
