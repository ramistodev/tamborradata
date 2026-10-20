import { describe, expect, it } from 'vitest';
import { RetentionSection } from '@/app/(frontend)/[locale]/(pages)/privacy-policy/components/sections/RetentionSection';
import { LOCALES, messagesByLocale } from '@/test/helpers/messages';
import { renderWithIntl } from '@/test/helpers/renderWithIntl';

describe('RetentionSection', () => {
  describe.each(LOCALES)('locale %s', (locale) => {
    it('renders the expected number of paragraphs and list items', () => {
      const { container } = renderWithIntl(<RetentionSection />, { locale });

      expect(container.querySelectorAll('p')).toHaveLength(3);
      expect(container.querySelectorAll('li')).toHaveLength(0);
    });

    it('renders the first plain paragraph from the messages', () => {
      const { container } = renderWithIntl(<RetentionSection />, { locale });

      const texts = Array.from(container.querySelectorAll('p')).map((p) => p.textContent);
      expect(texts[0]).toBe(messagesByLocale[locale].PrivacyPolicy.sections.retention.p1);
    });

    it('leaks no raw rich tag or placeholder', () => {
      const { container } = renderWithIntl(<RetentionSection />, { locale });

      expect(container.textContent).not.toMatch(/<\/?[a-z]+>/);
      expect(container.textContent).not.toMatch(/\{\w+\}/);
    });

    it('renders no links', () => {
      const { container } = renderWithIntl(<RetentionSection />, { locale });

      expect(container.querySelectorAll('a')).toHaveLength(0);
    });
  });
});
