import { fireEvent, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { useMobileMenu } from '@/app/(frontend)/[locale]/components/Header/hooks/useMobileMenu';
import { installDialogStubs } from '@/test/helpers/dialog';
import { navigationState } from '@/test/helpers/nextNavigation';
import { renderWithIntl } from '@/test/helpers/renderWithIntl';

function Harness() {
  const { dialogRef, menuOpen, openMenu, closeMenu, handleClose, handleDialogClick, periodsShow, togglePeriodsShow } =
    useMobileMenu();
  return (
    <div>
      <button onClick={openMenu}>open</button>
      <button onClick={togglePeriodsShow}>toggle</button>
      <dialog ref={dialogRef} onClose={handleClose} onClick={handleDialogClick} data-testid="dlg">
        <button onClick={closeMenu}>close</button>
        <p>content</p>
      </dialog>
      <output data-testid="state">{`${menuOpen}|${periodsShow}`}</output>
    </div>
  );
}

describe('useMobileMenu', () => {
  beforeEach(() => {
    document.body.style.overflow = '';
    installDialogStubs();
  });

  it('derives the initial periods state from localized and unlocalized statistics paths', () => {
    const first = renderWithIntl(<Harness />);
    expect(screen.getByTestId('state')).toHaveTextContent('false|false');
    first.unmount();

    navigationState.pathname = '/statistics/2024';
    const second = renderWithIntl(<Harness />);
    expect(screen.getByTestId('state')).toHaveTextContent('false|true');
    second.unmount();

    navigationState.pathname = '/en/statistics/2024';
    renderWithIntl(<Harness />, { locale: 'en' });
    expect(screen.getByTestId('state')).toHaveTextContent('false|true');
  });

  it('opens the dialog, locks scrolling, and restores the previous overflow on close', async () => {
    document.body.style.overflow = 'scroll';
    const { user } = renderWithIntl(<Harness />);
    const dialog = screen.getByTestId('dlg');

    await user.click(screen.getByRole('button', { name: 'open' }));
    expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalledOnce();
    expect(dialog).toHaveAttribute('open');
    expect(screen.getByTestId('state')).toHaveTextContent('true|false');
    expect(document.body.style.overflow).toBe('hidden');
    await user.click(screen.getByRole('button', { name: 'close' }));
    expect(screen.getByTestId('state')).toHaveTextContent('false|false');
    expect(document.body.style.overflow).toBe('scroll');
  });

  it('restores an initially empty body overflow', async () => {
    const { user } = renderWithIntl(<Harness />);

    await user.click(screen.getByRole('button', { name: 'open' }));
    await user.click(screen.getByRole('button', { name: 'close' }));

    expect(document.body.style.overflow).toBe('');
  });

  it('closes only when the dialog backdrop itself is clicked', async () => {
    const { user } = renderWithIntl(<Harness />);
    const dialog = screen.getByTestId('dlg');
    await user.click(screen.getByRole('button', { name: 'open' }));
    await user.click(screen.getByText('content'));
    expect(dialog).toHaveAttribute('open');
    fireEvent.click(dialog);
    expect(dialog).not.toHaveAttribute('open');
    expect(screen.getByTestId('state')).toHaveTextContent('false|false');
  });

  it('toggles periods and closes an open menu after navigation', async () => {
    const { user, rerender } = renderWithIntl(<Harness />);
    await user.click(screen.getByRole('button', { name: 'toggle' }));
    expect(screen.getByTestId('state')).toHaveTextContent('false|true');
    await user.click(screen.getByRole('button', { name: 'open' }));
    navigationState.pathname = '/search-participants';
    rerender(<Harness />);
    expect(screen.getByTestId('state')).toHaveTextContent('false|false');
    expect(HTMLDialogElement.prototype.close).toHaveBeenCalled();
  });
});
