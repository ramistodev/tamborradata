import { createTranslator } from 'next-intl';
import { screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import PagesError from '@/app/(frontend)/[locale]/(pages)/error';
import { messagesByLocale } from '@/test/helpers/messages';
import { renderWithIntl } from '@/test/helpers/renderWithIntl';

const m = messagesByLocale.es;

describe('PagesError', () => {
  let consoleError: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('shows the kicker, title and description', () => {
    renderWithIntl(<PagesError error={new Error('boom')} retry={vi.fn()} />);

    expect(screen.getByText(m.ErrorPage.kicker)).toBeInTheDocument();
    expect(screen.getByText(m.ErrorPage.title)).toBeInTheDocument();
    expect(screen.getByText(m.ErrorPage.description)).toBeInTheDocument();
  });

  it('moves focus to the title on mount', () => {
    renderWithIntl(<PagesError error={new Error('boom')} retry={vi.fn()} />);

    const title = screen.getByText(m.ErrorPage.title);
    expect(title).toHaveAttribute('tabindex', '-1');
    expect(document.activeElement).toBe(title);
  });

  it('logs the error once', () => {
    const error = new Error('boom');

    renderWithIntl(<PagesError error={error} retry={vi.fn()} />);

    expect(consoleError).toHaveBeenCalledTimes(1);
    expect(consoleError).toHaveBeenCalledWith(error);
  });

  it('calls retry once when the retry button is clicked', async () => {
    const retry = vi.fn();
    const { user } = renderWithIntl(<PagesError error={new Error('boom')} retry={retry} />);

    await user.click(screen.getByRole('button', { name: m.ErrorPage.retry }));

    expect(retry).toHaveBeenCalledTimes(1);
  });

  it('links back to the home page', () => {
    renderWithIntl(<PagesError error={new Error('boom')} retry={vi.fn()} />);

    expect(screen.getByRole('link', { name: m.ErrorPage.back })).toHaveAttribute('href', '/');
  });

  it('shows the error digest when there is one', () => {
    const error = Object.assign(new Error('boom'), { digest: 'abc123' });
    const t = createTranslator({ locale: 'es', messages: m, namespace: 'ErrorPage' } as never) as (
      key: string,
      values: Record<string, string>,
    ) => string;

    renderWithIntl(<PagesError error={error} retry={vi.fn()} />);

    expect(screen.getByText(t('digest', { digest: 'abc123' }))).toBeInTheDocument();
  });

  it('omits the digest paragraph when there is none', () => {
    const { container } = renderWithIntl(<PagesError error={new Error('boom')} retry={vi.fn()} />);

    expect(container.textContent).not.toContain(m.ErrorPage.digest.split('{')[0]);
  });
});
