import { Candidate, Match } from '../types';
import { isSubsequence } from './isSubsequence';

/**
 * An incomplete record is dropped only when a complete match of the same year covers it, so the
 * same person is not listed twice. Incompletes of other years are always kept.
 */
export function dropCoveredIncompletes(matches: Match[]): Match[] {
  const completes = matches.filter(({ candidate }) => !candidate.isIncomplete);

  return matches.filter(
    ({ candidate }) =>
      !candidate.isIncomplete ||
      !completes.some(({ candidate: complete }) => covers(complete, candidate))
  );
}

function covers(complete: Candidate, incomplete: Candidate): boolean {
  return (
    complete.year === incomplete.year &&
    complete.surnames[0] === incomplete.surnames[0] &&
    isSubsequence(incomplete.names, complete.names)
  );
}
