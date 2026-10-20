import { describe, expect, it } from 'vitest';

import { buildPeriodFacts } from '@/app/(frontend)/[locale]/config/structured-data/period/buildPeriodFacts';
import { makeGlobalPeriod, makePeriod, makePeriodList } from '@/test/fixtures/period';
import {
  makeFamily,
  makeRanksCategory,
  makeSchoolRef,
  makeStatisticRank,
  makeStatisticValue,
  makeStatisticsMeta,
  makeStatisticsResponse,
  makeValuesCategory,
} from '@/test/fixtures/statistics';

const ranks = ['Ane', 'Maite', 'Jon', 'Mikel', 'Leire', 'Ibai'].map((label, i) =>
  makeStatisticRank(i + 1, { entityLabel: label, value: 100 - i })
);

function makeFullStats() {
  return makeStatisticsResponse({
    overview: [
      { category: 'totalParticipants', metricKey: 'participant_count', valueNumeric: 1234 },
      { category: 'participantsGrowthRate', metricKey: 'growth_rate', valueNumeric: 2.91 },
      { category: 'participationRecordYears', metricKey: 'record_year', valueNumeric: 2019 },
      {
        category: 'participationRecordYears',
        metricKey: 'record_participant_count',
        valueNumeric: 1500,
      },
      { category: 'namesDiversity', metricKey: 'distinct_count', valueNumeric: 200 },
      { category: 'surnamesDiversity', metricKey: 'distinct_count', valueNumeric: 300 },
      {
        category: 'participantsWithMultipleNames',
        metricKey: 'participants_with_multiple_names',
        valueNumeric: 50,
      },
      {
        category: 'participantsWithMultipleNames',
        metricKey: 'multiple_names_rate',
        valueNumeric: 4.5,
      },
    ],
    families: [
      makeFamily('names', [
        makeRanksCategory('topNames', ranks),
        makeRanksCategory('newNames', [
          makeStatisticRank(1, { entityLabel: 'Nuevo A' }),
          makeStatisticRank(2, { entityLabel: 'Nuevo B' }),
        ]),
        makeRanksCategory(
          'perennialNames',
          [makeStatisticRank(1, { entityLabel: 'Perenne' })],
          null,
          'global'
        ),
      ]),
      makeFamily('schools', [
        makeRanksCategory('topSchools', [
          makeStatisticRank(1, {
            entityLabel: undefined,
            school: makeSchoolRef({ canonicalName: 'Escuela Uno' }),
            value: 50,
          }),
          makeStatisticRank(2, {
            entityLabel: undefined,
            groupSchool: makeSchoolRef({ canonicalName: 'Escuela Grupo' }),
            value: 40,
          }),
          makeStatisticRank(3, { entityLabel: undefined, value: 30 }),
        ]),
        makeRanksCategory('schoolGrowthRate', [
          makeStatisticRank(1, { entityLabel: 'Escuela Rapida', value: 12.5 }),
          makeStatisticRank(2, { entityLabel: 'Otra', value: 9 }),
        ]),
        makeValuesCategory('averageSchoolSize', [makeStatisticValue('average_school_size', 42.5)]),
      ]),
      makeFamily('schoolsRenewal', [
        makeValuesCategory('newVsVeteranSchoolRatio', [makeStatisticValue('school_count', 7)]),
      ]),
      makeFamily('schoolsEvolution', [
        makeRanksCategory(
          'schoolLongevity',
          [makeStatisticRank(1, { entityLabel: 'Escuela Antigua', value: 25 })],
          null,
          'global'
        ),
      ]),
    ],
  });
}

describe('buildPeriodFacts', () => {
  it('extracts every fact from a full year scenario', () => {
    const facts = buildPeriodFacts(makeFullStats(), makePeriodList());

    expect(facts).toEqual({
      period: '2024',
      kind: 'year',
      firstPeriod: '2023',
      lastPeriod: '2025',
      editions: 3,
      missingYears: [],
      participants: 1234,
      growth: 2.91,
      recordYear: 2019,
      recordCount: 1500,
      distinctNames: 200,
      distinctSurnames: 300,
      multipleNames: 50,
      multipleNamesRate: 4.5,
      averageSchoolSize: 42.5,
      schoolCount: 7,
      topNames: [
        { label: 'Ane', value: 100 },
        { label: 'Maite', value: 99 },
        { label: 'Jon', value: 98 },
        { label: 'Mikel', value: 97 },
        { label: 'Leire', value: 96 },
      ],
      topSurnames: [],
      topSchools: [
        { label: 'Escuela Uno', value: 50 },
        { label: 'Escuela Grupo', value: 40 },
      ],
      newNames: ['Nuevo A', 'Nuevo B'],
      perennialNames: ['Perenne'],
      schoolLongevity: [{ label: 'Escuela Antigua', value: 25 }],
      fastestGrowingSchool: { label: 'Escuela Rapida', value: 12.5 },
    });
  });

  it('returns null numbers, empty lists and no fastest school for an empty response', () => {
    const facts = buildPeriodFacts(
      makeStatisticsResponse({ overview: [], families: [] }),
      makePeriodList()
    );

    expect(facts).toMatchObject({
      participants: null,
      growth: null,
      recordYear: null,
      recordCount: null,
      distinctNames: null,
      distinctSurnames: null,
      multipleNames: null,
      multipleNamesRate: null,
      averageSchoolSize: null,
      schoolCount: null,
      topNames: [],
      topSurnames: [],
      topSchools: [],
      newNames: [],
      perennialNames: [],
      schoolLongevity: [],
      fastestGrowingSchool: null,
    });
  });

  describe('editions coverage', () => {
    it('reports the first and last year, the edition count and the missing years', () => {
      const periods = [
        makeGlobalPeriod(),
        makePeriod({ periodKey: '2024', publicSlug: '2024' }),
        makePeriod({ periodKey: '2023', publicSlug: '2023' }),
        makePeriod({ periodKey: '2021', publicSlug: '2021' }),
      ];

      const facts = buildPeriodFacts(makeStatisticsResponse(), periods);

      expect(facts).toMatchObject({
        firstPeriod: '2021',
        lastPeriod: '2024',
        editions: 3,
        missingYears: [2022],
      });
    });

    it('falls back to the current period when only the global period exists', () => {
      const facts = buildPeriodFacts(makeStatisticsResponse(), [makeGlobalPeriod()]);

      expect(facts.firstPeriod).toBe('2024');
      expect(facts.lastPeriod).toBe('2024');
      expect(facts.editions).toBe(0);
      expect(facts.missingYears).toEqual([]);
    });

    it('ignores a year period whose slug is not an integer', () => {
      const periods = [
        makeGlobalPeriod(),
        makePeriod({ periodKey: '2024', publicSlug: '2024' }),
        makePeriod({ periodKey: '2024', publicSlug: '2024-old', kind: 'year' }),
      ];

      const facts = buildPeriodFacts(makeStatisticsResponse(), periods);

      expect(facts).toMatchObject({
        firstPeriod: '2024',
        lastPeriod: '2024',
        editions: 1,
        missingYears: [],
      });
    });
  });

  it('keeps the global period and kind of a global response', () => {
    const stats = makeStatisticsResponse({
      metaData: makeStatisticsMeta({ period: 'global', periodKind: 'global' }),
      overview: [],
      families: [],
    });

    const facts = buildPeriodFacts(stats, makePeriodList());

    expect(facts.period).toBe('global');
    expect(facts.kind).toBe('global');
  });
});
