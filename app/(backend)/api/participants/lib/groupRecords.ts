import { matchTypes, ParticipantsResponse } from '../../../../types/api/participants.types';
import { Match } from '../types';

/** One record per distinct name, with its participations from the latest year to the oldest. */
export function groupRecords(matches: Match[]): ParticipantsResponse[] {
  const records = new Map<string, ParticipantsResponse>();

  for (const { candidate, matchType } of matches) {
    const record = records.get(candidate.nameKey) ?? {
      matchType,
      name: candidate.name,
      nameKey: candidate.nameKey,
      school: candidate.school,
      participations: [],
    };

    record.participations.push({ url: candidate.url, year: candidate.year });

    if (matchType === matchTypes.exact) {
      record.matchType = matchTypes.exact;
    }

    records.set(candidate.nameKey, record);
  }

  for (const record of records.values()) {
    record.participations.sort((a, b) => b.year - a.year);
  }

  return [...records.values()].sort(
    (a, b) =>
      Number(b.matchType === matchTypes.exact) - Number(a.matchType === matchTypes.exact) ||
      b.participations[0].year - a.participations[0].year
  );
}
