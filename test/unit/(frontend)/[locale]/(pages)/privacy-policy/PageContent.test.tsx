import { screen, within } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { PageContent } from '@/app/(frontend)/[locale]/(pages)/privacy-policy/PageContent';
import { installDialogStubs } from '@/test/helpers/dialog';
import { LOCALES, messagesByLocale } from '@/test/helpers/messages';
import { renderWithIntl } from '@/test/helpers/renderWithIntl';

const ids = [
  'controller',
  'data',
  'sources',
  'processing',
  'statistics',
  'search',
  'minors',
  'cookies',
  'thirdParties',
  'rights',
  'retention',
  'changes',
] as const;

describe('PageContent', () => {
  beforeEach(() => {
    installDialogStubs();
  });

  describe.each(LOCALES)('locale %s', (locale) => {
    const sections = messagesByLocale[locale].PrivacyPolicy.sections;

    it('renders the hero heading', () => {
      renderWithIntl(<PageContent />, { locale });

      expect(
        screen.getByRole('heading', { level: 1, name: new RegExp(messagesByLocale[locale].PrivacyPolicy.hero.titleLine1) }),
      ).toBeInTheDocument();
    });

    it('renders the 12 sections as named regions in order', () => {
      renderWithIntl(<PageContent />, { locale });

      const regions = screen.getAllByRole('region');
      expect(regions.map((region) => region.getAttribute('id'))).toEqual([...ids]);
      ids.forEach((id, index) => {
        expect(regions[index]).toHaveAccessibleName(sections[id].title);
        expect(regions[index]).toHaveAttribute('aria-labelledby', `${id}-title`);
      });
    });

    it('renders the aside navigation with 12 numbered links', () => {
      renderWithIntl(<PageContent />, { locale });

      const nav = within(screen.getByRole('complementary')).getByRole('navigation');
      const links = within(nav).getAllByRole('link');
      expect(links.map((link) => link.getAttribute('href'))).toEqual(ids.map((id) => `#${id}`));
      links.forEach((link, index) => {
        expect(link.textContent).toMatch(new RegExp(`^${String(index + 1).padStart(2, '0')}`));
        expect(link).toHaveTextContent(sections[ids[index]].title);
      });
    });

    it('renders a separator and marks the root for smooth scroll', () => {
      const { container } = renderWithIntl(<PageContent />, { locale });

      expect(container.querySelector('hr')).not.toBeNull();
      expect(container.firstElementChild).toHaveAttribute('data-smooth-scroll');
    });
  });
});
