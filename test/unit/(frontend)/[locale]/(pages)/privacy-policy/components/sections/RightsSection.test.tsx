import { describe, expect, it } from 'vitest';
import { RightsSection } from '@/app/(frontend)/[locale]/(pages)/privacy-policy/components/sections/RightsSection';
import { LOCALES, messagesByLocale } from '@/test/helpers/messages';
import { renderWithIntl } from '@/test/helpers/renderWithIntl';

describe('RightsSection', () => {
  describe.each(LOCALES)('locale %s', (locale) => {
    it('renders the expected number of paragraphs and list items', () => {
      const { container } = renderWithIntl(<RightsSection />, { locale });

      expect(container.querySelectorAll('p')).toHaveLength(4);
      expect(container.querySelectorAll('li')).toHaveLength(4);
    });

    it('renders the first plain paragraph from the messages', () => {
      const { container } = renderWithIntl(<RightsSection />, { locale });

      const texts = Array.from(container.querySelectorAll('p')).map((p) => p.textContent);
      expect(texts[0]).toBe(messagesByLocale[locale].PrivacyPolicy.sections.rights.intro);
    });

    it('leaks no raw rich tag or placeholder', () => {
      const { container } = renderWithIntl(<RightsSection />, { locale });

      expect(container.textContent).not.toMatch(/<\/?[a-z]+>/);
      expect(container.textContent).not.toMatch(/\{\w+\}/);
    });

    it('renders only mailto links to the contact address, including the removal request', () => {
      const { container } = renderWithIntl(<RightsSection />, { locale });

      const links = Array.from(container.querySelectorAll('a'));
      expect(links).toHaveLength(1);
      expect(links[0]).toHaveAttribute('href', 'mailto:contact@tamborradata.com');
    });
  });
});
