import { useTranslations } from 'next-intl';
import { Icons } from '../../../../components/Icons';
import type { Participation } from '../../../../../../types/api/participants.types';
import { getSourceHost } from '../../utils/getSourceHost';

export function ParticipationRow({ year, url }: Participation) {
  const t = useTranslations('Search.results.row');

  if (!url) {
    return (
      <li className="flex items-center gap-4 px-2 py-3">
        <time dateTime={String(year)} className="shrink-0 font-mono text-sm font-bold text-text">
          {year}
        </time>
        <span aria-hidden="true" className="flex-1 font-mono text-xs text-text-tertiary">
          —
        </span>
        <span className="shrink-0 text-xs text-text-tertiary">{t('noSource')}</span>
      </li>
    );
  }

  const host = getSourceHost(url);

  return (
    <li>
      {/* The name repeats the visible year, host and "View source", so each link is distinct and the new tab is announced */}
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t('viewSourceAriaLabel', { year: String(year), host })}
        className="group flex min-h-11 items-center gap-4 px-2 py-3 hover:bg-bg-hover focus-visible:outline-2 focus-visible:-outline-offset-2! focus-visible:outline-accent"
      >
        <time dateTime={String(year)} className="shrink-0 font-mono text-sm font-bold text-text">
          {year}
        </time>
        <span className="min-w-0 flex-1 truncate font-mono text-xs text-text-tertiary">{host}</span>
        <span className="flex shrink-0 items-center gap-1.5 text-xs font-semibold text-accent group-hover:underline">
          {t('viewSource')}
          <Icons.ExternalLink className="size-3.5" />
        </span>
      </a>
    </li>
  );
}
