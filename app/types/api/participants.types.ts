import { School } from './statistics.types';

export interface ParticipantsParams {
  name: string;
  schoolKey: string;
}

export interface ParticipantsResponse {
  id: string;
  name: string;
  nameKey: string;
  year: number;
  school: School;
  url: string;
}
