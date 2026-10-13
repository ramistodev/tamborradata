import 'server-only';
import type { MatchType, ParticipantsResponse } from '../../../../types/api/participants.types';

export type CheckParamsResponse = {
  tokens: string[];
  schoolKey: string;
};

export type ParticipantRow = {
  name: string;
  name_key: string;
  year: number;
  school: { canonical_name: string; school_key: string };
  scraped_url: { url: string } | null;
  resolution: { name_keys: string[] | null; surname_keys: string[] | null };
};

export type Candidate = {
  name: string;
  nameKey: string;
  year: number;
  url: string | null;
  school: ParticipantsResponse['school'];
  /** Given names, one unit each. */
  names: string[];
  /** Surnames, one unit each: a compound surname ("de la fuente") is a single unit. */
  surnames: string[];
  /** Only one surname is known; the second one is missing from the source. */
  isIncomplete: boolean;
};

export type Match = {
  candidate: Candidate;
  matchType: MatchType;
};
