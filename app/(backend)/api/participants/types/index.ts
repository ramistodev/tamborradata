import 'server-only';

export type CheckParamsResponse = {
  cleanName: string;
  schoolKey: string;
};

export type ParticipantRow = {
  id: string;
  name: string;
  name_key: string;
  year: number;
  school: { id: string; canonical_name: string; school_key: string };
  scraped_url: { url: string } | null;
};
