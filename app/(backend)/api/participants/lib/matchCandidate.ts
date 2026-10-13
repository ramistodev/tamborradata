import { matchTypes, MatchType } from '../../../../types/api/participants.types';
import { Candidate } from '../types';
import { isSubsequence } from './isSubsequence';

const startsWith = (words: string[], prefix: string[]) =>
  prefix.every((word, index) => word === words[index]);

/**
 * Tries every name|surname split of the query units. The typed names must be an ordered subset of
 * the candidate's names (a second name may be skipped) and the first surname can never be skipped.
 */
export function matchCandidate(query: string[], candidate: Candidate): MatchType {
  if (query.join(' ') === candidate.nameKey) {
    return matchTypes.exact;
  }

  for (let split = 1; split < query.length; split++) {
    const namesFit = isSubsequence(query.slice(0, split), candidate.names);

    if (namesFit && surnamesFit(query.slice(split), candidate)) {
      return matchTypes.compatible;
    }
  }

  return matchTypes.incompatible;
}

// Typed surnames may be a prefix of the known ones, or extend them if the 2nd one is missing.
function surnamesFit(typed: string[], { surnames, isIncomplete }: Candidate): boolean {
  if (typed.length <= surnames.length) {
    return startsWith(surnames, typed);
  }

  return isIncomplete && startsWith(typed, surnames);
}
