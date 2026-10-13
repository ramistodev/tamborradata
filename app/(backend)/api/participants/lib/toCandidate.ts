import { Candidate, ParticipantRow } from '../types';

export function toCandidate(row: ParticipantRow): Candidate {
  const surnames = row.resolution.surname_keys ?? [];

  return {
    name: row.name,
    nameKey: row.name_key,
    year: row.year,
    url: row.scraped_url?.url ?? null,
    school: { canonicalName: row.school.canonical_name, schoolKey: row.school.school_key },
    names: row.resolution.name_keys ?? [],
    surnames,
    isIncomplete: surnames.length === 1,
  };
}
