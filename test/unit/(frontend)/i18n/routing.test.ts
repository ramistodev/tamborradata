import { describe, expect, it } from 'vitest';
import { routing } from '@/app/(frontend)/i18n/routing';

describe('routing', () => {
  it('lists the locales in the routing order en, es, eu', () => {
    expect(routing.locales).toEqual(['en', 'es', 'eu']);
  });

  it('uses es as the default locale', () => {
    expect(routing.defaultLocale).toBe('es');
  });

  it('prefixes only the non-default locales', () => {
    expect(routing.localePrefix).toBe('as-needed');
  });

  it('disables locale detection', () => {
    expect(routing.localeDetection).toBe(false);
  });

  it('disables the alternate link headers', () => {
    expect(routing.alternateLinks).toBe(false);
  });
});
