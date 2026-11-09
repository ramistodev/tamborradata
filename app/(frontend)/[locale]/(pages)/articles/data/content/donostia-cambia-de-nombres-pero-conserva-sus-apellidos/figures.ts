import type { SourceItem } from '../../../types/article.types';

// Every figure below comes from the approved v3 draft and its evidence ledger.
// Queries of 2026-11-09 over the runs published on 2026-10-18. Copy values; do not recompute them.
// Q = own database queries; E-INE / E-Eustat / E-BOE = external sources verified directly.

// Q1: published periods. No data for 2009, 2010 and 2021.
export const figures = {
  editions: 16,
  smallestFigure: 17, // smallest figure cited in the article (Ramos, 2008)
  // Q6/Q9: first names of Basque form in the Top 30 (strict criterion)
  basqueTop30: { y2008: 18, peakLow: 22, peakHigh: 23, y2026: 16 },
  // Q2/Q7: Top 10 of Basque form (first names) and Basque origin (surnames)
  basqueTop10: {
    names: { y2008: 8, y2026: 5 },
    surnames: { y2008: 0, y2026: 0 },
  },
  // Q7: author example (aggregates)
  given: { count2008: 48, count2026: 47 },
  surname: { count2008: 17, count2026: 23 },
} as const;

// Q2: Top 10 first names (participations). "Iñigo" is stored as "Inigo".
export const topNames2008 = [
  { label: 'Ane', value: 114 },
  { label: 'Jon', value: 100 },
  { label: 'Iñigo', value: 94 },
  { label: 'Leire', value: 89 },
  { label: 'María', value: 85 },
  { label: 'Ander', value: 80 },
  { label: 'Mikel', value: 78 },
  { label: 'Asier', value: 70 },
  { label: 'Andrea', value: 65 },
  { label: 'Iker', value: 64 },
] as const;

export const topNames2026 = [
  { label: 'Nora', value: 110 },
  { label: 'Ane', value: 99 },
  { label: 'Jon', value: 83 },
  { label: 'Sara', value: 73 },
  { label: 'Maddi', value: 71 },
  { label: 'Telmo', value: 70 },
  { label: 'June', value: 69 },
  { label: 'Nahia', value: 65 },
  { label: 'Markel', value: 63 },
  { label: 'Martin', value: 63 },
] as const;

export const highlightedNames = ['Ane', 'Jon'] as const;

// Q4 (supporting, not shown): Top 10 first-name overlap with the previous published edition,
// 2011...2026 = 8, 7, 9, 7, 8, 8, 8, 9, 9, 8, 8, 9, 8, 9, 7 of 10, i.e. 1 to 3 changes per edition.
// Q2 (supporting, not shown): Iñigo 94 -> 35 and Leire 89 -> 37 appearances (2008 -> 2026), a loss of more than half.
// Q3 (supporting, not shown): surname Top 10 shares nine or ten with 2008 in 14 of the other 15 editions.

// Q2, Q3: editions with data (2008 is the baseline) and Top 10 overlap with 2008 (out of 10).
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

export const overlapNames = [10, 8, 7, 7, 5, 6, 7, 5, 5, 4, 4, 4, 4, 3, 3, 2] as const;
export const overlapSurnames = [10, 7, 10, 10, 10, 10, 10, 10, 10, 10, 9, 9, 9, 10, 10, 10] as const;

// Q2 + E-INE (Excel INE, first surname by province of residence, 1 Jan 2025):
// rank of each surname in the Tamborrada (2008, 2026) and among Gipuzkoa residents. Rows ordered by 2026 rank.
export const surnameRanks = [
  { surname: 'García', y2008: 1, y2026: 1, gipuzkoa: 1 },
  { surname: 'González', y2008: 3, y2026: 2, gipuzkoa: 2 },
  { surname: 'Martínez', y2008: 4, y2026: 3, gipuzkoa: 8 },
  { surname: 'Fernández', y2008: 2, y2026: 4, gipuzkoa: 4 },
  { surname: 'Rodríguez', y2008: 5, y2026: 5, gipuzkoa: 3 },
  { surname: 'Pérez', y2008: 6, y2026: 6, gipuzkoa: 6 },
  { surname: 'López', y2008: 8, y2026: 7, gipuzkoa: 7 },
  { surname: 'Sánchez', y2008: 7, y2026: 8, gipuzkoa: 5 },
  { surname: 'Martín', y2008: 10, y2026: 9, gipuzkoa: 9 },
  { surname: 'Gómez', y2008: 9, y2026: 10, gipuzkoa: 10 },
] as const;

// Q10: appearances per thousand first-name records, by edition (same order as `editions`).
export const perThousand = {
  nora: [3.5, 9.1, 11.2, 11.9, 12.0, 14.5, 16.7, 15.6, 16.7, 16.8, 19.9, 21.2, 20.4, 19.5, 19.7, 20.8],
  telmo: [5.0, 6.4, 7.6, 5.8, 5.5, 6.5, 6.8, 7.5, 8.7, 9.4, 8.6, 9.5, 10.4, 11.1, 12.9, 13.3],
  maria: [21.2, 14.9, 31.2, 20.9, 20.6, 16.7, 14.1, 13.1, 11.2, 9.2, 7.7, 5.3, 7.3, 7.9, 5.9, 4.9],
  ane: [28.4, 23.3, 20.0, 18.8, 19.5, 21.1, 23.1, 21.3, 21.5, 22.5, 24.2, 20.5, 22.7, 21.5, 18.1, 18.8],
} as const;

