import 'server-only';
import { fetchParticipants } from '../repositories/participants.repo';
import { NotFoundError } from '../../../lib/errors';
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

  if (records.length === 0) {
    throw new NotFoundError('No participants found for the given name and schoolKey');
  }

  return records;
}
