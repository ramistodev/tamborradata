import { describe, expect, it } from 'vitest';
import { toCandidate } from '@/app/(backend)/api/participants/lib/toCandidate';
import { makeParticipantRow } from '@/test/fixtures/dbRows';

describe('toCandidate', () => {
  it('maps the default row to a candidate', () => {
    expect(toCandidate(makeParticipantRow())).toStrictEqual({
      name: 'Ane Garcia Lopez',
      nameKey: 'ane garcia lopez',
      year: 2024,
      url: 'https://example.org/2024',
      school: { canonicalName: 'Ikastola Test', schoolKey: 'ikastola-test' },
      names: ['ane'],
      surnames: ['garcia', 'lopez'],
      isIncomplete: false,
    });
  });

  it('uses a null url when there is no scraped url', () => {
    expect(toCandidate(makeParticipantRow({ scraped_url: null })).url).toBeNull();
  });

  it('falls back to empty lists when the resolution has no keys', () => {
    const candidate = toCandidate(
      makeParticipantRow({ resolution: { name_keys: null, surname_keys: null } })
    );

    expect(candidate.names).toEqual([]);
    expect(candidate.surnames).toEqual([]);
    expect(candidate.isIncomplete).toBe(false);
  });

  it('flags a candidate with a single surname as incomplete', () => {
    const candidate = toCandidate(
      makeParticipantRow({ resolution: { name_keys: ['ane'], surname_keys: ['garcia'] } })
    );

    expect(candidate.isIncomplete).toBe(true);
  });

  it('does not flag a candidate with three surnames as incomplete', () => {
    const candidate = toCandidate(
      makeParticipantRow({
        resolution: { name_keys: ['ane'], surname_keys: ['garcia', 'lopez', 'perez'] },
      })
    );

    expect(candidate.isIncomplete).toBe(false);
  });
});
