export interface Statistics {
  year: string;
  total_categories: number;
  statistics: GlobalStats;
}

export interface GlobalStats {
  intro: Intro[];
  outro: Outro[];
  topNamesByYear: TopName[];
  commonNameBySchoolByYear: CommonNameBySchool[];
  topSchoolsByYear: TopSchool[];
  topSurnamesByYear: TopSurname[];
  uniqueNamesByYear: UniqueName[];
  newSchoolsByYear: NewSchool[];
  totalParticipantsByYear: TotalParticipant[];
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

export interface TopName {
  category: string;
  public_data: TopNameData[];
  summary: string;
}

export interface TopNameData {
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

export interface TopSchool {
  category: string;
  public_data: TopSchoolData[];
  summary: string;
}

export interface TopSchoolData {
  count: number;
  school: string;
}

export interface TopSurname {
  category: string;
  public_data: TopSurnameData[];
  summary: string;
}

export interface TopSurnameData {
  count: number;
  surname: string;
}

export interface UniqueName {
  category: string;
  public_data: string[];
  summary: string;
}

export interface NewSchool {
  category: string;
  public_data: NewSchoolData[];
  summary: string;
}

export interface NewSchoolData {
  school: string;
}

export interface TotalParticipant {
  category: string;
  public_data: TotalParticipantData[];
  summary: string;
}

export interface TotalParticipantData {
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
