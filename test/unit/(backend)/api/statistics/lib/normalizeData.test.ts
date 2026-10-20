import { describe, expect, it } from 'vitest';
import { normalizeData } from '@/app/(backend)/api/statistics/lib/normalizeData';
import { categoryDataShape } from '@/app/types/statistics';
import { makeRankRaw, makeSeriesPointRaw, makeValueRaw } from '@/test/fixtures/dbRows';

const schools = new Map([
  ['s1', { schoolId: 's1', canonicalName: 'Escuela Uno', schoolKey: 'escuela-uno' }],
  ['s2', { schoolId: 's2', canonicalName: 'Escuela Dos', schoolKey: 'escuela-dos' }],
]);

const school1 = { canonicalName: 'Escuela Uno', schoolKey: 'escuela-uno' };
const school2 = { canonicalName: 'Escuela Dos', schoolKey: 'escuela-dos' };

describe('normalizeData', () => {
  describe('ranks', () => {
    const normalize = (data: ReturnType<typeof makeRankRaw>[]) =>
      normalizeData(data, categoryDataShape.ranks, schools);

    it('maps a row to camelCase without id, school or groupSchool', () => {
      expect(normalize([makeRankRaw({ id: 'r1' })])).toStrictEqual([
        { entityType: 'name', rank: 1, value: 10, entityKey: 'ane', entityLabel: 'Ane' },
      ]);
    });

    it('adds the resolved school', () => {
      expect(normalize([makeRankRaw({ school_id: 's1' })])[0]).toStrictEqual({
        entityType: 'name',
        rank: 1,
        value: 10,
        school: school1,
        entityKey: 'ane',
        entityLabel: 'Ane',
      });
    });

    it('adds the resolved group school', () => {
      expect(normalize([makeRankRaw({ group_school_id: 's2' })])[0]).toStrictEqual({
        entityType: 'name',
        rank: 1,
        value: 10,
        groupSchool: school2,
        entityKey: 'ane',
        entityLabel: 'Ane',
      });
    });

    it('omits an empty entity key and label', () => {
      expect(normalize([makeRankRaw({ entity_key: '', entity_label: '' })])).toStrictEqual([
        { entityType: 'name', rank: 1, value: 10 },
      ]);
    });

    it('throws for an unknown school id', () => {
      expect(() => normalize([makeRankRaw({ school_id: 'zz' })])).toThrow(
        new Error('Failed to resolve school ID: zz')
      );
    });

    it('returns an empty list for no rows', () => {
      expect(normalize([])).toEqual([]);
    });

    it('preserves the row order', () => {
      const result = normalize([makeRankRaw({ rank: 3 }), makeRankRaw({ rank: 1 }), makeRankRaw({ rank: 2 })]);

      expect(result.map((row) => row.rank)).toEqual([3, 1, 2]);
    });
  });

  describe('series', () => {
    const normalize = (data: ReturnType<typeof makeSeriesPointRaw>[]) =>
      normalizeData(data, categoryDataShape.series, schools);

    it('maps a full point and keeps a zero value', () => {
      const point = makeSeriesPointRaw({
        entity_type: 'school',
        school_id: 's1',
        entity_key: 'k',
        entity_label: 'L',
        metric_key: 'count',
        dimension_key: '2024',
        dimension_order: 0,
        value: 0,
      });

      expect(normalize([point])).toStrictEqual([
        {
          metricKey: 'count',
          dimensionKey: '2024',
          entityType: 'school',
          school: school1,
          entityKey: 'k',
          entityLabel: 'L',
          dimensionOrder: 0,
          value: 0,
        },
      ]);
    });

    it('filters out points with a null value', () => {
      expect(normalize([makeSeriesPointRaw({ value: null })])).toEqual([]);
    });

    it('keeps only the metric and dimension keys when nothing else is set', () => {
      const point = makeSeriesPointRaw({
        entity_type: null,
        school_id: null,
        entity_key: null,
        entity_label: null,
        metric_key: 'c',
        dimension_key: 'd',
        dimension_order: null,
        value: undefined,
      } as never);

      expect(normalize([point])).toStrictEqual([{ metricKey: 'c', dimensionKey: 'd' }]);
    });

    it('omits a null entity type', () => {
      const result = normalize([makeSeriesPointRaw({ entity_type: null })]);

      expect(result[0]).not.toHaveProperty('entityType');
    });
  });

  describe('values', () => {
    const normalize = (data: ReturnType<typeof makeValueRaw>[]) =>
      normalizeData(data, categoryDataShape.values, schools);

    it('keeps falsy but defined values', () => {
      const raw = makeValueRaw('m', 0, { value_text: '', value_boolean: false });

      expect(normalize([raw])).toStrictEqual([
        { metricKey: 'm', valueNumeric: 0, valueText: '', valueBoolean: false },
      ]);
    });

    it('keeps only the metric key when every value is null', () => {
      expect(normalize([makeValueRaw('m', null)])).toStrictEqual([{ metricKey: 'm' }]);
    });
  });
});
