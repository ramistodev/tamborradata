export interface statEntry {
  category: string;
  scope: 'yearly' | 'global';
  data: any;
}

export interface summariesEntry {
  category: string;
  scope: 'yearly' | 'global';
  year: string;
  summary: any;
}

export type topNames = {
  name: string;
  count: number;
};

export type topSurnames = {
  surname: string;
  count: number;
};

export type topSchools = {
  school: string;
  count: number;
};

export type totalParticipants = {
  year: number;
  count: number;
};

export type commonNameBySchool = {
  school: string;
  name: string;
};

export interface schoolEvolution {
  school: string;
  years: schoolEvolutionYear[];
  total: number;
}

export interface schoolEvolutionYear {
  year: number;
  count: number;
}
