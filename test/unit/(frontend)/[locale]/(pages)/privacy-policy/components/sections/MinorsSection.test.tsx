import { describe, expect, it } from 'vitest';
import { MinorsSection } from '@/app/(frontend)/[locale]/(pages)/privacy-policy/components/sections/MinorsSection';
import { LOCALES, messagesByLocale } from '@/test/helpers/messages';
import { renderWithIntl } from '@/test/helpers/renderWithIntl';

describe('MinorsSection', () => {
  describe.each(LOCALES)('locale %s', (locale) => {
    it('renders the expected number of paragraphs and list items', () => {
      const { container } = renderWithIntl(<MinorsSection />, { locale });

      expect(container.querySelectorAll('p')).toHaveLength(3);
      expect(container.querySelectorAll('li')).toHaveLength(0);
    });

    it('renders the first plain paragraph from the messages', () => {
      const { container } = renderWithIntl(<MinorsSection />, { locale });

      const texts = Array.from(container.querySelectorAll('p')).map((p) => p.textContent);
      expect(texts[1]).toBe(messagesByLocale[locale].PrivacyPolicy.sections.minors.p2);
    });

    it('leaks no raw rich tag or placeholder', () => {
      const { container } = renderWithIntl(<MinorsSection />, { locale });

      expect(container.textContent).not.toMatch(/<\/?[a-z]+>/);
      expect(container.textContent).not.toMatch(/\{\w+\}/);
    });

    it('renders only mailto links to the contact address', () => {
      const { container } = renderWithIntl(<MinorsSection />, { locale });

      for (const link of container.querySelectorAll('a')) {
        expect(link).toHaveAttribute('href', 'mailto:contact@tamborradata.com');
      }
    });
  });
});
