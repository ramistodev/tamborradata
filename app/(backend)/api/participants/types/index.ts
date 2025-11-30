import 'server-only';
export type Participant = {
  name: string;
  school: string;
  year: number;
};

export type ParticipantQuery = {
  name: string;
  company: string;
};

export type ParticipantsType = {
  participants: Participant[] | null;
  error: string | null;
};

export type CheckParamsType = {
  valid: boolean;
  cleanName: string;
  error: string | null;
};
