import { act, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { SectionAside } from '@/app/(frontend)/[locale]/(pages)/privacy-policy/components/SectionAside';
import { installDialogStubs } from '@/test/helpers/dialog';
import { messagesByLocale } from '@/test/helpers/messages';
import { MockIntersectionObserver } from '@/test/helpers/observers';
import { renderWithIntl } from '@/test/helpers/renderWithIntl';

const m = messagesByLocale.es;
const sections = [
  { id: 'a', title: 'Alpha' },
  { id: 'b', title: 'Beta' },
  { id: 'c', title: 'Gamma' },
];

function renderAside() {
  return renderWithIntl(<SectionAside sections={sections} />);
}

function getDialog() {
  return screen.getByRole('dialog', { hidden: true });
}

describe('SectionAside', () => {
  beforeEach(() => {
    installDialogStubs();
    for (const { id } of sections) {
      const element = document.createElement('section');
      element.id = id;
      document.body.append(element);
    }
  });

  afterEach(() => {
    document.querySelectorAll('section').forEach((element) => element.remove());
    document.body.style.overflow = '';
  });

  describe('sticky aside', () => {
    it('renders the title and a navigation with numbered links', () => {
      renderAside();

      const aside = screen.getByRole('complementary');
      expect(within(aside).getByText(m.PrivacyPolicy.aside.title)).toBeInTheDocument();
      const nav = within(aside).getByRole('navigation', { name: m.PrivacyPolicy.aside.title });
      const links = within(nav).getAllByRole('link');
      expect(links.map((link) => link.getAttribute('href'))).toEqual(['#a', '#b', '#c']);
      expect(links[0]).toHaveTextContent(/^01\s*Alpha$/);
      expect(links[1]).toHaveTextContent(/^02\s*Beta$/);
      expect(links[2]).toHaveTextContent(/^03\s*Gamma$/);
    });

    it('marks the first link as the current location', () => {
      renderAside();

      const nav = within(screen.getByRole('complementary')).getByRole('navigation');
      const links = within(nav).getAllByRole('link');
      expect(links[0]).toHaveAttribute('aria-current', 'location');
      expect(links[1]).not.toHaveAttribute('aria-current');
      expect(links[2]).not.toHaveAttribute('aria-current');
    });

    it('moves the current location when another section intersects', () => {
      renderAside();
      const io = MockIntersectionObserver.instances[0];

      act(() => io.triggerMany([{ target: document.getElementById('b') as HTMLElement, isIntersecting: true }]));

      const nav = within(screen.getByRole('complementary')).getByRole('navigation');
      const current = within(nav)
        .getAllByRole('link')
        .filter((link) => link.getAttribute('aria-current') === 'location');
      expect(current).toHaveLength(1);
      expect(current[0]).toHaveTextContent('Beta');
    });
  });

  describe('dialog for small screens', () => {
    it('renders a closed open button wired to the dialog', () => {
      renderAside();

      const button = screen.getByRole('button', { name: m.PrivacyPolicy.aside.open });
      expect(button).toHaveAttribute('aria-haspopup', 'dialog');
      expect(button).toHaveAttribute('aria-controls', 'privacy-aside');
      expect(button).toHaveAttribute('aria-expanded', 'false');
      expect(getDialog()).not.toHaveAttribute('open');
      expect(getDialog()).toHaveAttribute('id', 'privacy-aside');
    });

    it('opens the dialog with the same links and locks the page scroll', async () => {
      const { user } = renderAside();

      await user.click(screen.getByRole('button', { name: m.PrivacyPolicy.aside.open }));

      const dialog = getDialog();
      expect(dialog).toHaveAttribute('open');
      expect(screen.getByRole('button', { name: m.PrivacyPolicy.aside.open })).toHaveAttribute(
        'aria-expanded',
        'true',
      );
      const links = within(dialog).getAllByRole('link');
      expect(links.map((link) => link.getAttribute('href'))).toEqual(['#a', '#b', '#c']);
      expect(document.body.style.overflow).toBe('hidden');
    });

    it('closes the dialog when a link inside it is clicked', async () => {
      const { user } = renderAside();
      await user.click(screen.getByRole('button', { name: m.PrivacyPolicy.aside.open }));

      await user.click(within(getDialog()).getAllByRole('link')[1]);

      expect(getDialog()).not.toHaveAttribute('open');
      expect(screen.getByRole('button', { name: m.PrivacyPolicy.aside.open })).toHaveAttribute(
        'aria-expanded',
        'false',
      );
      expect(document.body.style.overflow).toBe('');
    });

    it('closes the dialog with the close button', async () => {
      const { user } = renderAside();
      await user.click(screen.getByRole('button', { name: m.PrivacyPolicy.aside.open }));

      await user.click(within(getDialog()).getByRole('button', { name: m.PrivacyPolicy.aside.close }));

      expect(getDialog()).not.toHaveAttribute('open');
      expect(screen.getByRole('button', { name: m.PrivacyPolicy.aside.open })).toHaveAttribute(
        'aria-expanded',
        'false',
      );
      expect(document.body.style.overflow).toBe('');
    });
  });
});
