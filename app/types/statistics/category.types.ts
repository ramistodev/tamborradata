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
  schoolSizeDistribution: 'schoolSizeDistribution',
  schoolNameDiversity: 'schoolNameDiversity',
  schoolSurnameDiversity: 'schoolSurnameDiversity',
  commonNameBySchool: 'commonNameBySchool',
  schoolsEvolution: 'schoolsEvolution',
  mostConstantSchools: 'mostConstantSchools',
  newVsVeteranSchoolRatio: 'newVsVeteranSchoolRatio',
  schoolsParticipantsCorrelation: 'schoolsParticipantsCorrelation',
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
    statisticCategories.schoolSizeDistribution,
    statisticCategories.schoolNameDiversity,
    statisticCategories.schoolSurnameDiversity,
    statisticCategories.commonNameBySchool,
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
    statisticCategories.schoolsParticipantsCorrelation,
  ],
  participationDynamics: [
    statisticCategories.totalParticipants,
    statisticCategories.participantsGrowthRate,
    statisticCategories.participationRecordYears,
  ],
};

export function categoryFamily(category: StatisticCategories): CategoryFamilies {
  const family = (
    Object.entries(categoriesGroupedByFamilies) as [
      CategoryFamilies,
      readonly StatisticCategories[],
    ][]
  ).find(([, categories]) => categories.includes(category))?.[0];

  if (!family) {
    throw new Error(`No category family configured for statistic category: ${category}`);
  }

  return family;
}
