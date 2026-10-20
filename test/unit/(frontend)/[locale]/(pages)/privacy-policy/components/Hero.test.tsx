import { createFormatter, createTranslator } from 'next-intl';
import { screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Hero } from '@/app/(frontend)/[locale]/(pages)/privacy-policy/components/Hero';
import {
  PRIVACY_POLICY_PUBLISHED,
  PRIVACY_POLICY_UPDATED,
} from '@/app/(frontend)/[locale]/(pages)/privacy-policy/data/constants';
import { LOCALES, messagesByLocale, type TestLocale } from '@/test/helpers/messages';
import { renderWithIntl } from '@/test/helpers/renderWithIntl';

const dates = vi.hoisted(() => ({ published: undefined as string | undefined, updated: undefined as string | undefined }));

vi.mock('@/app/(frontend)/[locale]/(pages)/privacy-policy/data/constants', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/app/(frontend)/[locale]/(pages)/privacy-policy/data/constants')>();
  return {
    get PRIVACY_POLICY_PUBLISHED() {
      return dates.published ?? actual.PRIVACY_POLICY_PUBLISHED;
    },
    get PRIVACY_POLICY_UPDATED() {
      return dates.updated ?? actual.PRIVACY_POLICY_UPDATED;
    },
  };
});

function formatDate(locale: TestLocale, iso: string): string {
  return createFormatter({ locale }).dateTime(new Date(iso), {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Europe/Madrid',
  });
}

function translator(locale: TestLocale) {
  return createTranslator({
    locale,
    messages: messagesByLocale[locale],
    namespace: 'PrivacyPolicy.hero',
  } as never) as (key: string, values?: Record<string, string>) => string;
}

describe('Hero', () => {
  afterEach(() => {
    dates.published = undefined;
    dates.updated = undefined;
  });

  describe.each(LOCALES)('locale %s', (locale) => {
    const m = messagesByLocale[locale];

    it('renders the title on two lines and the description', () => {
      renderWithIntl(<Hero />, { locale });

      const heading = screen.getByRole('heading', { level: 1 });
      const lines = heading.querySelectorAll('span');
      expect(lines).toHaveLength(2);
      expect(lines[0]).toHaveTextContent(m.PrivacyPolicy.hero.titleLine1);
      expect(lines[1]).toHaveTextContent(m.PrivacyPolicy.hero.titleLine2);
      expect(screen.getByText(m.PrivacyPolicy.hero.description)).toBeInTheDocument();
    });

    it('shows the updated date when the policy was modified after publishing', () => {
      const { container } = renderWithIntl(<Hero />, { locale });

      expect(PRIVACY_POLICY_UPDATED > PRIVACY_POLICY_PUBLISHED).toBe(true);
      const time = container.querySelector('time');
      expect(time).toHaveAttribute('datetime', PRIVACY_POLICY_UPDATED);
      expect(time).toHaveTextContent(
        translator(locale)('updated', { date: formatDate(locale, PRIVACY_POLICY_UPDATED) }),
      );
    });

    it('shows the published date when the policy was never modified', () => {
      dates.updated = PRIVACY_POLICY_PUBLISHED;

      const { container } = renderWithIntl(<Hero />, { locale });

      const time = container.querySelector('time');
      expect(time).toHaveAttribute('datetime', PRIVACY_POLICY_PUBLISHED);
      expect(time).toHaveTextContent(
        translator(locale)('published', { date: formatDate(locale, PRIVACY_POLICY_PUBLISHED) }),
      );
    });
  });
});
