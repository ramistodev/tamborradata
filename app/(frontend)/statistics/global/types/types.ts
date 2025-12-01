export interface Statistics {
  isUpdating: boolean;
  year: string;
  total_categories: number;
  statistics: GlobalStats;
}

export interface GlobalStats {
  outro: Outro[];
  intro: Intro[];
  schoolsEvolution: SchoolsEvolution[];
  mostConstantSchools: MostConstantSchool[];
  commonNameBySchool: CommonNameBySchool[];
  topNames: TopName[];
  topSchools: TopSchool[];
  topSurnames: TopSurname[];
  longestNames: LongestName[];
  totalParticipants: TotalParticipant[];
  surnamesDiversity: SurnamesDiversity[];
  namesDiversity: NamesDiversity[];
}

export interface Outro {
  category: string;
  public_data: any;
  summary: string;
}

export interface Intro {
  category: string;
  public_data: any;
  summary: string;
}

export interface SchoolsEvolution {
  category: string;
  public_data: SchoolsEvolutionData[];
  summary: string;
}

export interface SchoolsEvolutionData {
  total: number;
  years: Year[];
  school: string;
}

export interface Year {
  year: number;
  count: number;
}

export interface MostConstantSchool {
  category: string;
  public_data: MostConstantSchoolData[];
  summary: string;
}

export interface MostConstantSchoolData {
  school: string;
  yearsActive: YearsActive[];
}

export interface YearsActive {
  year: number;
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

export interface TopName {
  category: string;
  public_data: TopNameData[];
  summary: string;
}

export interface TopNameData {
  name: string;
  count: number;
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

export interface LongestName {
  category: string;
  public_data: string[];
  summary: string;
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
