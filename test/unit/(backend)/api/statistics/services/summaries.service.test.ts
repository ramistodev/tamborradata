import { beforeEach, describe, expect, it, vi } from 'vitest';
import { summariesService } from '@/app/(backend)/api/statistics/services/summaries.service';
import { getPublishedPeriod } from '@/app/(backend)/api/statistics/repo/period.repo';
import { getPublishedEditorialSections } from '@/app/(backend)/api/statistics/repo/editorialSections.repo';
import { resolveSchoolIds } from '@/app/(backend)/api/statistics/repo/schools.repo';
import { PeriodMovedError } from '@/app/(backend)/lib/errors';
import { logMock } from '@/test/helpers/loggerMock';
import { makePublishedSection } from '@/test/fixtures/dbRows';
import { makeStatisticsMeta } from '@/test/fixtures/statistics';

vi.mock('@/app/(backend)/core/logger', async () => (await import('@/test/helpers/loggerMock')).loggerModule());
vi.mock('@/app/(backend)/api/statistics/repo/period.repo', () => ({ getPublishedPeriod: vi.fn() }));
vi.mock('@/app/(backend)/api/statistics/repo/editorialSections.repo', () => ({
  getPublishedEditorialSections: vi.fn(),
}));
vi.mock('@/app/(backend)/api/statistics/repo/schools.repo', () => ({ resolveSchoolIds: vi.fn() }));

const params = { publicSlug: '2024', locale: 'en' } as const;

beforeEach(() => {
  vi.mocked(getPublishedPeriod).mockResolvedValue({
    runId: 'run-1',
    kind: 'year',
    metaData: makeStatisticsMeta(),
  });
  vi.mocked(resolveSchoolIds).mockResolvedValue([
    { schoolId: 'sch-1', canonicalName: 'Escuela', schoolKey: 'escuela' },
  ]);
  vi.mocked(getPublishedEditorialSections).mockResolvedValue([]);
});

describe('summariesService', () => {
  it('returns the period metadata, the locale and the resolved summaries', async () => {
    vi.mocked(getPublishedEditorialSections).mockResolvedValue([
      makePublishedSection({ section: 'periodIntro', template: 'Hola {{school:sch-1}}', locale: 'en' }),
    ]);

    const result = await summariesService(params);

    expect(result).toEqual({
      metaData: makeStatisticsMeta(),
      locale: 'en',
      summaries: [{ section: 'periodIntro', summary: 'Hola Escuela' }],
    });
    expect(getPublishedEditorialSections).toHaveBeenCalledWith('run-1', 'en');
    expect(getPublishedPeriod).toHaveBeenCalledWith('2024');
  });

  it('skips a summary with an unresolvable school token and logs it', async () => {
    vi.mocked(getPublishedEditorialSections).mockResolvedValue([
      makePublishedSection({ section: 'periodIntro', template: 'Hola {{school:zz}}', locale: 'en' }),
    ]);

    const result = await summariesService(params);

    expect(result.summaries).toEqual([]);
    expect(logMock).toHaveBeenCalledTimes(1);
    expect(logMock).toHaveBeenCalledWith(
      expect.stringContaining("Summary 'periodIntro' (en) skipped: Failed to resolve school ID: zz"),
      'error',
    );
  });

  it('returns an empty summaries list when there are no sections', async () => {
    const result = await summariesService(params);

    expect(result.summaries).toEqual([]);
    expect(logMock).not.toHaveBeenCalled();
  });

  it('propagates a sections repo rejection because summaries are required here', async () => {
    const error = new Error('sections down');
    vi.mocked(getPublishedEditorialSections).mockRejectedValue(error);

    await expect(summariesService(params)).rejects.toBe(error);
  });

  it('propagates a PeriodMovedError from the period repo', async () => {
    const error = new PeriodMovedError('2024');
    vi.mocked(getPublishedPeriod).mockRejectedValue(error);

    await expect(summariesService(params)).rejects.toBe(error);
  });
});
