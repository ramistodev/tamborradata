import type { SourceItem } from '../../../types/article.types';

// Every figure below comes from own aggregate queries over the runs published on 2026-10-18
// (read-only, production database, queried on 2026-11-09), from the published statistics, and from
// the INE and Eustat sources verified directly in earlier work. Copy values; do not recompute them.
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

// Published `totalParticipants` (participations per edition).
export const participations = [
  4040, 3310, 2768, 4647, 4589, 4508, 4691, 4807, 4850, 4896, 4683, 2849, 5219, 5320, 5149, 5298,
] as const;

// Sum of the published `topNames` of each edition (participations with an identified first name).
export const identified = [
  4012, 3298, 2756, 4637, 4568, 4495, 4678, 4796, 4838, 4886, 4665, 2833, 5189, 5292, 5126, 5276,
] as const;

// Participations whose name could not be told from the surname (resolution status "ambiguous").
export const ambiguous = [28, 12, 12, 10, 21, 13, 13, 11, 12, 10, 18, 16, 30, 28, 23, 22] as const;

// Resolved participations with a resolver confidence below 0.8.
export const lowConfidence = [
  222, 122, 92, 135, 117, 113, 130, 148, 107, 123, 102, 80, 141, 180, 198, 254,
] as const;

// Share (%) of the edition's participations resolved with low confidence (one decimal).
export const lowConfidencePct = lowConfidence.map(
  (value, index) => Math.round((value / participations[index]) * 1000) / 10
);

// Companies with participants in each edition.
export const companies = [43, 45, 25, 43, 43, 42, 42, 42, 41, 41, 40, 26, 45, 45, 42, 43] as const;

export const figures = {
  editions: 16,
  total: 71624,
  resolved: 71345,
  ambiguous: 279,
  ambiguousPct: 0.4,
  noPrimaryName: 206,
  lowConfidence: 2264,
  lowConfidencePct: 3.2,
  // Rows whose written form differs from "Name Surname Surname" or is hard to read
  commaFormat: 886,
  singleWord: 18,
  parentheses: 13,
  sixOrMoreWords: 121,
  // Ambiguous rows by number of words in the written name
  ambiguousShortNames: 137,
  ambiguousThreeWords: 116,
  // Source format: share of rows written as "Surnames, Name"
  commaShare2008: 15.1,
  commaShare2017: 5.6,
  // Company names written in different ways at the source
  companyAliases: 251,
  companiesRegistered: 53,
  maxAliases: 14,
  // Partial editions
  partial2011: { common: 42, under60: 15, under80: 21 },
  partial2012: { companies: 25, urls: 27, sizeVs2013: { edition: 2366, reference: 2446, common: 22 } },
  partial2022: { companies: 26, urls: 27, sizeVs2020: { edition: 2686, reference: 2693, common: 23 } },
  // Low-confidence share extremes
  lowConfidenceMin: 2.2,
  lowConfidence2008Pct: 5.5,
  lowConfidence2026Pct: 4.8,
  // INE surnames
  surnamesMatching: 10,
  // Smallest figure shown anywhere in the article
  smallestFigure: 10,
} as const;

// Organisers' figures for the Tamborrada Infantil parade (Donostia Kultura press notes and memorias,
// 2025 participants as reported by Orain) against own counts. `own` excludes the four "Txiki" sections
// (Unión Artesana, Amaratarra Txiki, Kresala Txiki, Gaztelubide Txiki) that join the dataset from 2022-2023.
// `ownWithAll` is the full dataset total. Differences are rounded to one decimal.
export const officialComparison = [
  { year: '2017', official: 4977, officialCentres: 42, own: 4807, ownCompanies: 42, ownWithAll: 4807 },
  { year: '2020', official: 4828, officialCentres: 41, own: 4683, ownCompanies: 40, ownWithAll: 4683 },
  { year: '2023', official: 4731, officialCentres: 41, own: 4672, ownCompanies: 41, ownWithAll: 5219 },
  { year: '2024', official: 4732, officialCentres: 41, own: 4710, ownCompanies: 41, ownWithAll: 5320 },
  { year: '2025', official: 4625, officialCentres: 38, own: 4506, ownCompanies: 38, ownWithAll: 5149 },
] as const;

// Difference (%) between own count and the organisers' figure, one decimal.
export const officialGapPct = officialComparison.map(
  ({ official, own }) => Math.round(((own - official) / official) * 1000) / 10
);

export const officialFacts = {
  gapMin: 0.5,
  gapMax: 3.4,
  // Txiki sections in the dataset: participants in 2023 and 2026
  txiki2023: 547,
  txiki2026: 724,
  // Dataset totals with the Txiki sections
  withAll2023: 5219,
  // Organisers' press note of 2024 states 4,732 in the headline and 4,731 in the body
  pressNote2024: { headline: 4732, body: 4731 },
} as const;

