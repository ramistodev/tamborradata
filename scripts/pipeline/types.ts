export type serpApiParams = {
  engine: string;
  q: string;
  num: string;
  start: string;
  device: string;
  api_key: string | undefined;
};

export type waybackParams = {
  url: string;
  output: string;
  fl: string;
  filter: string;
  collapse: string;
};

export interface updateUrls {
  id: string;
  article_date: string;
}

export interface pageParticipants {
  name: string;
  school: string;
  article_date: string;
}

export interface allParticipants extends pageParticipants {
  url_id: string;
  year: number;
}
