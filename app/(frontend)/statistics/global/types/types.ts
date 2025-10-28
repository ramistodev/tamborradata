export interface Category {
  stats:
    | SchoolEvolution[]
    | MostConstantSchool[]
    | CommonNameBySchool[]
    | TopName[]
    | TopSchool[]
    | TopSurname[]
    | MostRepeatedNameOverall[]
    | LongestName[]
    | TotalParticipant[]
    | SurnamesDiversity[];
}

export interface Statistics {
  year: string;
  total_categories: number;
  statistics: Statistics;
}

export interface GlobalStats {
  schoolsEvolution: SchoolEvolution[];
  mostConstantSchools: MostConstantSchool[];
  commonNameBySchool: CommonNameBySchool[];
  topNames: TopName[];
  topSchools: TopSchool[];
  topSurnames: TopSurname[];
  mostRepeatedNameOverall: MostRepeatedNameOverall[];
  longestNames: LongestName[];
  totalParticipants: TotalParticipant[];
  surnamesDiversity: SurnamesDiversity[];
  namesDiversity: NamesDiversity[];
}

export interface SchoolEvolution {
  category: string;
  public_data: PublicDaum[];
  summary: string;
}

export interface PublicDaum {
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
  public_data: PublicDaum2[];
  summary: string;
}

export interface PublicDaum2 {
  school: string;
  yearsActive: YearsActive[];
}

export interface YearsActive {
  year: number;
  count: number;
}

export interface CommonNameBySchool {
  category: string;
  public_data: PublicDaum3[];
  summary: string;
}

export interface PublicDaum3 {
  name: string;
  school: string;
}

export interface TopName {
  category: string;
  public_data: PublicDaum4[];
  summary: string;
}

export interface PublicDaum4 {
  name: string;
  count: number;
}

export interface TopSchool {
  category: string;
  public_data: PublicDaum5[];
  summary: string;
}

export interface PublicDaum5 {
  count: number;
  school: string;
}

export interface TopSurname {
  category: string;
  public_data: PublicDaum6[];
  summary: string;
}

export interface PublicDaum6 {
  count: number;
  surname: string;
}

export interface MostRepeatedNameOverall {
  category: string;
  public_data: [string, number][];
  summary: string;
}

export interface LongestName {
  category: string;
  public_data: string[];
  summary: string;
}

export interface TotalParticipant {
  category: string;
  public_data: PublicDaum7[];
  summary: string;
}

export interface PublicDaum7 {
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
