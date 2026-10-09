import {
  CategoryFamilies,
  StatisticCategories,
  statisticCategories,
} from '../../../../../../../types/statistics';

/**
 * Importance of each category inside its family: 1 is the most important, higher numbers matter less.
 * Every category of the family is listed so the order is total. The layout filters by data shape, so
 * only the relative order matters: the first ranking is the active tab and the first series is the
 * lead chart. A category that is absent from a period is simply skipped.
 */
export const FEATURED_CATEGORIES: Record<CategoryFamilies, Map<StatisticCategories, number>> = {
  participationDynamics: new Map([
    [statisticCategories.totalParticipants, 1],
    [statisticCategories.participantsGrowthRate, 2],
    [statisticCategories.participationRecordYears, 3],
  ]),
  names: new Map([
    [statisticCategories.topNames, 1],
    [statisticCategories.topSecondNames, 2],
    [statisticCategories.nameTrends, 3],
    [statisticCategories.newNames, 4],
    [statisticCategories.nameComebacks, 5],
    [statisticCategories.disappearedNames, 6],
    [statisticCategories.perennialNames, 7],
    [statisticCategories.participantsWithMultipleNames, 8],
    [statisticCategories.nameSchoolCorrelation, 9],
    [statisticCategories.nameInitialDistribution, 10],
    [statisticCategories.longestNames, 11],
    [statisticCategories.averageNameLength, 12],
    [statisticCategories.rareNames, 13],
    [statisticCategories.singleYearNames, 14],
  ]),
  surnames: new Map([
    [statisticCategories.topSurnames, 1],
    [statisticCategories.surnameTrends, 2],
    [statisticCategories.newSurnames, 3],
    [statisticCategories.surnameComebacks, 4],
    [statisticCategories.disappearedSurnames, 5],
    [statisticCategories.perennialSurnames, 6],
    [statisticCategories.surnameSchoolCorrelation, 7],
    [statisticCategories.surnameInitialDistribution, 8],
    [statisticCategories.longestSurnames, 9],
    [statisticCategories.averageSurnameLength, 10],
    [statisticCategories.rareSurnames, 11],
    [statisticCategories.singleYearSurnames, 12],
  ]),
  identityDiversity: new Map([
    [statisticCategories.nameSurnameDynasties, 1],
    [statisticCategories.namesDiversity, 2],
    [statisticCategories.surnamesDiversity, 3],
    [statisticCategories.nameConcentration, 4],
    [statisticCategories.surnameConcentration, 5],
  ]),
  schools: new Map([
    [statisticCategories.topSchools, 1],
    [statisticCategories.schoolGrowthRate, 2],
    [statisticCategories.averageSchoolSize, 3],
    [statisticCategories.commonNameBySchool, 4],
    [statisticCategories.commonSurnameBySchool, 5],
    [statisticCategories.schoolNameDiversity, 6],
    [statisticCategories.schoolSurnameDiversity, 7],
  ]),
  schoolsRenewal: new Map([
    [statisticCategories.newSchools, 1],
    [statisticCategories.disappearedSchools, 2],
    [statisticCategories.newVsVeteranSchoolRatio, 3],
  ]),
  schoolsEvolution: new Map([
    [statisticCategories.schoolsEvolution, 1],
    [statisticCategories.mostConstantSchools, 2],
    [statisticCategories.schoolLongevity, 3],
  ]),
};
