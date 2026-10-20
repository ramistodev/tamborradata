import { describe, expect, it } from 'vitest';
import * as navigation from '@/app/(frontend)/i18n/navigation';

describe('navigation', () => {
  it.each(['Link', 'redirect', 'permanentRedirect', 'usePathname', 'useRouter', 'getPathname'])(
    'exports %s',
    (name) => {
      expect(navigation[name as keyof typeof navigation]).toBeDefined();
    }
  );

  describe('getPathname', () => {
    it.each([
      { locale: 'es', href: '/statistics/2024', expected: '/statistics/2024' },
      { locale: 'en', href: '/statistics/2024', expected: '/en/statistics/2024' },
      { locale: 'eu', href: '/privacy-policy', expected: '/eu/privacy-policy' },
    ] as const)('maps $href in $locale to $expected', ({ locale, href, expected }) => {
      expect(navigation.getPathname({ locale, href })).toBe(expected);
    });
  });
});
