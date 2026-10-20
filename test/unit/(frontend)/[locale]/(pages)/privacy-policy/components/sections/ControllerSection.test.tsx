import { describe, expect, it } from 'vitest';
import { ControllerSection } from '@/app/(frontend)/[locale]/(pages)/privacy-policy/components/sections/ControllerSection';
import { LOCALES, messagesByLocale } from '@/test/helpers/messages';
import { renderWithIntl } from '@/test/helpers/renderWithIntl';

describe('ControllerSection', () => {
  describe.each(LOCALES)('locale %s', (locale) => {
    it('renders the expected number of paragraphs and list items', () => {
      const { container } = renderWithIntl(<ControllerSection />, { locale });

      expect(container.querySelectorAll('p')).toHaveLength(2);
      expect(container.querySelectorAll('li')).toHaveLength(0);
    });

    it('renders the first plain paragraph from the messages', () => {
      const { container } = renderWithIntl(<ControllerSection />, { locale });

      const texts = Array.from(container.querySelectorAll('p')).map((p) => p.textContent);
      expect(texts).toContain(messagesByLocale[locale].PrivacyPolicy.sections.controller.p1);
    });

    it('leaks no raw rich tag or placeholder', () => {
      const { container } = renderWithIntl(<ControllerSection />, { locale });

      expect(container.textContent).not.toMatch(/<\/?[a-z]+>/);
      expect(container.textContent).not.toMatch(/\{\w+\}/);
    });

    it('renders only mailto links to the contact address', () => {
      const { container } = renderWithIntl(<ControllerSection />, { locale });

      const links = Array.from(container.querySelectorAll('a'));
      expect(links).toHaveLength(1);
      expect(links[0]).toHaveAttribute('href', 'mailto:contact@tamborradata.com');
      expect(links[0]).toHaveTextContent('contact@tamborradata.com');
    });
  });
});
