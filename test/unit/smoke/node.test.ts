import { describe, expect, it } from 'vitest';

describe('node environment', () => {
  it('runs in Node with the Europe/Madrid time zone', () => {
    expect(typeof process.versions.node).toBe('string');
    expect(process.env.TZ).toBe('Europe/Madrid');
    expect(new Date('2026-01-17T00:00:00+01:00').getHours()).toBe(0);
  });
});
