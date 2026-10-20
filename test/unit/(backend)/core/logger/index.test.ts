import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { log } from '@/app/(backend)/core/logger';
import { importFresh } from '@/test/helpers/freshImport';

const line = expect.stringMatching(/^\S+ \[2026-03-10T12:00:00\.000Z\] hello$/);

function spyOnConsole() {
  return {
    log: vi.spyOn(console, 'log').mockImplementation(() => {}),
    warn: vi.spyOn(console, 'warn').mockImplementation(() => {}),
    error: vi.spyOn(console, 'error').mockImplementation(() => {}),
    debug: vi.spyOn(console, 'debug').mockImplementation(() => {}),
  };
}

type Spies = ReturnType<typeof spyOnConsole>;

describe('log', () => {
  let spies: Spies;

  beforeEach(() => {
    vi.useFakeTimers({ now: new Date('2026-03-10T12:00:00.000Z') });
    spies = spyOnConsole();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('in production', () => {
    it('prints errors only', () => {
      log('hello', 'error');

      expect(spies.error).toHaveBeenCalledTimes(1);
      expect(spies.error).toHaveBeenCalledWith(line);
      expect(spies.log).not.toHaveBeenCalled();
      expect(spies.warn).not.toHaveBeenCalled();
      expect(spies.debug).not.toHaveBeenCalled();
    });

    it.each([undefined, 'info', 'warn', 'debug'] as const)('drops the %s level', (type) => {
      log('hello', type);

      expect(spies.log).not.toHaveBeenCalled();
      expect(spies.warn).not.toHaveBeenCalled();
      expect(spies.error).not.toHaveBeenCalled();
      expect(spies.debug).not.toHaveBeenCalled();
    });
  });

  describe('in development', () => {
    async function loadDev() {
      vi.stubEnv('NODE_ENV', 'development');
      const { log: devLog } = await importFresh(() => import('@/app/(backend)/core/logger'));

      return devLog;
    }

    it.each([
      ['the default level', undefined, 'log'],
      ['info', 'info', 'log'],
      ['warn', 'warn', 'warn'],
      ['debug', 'debug', 'debug'],
      ['error', 'error', 'error'],
    ] as const)('routes %s to console.%s only', async (_label, type, method) => {
      const devLog = await loadDev();

      devLog('hello', type);

      for (const [name, spy] of Object.entries(spies)) {
        if (name === method) {
          expect(spy).toHaveBeenCalledTimes(1);
          expect(spy).toHaveBeenCalledWith(line);
        } else {
          expect(spy).not.toHaveBeenCalled();
        }
      }
    });
  });
});