// Rows of the "what could not be cleaned" table: participations out of `figures.total`.
export const residue = [
  { id: 'lowConfidence', value: figures.lowConfidence },
  { id: 'commaFormat', value: figures.commaFormat },
  { id: 'ambiguous', value: figures.ambiguous },
  { id: 'noPrimaryName', value: figures.noPrimaryName },
  { id: 'sixOrMoreWords', value: figures.sixOrMoreWords },
  { id: 'singleWord', value: figures.singleWord },
  { id: 'parentheses', value: figures.parentheses },
] as const;

export type ResidueId = (typeof residue)[number]['id'];

// Q + E-INE (first surname by province of residence, 1 Jan 2025): rank of each surname in the
// Tamborrada 2026 and among Gipuzkoa residents. Ordered by 2026 rank.
export const surnameRanks = [
  { surname: 'García', y2026: 1, gipuzkoa: 1 },
  { surname: 'González', y2026: 2, gipuzkoa: 2 },
  { surname: 'Martínez', y2026: 3, gipuzkoa: 8 },
  { surname: 'Fernández', y2026: 4, gipuzkoa: 4 },
  { surname: 'Rodríguez', y2026: 5, gipuzkoa: 3 },
  { surname: 'Pérez', y2026: 6, gipuzkoa: 6 },
  { surname: 'López', y2026: 7, gipuzkoa: 7 },
  { surname: 'Sánchez', y2026: 8, gipuzkoa: 5 },
  { surname: 'Martín', y2026: 9, gipuzkoa: 9 },
  { surname: 'Gómez', y2026: 10, gipuzkoa: 10 },
] as const;

// E-Eustat: first names that lead newborns in Gipuzkoa 2022-2025 and are also in the Tamborrada 2026 Top 10.
export const sharedNames = ['Nora', 'June', 'Martin', 'Markel'] as const;

// Sources verified directly. Cited in the original language.
export const externalSources: SourceItem[] = [
  {
    title: 'Nota de prensa de la Tamborrada Infantil 2024',
    publisher: 'Donostia Kultura',
    year: '12-1-2024',
    url: 'https://www.donostiakultura.eus/imgs/agenda/eventos/2024/Festak/01-Urtarrila/docs/TINFANTILNOTAPRENSA24.pdf',
  },
  {
    title: 'Nota de prensa de la Tamborrada Infantil 2023',
    publisher: 'Donostia Kultura',
    year: '13-1-2023',
    url: 'https://donostiakultura.eus/imgs/agenda/eventos/2023/festak/docs/NOTAPRENSATAMBORRADAINFANTIL.pdf',
  },
  {
    title: 'Memoria de fiestas 2020',
    publisher: 'Donostia Kultura',
    year: '2020',
    url: 'https://www.donostiakultura.eus/imgs/acerca-de-DK/memorias/2020/docs/fiestas-2020-es.pdf',
  },
  {
    title: 'Nota de prensa de la Tamborrada Infantil 2017',
    publisher: 'Donostia Kultura',
    year: '2017',
    url: 'https://www.donostiakultura.eus/images/100_actividades/130_fiestas/020_dia_de_snsn_tamborrada/2017/PRENTSAOHARRAGAZTELERA.pdf',
  },
  {
    title: '45 compañías y 5000 niñas y niños recorrerán las calles de San Sebastián',
    publisher: 'Orain',
    year: '15-1-2025',
    url: 'https://orain.eus/es/actualidad/sociedad/2025/01/15/45-companias-y-5000-ninas-y-ninos-recorreran-calles-de-san-sebastian-al-son-de-marchas-de-sarriegi/',
  },
  {
    title: 'Primer apellido más frecuente por provincia de residencia, censo anual a 1-1-2025',
    publisher: 'INE',
    url: 'https://www.ine.es/daco/daco42/nombyapel/apellidos_mas_frecuentes.xls',
  },
  {
    title: 'Nota de prensa sobre nombres de los nacidos en 2022-2024',
    publisher: 'Eustat',
    year: '7-10-2025',
    url: 'https://es.eustat.eus/elementos/not0025020_c.pdf',
  },
  {
    title: 'Nombres de niña más frecuentes por territorio histórico, 2022-2025',
    publisher: 'Eustat',
    url: 'https://en.eustat.eus/elementos/ele0005700/ti_lista-de-los-25-nombres-de-nina-mas-frecuentes-por-territorio-historico-en-la-ca-de-euskadi-2022-2024/tbl0005717_i.html',
  },
  {
    title: 'Nombres de niño más frecuentes por territorio histórico, 2022-2025',
    publisher: 'Eustat',
    url: 'https://en.eustat.eus/elementos/ele0005700/ti_lista-de-los-25-nombres-de-nino-mas-frecuentes-por-territorio-historico-en-la-ca-de-euskadi-2022-2024/tbl0005718_i.html',
  },
];
