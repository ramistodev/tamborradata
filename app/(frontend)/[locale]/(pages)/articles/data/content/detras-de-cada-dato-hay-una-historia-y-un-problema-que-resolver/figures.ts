export const figures = {
  participants: 71624,
  resolved: 71345,
  ambiguous: 279,
  distinctWords: 12466,
  bothRoleWords: 1611,
  schools: 53,
  schoolAliases: 251,
  schoolsWithManyAliases: 49,
  maxAliases: 14,
  editions: 16,
  firstEdition: 2008,
  lastEdition: 2026,
  sourcePages: 811,
  categories: 47,
  yearCategoriesMin: 20,
  yearCategoriesMax: 29,
  globalCategories: 37,
  periods: 17,
  yearPeriods: 16,
  summaries: 390,
  summariesPerLanguage: 130,
  summariesWithSchoolRefs: 28,
  schoolRefsPerLanguage: 66,
  schoolsReferenced: 18,
  repeatedNameKeys: 578,
  repeatedExtraRowsShare: 0.82,
  partialEditionSchools: 25,
  regularSchoolsMin: 40,
  regularSchoolsMax: 45,
  firstPositionWeight: 3,
  orderThreshold: 85,
  secondNameThreshold: 65,
  stableTrendThreshold: 5,
  canarySample: 25,
  canaryFixed: 5,
  canaryRandom: 20,
  canaryDriftPages: 3,
  canaryDriftShare: 10,
  minDiscoveredPages: 20,
  roleWords: 280,
  rolePhrases: 80,
} as const;

export const resolvedShare = (figures.resolved / figures.participants) * 100;
export const ambiguousShare = (figures.ambiguous / figures.participants) * 100;
export const bothRoleShare = (figures.bothRoleWords / figures.distinctWords) * 100;

export const tokenEvidence = {
  aitor: { word: 'Aitor', asName: 1674, asSurname: 29, first: 558, middle: 3, last: 26, total: 587 },
  jose: { word: 'José', asName: 306, asSurname: 35, first: 102, middle: 33, last: 2, total: 137 },
  goikoetxea: {
    word: 'Goikoetxea',
    asName: 0,
    asSurname: 258,
    first: 0,
    middle: 127,
    last: 131,
    total: 258,
  },
  lasa: { word: 'Lasa', asName: 6, asSurname: 270, first: 2, middle: 122, last: 148, total: 272 },
  martin: {
    word: 'Martin',
    asName: 1611,
    asSurname: 1020,
    first: 537,
    middle: 407,
    last: 613,
    total: 1557,
  },
} as const;

export const evidenceRows = [
  tokenEvidence.aitor,
  tokenEvidence.jose,
  tokenEvidence.goikoetxea,
  tokenEvidence.lasa,
  tokenEvidence.martin,
] as const;

interface EvidenceCounts {
  asName: number;
  asSurname: number;
  total: number;
}

const PRIOR_STRENGTH = 2;

function leaning({ asName, asSurname, total }: EvidenceCounts) {
  const weighted = asName + asSurname;
  const denominator = total + PRIOR_STRENGTH;
  const pName = (total * (asName / weighted) + PRIOR_STRENGTH / 2) / denominator;
  const pSurname = (total * (asSurname / weighted) + PRIOR_STRENGTH / 2) / denominator;
  return Math.max(pName, pSurname);
}

const exampleTokens = [
  tokenEvidence.aitor,
  tokenEvidence.jose,
  tokenEvidence.goikoetxea,
  tokenEvidence.lasa,
];

export const exampleConfidence =
  exampleTokens.reduce((sum, row) => sum + leaning(row), 0) / exampleTokens.length;

export const exampleRecord = {
  primaryName: 'Aitor',
  names: ['Aitor', 'José'],
  surnames: ['Goikoetxea', 'Lasa'],
} as const;

export const compoundNames = { two: 2291, three: 24 } as const;

export const variantGroups = [
  {
    name: 'La Salle',
    variants: [
      'La Salle',
      'La Salle 1 Compania',
      'La Salle 2',
      'La Salle 2 Compania',
      'La Salle Compania 1',
      'La Salle Compania 2',
      'La Salle Ikastetxea',
      'Lasalle Compania',
      'Lasalle Compania 1',
      'Lasalle Compania 2',
      'Lasalle Ikastetxea',
      'Salle Ikastetxea',
    ],
  },
  {
    name: 'Karmelo',
    variants: [
      'Carmelo',
      'Colegio Carmelo Ikastetxea',
      'Colegio Nino Jesus',
      'El Carmelo',
      'Karmelo',
      'Karmelo Ikastetxea',
      'Nino Jesus De Praga Karmelo',
      'Scentia Karmelo',
      'Scentia Karmelo Ikastetxea',
      'Scientia Karmelo',
      'Scientia Karmelo Ikastetxea',
    ],
  },
  {
    name: 'Santo Tomas Lizeoa',
    variants: [
      'Santo Tomas Lizeoa',
      'Santo Tomas Lizeoa 2',
      'Santo Tomas Lizeoa 2 Compania',
      'Santo Tomas Lizeoa Compania',
      'Santo Tomas Lizeoa Compania 1',
      'Santo Tomas Lizeoa Compania 2',
      'Santo Tomas Lizeoa Ikastola',
    ],
  },
  {
    name: 'Orixe',
    variants: ['Orixe', 'Orixe Ikastola'],
  },
] as const;
