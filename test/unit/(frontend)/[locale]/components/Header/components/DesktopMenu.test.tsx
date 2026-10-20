import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { DesktopMenu } from '@/app/(frontend)/[locale]/components/Header/components/DesktopMenu';
import { makePeriodList } from '@/test/fixtures/period';
import { messagesByLocale } from '@/test/helpers/messages';
import { navigationState } from '@/test/helpers/nextNavigation';
import { renderWithIntl } from '@/test/helpers/renderWithIntl';

const m = messagesByLocale.es;

describe('DesktopMenu', () => {
  it('renders the brand link to the home page', () => {
    renderWithIntl(<DesktopMenu periods={makePeriodList()} />);

    expect(screen.getByRole('link', { name: 'Tamborradata' })).toHaveAttribute('href', '/');
  });

  it('marks the brand as the current page only on the home page', () => {
    navigationState.pathname = '/';

    const { unmount } = renderWithIntl(<DesktopMenu periods={makePeriodList()} />);

    expect(screen.getByRole('link', { name: 'Tamborradata' })).toHaveAttribute('aria-current', 'page');

    unmount();
    navigationState.pathname = '/search-participants';
    renderWithIntl(<DesktopMenu periods={makePeriodList()} />);

    expect(screen.getByRole('link', { name: 'Tamborradata' })).not.toHaveAttribute('aria-current');
  });

  it('renders the statistics button and the language group', () => {
    renderWithIntl(<DesktopMenu periods={makePeriodList()} />);

    expect(screen.getByRole('button', { name: m.Header.statistics })).toBeInTheDocument();
    expect(screen.getByRole('group', { name: m.Header.language })).toBeInTheDocument();
  });
});
