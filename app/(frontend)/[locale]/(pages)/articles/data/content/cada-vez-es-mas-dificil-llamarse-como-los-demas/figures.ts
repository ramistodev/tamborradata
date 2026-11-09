// Every figure below comes from the approved v2 draft and its evidence ledger.
// Queries of 2026-11-09 over the runs published on 2026-10-18. Copy values; do not recompute them.
// Qn = own database queries (production, read-only).

// Q1: published periods. 16 editions; no data for 2009, 2010 and 2021.
// Q5: published denominators. "Participants" are participations with an unambiguous first name.
export const participants = {
  y2008: 4012,
  y2026: 5276,
} as const;

export const totalParticipations = {
  y2008: 4040,
  y2026: 5298,
} as const;

// Q1, Q3, Q4, Q6: the 14 editions used by the evolution charts. 2012 and 2022 are incomplete
// editions (about 25 schools against 40 or more) and are left out; 2009, 2010 and 2021 have no data.
export const chartEditions = [
  '2008',
  '2011',
  '2013',
  '2014',
  '2015',
  '2016',
  '2017',
  '2018',
  '2019',
  '2020',
  '2023',
  '2024',
  '2025',
  '2026',
] as const;

// Q2: Top 10 first names (participations). "Iñigo" is stored as "Inigo".
export const topNames2008 = [
  { name: 'Ane', count: 114 },
  { name: 'Jon', count: 100 },
  { name: 'Iñigo', count: 94 },
  { name: 'Leire', count: 89 },
  { name: 'María', count: 85 },
  { name: 'Ander', count: 80 },
  { name: 'Mikel', count: 78 },
  { name: 'Asier', count: 70 },
  { name: 'Andrea', count: 65 },
  { name: 'Iker', count: 64 },
] as const;

export const topNames2026 = [
  { name: 'Nora', count: 110 },
  { name: 'Ane', count: 99 },
  { name: 'Jon', count: 83 },
  { name: 'Sara', count: 73 },
  { name: 'Maddi', count: 71 },
  { name: 'Telmo', count: 70 },
  { name: 'June', count: 69 },
  { name: 'Nahia', count: 65 },
  { name: 'Markel', count: 63 },
  { name: 'Martin', count: 63 },
] as const;

const sum = (values: readonly number[]) => values.reduce((total, value) => total + value, 0);

// Q6: Top 10 totals (839 and 766). Derived from the two lists above.
export const topTenTotal = {
  y2008: sum(topNames2008.map(({ count }) => count)),
  y2026: sum(topNames2026.map(({ count }) => count)),
} as const;

// Q6: weight of the Top 10 (% of the participants of each edition), 14 editions.
export const topTenShare = [
  20.91, 19.62, 17.99, 18.19, 17.2, 16.57, 15.97, 16.27, 16.17, 17.26, 16.05, 15.27, 14.87, 14.52,
] as const;

// Q3: one in N pairs of participants shares the first name (rounded), 14 editions.
// Unrounded: 117.9 (2008), 128.1, 140.0, 138.9, 142.0, 149.7, 155.4, 157.6, 160.7, 155.0, 170.6,
// 181.6, 184.6, 190.0 (2026).
export const pairOneIn = [118, 128, 140, 139, 142, 150, 155, 158, 161, 155, 171, 182, 185, 190] as const;

// Q4: distinct names expected in a random draw of 2,756 participants (exact, without replacement).
export const sampleSize = 2756; // size of the smallest list
export const expectedDistinctNames = [
  516.3, 559.9, 569.0, 573.7, 581.7, 602.2, 604.2, 619.1, 640.8, 637.1, 655.7, 689.5, 703.4, 713.0,
] as const;

export const figures = {
  editions: 16,
  // Q1: distinct names in each edition
  distinct2008: 620,
  distinct2026: 1025,
  // Q9: panel of the 35 schools present in the 12 complete editions (2013-2020 and 2023-2026)
  panelSchools: 35,
  panel2023: { participants: 4226, distinctNames: 842 },
  panel2026: { participants: 4232, distinctNames: 956 },
  // Q6: participants whose name has fewer than five bearers in the edition, and names with a single bearer
  uncommon2008: { participants: 761, share: 18.97, singleBearerNames: 301 },
  uncommon2026: { participants: 1218, share: 23.09, singleBearerNames: 563 },
  // Q11: participants with each name (2008 values below five are not published)
  counts: {
    maria: { y2008: 85, y2026: 26 },
    leire: { y2008: 89, y2026: 37 },
    martina: { y2026: 62 },
    noa: { y2026: 53 },
    laia: { y2026: 45 },
  },
  // Q8: participations in 2017 / 2026 with a name absent from the published editions 2008-2016
  // (152 participations in 2017)
  unseen2017: { share: 3.17 },
  unseen2026: { participants: 542, share: 10.27 },
  // Q10 (told in words in the copy): the Top 10 keeps between 7 and 9 names from the previous published edition
  // Q7: Ane and Jon are in the top five in all 16 editions
} as const;

// Q11: dataTable rows (names with counts; "menos de 5" is resolved per language).
export const arrivals = [
  { name: 'Martina', count2026: figures.counts.martina.y2026 },
  { name: 'Noa', count2026: figures.counts.noa.y2026 },
  { name: 'Laia', count2026: figures.counts.laia.y2026 },
] as const;

// Derived from the figures above (Q2, Q4, Q9).
export const derived = {
  // "one in 35" / "one in 48": the leading name against the whole edition
  leaderOneIn2008: Math.round(participants.y2008 / topNames2008[0].count),
  leaderOneIn2026: Math.round(participants.y2026 / topNames2026[0].count),
  // +38 %: expected distinct names in 2026 against 2008
  expectedIncreasePercent: Math.round(
    (expectedDistinctNames[expectedDistinctNames.length - 1] / expectedDistinctNames[0] - 1) * 100
  ),
  panelExtraNames: figures.panel2026.distinctNames - figures.panel2023.distinctNames,
} as const;
