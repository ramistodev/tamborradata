import type {
  ParticipantsResponse,
  Participation,
} from '@/app/types/api/participants.types';
import type { School } from '@/app/types/api/statistics.types';

export function makeSchool(overrides: Partial<School> = {}): School {
  return { canonicalName: 'Ikastola Test', schoolKey: 'ikastola-test', ...overrides };
}

export function makeParticipation(overrides: Partial<Participation> = {}): Participation {
  return { url: 'https://example.org/2024', year: 2024, ...overrides };
}

export function makeParticipantsResponse(
  overrides: Partial<ParticipantsResponse> = {},
): ParticipantsResponse {
  return {
    matchType: 'exact',
    name: 'Ane Garcia Lopez',
    nameKey: 'ane garcia lopez',
    school: makeSchool(),
    participations: [makeParticipation()],
    ...overrides,
  };
}
