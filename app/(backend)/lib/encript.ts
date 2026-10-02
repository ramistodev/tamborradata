import 'server-only';
import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'node:crypto';
import { signatureSecret } from '../core/config/env';
import { ValidationError } from './errors';

export type RankCursorPayload =
  | {
      version: 1;
      variant: 'global-rank';
      statisticId: string;
      lastId: string;
      rank: number;
    }
  | {
      version: 1;
      variant: 'school-grouped-rank';
      statisticId: string;
      groupSchoolId: string;
    };

export type SeriesCursorPayload = {
  version: 1;
  statisticId: string;
  lastEntityKey: string;
};

const key = createHash('sha256').update(signatureSecret).digest();

export function encodeRankCursor(payload: RankCursorPayload): string {
  return encodeCursor(payload);
}

export function encodeSeriesCursor(payload: SeriesCursorPayload): string {
  return encodeCursor(payload);
}

function encodeCursor(payload: RankCursorPayload | SeriesCursorPayload): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', key, iv);
  const encrypted = Buffer.concat([cipher.update(JSON.stringify(payload), 'utf8'), cipher.final()]);

  return Buffer.concat([iv, cipher.getAuthTag(), encrypted]).toString('base64url');
}

export function decodeRankCursor(token: string): RankCursorPayload {
  const payload = decodeCursor(token);

  const isGlobalRank =
    payload.variant === 'global-rank' &&
    typeof payload.lastId === 'string' &&
    typeof payload.rank === 'number';
  const isSchoolGroupedRank =
    payload.variant === 'school-grouped-rank' && typeof payload.groupSchoolId === 'string';

  if (
    payload.version !== 1 ||
    typeof payload.statisticId !== 'string' ||
    (!isGlobalRank && !isSchoolGroupedRank)
  ) {
    throwInvalidCursor();
  }

  return payload as RankCursorPayload;
}

export function decodeSeriesCursor(token: string): SeriesCursorPayload {
  const payload = decodeCursor(token);

  if (
    payload?.version !== 1 ||
    typeof payload.statisticId !== 'string' ||
    typeof payload.lastEntityKey !== 'string'
  ) {
    throwInvalidCursor();
  }

  return payload as SeriesCursorPayload;
}

function decodeCursor(token: string): Record<string, unknown> {
  try {
    if (!/^[A-Za-z0-9_-]+$/.test(token)) throw new Error();

    const encrypted = Buffer.from(token, 'base64url');
    if (encrypted.length <= 28) throw new Error();

    const decipher = createDecipheriv('aes-256-gcm', key, encrypted.subarray(0, 12));
    decipher.setAuthTag(encrypted.subarray(12, 28));
    const payload = JSON.parse(
      Buffer.concat([decipher.update(encrypted.subarray(28)), decipher.final()]).toString('utf8')
    );

    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) throw new Error();

    return payload as Record<string, unknown>;
  } catch {
    throwInvalidCursor();
  }
}

function throwInvalidCursor(): never {
  throw new ValidationError("The 'cursor' parameter is not valid");
}
