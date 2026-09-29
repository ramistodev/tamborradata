export const statisticCategories = {
  // Participantes
  totalParticipants: 'totalParticipants',
  participantsGrowthRate: 'participantsGrowthRate',
  participationRecordYears: 'participationRecordYears',

  // Nombres
  topNames: 'topNames',
  namesDiversity: 'namesDiversity',
  nameTrends: 'nameTrends',
  newNames: 'newNames',
  disappearedNames: 'disappearedNames',
  perennialNames: 'perennialNames',
  nameComebacks: 'nameComebacks',
  averageNameLength: 'averageNameLength',
  nameInitialDistribution: 'nameInitialDistribution',
  nameConcentration: 'nameConcentration',
  singleYearNames: 'singleYearNames',
  rareNames: 'rareNames',
  longestNames: 'longestNames',
  nameSchoolCorrelation: 'nameSchoolCorrelation',
  topSecondNames: 'topSecondNames',
  participantsWithMultipleNames: 'participantsWithMultipleNames',

  // Apellidos
  topSurnames: 'topSurnames',
  surnamesDiversity: 'surnamesDiversity',
  surnameTrends: 'surnameTrends',
  newSurnames: 'newSurnames',
  disappearedSurnames: 'disappearedSurnames',
  perennialSurnames: 'perennialSurnames',
  surnameComebacks: 'surnameComebacks',
  averageSurnameLength: 'averageSurnameLength',
  surnameInitialDistribution: 'surnameInitialDistribution',
  surnameConcentration: 'surnameConcentration',
  singleYearSurnames: 'singleYearSurnames',
  rareSurnames: 'rareSurnames',
  longestSurnames: 'longestSurnames',
  surnameSchoolCorrelation: 'surnameSchoolCorrelation',

  // Nombre + Apellido
  nameSurnameDynasties: 'nameSurnameDynasties',

  // Escuelas
  topSchools: 'topSchools',
  newSchools: 'newSchools',
  disappearedSchools: 'disappearedSchools',
  schoolLongevity: 'schoolLongevity',
  schoolGrowthRate: 'schoolGrowthRate',
  averageSchoolSize: 'averageSchoolSize',
  schoolNameDiversity: 'schoolNameDiversity',
  schoolSurnameDiversity: 'schoolSurnameDiversity',
  commonNameBySchool: 'commonNameBySchool',
  commonSurnameBySchool: 'commonSurnameBySchool',
  schoolsEvolution: 'schoolsEvolution',
  mostConstantSchools: 'mostConstantSchools',
  newVsVeteranSchoolRatio: 'newVsVeteranSchoolRatio',
} as const;

export const categoryFamilies = {
  names: 'names',
  surnames: 'surnames',
  schools: 'schools',
  identityDiversity: 'identityDiversity',
  schoolsRenewal: 'schoolsRenewal',
  schoolsEvolution: 'schoolsEvolution',
  participationDynamics: 'participationDynamics',
} as const;

export type StatisticCategories = (typeof statisticCategories)[keyof typeof statisticCategories];
export type CategoryFamilies = (typeof categoryFamilies)[keyof typeof categoryFamilies];

export interface CategoriesGroupedByFamilies extends Readonly<
  Record<CategoryFamilies, readonly StatisticCategories[]>
> {}

export const categoriesGroupedByFamilies = {
  names: [
    statisticCategories.topNames,
    statisticCategories.topSecondNames,
    statisticCategories.nameTrends,
    statisticCategories.newNames,
    statisticCategories.disappearedNames,
    statisticCategories.perennialNames,
    statisticCategories.nameComebacks,
    statisticCategories.averageNameLength,
    statisticCategories.nameInitialDistribution,
    statisticCategories.longestNames,
    statisticCategories.nameSchoolCorrelation,
    statisticCategories.singleYearNames,
    statisticCategories.rareNames,
    statisticCategories.participantsWithMultipleNames,
  ],
  surnames: [
    statisticCategories.topSurnames,
    statisticCategories.surnameTrends,
    statisticCategories.newSurnames,
    statisticCategories.disappearedSurnames,
    statisticCategories.perennialSurnames,
    statisticCategories.surnameComebacks,
    statisticCategories.averageSurnameLength,
    statisticCategories.surnameInitialDistribution,
    statisticCategories.longestSurnames,
    statisticCategories.surnameSchoolCorrelation,
    statisticCategories.singleYearSurnames,
    statisticCategories.rareSurnames,
  ],
  schools: [
    statisticCategories.topSchools,
    statisticCategories.schoolGrowthRate,
    statisticCategories.averageSchoolSize,
    statisticCategories.schoolNameDiversity,
    statisticCategories.schoolSurnameDiversity,
    statisticCategories.commonNameBySchool,
    statisticCategories.commonSurnameBySchool,
  ],
  identityDiversity: [
    statisticCategories.namesDiversity,
    statisticCategories.surnamesDiversity,
    statisticCategories.nameConcentration,
    statisticCategories.surnameConcentration,
    statisticCategories.nameSurnameDynasties,
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
} as const satisfies CategoriesGroupedByFamilies;
