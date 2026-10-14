import 'server-only';
import { supabaseClient } from '../../../core/db/supabaseClient';
import { ServerError } from '../../../lib/errors';
import { statisticSummariesStatus, tables } from '../../../../types/dbSchema';
import { Locale } from '../../../../types/locale';
import { PublishedEditorialSection } from '../types';

export async function getPublishedEditorialSections(
  publishedRunId: string,
  locale: Locale
): Promise<PublishedEditorialSection[]> {
  const { data: summaries, error: summariesError } = await supabaseClient
    .from(tables.statisticSummaries)
    .select('id, section, locale, template')
    .eq('run_id', publishedRunId)
    .eq('locale', locale)
    .eq('status', statisticSummariesStatus.published)
    .order('section', { ascending: true })
    .order('id', { ascending: true });

  if (summariesError) {
    throw new ServerError(`Failed to fetch the published editorial sections: ${summariesError.message}`);
  }

  const filteredSummaries = summaries?.filter(
    (summary) => summary.template !== null && summary.template.trim() !== ''
  );

  return filteredSummaries?.map((summary) => {
    return {
      id: summary.id,
      section: summary.section,
      locale: summary.locale,
      template: summary.template,
    };
  }) as PublishedEditorialSection[];
}
