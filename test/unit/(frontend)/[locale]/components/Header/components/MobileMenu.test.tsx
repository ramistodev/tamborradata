import { screen, within } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { MobileMenu } from '@/app/(frontend)/[locale]/components/Header/components/MobileMenu';
import { makePeriodList } from '@/test/fixtures/period';
import { installDialogStubs } from '@/test/helpers/dialog';
import { messagesByLocale } from '@/test/helpers/messages';
import { navigationState } from '@/test/helpers/nextNavigation';
import { renderWithIntl } from '@/test/helpers/renderWithIntl';

const m = messagesByLocale.es;

function getOpenButton() {
  return screen.getByRole('button', { name: m.Header.openMenu });
}

// A closed <dialog> is not rendered, so its accessible name is empty: query it by role only
function getDialog() {
  return screen.getByRole('dialog', { hidden: true });
}

function getNav() {
  return within(getDialog()).getByRole('navigation', { name: m.Header.menuLabel });
}

function getAccordionButton() {
  return within(getNav()).getByRole('button', { name: m.Header.statistics });
}

describe('MobileMenu', () => {
  beforeEach(() => {
    installDialogStubs();
  });

  it('renders a closed menu with the open button', () => {
    renderWithIntl(<MobileMenu periods={makePeriodList()} />);

    const button = getOpenButton();

    expect(button).toHaveAttribute('aria-haspopup', 'dialog');
    expect(button).toHaveAttribute('aria-controls', 'mobile-nav');
    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(getDialog()).not.toHaveAttribute('open');
    expect(getDialog()).toHaveAttribute('aria-label', m.Header.menuLabel);
    expect(getDialog()).toHaveAttribute('id', 'mobile-nav');
  });

  it('opens the dialog when the open button is clicked', async () => {
    const { user } = renderWithIntl(<MobileMenu periods={makePeriodList()} />);

    await user.click(getOpenButton());

    expect(getOpenButton()).toHaveAttribute('aria-expanded', 'true');
    expect(getDialog()).toHaveAttribute('open');
  });

  it('renders the navigation with the home and search links', async () => {
    navigationState.pathname = '/';

    const { user } = renderWithIntl(<MobileMenu periods={makePeriodList()} />);
    await user.click(getOpenButton());

    const nav = getNav();

    expect(within(nav).getByRole('link', { name: 'Tamborradata' })).toHaveAttribute('aria-current', 'page');
    expect(within(nav).getByRole('link', { name: m.Header.search })).toHaveAttribute('href', '/search-participants');
    expect(within(nav).getByRole('link', { name: m.Header.search })).not.toHaveAttribute('aria-current');
  });

  it('marks the search link as current on the search page', async () => {
    navigationState.pathname = '/search-participants';

    const { user } = renderWithIntl(<MobileMenu periods={makePeriodList()} />);
    await user.click(getOpenButton());

    expect(within(getNav()).getByRole('link', { name: m.Header.search })).toHaveAttribute('aria-current', 'page');
    expect(within(getNav()).getByRole('link', { name: 'Tamborradata' })).not.toHaveAttribute('aria-current');
  });

  it('keeps the statistics accordion closed outside the statistics pages', async () => {
    const { user } = renderWithIntl(<MobileMenu periods={makePeriodList()} />);
    await user.click(getOpenButton());

    expect(getAccordionButton()).toHaveAttribute('aria-expanded', 'false');
  });

  it('opens the statistics accordion on a statistics page', async () => {
    navigationState.pathname = '/statistics/2024';

    const { user } = renderWithIntl(<MobileMenu periods={makePeriodList()} />);
    await user.click(getOpenButton());

    expect(getAccordionButton()).toHaveAttribute('aria-expanded', 'true');
  });

  it('toggles the statistics accordion', async () => {
    const { user } = renderWithIntl(<MobileMenu periods={makePeriodList()} />);
    await user.click(getOpenButton());

    await user.click(getAccordionButton());

    expect(getAccordionButton()).toHaveAttribute('aria-expanded', 'true');

    await user.click(getAccordionButton());

    expect(getAccordionButton()).toHaveAttribute('aria-expanded', 'false');
  });

  it('lists the periods with global first and marks the current one', async () => {
    navigationState.pathname = '/statistics/2025';

    const { user } = renderWithIntl(<MobileMenu periods={makePeriodList()} />);
    await user.click(getOpenButton());

    const links = within(within(getNav()).getByRole('list', { name: m.Header.statisticsOptions })).getAllByRole('link');

    expect(links.map((link) => link.getAttribute('href'))).toEqual([
      '/statistics/global',
      '/statistics/2025',
      '/statistics/2024',
      '/statistics/2023',
    ]);
    expect(links.filter((link) => link.getAttribute('aria-current') === 'page').map((link) => link.textContent)).toEqual([
      '2025',
    ]);
  });

  it('closes the dialog with the close button', async () => {
    const { user } = renderWithIntl(<MobileMenu periods={makePeriodList()} />);
    await user.click(getOpenButton());

    await user.click(within(getDialog()).getByRole('button', { name: m.Header.closeMenu }));

    expect(getDialog()).not.toHaveAttribute('open');
    expect(getOpenButton()).toHaveAttribute('aria-expanded', 'false');
  });

  it('closes the menu when a link inside it is clicked', async () => {
    const { user } = renderWithIntl(<MobileMenu periods={makePeriodList()} />);
    await user.click(getOpenButton());

    await user.click(within(getNav()).getByRole('link', { name: m.Header.search }));

    expect(getDialog()).not.toHaveAttribute('open');
    expect(getOpenButton()).toHaveAttribute('aria-expanded', 'false');
  });

  it('includes the language switcher in the dialog', async () => {
    const { user } = renderWithIntl(<MobileMenu periods={makePeriodList()} />);
    await user.click(getOpenButton());

    expect(within(getDialog()).getByRole('group', { name: m.Header.language })).toBeInTheDocument();
  });

  it('locks the page scroll while open and restores it after closing', async () => {
    const { user } = renderWithIntl(<MobileMenu periods={makePeriodList()} />);

    expect(document.body.style.overflow).toBe('');

    await user.click(getOpenButton());

    expect(document.body.style.overflow).toBe('hidden');

    await user.click(within(getDialog()).getByRole('button', { name: m.Header.closeMenu }));

    expect(document.body.style.overflow).toBe('');
  });
});
