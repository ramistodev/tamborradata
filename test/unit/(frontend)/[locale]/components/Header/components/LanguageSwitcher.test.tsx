import { screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { LanguageSwitcher } from '@/app/(frontend)/[locale]/components/Header/components/LanguageSwitcher';
import { messagesByLocale } from '@/test/helpers/messages';
import { navigationState } from '@/test/helpers/nextNavigation';
import { renderWithIntl } from '@/test/helpers/renderWithIntl';

const m = messagesByLocale.es;

describe('LanguageSwitcher', () => {
  beforeEach(() => {
    window.history.replaceState(null, '', '/');
  });

  it('renders a labelled group with one button per language', () => {
    renderWithIntl(<LanguageSwitcher />);

    const group = screen.getByRole('group', { name: m.Header.language });
    const buttons = screen.getAllByRole('button');

    expect(group).toBeInTheDocument();
    expect(buttons.map((button) => button.getAttribute('aria-label'))).toEqual([
      'ES, Español',
      'EN, English',
      'EU, Euskara',
    ]);
    expect(buttons.map((button) => button.getAttribute('lang'))).toEqual(['es', 'en', 'eu']);
  });

  it('marks only the current language', () => {
    renderWithIntl(<LanguageSwitcher />);

    const current = screen.getAllByRole('button').filter((button) => button.getAttribute('aria-current') === 'true');

    expect(current).toHaveLength(1);
    expect(current[0]).toHaveAccessibleName('ES, Español');
  });

  it('replaces the route with the chosen locale without scrolling', async () => {
    const { user } = renderWithIntl(<LanguageSwitcher />);

    await user.click(screen.getByRole('button', { name: 'EN, English' }));

    expect(navigationState.router.replace).toHaveBeenCalledTimes(1);

    const [path, options] = vi.mocked(navigationState.router.replace).mock.calls[0];

    expect(path).toMatch(/^\/en/);
    expect(options).toEqual(expect.objectContaining({ scroll: false }));
  });

  it('does nothing when the current language is clicked', async () => {
    const { user } = renderWithIntl(<LanguageSwitcher />);

    await user.click(screen.getByRole('button', { name: 'ES, Español' }));

    expect(navigationState.router.replace).not.toHaveBeenCalled();
  });

  it('marks English as current and leaves the /en prefix when switching to Spanish', async () => {
    navigationState.pathname = '/en';

    const { user } = renderWithIntl(<LanguageSwitcher />, { locale: 'en' });

    expect(screen.getByRole('button', { name: 'EN, English' })).toHaveAttribute('aria-current', 'true');

    await user.click(screen.getByRole('button', { name: 'ES, Español' }));

    expect(navigationState.router.replace).toHaveBeenCalledTimes(1);

    const [path] = vi.mocked(navigationState.router.replace).mock.calls[0];

    expect(path).not.toMatch(/^\/en/);
  });
});
