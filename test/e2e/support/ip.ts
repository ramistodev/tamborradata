import { randomInt } from 'node:crypto';

/** A random address for `x-forwarded-for`; every real POST /api/participants must use a different one. */
export function uniqueIp(): string {
  return `10.${randomInt(0, 256)}.${randomInt(0, 256)}.${randomInt(1, 255)}`;
}