// Q10 + Q2: appearances (participations) quoted in the story
export const trajectories = {
  nora: { count2008: 14, count2026: 110 },
  maria: { count2008: 85, count2026: 26 },
  andrea: { count2008: 65, count2026: 10 },
} as const;

// Q2 + Q5: concentration of the Top 10 (own calculation over published ranks).
// Names: share of first-name appearances. Surnames: share of surname appearances (first and second).
export const concentration = {
  y2008: { topNames: 839, nameAppearances: 4012, topSurnames: 759, surnameAppearances: 6648 },
  y2026: { topNames: 766, nameAppearances: 5276, topSurnames: 1098, surnameAppearances: 8695 },
} as const;

export const share = (part: number, whole: number) => (part / whole) * 100;

// Q6, Q8, Q9: first names classified as Basque in form (strict criterion). Editorial classification.
export const basqueNamesStrict = [
  'Ane',
  'Jon',
  'Ander',
  'Iker',
  'Unai',
  'Nahia',
  'Leire',
  'Mikel',
  'Irati',
  'Maddi',
  'Julen',
  'Eneko',
  'Markel',
  'Iñigo',
  'Asier',
  'Oier',
  'Uxue',
  'Aitor',
  'Naroa',
  'Maialen',
  'Xabier',
  'Aimar',
  'Ibai',
  'Ainhoa',
  'Nerea',
  'Eider',
  'Malen',
  'Danel',
  'Amaia',
  'Naiara',
  'Maider',
  'Unax',
] as const;

// Q9: share (%) of the appearances of the Top 30 first names that are of Basque form, by edition.
export const basqueShare = {
  strict: [67.0, 76.0, 61.9, 73.3, 74.8, 75.7, 75.3, 75.1, 73.1, 74.1, 70.8, 68.5, 62.8, 59.4, 56.1, 51.9],
  restrictive: [47.7, 60.9, 45.2, 58.6, 61.4, 63.3, 63.1, 68.0, 63.7, 64.1, 61.0, 60.7, 57.7, 54.7, 52.2, 48.4],
  broad: [67.0, 78.2, 64.7, 79.0, 80.1, 82.3, 83.0, 82.6, 83.5, 84.7, 83.9, 80.8, 78.4, 77.8, 75.0, 71.4],
} as const;

// E-BOE, E-INE, E-Eustat and the rest: sources verified directly. Cited in the original language.
// `noteId` points to a per-locale note in the copy (`used.sourceNotes`).
export type SourceNoteId = 'castells' | 'montero';

export const externalSources: (SourceItem & { noteId?: SourceNoteId })[] = [
  {
    title: 'Orden de 18 de mayo de 1938',
    publisher: 'Ministerio de Justicia, BOE n.º 577',
    year: '21-5-1938',
    url: 'https://www.boe.es/gazeta/dias/1938/05/21/pdfs/BOE-1938-577.pdf',
  },
  {
    title: 'Ley 17/1977, de 4 de enero, sobre reforma del artículo 54 de la Ley del Registro Civil',
    publisher: 'BOE',
    year: '8-1-1977',
    url: 'https://boe.es/boe/dias/1977/01/08/pdfs/A00393-00393.pdf',
  },
  {
    title: 'Real Decreto 3455/1977, de 1 de diciembre',
    publisher: 'BOE',
    year: '25-1-1978',
    url: 'https://boe.es/boe/dias/1978/01/25/pdfs/A01745-01750.pdf',
  },
  {
    title: 'Nombres vascos de persona en España 2000-2017',
    publisher: 'Gorrotxategi Nieto, M. (Euskaltzaindia), Moenia 25',
    year: '2019',
    url: 'https://revistas.usc.gal/index.php/moenia/article/view/6055/9970',
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
  {
    title: 'Primer apellido más frecuente por provincia de residencia, censo anual a 1-1-2025',
    publisher: 'INE',
    url: 'https://www.ine.es/daco/daco42/nombyapel/apellidos_mas_frecuentes.xls',
  },
  {
    title: 'Migraciones hacia el País Vasco en los siglos XX y XXI',
    publisher: 'Instituto de Historia Social Valentín de Foronda (UPV/EHU)',
    url: 'https://www.ehu.eus/es/web/institutovalentindeforonda/migraciones-hacia-el-pais-vasco-en-los-siglos-xx-y-xxi',
  },
  {
    title: 'Migraciones internas y su aportación al desarrollo de Gipuzkoa (1950-1975)',
    publisher: 'Castells, Hernando, Izaola, Juaristi, López Romo y Zubero, Fundación Ramón Rubial',
    year: '2018',
    url: 'https://medios.mugak.eu/noticias/noticia/572213?criterio_id=17698',
    noteId: 'castells',
  },
  {
    title: 'Estudios Vascos, Sancho el Sabio n.º 38',
    publisher: 'Montero',
    year: '2015',
    url: 'https://dialnet.unirioja.es/descarga/articulo/5307927.pdf',
    noteId: 'montero',
  },
  {
    title: 'El bombardeo de Gernika',
    publisher: 'Museo de la Paz de Gernika',
    url: 'https://www.museodelapaz.eus/en/the-bombing-of-gernika/',
  },
];
