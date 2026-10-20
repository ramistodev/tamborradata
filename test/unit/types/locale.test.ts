import { describe, expect, it } from 'vitest';
import { locale } from '@/app/types/locale';

describe('locale', () => {
  it('declares the supported locales', () => {
    expect(locale).toEqual({ en: 'en', es: 'es', eu: 'eu' });
  });
});
