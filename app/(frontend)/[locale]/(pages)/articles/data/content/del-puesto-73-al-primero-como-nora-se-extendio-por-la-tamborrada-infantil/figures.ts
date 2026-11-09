import type { SourceItem } from '../../../types/article.types';

// Every figure below comes from own aggregate queries over the runs published on 2026-10-18
// (read-only, production database, queried on 2026-11-09) and from Eustat pages opened directly.
// Participations are counted by primary name; they reconcile with the published `topNames`
// statistic of each edition (e.g. Nora 14 in 2008, 110 in 2026). Copy values; do not recompute them.
// Editions with data: 2008, 2011-2020 and 2022-2026 (no 2009, 2010 or 2021).

export const editions = [
  '2008',
  '2011',
  '2012',
  '2013',
  '2014',
  '2015',
  '2016',
  '2017',
  '2018',
  '2019',
  '2020',
  '2022',
  '2023',
  '2024',
  '2025',
  '2026',
] as const;

// Published `topNames` (rank and participations) and aggregate over participations (companies).
export const noraCount = [14, 30, 31, 55, 55, 65, 78, 75, 81, 82, 93, 60, 106, 103, 101, 110] as const;
export const aneCount = [114, 77, 55, 87, 89, 95, 108, 102, 104, 110, 113, 58, 118, 114, 93, 99] as const;
export const noraRank = [73, 25, 17, 16, 16, 9, 4, 5, 4, 5, 2, 1, 2, 2, 1, 1] as const;

// Companies (distinct `school_id`) with at least one participant named Nora, and companies registered.
export const noraCompanies = [8, 19, 16, 30, 32, 33, 33, 32, 33, 33, 34, 23, 42, 36, 32, 35] as const;
export const companiesRegistered = [43, 45, 25, 43, 43, 42, 42, 42, 41, 41, 40, 26, 45, 45, 42, 43] as const;

// Participations of Nora divided by companies with Nora (rounded to two decimals).
export const noraPerCompany = [
  1.75, 1.58, 1.94, 1.83, 1.72, 1.97, 2.36, 2.34, 2.45, 2.48, 2.74, 2.61, 2.52, 2.86, 3.16, 3.14,
] as const;

// Total participations per edition (published `totalParticipants`).
export const participants = [
  4040, 3310, 2768, 4647, 4589, 4508, 4691, 4807, 4850, 4896, 4683, 2849, 5219, 5320, 5149, 5298,
] as const;

const at = <T>(values: readonly T[], edition: (typeof editions)[number]): T =>
  values[editions.indexOf(edition)];

// Milestone editions shown in the table (the ones the story walks through).
export const milestoneEditions = [
  '2008',
  '2011',
  '2013',
  '2015',
  '2016',
  '2020',
  '2022',
  '2023',
  '2024',
  '2025',
  '2026',
] as const;

export const milestoneRows = milestoneEditions.map((edition) => ({
  edition,
  rank: at(noraRank, edition),
  count: at(noraCount, edition),
  companies: at(noraCompanies, edition),
  registered: at(companiesRegistered, edition),
}));

export const figures = {
  editions: 16,
  companies2026: 43,
  // 2008 and 2026 snapshots
  y2008: {
    participants: at(participants, '2008'),
    nora: 14,
    ane: 114,
    rank: 73,
    companiesWithNora: 8,
    companies: 43,
  },
  y2026: {
    participants: at(participants, '2026'),
    nora: 110,
    ane: 99,
    jon: 83,
    sara: 73,
    companiesWithNora: 35,
    companies: 43,
    companiesWithoutNora: 8,
  },
  // 2022: reduced edition
  y2022: { participants: 2849, companies: 26, nora: 60, ane: 58 },
  y2020: { participants: 4683, companies: 40 },
  // Gap between Ane and Nora (participations) in 2008 and 2020
  gap2008: 100,
  gap2020: 20,
  // Nora's first Top 10 (2015) and rank climbed since 2008
  top10Year: 2015,
  placesClimbed2015: 64,
  // Companies and averages in the spread story
  companies2011: 19,
  companies2013: 30,
  companies2013Rank: 16,
  companies2023: 42,
  registered2023: 45,
  perCompany2008: 1.75,
  perCompany2013: 1.83,
  perCompany2020: 2.74,
  perCompany2026: 3.14,
  // Leaders in 2026: sole leaders among the 43 companies
  noraSoleLeaders: 4,
  aneSoleLeaders: 3,
  aneSharedLeaders: 2,
  aneCompanies2026: 36,
  noraCompanies2026: 35,
  // Nora's rank inside each company in 2026 (competition ranking, ties share a position)
  noraRankBuckets: { first: 4, second3: 10, fourTo10: 12, eleven: 9, none: 8 },
  // Top 10 overlap between companies present in the four editions 2023-2026 (pooled Top 10 per company)
  top10Overlap: { companies: 41, pairs: 820, real: 1.99, shuffled: 4.1 },
  // Share of Nora's participations in her biggest company in 2026 (10 of 110, rounded)
  biggestCompanySharePct: 9,
  // Amara Berri 2026: participants and Anes
  amaraBerri2026: 249,
  // Companies with no Nora across all their editions
  sanJoseEditions: 14,
  deutscheEditions: 16,
  deutscheEditionsWithNora: 13,
  // Smallest participant count shown anywhere in the article
  smallestFigure: 6,
} as const;

