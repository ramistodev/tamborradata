export const chartEditions = [
  2008, 2011, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2023, 2024, 2025, 2026,
] as const;

export type ChartEdition = (typeof chartEditions)[number];

export type ByEdition = Record<ChartEdition, number>;

export const namedParticipants: ByEdition = {
  2008: 4019,
  2011: 3306,
  2013: 4643,
  2014: 4576,
  2015: 4501,
  2016: 4682,
  2017: 4798,
  2018: 4839,
  2019: 4887,
  2020: 4668,
  2023: 5198,
  2024: 5300,
  2025: 5126,
  2026: 5280,
};

export const topTenShare: ByEdition = {
  2008: 20.88,
  2011: 19.6,
  2013: 17.96,
  2014: 18.16,
  2015: 17.17,
  2016: 16.55,
  2017: 15.96,
  2018: 16.26,
  2019: 16.17,
  2020: 17.25,
  2023: 16.04,
  2024: 15.25,
  2025: 14.87,
  2026: 14.51,
};

export const sampledDistinctNames: ByEdition = {
  2008: 516.7,
  2011: 562.7,
  2013: 568.2,
  2014: 572.8,
  2015: 587.9,
  2016: 604.0,
  2017: 605.3,
  2018: 618.7,
  2019: 642.1,
  2020: 640.6,
  2023: 657.1,
  2024: 686.1,
  2025: 701.5,
  2026: 713.8,
};

export const oldTopTwentyShare: ByEdition = {
  2008: 34.06,
  2011: 30.85,
  2013: 27.93,
  2014: 27.14,
  2015: 25.28,
  2016: 23.71,
  2017: 22.2,
  2018: 21.97,
  2019: 20.5,
  2020: 20.65,
  2023: 17.87,
  2024: 17.23,
  2025: 16.02,
  2026: 15.08,
};

export const currentTopTwentyShare: ByEdition = {
  2008: 20.1,
  2011: 23.41,
  2013: 23.45,
  2014: 24.3,
  2015: 24.37,
  2016: 24.5,
  2017: 24.57,
  2018: 25.01,
  2019: 25.46,
  2020: 26.48,
  2023: 26.13,
  2024: 25.06,
  2025: 25.19,
  2026: 24.58,
};

export const noraShare: ByEdition = {
  2008: 0.35,
  2011: 0.91,
  2013: 1.18,
  2014: 1.2,
  2015: 1.44,
  2016: 1.67,
  2017: 1.56,
  2018: 1.67,
  2019: 1.68,
  2020: 1.99,
  2023: 2.04,
  2024: 1.94,
  2025: 1.97,
  2026: 2.08,
};

export const aneShare: ByEdition = {
  2008: 2.84,
  2011: 2.33,
  2013: 1.87,
  2014: 1.94,
  2015: 2.11,
  2016: 2.31,
  2017: 2.13,
  2018: 2.15,
  2019: 2.25,
  2020: 2.42,
  2023: 2.27,
  2024: 2.15,
  2025: 1.81,
  2026: 1.88,
};

export const jonShare: ByEdition = {
  2008: 2.49,
  2011: 2.6,
  2013: 2.67,
  2014: 2.58,
  2015: 2.27,
  2016: 1.82,
  2017: 1.79,
  2018: 1.8,
  2019: 1.8,
  2020: 1.86,
  2023: 1.89,
  2024: 1.7,
  2025: 1.68,
  2026: 1.57,
};

export const coreShare: ByEdition = {
  2008: 77.5,
  2011: 79.7,
  2013: 78.2,
  2014: 78.5,
  2015: 78.2,
  2016: 77.3,
  2017: 77.3,
  2018: 76.0,
  2019: 74.8,
  2020: 74.6,
  2023: 69.6,
  2024: 67.6,
  2025: 65.5,
  2026: 63.9,
};

export const nameCounts = {
  maria: {
    2008: 85,
    2011: 49,
    2013: 97,
    2014: 94,
    2015: 75,
    2016: 66,
    2017: 63,
    2018: 54,
    2019: 45,
    2020: 36,
    2023: 38,
    2024: 42,
    2025: 30,
    2026: 26,
  },
  leire: {
    2008: 89,
    2011: 75,
    2013: 89,
    2014: 80,
    2015: 73,
    2016: 69,
    2017: 65,
    2018: 68,
    2019: 55,
    2020: 44,
    2023: 40,
    2024: 41,
    2025: 36,
    2026: 37,
  },
  inaki: {
    2008: 30,
    2011: 0,
    2013: 27,
    2014: 32,
    2015: 25,
    2016: 20,
    2017: 13,
    2018: 11,
    2019: 7,
    2020: 9,
    2023: 7,
    2024: 2,
    2025: 1,
    2026: 3,
  },
  martina: {
    2008: 1,
    2011: 0,
    2013: 1,
    2014: 3,
    2015: 2,
    2016: 4,
    2017: 12,
    2018: 15,
    2019: 22,
    2020: 26,
    2023: 59,
    2024: 56,
    2025: 62,
    2026: 62,
  },
  laia: {
    2008: 2,
    2011: 2,
    2013: 2,
    2014: 4,
    2015: 8,
    2016: 8,
    2017: 14,
    2018: 11,
    2019: 22,
    2020: 24,
    2023: 33,
    2024: 40,
    2025: 50,
    2026: 45,
  },
} as const satisfies Record<string, ByEdition>;

