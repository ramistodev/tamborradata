import 'server-only';
export type Participants = {
  name: string;
  school: string;
  year: number;
};

export type ParticipantQuery = {
  name: string;
  company: string;
};

export type ParticipantsType = {
  participants: Participants[] | null;
  error: string | null;
};

export type CheckParamsType = {
  valid: boolean;
  cleanName: string;
  error: string | null;
};