// Q: number of participants per Nora, as "one in N" (4040/14 and 5298/110, rounded for 2008).
export const oneIn = {
  y2008: Math.round(figures.y2008.participants / figures.y2008.nora / 10) * 10,
  y2026: Math.round(figures.y2026.participants / figures.y2026.nora),
} as const;

// Most repeated name of each company in 2026 (sole leader, 6 or more participants). "Iñigo" is stored as "Inigo".
export const companyLeaders2026 = [
  { company: 'Amara Berri', name: 'Nora', value: 10, nora: true },
  { company: 'Santo Tomás', name: 'Ane', value: 10, nora: false },
  { company: 'La Salle', name: 'Ane', value: 10, nora: false },
  { company: 'Ekintza', name: 'Martín', value: 10, nora: false },
  { company: 'Kresala Txiki', name: 'Nora', value: 9, nora: true },
  { company: 'Amaratarra Txiki', name: 'Sara', value: 7, nora: false },
  { company: 'Sagrado Corazón Mundaiz', name: 'Nora', value: 7, nora: true },
  { company: 'Deutsche Schule', name: 'Martina', value: 6, nora: false },
  { company: 'Ikasbide', name: 'June', value: 6, nora: false },
  { company: 'Zurriola Ikastola', name: 'Nora', value: 6, nora: true },
] as const;

// Leaders of selected companies, 2023-2026 (names tied at the top; 'many' = several names tied below 5).
export type LeaderCell = readonly string[] | 'many';

export const leaders = [
  {
    company: 'Amara Berri',
    cells: [['Nahia'], ['Nahia'], ['Maddi', 'Nora'], ['Nora']],
  },
  {
    company: 'Kresala Txiki',
    cells: [['Maddi'], ['Maddi', 'Nora'], ['Maddi'], ['Nora']],
  },
  {
    company: 'Sagrado Corazón Mundaiz',
    cells: [['Nahia'], ['Ander'], ['Nahia', 'Nora', 'Paula'], ['Nora']],
  },
  {
    company: 'Zurriola Ikastola',
    cells: [['Ander'], ['Sara'], 'many', ['Nora']],
  },
  {
    company: 'Ekintza',
    cells: [['Ane', 'Martín', 'Martina'], ['Ane', 'Martín'], ['Martín'], ['Martín']],
  },
  {
    company: 'Deutsche Schule',
    cells: [['Martina'], ['Martina'], ['Martina'], ['Martina']],
  },
  {
    company: 'Santo Tomás',
    cells: [['Jon'], ['Jon', 'Mikel'], ['Maddi'], ['Ane']],
  },
  {
    company: 'La Salle',
    cells: [['Lucía'], ['Lucía'], ['Ane', 'Nora'], ['Ane']],
  },
] as const satisfies readonly { company: string; cells: readonly LeaderCell[] }[];

// Eustat: position of Nora among girls' names by year of birth (verified directly on the pages).
export const eustatRanks = [
  { year: '2022', euskadi: 7, gipuzkoa: 1, donostia: 2 },
  { year: '2023', euskadi: 4, gipuzkoa: 1, donostia: 1 },
  { year: '2024', euskadi: 3, gipuzkoa: 2, donostia: 2 },
  { year: '2025', euskadi: 4, gipuzkoa: 3, donostia: 3 },
] as const;

// Eustat, Euskadi: births named Nora in 2022, 2023, 2024 and 2025.
export const eustatBirths = { min: 90, max: 113 } as const;

// Sources verified directly. Cited in the original language.
export const externalSources: SourceItem[] = [
  {
    title: 'Nombres de niña más frecuentes en la CA de Euskadi, 2022-2025 (los 100 primeros)',
    publisher: 'Eustat, estadística de nacimientos',
    year: '17-8-2026',
    url: 'https://en.eustat.eus/elementos/ele0005700/ti_lista-de-los-100-nombres-de-nina-mas-frecuentes-en-la-ca-de-euskadi-2022-2025/tbl0005715_i.html',
  },
  {
    title: 'Nombres de niña más frecuentes por territorio histórico, 2022-2025 (los 25 primeros)',
    publisher: 'Eustat, estadística de nacimientos',
    year: '17-8-2026',
    url: 'https://en.eustat.eus/elementos/ele0005700/ti_lista-de-los-25-nombres-de-nina-mas-frecuentes-por-territorio-historico-en-la-ca-de-euskadi-2022-2024/tbl0005717_i.html',
  },
  {
    title: 'Nombres de niña más frecuentes en las capitales de la CA de Euskadi, 2022-2025 (los 25 primeros)',
    publisher: 'Eustat, estadística de nacimientos',
    year: '17-8-2026',
    url: 'https://en.eustat.eus/elementos/ele0005700/ti_lista-de-los-25-nombres-de-nina-mas-frecuentes-en-las-capitales-en-la-ca-de-euskadi-2022-2024/tbl0005719_i.html',
  },
];
