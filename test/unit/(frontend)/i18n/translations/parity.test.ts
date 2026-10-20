import { createTranslator } from 'next-intl';
import { describe, expect, it } from 'vitest';
import {
  arrayLengths,
  flattenMessages,
  icuSignature,
  LOCALES,
  messagesByLocale,
} from '@/test/helpers/messages';

const REFERENCE = 'es';
const COMPARED = LOCALES.filter((locale) => locale !== REFERENCE);
const NAMESPACES = Object.keys(messagesByLocale[REFERENCE]);

function leavesOf(locale: (typeof LOCALES)[number], namespace?: string) {
  const messages = messagesByLocale[locale] as unknown as Record<string, unknown>;
  return namespace
    ? flattenMessages(messages[namespace], namespace)
    : flattenMessages(messages);
}

describe('translations parity', () => {
  describe('namespaces', () => {
    it('exposes the same namespaces in every locale', () => {
      const names = LOCALES.map((locale) => Object.keys(messagesByLocale[locale]).sort());

      expect(names[1]).toEqual(names[0]);
      expect(names[2]).toEqual(names[0]);
    });

    it('includes the known namespaces', () => {
      expect([...NAMESPACES].sort()).toEqual(
        expect.arrayContaining([
          'ErrorPage',
          'Footer',
          'Header',
          'Landing',
          'NotFound',
          'PrivacyPolicy',
          'Search',
          'Site',
          'Statistics',
        ])
      );
    });
  });

  describe.each(NAMESPACES)('namespace %s', (namespace) => {
    describe.each(COMPARED)('locale %s against es', (locale) => {
      it('has the same keys as es', () => {
        const reference = Object.keys(leavesOf(REFERENCE, namespace));
        const compared = Object.keys(leavesOf(locale, namespace));

        const missing = reference.filter((key) => !compared.includes(key));
        const extra = compared.filter((key) => !reference.includes(key));

        expect({ missing, extra }).toEqual({ missing: [], extra: [] });
      });

      it('uses the same ICU arguments and rich tags as es in every message', () => {
        const reference = leavesOf(REFERENCE, namespace);
        const compared = leavesOf(locale, namespace);

        const offenders = Object.keys(reference)
          .filter((key) => key in compared)
          .filter(
            (key) =>
              JSON.stringify(icuSignature(compared[key])) !==
              JSON.stringify(icuSignature(reference[key]))
          )
          .map((key) => ({
            key,
            es: icuSignature(reference[key]),
            [locale]: icuSignature(compared[key]),
          }));

        expect(offenders).toEqual([]);
      });
    });
  });

  describe('arrays', () => {
    it.each(COMPARED)('has the same array lengths in %s as in es', (locale) => {
      expect(arrayLengths(messagesByLocale[locale])).toEqual(
        arrayLengths(messagesByLocale[REFERENCE])
      );
    });
  });

  describe('leaves', () => {
    it.each(LOCALES)('has only non-empty trimmed strings in %s', (locale) => {
      const offenders = Object.entries(leavesOf(locale))
        .filter(([, value]) => typeof value !== 'string' || value.trim() === '' || value !== value.trim())
        .map(([path]) => path);

      expect(offenders).toEqual([]);
    });
  });

  describe('formatting', () => {
    it.each(LOCALES)('formats every message in %s without throwing', (locale) => {
      const t = createTranslator({
        locale,
        messages: messagesByLocale[locale],
        onError: (error: unknown) => {
          throw error;
        },
      } as never) as unknown as {
        (path: string, values?: Record<string, unknown>): string;
        rich: (path: string, values?: Record<string, unknown>) => unknown;
      };
      const failures: { locale: string; path: string; message: string }[] = [];

      for (const [path, message] of Object.entries(leavesOf(locale))) {
        const signature = icuSignature(message);
        const values: Record<string, unknown> = {};
        let hasTags = false;
        for (const name of signature) {
          if (name.startsWith('<')) {
            hasTags = true;
            values[name.slice(1, -1)] = (chunks: unknown) => chunks;
          } else {
            values[name] = 2;
          }
        }

        try {
          if (hasTags) t.rich(path, values);
          else t(path, values);
        } catch (error) {
          failures.push({
            locale,
            path,
            message: error instanceof Error ? error.message : String(error),
          });
        }
      }

      expect(failures).toEqual([]);
    });
  });
});
