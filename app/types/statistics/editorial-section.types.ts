import { statisticCategories, StatisticCategories } from './category.types';

export const editorialSections = {
  periodIntro: 'periodIntro',
  names: 'names',
  surnames: 'surnames',
  schools: 'schools',
  identityDiversity: 'identityDiversity',
  schoolsRenewal: 'schoolsRenewal',
  schoolsEvolution: 'schoolsEvolution',
  participationDynamics: 'participationDynamics',
  periodOutro: 'periodOutro',
} as const;

export type EditorialSections = (typeof editorialSections)[keyof typeof editorialSections];

export interface EditorialSectionCategories extends Readonly<
  Record<EditorialSections, readonly StatisticCategories[]>
> {}

export const editorialSectionCategories = {
  periodIntro: [
    statisticCategories.totalParticipants,
    statisticCategories.participantsGrowthRate,
    statisticCategories.participationRecordYears,
    statisticCategories.newNames,
    statisticCategories.nameComebacks,
    statisticCategories.newSchools,
  ],
  names: [
    statisticCategories.topNames,
    statisticCategories.nameTrends,
    statisticCategories.newNames,
    statisticCategories.disappearedNames,
    statisticCategories.perennialNames,
    statisticCategories.nameComebacks,
    statisticCategories.singleYearNames,
    statisticCategories.rareNames,
  ],
  surnames: [
    statisticCategories.topSurnames,
    statisticCategories.surnameTrends,
    statisticCategories.newSurnames,
    statisticCategories.disappearedSurnames,
    statisticCategories.perennialSurnames,
    statisticCategories.surnameComebacks,
    statisticCategories.singleYearSurnames,
    statisticCategories.rareSurnames,
  ],
  schools: [
    statisticCategories.topSchools,
    statisticCategories.schoolGrowthRate,
    statisticCategories.averageSchoolSize,
    statisticCategories.schoolSizeDistribution,
    statisticCategories.schoolNameDiversity,
    statisticCategories.schoolSurnameDiversity,
    statisticCategories.commonNameBySchool,
    statisticCategories.schoolsParticipantsCorrelation,
  ],
  identityDiversity: [
    statisticCategories.namesDiversity,
    statisticCategories.surnamesDiversity,
    statisticCategories.nameConcentration,
    statisticCategories.surnameConcentration,
  ],
  schoolsRenewal: [
    statisticCategories.newSchools,
    statisticCategories.disappearedSchools,
    statisticCategories.newVsVeteranSchoolRatio,
  ],
  schoolsEvolution: [
    statisticCategories.schoolsEvolution,
    statisticCategories.schoolLongevity,
    statisticCategories.mostConstantSchools,
  ],
  participationDynamics: [
    statisticCategories.totalParticipants,
    statisticCategories.participantsGrowthRate,
    statisticCategories.participationRecordYears,
  ],
  periodOutro: [
    statisticCategories.totalParticipants,
    statisticCategories.participantsGrowthRate,
    statisticCategories.schoolsEvolution,
    statisticCategories.schoolGrowthRate,
    statisticCategories.averageSchoolSize,
    statisticCategories.newVsVeteranSchoolRatio,
  ],
} as const satisfies EditorialSectionCategories;
