export interface Statistics {
  year: string;
  total_categories: number;
  statistics: GlobalStats;
}

export interface GlobalStats {
  intro: Intro[];
  outro: Outro[];
  topNamesByYear: TopNames[];
  commonNameBySchoolByYear: CommonNameBySchool[];
  topSchoolsByYear: TopSchools[];
  topSurnamesByYear: TopSurnames[];
  uniqueNamesByYear: UniqueNames[];
  newSchoolsByYear: NewSchools[];
  totalParticipantsByYear: TotalParticipants[];
  surnamesDiversityByYear: SurnamesDiversity[];
  namesDiversityByYear: NamesDiversity[];
}

export interface Intro {
  category: string;
  public_data: any;
  summary: string;
}

export interface Outro {
  category: string;
  public_data: any;
  summary: string;
}

export interface TopNames {
  category: string;
  public_data: TopNamesData[];
  summary: string;
}

export interface TopNamesData {
  name: string;
  count: number;
}

export interface CommonNameBySchool {
  category: string;
  public_data: CommonNameBySchoolData[];
  summary: string;
}

export interface CommonNameBySchoolData {
  name: string;
  school: string;
}

export interface TopSchools {
  category: string;
  public_data: TopSchoolsData[];
  summary: string;
}

export interface TopSchoolsData {
  count: number;
  school: string;
}

export interface TopSurnames {
  category: string;
  public_data: TopSurnamesData[];
  summary: string;
}

export interface TopSurnamesData {
  count: number;
  surname: string;
}

export interface UniqueNames {
  category: string;
  public_data: string[];
  summary: string;
}

export interface NewSchools {
  category: string;
  public_data: NewSchoolsData[];
  summary: string;
}

export interface NewSchoolsData {
  school: string;
}

export interface TotalParticipants {
  category: string;
  public_data: TotalParticipantsData[];
  summary: string;
}

export interface TotalParticipantsData {
  year: number;
  count: number;
}

export interface SurnamesDiversity {
  category: string;
  public_data: number;
  summary: string;
}

export interface NamesDiversity {
  category: string;
  public_data: number;
  summary: string;
}
