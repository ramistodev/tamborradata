import { School } from './statistics.types';

export interface ParticipantsParams {
  participant: string | null;
  schoolKey: string | null;
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
