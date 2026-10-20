import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Link, usePathname } from '@/app/(frontend)/i18n/navigation';
import { navigationState } from '@/test/helpers/nextNavigation';
import { renderWithIntl } from '@/test/helpers/renderWithIntl';

function PathProbe() {
  return <p data-testid="path">{usePathname()}</p>;
}

describe('i18n navigation under the next/navigation mock', () => {
  it('renders a localized link for the default locale without prefix', () => {
    renderWithIntl(<Link href="/search-participants">go</Link>);

    expect(screen.getByRole('link', { name: 'go' })).toHaveAttribute('href', '/search-participants');
  });

  it('prefixes the href for en and eu', () => {
    renderWithIntl(<Link href="/search-participants">go</Link>, { locale: 'en' });

    expect(screen.getByRole('link', { name: 'go' })).toHaveAttribute('href', '/en/search-participants');
  });

  it('strips the locale prefix from the mocked raw pathname', () => {
    navigationState.pathname = '/en/statistics/2024';

    renderWithIntl(<PathProbe />, { locale: 'en' });

    expect(screen.getByTestId('path')).toHaveTextContent('/statistics/2024');
  });
});
