import { describe, expect, it } from 'vitest';
import { ThirdPartiesSection } from '@/app/(frontend)/[locale]/(pages)/privacy-policy/components/sections/ThirdPartiesSection';
import { LOCALES, messagesByLocale } from '@/test/helpers/messages';
import { renderWithIntl } from '@/test/helpers/renderWithIntl';

describe('ThirdPartiesSection', () => {
  describe.each(LOCALES)('locale %s', (locale) => {
    it('renders the expected number of paragraphs and list items', () => {
      const { container } = renderWithIntl(<ThirdPartiesSection />, { locale });

      expect(container.querySelectorAll('p')).toHaveLength(2);
      expect(container.querySelectorAll('li')).toHaveLength(5);
    });

    it('renders the first plain paragraph from the messages', () => {
      const { container } = renderWithIntl(<ThirdPartiesSection />, { locale });

      const texts = Array.from(container.querySelectorAll('p')).map((p) => p.textContent);
      expect(texts[0]).toBe(messagesByLocale[locale].PrivacyPolicy.sections.thirdParties.intro);
    });

    it('leaks no raw rich tag or placeholder', () => {
      const { container } = renderWithIntl(<ThirdPartiesSection />, { locale });

      expect(container.textContent).not.toMatch(/<\/?[a-z]+>/);
      expect(container.textContent).not.toMatch(/\{\w+\}/);
    });

    it('renders only mailto links to the contact address', () => {
      const { container } = renderWithIntl(<ThirdPartiesSection />, { locale });

      for (const link of container.querySelectorAll('a')) {
        expect(link).toHaveAttribute('href', 'mailto:contact@tamborradata.com');
      }
    });
  });
});
