import { describe, expect, it, vi } from 'vitest';
import { participantsService } from '@/app/(backend)/api/participants/services/participants.service';
import { fetchParticipants } from '@/app/(backend)/api/participants/repo/participants.repo';
import { makeParticipantRow } from '@/test/fixtures/dbRows';

vi.mock('@/app/(backend)/api/participants/repo/participants.repo', () => ({
  fetchParticipants: vi.fn(),
}));

const tokens = ['ane', 'garcia', 'lopez'];

describe('participantsService', () => {
  it('calls the repo with name units instead of raw tokens', async () => {
    vi.mocked(fetchParticipants).mockResolvedValue([]);

    await participantsService(['ramos', 'de', 'la', 'fuente'], 'sk');

    expect(fetchParticipants).toHaveBeenCalledWith(['ramos', 'de la fuente'], 'sk');
  });

  it('groups exact matches into one record with its participations', async () => {
    vi.mocked(fetchParticipants).mockResolvedValue([
      makeParticipantRow(),
      makeParticipantRow({ year: 2023, scraped_url: null }),
    ]);

    const result = await participantsService(tokens, 'ikastola-test');

    expect(result).toEqual([
      {
        matchType: 'exact',
        name: 'Ane Garcia Lopez',
        nameKey: 'ane garcia lopez',
        school: { canonicalName: 'Ikastola Test', schoolKey: 'ikastola-test' },
        participations: [
          { url: 'https://example.org/2024', year: 2024 },
          { url: null, year: 2023 },
        ],
      },
    ]);
  });

  it('flags a partial query as a compatible match', async () => {
    vi.mocked(fetchParticipants).mockResolvedValue([makeParticipantRow()]);

    const result = await participantsService(['ane', 'garcia'], 'ikastola-test');

    expect(result).toHaveLength(1);
    expect(result[0].matchType).toBe('compatible');
  });

  it('filters out incompatible rows', async () => {
    vi.mocked(fetchParticipants).mockResolvedValue([
      makeParticipantRow(),
      makeParticipantRow({
        name: 'Maite Perez Ruiz',
        name_key: 'maite perez ruiz',
        resolution: { name_keys: ['maite'], surname_keys: ['perez', 'ruiz'] },
      }),
    ]);

    const result = await participantsService(tokens, 'ikastola-test');

    expect(result.map((record) => record.nameKey)).toEqual(['ane garcia lopez']);
  });

  it('drops an incomplete record covered by a complete one of the same year', async () => {
    vi.mocked(fetchParticipants).mockResolvedValue([
      makeParticipantRow({
        name_key: 'ane miren garcia lopez',
        name: 'Ane Miren Garcia Lopez',
        resolution: { name_keys: ['ane', 'miren'], surname_keys: ['garcia', 'lopez'] },
      }),
      makeParticipantRow({
        name_key: 'ane garcia',
        name: 'Ane Garcia',
        resolution: { name_keys: ['ane'], surname_keys: ['garcia'] },
      }),
    ]);

    const result = await participantsService(tokens, 'ikastola-test');

    expect(result).toHaveLength(1);
    expect(result[0].nameKey).toBe('ane miren garcia lopez');
  });

  it('returns an empty list when the repo has no rows', async () => {
    vi.mocked(fetchParticipants).mockResolvedValue([]);

    await expect(participantsService(tokens, 'sk')).resolves.toEqual([]);
  });

  it('returns an empty list when every row is incompatible', async () => {
    vi.mocked(fetchParticipants).mockResolvedValue([
      makeParticipantRow({
        name: 'Maite Perez Ruiz',
        name_key: 'maite perez ruiz',
        resolution: { name_keys: ['maite'], surname_keys: ['perez', 'ruiz'] },
      }),
    ]);

    await expect(participantsService(tokens, 'sk')).resolves.toEqual([]);
  });

  it('sorts an exact record before a compatible one even when the latter is newer', async () => {
    vi.mocked(fetchParticipants).mockResolvedValue([
      makeParticipantRow({
        name_key: 'ane miren garcia lopez',
        name: 'Ane Miren Garcia Lopez',
        year: 2024,
        resolution: { name_keys: ['ane', 'miren'], surname_keys: ['garcia', 'lopez'] },
      }),
      makeParticipantRow({ year: 2020 }),
    ]);

    const result = await participantsService(tokens, 'sk');

    expect(result.map((record) => [record.nameKey, record.matchType])).toEqual([
      ['ane garcia lopez', 'exact'],
      ['ane miren garcia lopez', 'compatible'],
    ]);
  });

  it('propagates a repo rejection unchanged', async () => {
    const error = new Error('db down');
    vi.mocked(fetchParticipants).mockRejectedValue(error);

    await expect(participantsService(tokens, 'sk')).rejects.toBe(error);
  });
});
