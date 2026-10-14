import { useFormatter, useTranslations } from 'next-intl';
import { TopEntry } from '../../../../../types/api/overview.types';

type TopStatsProps = {
  topName: TopEntry;
  topSurname: TopEntry;
  topSchool: TopEntry;
};

export function TopStats({ topName, topSurname, topSchool }: TopStatsProps) {
  const t = useTranslations('Search.topStats');
  const format = useFormatter();
  const stats = [
    { title: t('name'), entry: topName },
    { title: t('surname'), entry: topSurname },
    { title: t('school'), entry: topSchool },
  ];

  return (
    <dl className="flex flex-wrap gap-x-10 gap-y-5">
      {stats.map(({ title, entry }) => (
        <div key={title} className="flex min-w-0 flex-col gap-1">
          <dt className="font-mono text-xs tracking-widest text-text-tertiary uppercase">
            {title}
          </dt>
          <dd className="wrap-break-word text-xl font-semibold text-text sm:text-2xl">
            {entry.label}
          </dd>
          <dd className="font-mono text-xs text-text-tertiary">
            <span aria-hidden="true">{format.number(entry.count, { useGrouping: 'always' })}</span>
            <span className="sr-only">{t('count', { count: entry.count })}</span>
          </dd>
        </div>
      ))}
    </dl>
  );
}
