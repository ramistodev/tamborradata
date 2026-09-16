import 'server-only';
import type { SummariesParams } from '../dtos/summaries.schema';
import { loadAllSchoolsById } from '../lib/loadAllSchoolsById';
import { getPublishedEditorialSections, getPublishedPeriod } from '../repositories/statistics.repo';
import { resolveEditorialTemplates } from './buildStatisticsResponse';
import { SummariesResponse } from '../../../../types/api/statistics.types';

export async function getSummaries(params: SummariesParams): Promise<SummariesResponse> {
  const { periodKey, locale } = params;
  const { publishedRunId } = await getPublishedPeriod(periodKey);
  const [summaries, allSchoolsById] = await Promise.all([
    getPublishedEditorialSections(publishedRunId, locale),
    loadAllSchoolsById(),
  ]);

  return {
    period: periodKey,
    locale,
    summaries: resolveEditorialTemplates(summaries, allSchoolsById),
  };
}
