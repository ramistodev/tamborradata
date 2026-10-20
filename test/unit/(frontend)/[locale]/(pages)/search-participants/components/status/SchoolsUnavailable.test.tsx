import { describe, expect, it } from 'vitest';
import { act, screen, waitFor } from '@testing-library/react';
import { SchoolsUnavailable } from '@/app/(frontend)/[locale]/(pages)/search-participants/components/status/SchoolsUnavailable';
import { messagesByLocale } from '@/test/helpers/messages';
import { navigationState } from '@/test/helpers/nextNavigation';
import { renderWithIntl } from '@/test/helpers/renderWithIntl';

const m = messagesByLocale.es.Search.status.schoolsUnavailable;

function deferred() {
  let resolve!: () => void;
  const promise = new Promise<void>((done) => {
    resolve = done;
  });
  return { promise, resolve };
}

describe('SchoolsUnavailable', () => {
  it('renders the heading, the description and the retry button', () => {
    renderWithIntl(<SchoolsUnavailable />);

    expect(screen.getByRole('heading', { level: 3, name: m.title })).toBeInTheDocument();
    expect(screen.getByText(m.description)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: m.retry })).toBeInTheDocument();
  });

  it('asks the router to refresh once when retrying', async () => {
    const { user } = renderWithIntl(<SchoolsUnavailable />);

    await user.click(screen.getByRole('button', { name: m.retry }));

    expect(navigationState.router.refresh).toHaveBeenCalledTimes(1);
  });

  it('locks the button while the refresh is pending and unlocks it afterwards', async () => {
    const pending = deferred();
    navigationState.router.refresh.mockReturnValue(pending.promise);
    const { user } = renderWithIntl(<SchoolsUnavailable />);

    await user.click(screen.getByRole('button', { name: m.retry }));

    const busyButton = await screen.findByRole('button', { name: m.retrying });
    expect(busyButton).toHaveAttribute('aria-disabled', 'true');

    await user.click(busyButton);

    expect(navigationState.router.refresh).toHaveBeenCalledTimes(1);

    await act(async () => {
      pending.resolve();
      await pending.promise;
    });

    await waitFor(() => expect(screen.getByRole('button', { name: m.retry })).toBeInTheDocument());
    expect(screen.getByRole('button', { name: m.retry })).toHaveAttribute('aria-disabled', 'false');
  });
});