export const arrivals = [
  { name: 'Martina', in2013: 1, in2026: 62 },
  { name: 'Noa', in2013: 4, in2026: 53 },
  { name: 'Laia', in2013: 2, in2026: 45 },
  { name: 'Luka', in2013: 1, in2026: 38 },
  { name: 'Leo', in2013: 0, in2026: 28 },
] as const;

export const noraHistory = [
  { year: 2008, count: 14, share: 0.35, position: 70 },
  { year: 2011, count: 30, share: 0.91, position: 25 },
  { year: 2013, count: 55, share: 1.18, position: 15 },
  { year: 2016, count: 78, share: 1.67, position: 4 },
  { year: 2020, count: 93, share: 1.99, position: 2 },
  { year: 2023, count: 106, share: 2.04, position: 2 },
  { year: 2024, count: 103, share: 1.94, position: 2 },
  { year: 2025, count: 101, share: 1.97, position: 1 },
  { year: 2026, count: 110, share: 2.08, position: 1 },
] as const;

export const editionsPerName = [
  { editions: 1, names: 968 },
  { editions: 2, names: 421 },
  { editions: 3, names: 263 },
  { editions: 4, names: 215 },
  { editions: 5, names: 162 },
  { editions: 6, names: 98 },
  { editions: 7, names: 94 },
  { editions: 8, names: 65 },
  { editions: 9, names: 55 },
  { editions: 10, names: 43 },
  { editions: 11, names: 44 },
  { editions: 12, names: 41 },
  { editions: 13, names: 37 },
  { editions: 14, names: 49 },
  { editions: 15, names: 51 },
  { editions: 16, names: 189 },
] as const;

export const topTenStaying = [
  { name: 'Ane', editions: 16 },
  { name: 'Jon', editions: 16 },
  { name: 'Ander', editions: 15 },
  { name: 'Iker', editions: 12 },
  { name: 'Nora', editions: 11 },
  { name: 'Unai', editions: 10 },
  { name: 'Nahia', editions: 10 },
  { name: 'Paula', editions: 9 },
  { name: 'Leire', editions: 9 },
  { name: 'María', editions: 7 },
] as const;

export const figures = {
  editionCount: 16,
  firstEdition: 2008,
  lastEdition: 2026,
  namedParticipations: 71418,
  completeEditionCount: 12,
  sampleSize: 2761,
  sampleDraws: 30,
  distinct2008: 622,
  distinct2026: 1026,
  sampledDistinct2008: 516.7,
  sampledDistinct2026: 713.8,
  panelSchools: 35,
  panelDistinct2023: 843,
  panelDistinct2026: 957,
  panelMinParticipants: 4213,
  panelMaxParticipants: 4236,
  pairOneIn2008: 118,
  pairOneIn2026: 190,
  leaderShare2008: 2.84,
  leaderShare2026: 2.08,
  noraCount2008: 14,
  noraCount2026: 110,
  noraPosition2008: 70,
  noraCount2025: 101,
  aneCount2025: 93,
  aneCount2026: 99,
  noraShareSince2020Min: 1.94,
  noraShareSince2020Max: 2.08,
  topTenOverlapMin: 7,
  topTenOverlapMax: 9,
  mariaPosition2008: 5,
  mariaPosition2026: 50,
  coreNames: 189,
  coreParticipations: 52740,
  coreShare2008: 77.5,
  coreShare2026: 63.9,
  singleEditionNames: 968,
  unseenParticipants2026: 536,
  unseenShare2017: 3.19,
  unseenShare2026: 10.15,
  partialEditionSchools: 25,
  regularEditionSchoolsMin: 40,
} as const;

export const yearsBetween = figures.lastEdition - figures.firstEdition;

export const pairDropPercent = Math.round(
  (1 - figures.pairOneIn2008 / figures.pairOneIn2026) * 100
);

export const sampledIncrease = Math.round(
  figures.sampledDistinct2026 - figures.sampledDistinct2008
);

export const sampledIncreasePercent = Math.round(
  ((figures.sampledDistinct2026 - figures.sampledDistinct2008) / figures.sampledDistinct2008) * 100
);

export const coreShareOfAll = (figures.coreParticipations / figures.namedParticipations) * 100;

export const singleEditionShareOfNames =
  (figures.singleEditionNames / editionsPerName.reduce((total, { names }) => total + names, 0)) *
  100;
