import { vi } from 'vitest';
import { singleton } from './singleton';

export const logMock = singleton('logMock', () =>
  vi.fn<(message: string, type?: 'info' | 'warn' | 'debug' | 'error') => void>(),
);

export function loggerModule() {
  return { log: logMock };
}
