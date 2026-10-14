import { useId } from 'react';
import { useTranslations } from 'next-intl';
import { Icons } from '../../../../components/Icons';
import { matchTypes } from '../../../../../../types/api/participants.types';
import type { ParticipantsResponse } from '../../../../../../types/api/participants.types';
import { ParticipationRow } from './ParticipationRow';

export function ParticipantCard({ record }: { record: ParticipantsResponse }) {
  const t = useTranslations('Search.results.card');
  const id = useId();
  const nameId = `${id}-name`;
  const matchId = `${id}-match`;
  const schoolId = `${id}-school`;
  const countId = `${id}-count`;
  const count = record.participations.length;
  const isExact = record.matchType === matchTypes.exact;

  return (
    <article
      aria-labelledby={nameId}
      aria-describedby={`${matchId} ${schoolId}`}
      className="w-full flex-1 flex flex-col gap-4 bg-card rounded-lg border border-border p-4 sm:p-5"
    >
      <header className="flex flex-col gap-2">
        <p
          id={matchId}
          className={`font-mono text-xs font-semibold tracking-widest uppercase ${isExact ? 'text-accent' : 'text-text-tertiary'}`}
        >
          {isExact ? t('exact') : t('compatible')}
        </p>
        <h3 id={nameId} className="text-xl sm:text-nowrap sm:text-2xl font-semibold text-text">
          {record.name}
        </h3>
        <p id={schoolId} className="flex items-center gap-2 font-mono text-xs text-text-secondary">
          <Icons.GraduationCap />
          {record.school.canonicalName}
        </p>
      </header>

      <div className="flex flex-col gap-2">
        <p id={countId} className="font-mono truncate text-xs text-text-tertiary">
          {t('count', { count })}
        </p>
        <ul
          aria-labelledby={countId}
          className="flex flex-col divide-y divide-border border-y border-border"
        >
          {record.participations.map((participation) => (
            <ParticipationRow key={participation.year} {...participation} />
          ))}
        </ul>
      </div>
    </article>
  );
}
