import { getLocale } from 'next-intl/server';
import { redirect } from '../../../i18n/navigation';

export default async function StatisticsPage() {
  const locale = await getLocale();
  return redirect({ href: '/statistics/global', locale });
}
