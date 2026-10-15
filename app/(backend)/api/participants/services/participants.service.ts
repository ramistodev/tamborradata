import 'server-only';
import { fetchParticipants } from '../repo/participants.repo';
import { matchTypes, ParticipantsResponse } from '../../../../types/api/participants.types';
import { dropCoveredIncompletes } from '../lib/dropCoveredIncompletes';
import { groupRecords } from '../lib/groupRecords';
import { matchCandidate } from '../lib/matchCandidate';
import { toUnits } from '../lib/particles';
import { toCandidate } from '../lib/toCandidate';

export async function participantsService(
  tokens: string[],
  schoolKey: string
): Promise<ParticipantsResponse[]> {
  const units = toUnits(tokens);
  const rows = await fetchParticipants(units, schoolKey);

  const matches = rows
    .map(toCandidate)
    .map((candidate) => ({ candidate, matchType: matchCandidate(units, candidate) }))
    .filter(({ matchType }) => matchType !== matchTypes.incompatible);

  const records = groupRecords(dropCoveredIncompletes(matches));

  // No matches is a valid answer, not an error: it resolves to an empty list
  return records;
}
