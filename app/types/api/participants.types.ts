import { School } from './statistics.types';

/** Shared by the search form and the API, so what the form allows is what the API accepts. */
export const MAX_PARTICIPANT_LENGTH = 120;
export const MIN_PARTICIPANT_WORDS = 3;

export interface ParticipantsParams {
  participant: string;
  schoolKey: string;
}

export const matchTypes = {
  exact: 'exact',
  compatible: 'compatible',
  incompatible: 'incompatible',
} as const;

export type MatchType = (typeof matchTypes)[keyof typeof matchTypes];

export interface ParticipantsResponse {
  matchType: MatchType;
  name: string;
  nameKey: string;
  school: Pick<School, 'canonicalName' | 'schoolKey'>;
  participations: Participation[];
}

export interface Participation {
  url: string | null;
  year: number;
}
