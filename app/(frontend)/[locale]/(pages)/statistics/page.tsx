import { notFound } from 'next/navigation';
import { getLocale } from 'next-intl/server';
import { getPeriods } from '../../services/getPeriods';
import { redirect } from '../../../i18n/navigation';

/** The index has no content of its own: it sends to the full history, whose slug changes every year. */
export default async function StatisticsPage() {
  const [locale, periods] = await Promise.all([getLocale(), getPeriods()]);
  const global = periods.find((period) => period.kind === 'global');
  if (!global) notFound();

  return redirect({ href: `/statistics/${global.publicSlug}`, locale });
}
