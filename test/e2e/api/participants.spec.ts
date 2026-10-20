import { test, expect, type APIRequestContext, type APIResponse } from '@playwright/test';
import { API_HEADERS } from '../support/api';
import { uniqueIp } from '../support/ip';

type SchoolItem = { school: string; schoolKey: string };

type ParticipantRecord = {
  matchType: string;
  name: string;
  nameKey: string;
  school: { canonicalName: string; schoolKey: string };
  participations: { url: string | null; year: number }[];
};

/** A fresh address per request, so the in-memory rate limiter of the server never interferes. */
function postHeaders() {
  return {
    ...API_HEADERS,
    'content-type': 'application/json',
    'x-forwarded-for': uniqueIp(),
  };
}

function postParticipants(
  request: APIRequestContext,
  data: unknown,
): Promise<APIResponse> {
  return request.post('/api/participants', { headers: postHeaders(), data });
}

async function firstSchoolKey(request: APIRequestContext): Promise<string> {
  const response = await request.get('/api/schools', { headers: API_HEADERS });

  expect(response.status()).toBe(200);

  const schools = (await response.json()) as SchoolItem[];

  expect(schools.length).toBeGreaterThan(0);

  return schools[0].schoolKey;
}

async function expectInvalidRequest(response: APIResponse) {
  expect(response.status()).toBe(400);
  expect(await response.json()).toEqual({ error: 'Invalid request' });
}

test.describe('POST /api/participants validation', () => {
  test('rejects a malformed JSON body without echoing it', async ({ request }) => {
    const response = await request.post('/api/participants', {
      headers: postHeaders(),
      data: '{bad json',
    });

    expect(response.status()).toBe(400);

    const text = await response.text();

    expect(JSON.parse(text)).toEqual({ error: 'Invalid request' });
    expect(text).not.toContain('bad json');
  });

  test('rejects a JSON null body', async ({ request }) => {
    const response = await request.post('/api/participants', {
      headers: postHeaders(),
      data: 'null',
    });

    await expectInvalidRequest(response);
  });

  test('rejects an empty JSON object', async ({ request }) => {
    await expectInvalidRequest(await postParticipants(request, {}));
  });

  test('rejects a name with only two words', async ({ request }) => {
    const schoolKey = await firstSchoolKey(request);

    await expectInvalidRequest(
      await postParticipants(request, { participant: 'Ane Garcia', schoolKey }),
    );
  });

  test('rejects a request without schoolKey', async ({ request }) => {
    await expectInvalidRequest(
      await postParticipants(request, { participant: 'Ane Garcia Lopez' }),
    );
  });

  test('rejects a blank schoolKey', async ({ request }) => {
    await expectInvalidRequest(
      await postParticipants(request, { participant: 'Ane Garcia Lopez', schoolKey: '   ' }),
    );
  });

  test('rejects a participant longer than 120 characters', async ({ request }) => {
    const schoolKey = await firstSchoolKey(request);
    const participant = 'a'.repeat(121);

    expect(participant).toHaveLength(121);

    await expectInvalidRequest(await postParticipants(request, { participant, schoolKey }));
  });
});

test.describe('POST /api/participants search', () => {
  test('answers 200 with well-formed records for a valid request', async ({ request }) => {
    const schoolKey = await firstSchoolKey(request);
    const response = await postParticipants(request, {
      participant: 'Ane Garcia Lopez',
      schoolKey,
    });

    expect(response.status()).toBe(200);
    expect(response.headers()['retry-after']).toBeUndefined();

    const records = (await response.json()) as ParticipantRecord[];

    expect(Array.isArray(records)).toBe(true);

    for (const record of records) {
      expect(['exact', 'compatible']).toContain(record.matchType);
      expect(typeof record.name).toBe('string');
      expect(typeof record.nameKey).toBe('string');
      expect(typeof record.school.canonicalName).toBe('string');
      expect(typeof record.school.schoolKey).toBe('string');
      expect(record.participations.length).toBeGreaterThan(0);

      const years = record.participations.map((participation) => participation.year);

      expect(years.every((year) => typeof year === 'number')).toBe(true);
      expect(years).toEqual([...years].sort((a, b) => b - a));
    }
  });

  test('answers an empty list for an unknown school key', async ({ request }) => {
    const response = await postParticipants(request, {
      participant: 'Ane Garcia Lopez',
      schoolKey: 'no-such-school-key-xyz',
    });

    expect(response.status()).toBe(200);
    expect(await response.json()).toEqual([]);
    expect(response.headers()['retry-after']).toBeUndefined();
  });
});
