import { describe, expect, it } from 'vitest';
import { ChangesSection } from '@/app/(frontend)/[locale]/(pages)/privacy-policy/components/sections/ChangesSection';
import { LOCALES, messagesByLocale } from '@/test/helpers/messages';
import { renderWithIntl } from '@/test/helpers/renderWithIntl';

describe('ChangesSection', () => {
  describe.each(LOCALES)('locale %s', (locale) => {
    it('renders the expected number of paragraphs and list items', () => {
      const { container } = renderWithIntl(<ChangesSection />, { locale });

      expect(container.querySelectorAll('p')).toHaveLength(2);
      expect(container.querySelectorAll('li')).toHaveLength(0);
    });

    it('renders the first plain paragraph from the messages', () => {
      const { container } = renderWithIntl(<ChangesSection />, { locale });

      const texts = Array.from(container.querySelectorAll('p')).map((p) => p.textContent);
      expect(texts[0]).toBe(messagesByLocale[locale].PrivacyPolicy.sections.changes.p1);
    });

    it('leaks no raw rich tag or placeholder', () => {
      const { container } = renderWithIntl(<ChangesSection />, { locale });

      expect(container.textContent).not.toMatch(/<\/?[a-z]+>/);
      expect(container.textContent).not.toMatch(/\{\w+\}/);
    });

    it('renders no links', () => {
      const { container } = renderWithIntl(<ChangesSection />, { locale });

      expect(container.querySelectorAll('a')).toHaveLength(0);
    });
  });
});
